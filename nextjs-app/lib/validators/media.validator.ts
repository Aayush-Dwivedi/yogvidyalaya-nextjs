import { z } from 'zod';

export const deleteMediaSchema = {
  body: z.object({
    path: z.string().trim().min(1, 'Storage path is required'),
  }),
};

export const createSignedUrlSchema = {
  body: z.object({
    path: z.string().trim().min(1, 'Storage path is required'),
    expiresIn: z.number().int().positive().max(604800).default(3600), // Max 7 days
  }),
};
