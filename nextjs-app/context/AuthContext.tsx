'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterStudentData, UpdateProfileData } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  loginDemoStudent: () => Promise<User>;
  loginDemoAdmin: () => Promise<User>;
  register: (data: RegisterStudentData) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await AuthService.getMe();
      setUser(currentUser);
      setError(null);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await AuthService.login(credentials);
      setUser(data.user);
      return data.user;
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const message = errObj?.message || 'Login failed. Please check your credentials.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoStudent = async (): Promise<User> => {
    return login({
      email: 'student@kalptaruyog.org',
      password: 'Student@Kalptaru2026!',
    });
  };

  const loginDemoAdmin = async (): Promise<User> => {
    return login({
      email: 'admin@kalptaruyog.org',
      password: 'Admin@Kalptaru2026!',
    });
  };

  const register = async (data: RegisterStudentData): Promise<User> => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await AuthService.register(data);
      setUser(res.user);
      return res.user;
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const message = errObj?.message || 'Registration failed. Please check the entered details.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    setIsLoading(true);
    try {
      const updatedUser = await AuthService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const message = errObj?.message || 'Failed to update profile.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<User | null> => {
    return fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        loginDemoStudent,
        loginDemoAdmin,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
