export interface ProfileImage {
  url: string;
  path: string;
  bucket?: string;
  size?: number;
  mimeType?: string;
  alt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'admin' | 'super_admin';
  profileImage?: ProfileImage;
  bio?: string;
  city?: string;
  address?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  emergencyContact?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStudentData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  profileImage?: ProfileImage;
  bio?: string;
  city?: string;
  address?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  emergencyContact?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: string;
}

export interface AuthResponseData {
  user: User;
  tokens: AuthTokens;
}
