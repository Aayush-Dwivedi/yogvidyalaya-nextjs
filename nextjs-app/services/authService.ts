import { apiClient } from '../api/axios';
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
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const res = (await apiClient.post('/auth/login', credentials)) as unknown as ApiResponse<AuthResponseData>;
    if (res.data?.tokens?.accessToken) {
      localStorage.setItem('kalptaru_auth_token', res.data.tokens.accessToken);
      if (res.data.tokens.refreshToken) {
        localStorage.setItem('kalptaru_refresh_token', res.data.tokens.refreshToken);
      }
    }
    return res.data;
  }

  /**
   * Register a new student
   */
  static async register(data: RegisterStudentData): Promise<AuthResponseData> {
    const res = (await apiClient.post('/auth/register', data)) as unknown as ApiResponse<AuthResponseData>;
    if (res.data?.tokens?.accessToken) {
      localStorage.setItem('kalptaru_auth_token', res.data.tokens.accessToken);
      if (res.data.tokens.refreshToken) {
        localStorage.setItem('kalptaru_refresh_token', res.data.tokens.refreshToken);
      }
    }
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
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kalptaru_auth_token');
        localStorage.removeItem('kalptaru_refresh_token');
      }
    }
  }

  /**
   * Check if session might exist
   */
  static hasToken(): boolean {
    if (typeof window === 'undefined') return false;
    return true;
  }
}
