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
 * Protected routes:
 *   /dashboard/*  → requires any authenticated user
 *   /admin/*      → requires role: admin | super_admin
 *
 * This runs at the Edge before any page renders — no flash of unauthenticated content.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');

  // Only apply to protected routes
  if (!isDashboard && !isAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role as string;

    // Admin route: enforce admin/super_admin role
    if (isAdmin && !['admin', 'super_admin'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
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
    // Clear the stale cookie
    response.cookies.delete(ACCESS_COOKIE);
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
