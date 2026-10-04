import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format; must be a 24-character hexadecimal ObjectId');

export const idParamSchema = z.object({
  id: objectIdSchema,
});

export const idOrSlugParamSchema = z.object({
  idOrSlug: z.string().trim().min(1, 'Identifier (ID or slug) cannot be empty'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  sort: z.string().trim().optional(),
  search: z.string().trim().optional(),
  status: z.enum(['draft', 'published', 'archived', 'all']).optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
});

export const storageImageSchema = z.object({
  url: z.string().url('Image URL must be a valid URL'),
  path: z.string().min(1, 'Storage path is required'),
  bucket: z.string().optional(),
  size: z.number().nonnegative().optional(),
  mimeType: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

export const seoSchema = z.object({
  metaTitle: z.string().max(70, 'Meta title must be <= 70 chars').optional(),
  metaDescription: z.string().max(200, 'Meta description must be <= 200 chars').optional(),
  keywords: z.array(z.string().trim()).optional(),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
});

export const priceSchema = z.object({
  amount: z.number().min(0, 'Price cannot be negative'),
  currency: z.string().default('INR'),
  isFree: z.boolean().default(false),
  displayPrice: z.string().optional(),
});
