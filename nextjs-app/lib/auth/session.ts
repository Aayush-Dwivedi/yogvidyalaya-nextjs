import { type NextRequest } from 'next/server';
import { getAccessTokenFromCookies, verifyAccessToken, type TokenPayload, ACCESS_COOKIE } from './token';

export type SessionUser = {
  id: string;
  userId: string;
  email: string;
  role: 'student' | 'admin' | 'super_admin';
};

/**
 * Get the current session user from HttpOnly cookies or Authorization header.
 * Returns null if unauthenticated or token is invalid.
 * Safe to call in Server Components, Route Handlers, and Server Actions.
 */
export async function getSession(request?: NextRequest | Request): Promise<SessionUser | null> {
  try {
    let token: string | null = null;

    if (request) {
      if ('cookies' in request && typeof (request as any).cookies?.get === 'function') {
        token = (request as NextRequest).cookies.get(ACCESS_COOKIE)?.value || null;
      }
      if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.substring(7).trim();
        }
      }
    }

    if (!token) {
      token = await getAccessTokenFromCookies();
    }

    if (!token) return null;

    const payload: TokenPayload = await verifyAccessToken(token);
    return {
      id: payload.id,
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Require an authenticated session.
 * Throws an error (caught by Route Handler error boundaries) if not authenticated.
 * Use inside Route Handlers and Server Actions.
 */
export async function requireSession(request?: NextRequest | Request): Promise<SessionUser> {
  const session = await getSession(request);
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

/**
 * Require an admin or super_admin session.
 * Throws FORBIDDEN if role is insufficient.
 */
export async function requireAdminSession(request?: NextRequest | Request): Promise<SessionUser> {
  const session = await requireSession(request);
  if (!['admin', 'super_admin'].includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

/**
 * Require a student session.
 * Denies admin users from accessing student-only data/endpoints.
 * Throws FORBIDDEN if user is an administrator.
 */
export async function requireStudentSession(request?: NextRequest | Request): Promise<SessionUser> {
  const session = await requireSession(request);
  if (session.role !== 'student') {
    throw new Error('FORBIDDEN');
  }
  return session;
}

/**
 * Check if the current user has at least admin access.
 * Respects super_admin > admin > student hierarchy.
 */
export function isAdmin(session: SessionUser): boolean {
  return session.role === 'admin' || session.role === 'super_admin';
}

/**
 * Check if the current user owns a resource or has admin access.
 */
export function isOwnerOrAdmin(session: SessionUser, ownerId: string): boolean {
  return session.id === ownerId || isAdmin(session);
}
