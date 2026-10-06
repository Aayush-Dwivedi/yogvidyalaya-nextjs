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

export const storageImageSchema = z.union([
  z.string().min(1).transform((url) => ({
    url,
    path: url.replace(/^https?:\/\/[^\/]+\//, '').replace(/^\//, '') || 'media/image.jpg',
    bucket: 'kalptaru-media-dev',
  })),
  z
    .object({
      url: z.string().min(1, 'Image URL cannot be empty'),
      path: z.string().optional(),
      bucket: z.string().optional(),
      size: z.number().nonnegative().optional(),
      mimeType: z.string().optional(),
      alt: z.string().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    })
    .transform((val) => ({
      ...val,
      path:
        val.path && val.path.trim().length > 0
          ? val.path.trim()
          : typeof val.url === 'string'
          ? val.url.replace(/^https?:\/\/[^\/]+\//, '').replace(/^\//, '')
          : 'media/image.jpg',
      bucket: val.bucket || 'kalptaru-media-dev',
    })),
]);

export const seoSchema = z.object({
  metaTitle: z.string().max(120).optional().transform((v) => (v === '' ? undefined : v)),
  metaDescription: z.string().max(300).optional().transform((v) => (v === '' ? undefined : v)),
  keywords: z.array(z.string().trim()).optional().default([]),
  ogImage: z.string().optional().transform((v) => (v === '' ? undefined : v)),
  canonicalUrl: z.string().optional().transform((v) => (v === '' ? undefined : v)),
});

export const priceSchema = z.object({
  amount: z.coerce.number().min(0, 'Price cannot be negative').default(0),
  currency: z.string().default('INR'),
  isFree: z.boolean().default(false),
  displayPrice: z.string().optional(),
});
