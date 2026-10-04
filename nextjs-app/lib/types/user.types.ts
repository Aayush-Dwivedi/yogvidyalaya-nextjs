/**
 * User and Authentication Types
 */

export type UserRole = 'student' | 'admin' | 'super_admin';

export interface IRefreshToken {
  token: string;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  id: string;
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}
