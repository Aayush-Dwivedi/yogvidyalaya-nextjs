import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_COOKIE = 'kalptaru_access';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('[Middleware] JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

/**
 * Edge Middleware — enforces route-level authentication and role-based access.
 *
 * Public routes:
 *   /              → Public website
 *   /courses       → Public courses
 *   /workshops     → Public workshops
 *   /register      → Decommissioned: redirects to /courses
 *
 * Protected routes:
 *   /admin/*       → requires role: admin | super_admin
 *   /dashboard/*   → Decommissioned: redirects admin to /admin, visitors to /courses
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Decommission public student registration — redirect to courses
  if (pathname === '/register' || pathname.startsWith('/register/')) {
    return NextResponse.redirect(new URL('/courses', request.url));
  }

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');

  // Decommission student dashboard — redirect admin to /admin, others to /courses
  if (isDashboard) {
    const token = request.cookies.get(ACCESS_COOKIE)?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, getSecret());
        const role = payload.role as string;
        if (['admin', 'super_admin'].includes(role)) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      } catch {
        // Token invalid
      }
    }
    return NextResponse.redirect(new URL('/courses', request.url));
  }

  // Admin route protection
  if (isAdmin) {
    const token = request.cookies.get(ACCESS_COOKIE)?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, getSecret());
      const role = payload.role as string;

      if (!['admin', 'super_admin'].includes(role)) {
        // Non-admin cannot access admin panel
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(loginUrl);
      }

      // Attach user info to request headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-role', role);
      requestHeaders.set('x-user-email', payload.email as string);

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      // Token invalid or expired — redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(ACCESS_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/register',
    '/register/:path*',
  ],
};
