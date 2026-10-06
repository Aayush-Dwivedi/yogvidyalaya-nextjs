import { apiClient } from '@/lib/api/axios';
import { ApiResponse } from '../types';
import {
  User,
  LoginCredentials,
  RegisterStudentData,
  UpdateProfileData,
  AuthResponseData,
} from '../types/auth';

export class AuthService {
  /**
   * Log in user (student or admin)
   * Session is maintained via secure HttpOnly cookies set by the server.
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const res = (await apiClient.post('/auth/login', credentials)) as unknown as ApiResponse<AuthResponseData>;
    return res.data;
  }

  /**
   * Register a new student
   * Session is maintained via secure HttpOnly cookies set by the server.
   */
  static async register(data: RegisterStudentData): Promise<AuthResponseData> {
    const res = (await apiClient.post('/auth/register', data)) as unknown as ApiResponse<AuthResponseData>;
    return res.data;
  }

  /**
   * Get currently authenticated user
   */
  static async getMe(): Promise<User> {
    const res = (await apiClient.get('/auth/me')) as unknown as ApiResponse<User>;
    return res.data;
  }

  /**
   * Update student profile
   */
  static async updateProfile(data: UpdateProfileData): Promise<User> {
    const res = (await apiClient.patch('/auth/profile', data)) as unknown as ApiResponse<User>;
    return res.data;
  }

  /**
   * Logout current session
   * Instructs server to clear HttpOnly authentication cookies.
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    }
  }

  /**
   * Check if session might exist
   */
  static hasToken(): boolean {
    return typeof window !== 'undefined';
  }
}
