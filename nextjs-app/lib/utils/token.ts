/**
 * Token utility adapter for lib/services/*.
 * Wraps the jose-based lib/auth/token.ts to maintain the same function signatures
 * that the backend services originally depended on.
 *
 * NOTE: These are async wrappers. Services that call these must await them.
 * In practice, AuthService.login() already saves the tokens — the Next.js
 * Route Handlers then set cookies via setAuthCookies() after the service call.
 */
import {
  generateAccessToken as _generateAccessToken,
  generateRefreshToken as _generateRefreshToken,
  verifyAccessToken as _verifyAccessToken,
  verifyRefreshToken as _verifyRefreshToken,
  type TokenPayload,
  type RefreshTokenPayload,
} from '../auth/token';
import type { IUser } from '../models/User';

export type { TokenPayload, RefreshTokenPayload };

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

/**
 * Generate a short-lived access token for a user.
 */
export async function generateAccessToken(user: IUser): Promise<string> {
  return _generateAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });
}

/**
 * Generate a long-lived refresh token for a user.
 */
export async function generateRefreshToken(
  user: IUser
): Promise<{ token: string; expiresAt: Date }> {
  return _generateRefreshToken({ id: user._id.toString() });
}

/**
 * Verify an access token and return its payload.
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  return _verifyAccessToken(token);
}

/**
 * Verify a refresh token and return its payload.
 */
export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  return _verifyRefreshToken(token);
}
