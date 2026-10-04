import { z } from 'zod';

const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password cannot exceed 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit');

export const registerStudentSchema = {
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, 'Name must have at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters'),
      email: z
        .string()
        .trim()
        .email('Please enter a valid email address')
        .toLowerCase(),
      phone: z
        .string()
        .trim()
        .min(8, 'Phone number must have at least 8 digits')
        .max(20, 'Phone number cannot exceed 20 characters'),
      password: passwordValidation,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
};

export const loginSchema = {
  body: z.object({
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address')
      .toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().trim().min(1, 'Refresh token is required'),
  }),
};

export const changePasswordSchema = {
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: passwordValidation,
      confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    }),
};

export const updateProfileSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters').max(100).optional(),
    phone: z.string().trim().min(8, 'Phone number must have at least 8 digits').max(20).optional(),
    profileImage: z
      .object({
        url: z.string().url(),
        path: z.string(),
        bucket: z.string().optional(),
        size: z.number().optional(),
        mimeType: z.string().optional(),
        alt: z.string().optional(),
      })
      .optional(),
    bio: z.string().trim().max(500).optional(),
    city: z.string().trim().optional(),
    address: z.string().trim().optional(),
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    emergencyContact: z.string().trim().optional(),
  }),
};

