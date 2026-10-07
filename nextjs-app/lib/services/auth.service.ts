import { User, IUser } from '../models/User';
import { AppError } from '../utils/appError';
import {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
} from '../utils/token';
import { AuthTokens, UserRole } from '../types/user.types';
import { logger } from '../utils/logger';

export interface RegisterStudentDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new Student account
   */
  static async registerStudent(
    data: RegisterStudentDTO,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw AppError.conflict('An account with this email address already exists.');
    }

    const user = new User({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      password: data.password, // Will be hashed via pre-save hook
      role: 'student',
      isActive: true,
    });

    const { token: refreshToken, expiresAt } = await generateRefreshToken(user);
    const accessToken = await generateAccessToken(user);

    user.refreshTokens = [
      {
        token: refreshToken,
        createdAt: new Date(),
        expiresAt,
        userAgent,
        ipAddress,
      },
    ];
    user.lastLoginAt = new Date();

    await user.save();
    logger.info(`[Auth] Registered new student: ${user.email} (${user._id})`);

    const tokens: AuthTokens = {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: '1d',
    };

    return { user, tokens };
  }

  /**
   * Secure user login with generic error messages and refresh token issuance
   */
  static async login(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +refreshTokens'
    );

    // Generic error message to prevent user enumeration
    if (!user) {
      throw AppError.unauthorized('Invalid email or password.');
    }

    if (!user.isActive) {
      throw AppError.forbidden(
        'Your account has been deactivated. Please contact the Vidhyalaya administration.'
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password.');
    }

    // Generate tokens
    const { token: refreshToken, expiresAt } = await generateRefreshToken(user);
    const accessToken = await generateAccessToken(user);

    // Clean expired refresh tokens and retain up to 5 concurrent sessions
    const now = new Date();
    const activeTokens = (user.refreshTokens || []).filter(
      (t) => new Date(t.expiresAt) > now
    );

    activeTokens.push({
      token: refreshToken,
      createdAt: now,
      expiresAt,
      userAgent,
      ipAddress,
    });

    user.refreshTokens = activeTokens.slice(-5);
    user.lastLoginAt = now;

    await user.save();
    logger.info(`[Auth] Successful login for: ${user.email} (Role: ${user.role})`);

    const tokens: AuthTokens = {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: '1d',
    };

    return { user, tokens };
  }

  /**
   * Rotate and issue new tokens using a valid Refresh Token
   */
  static async refreshTokens(
    incomingToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const payload = await verifyRefreshToken(incomingToken);

    const user = await User.findById(payload.id).select('+refreshTokens');
    if (!user || !user.isActive) {
      throw AppError.unauthorized('Session has ended or user account is inactive.');
    }

    // Check if refresh token exists in user's saved tokens
    const tokenRecord = user.refreshTokens.find((t) => t.token === incomingToken);
    if (!tokenRecord) {
      logger.warn(`[Auth] Revoked or reuse-detected refresh token attempted for user ${user._id}`);
      throw AppError.unauthorized('Refresh token is invalid or has been revoked.');
    }

    // Token rotation: generate new access & refresh tokens
    const newAccessToken = await generateAccessToken(user);
    const { token: newRefreshToken, expiresAt } = await generateRefreshToken(user);

    // Replace the old token with the new one
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== incomingToken);
    user.refreshTokens.push({
      token: newRefreshToken,
      createdAt: new Date(),
      expiresAt,
      userAgent,
      ipAddress,
    });

    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
      expiresIn: '1d',
    };
  }

  /**
   * Invalidate specific refresh token on logout
   */
  static async logout(userId: string, incomingToken?: string): Promise<void> {
    if (!incomingToken) return;

    const user = await User.findById(userId).select('+refreshTokens');
    if (user && user.refreshTokens) {
      user.refreshTokens = user.refreshTokens.filter((t) => t.token !== incomingToken);
      await user.save();
      logger.info(`[Auth] Logged out session for user ${userId}`);
    }
  }

  /**
   * Invalidate all refresh tokens (logout from all devices)
   */
  static async logoutAll(userId: string): Promise<void> {
    const user = await User.findById(userId).select('+refreshTokens');
    if (user) {
      user.refreshTokens = [];
      await user.save();
      logger.info(`[Auth] Logged out all sessions for user ${userId}`);
    }
  }

  /**
   * Get current authenticated user profile
   */
  static async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('User account not found.');
    }
    return user;
  }

  static async getUserById(userId: string): Promise<IUser> {
    return this.getCurrentUser(userId);
  }

  /**
   * Update student profile information
   */
  static async updateProfile(userId: string, data: Partial<IUser>): Promise<IUser> {
    delete (data as any).password;
    delete (data as any).role;
    delete (data as any).refreshTokens;
    delete (data as any).email;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw AppError.notFound('User account not found.');
    }
    return user;
  }

  /**
   * Helper to seed initial admin / super_admin account
   */
  static async seedAdmin(
    data: { name: string; email: string; phone: string; password: string; role: UserRole }
  ): Promise<IUser> {
    let user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        password: data.password,
        role: data.role,
        isActive: true,
        isEmailVerified: true,
      });
      logger.info(`[Auth] Seeded ${data.role} account: ${data.email}`);
    }
    return user;
  }
}
