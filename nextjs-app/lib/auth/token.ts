import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCESS_COOKIE = 'kalptaru_access';
const REFRESH_COOKIE = 'kalptaru_refresh';
const ACCESS_MAX_AGE = 60 * 60 * 24;        // 1 day in seconds
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;  // 30 days in seconds

// ─── Secrets ──────────────────────────────────────────────────────────────────
function getAccessSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('[Auth] JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

function getRefreshSecret(): Uint8Array {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('[Auth] JWT_REFRESH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

// ─── Payload Types ────────────────────────────────────────────────────────────
export interface TokenPayload extends JWTPayload {
  id: string;
  email: string;
  role: 'student' | 'admin' | 'super_admin';
}

export interface RefreshTokenPayload extends JWTPayload {
  id: string;
}

// ─── Token Generation ─────────────────────────────────────────────────────────
export async function generateAccessToken(payload: { id: string; email: string; role: string }): Promise<string> {
  return new SignJWT({ id: payload.id, email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '1d')
    .sign(getAccessSecret());
}

export async function generateRefreshToken(payload: { id: string }): Promise<{ token: string; expiresAt: Date }> {
  const token = await new SignJWT({ id: payload.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '30d')
    .sign(getRefreshSecret());

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return { token, expiresAt };
}

// ─── Token Verification ───────────────────────────────────────────────────────
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret());
    return payload as TokenPayload;
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === 'ERR_JWT_EXPIRED') {
      throw new Error('Access token has expired. Please refresh your session.');
    }
    throw new Error('Invalid authentication token.');
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret());
    return payload as RefreshTokenPayload;
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === 'ERR_JWT_EXPIRED') {
      throw new Error('Refresh token has expired. Please log in again.');
    }
    throw new Error('Invalid refresh token.');
  }
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────
/**
 * Set both access and refresh token cookies (HttpOnly, Secure, SameSite=Lax).
 * Must be called from a Route Handler or Server Action.
 */
export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: ACCESS_MAX_AGE,
    path: '/',
  });

  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: REFRESH_MAX_AGE,
    path: '/',
  });
}

/**
 * Clear all auth cookies on logout.
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

/**
 * Read the raw access token from cookies (server-side only).
 */
export async function getAccessTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value ?? null;
}

/**
 * Read the raw refresh token from cookies (server-side only).
 */
export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE)?.value ?? null;
}

export { ACCESS_COOKIE, REFRESH_COOKIE };
