import { z } from 'zod';
import {
  idParamSchema,
  paginationQuerySchema,
  storageImageSchema,
  objectIdSchema,
} from './common.validator';

export const getGalleryImagesSchema = {
  query: paginationQuerySchema.extend({
    category: z.string().trim().optional(),
    categorySlug: z.string().trim().optional(),
    event: z.string().trim().optional(),
  }),
};

export const getGalleryImageByIdSchema = {
  params: idParamSchema,
};

export const createGalleryImageSchema = {
  body: z.object({
    image: storageImageSchema,
    title: z.string().trim().min(2, 'Title is required'),
    description: z.string().trim().optional(),
    category: objectIdSchema.optional(),
    categorySlug: z.string().trim().optional(),
    event: z.string().trim().optional(),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
  }),
};

export const updateGalleryImageSchema = {
  params: idParamSchema,
  body: createGalleryImageSchema.body.partial(),
};

export const deleteGalleryImageSchema = {
  params: idParamSchema,
};

// Gallery Category Schemas
export const createGalleryCategorySchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Category name is required'),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    description: z.string().trim().optional(),
    coverImage: storageImageSchema.optional(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
};

export const updateGalleryCategorySchema = {
  params: idParamSchema,
  body: createGalleryCategorySchema.body.partial(),
};

export const deleteGalleryCategorySchema = {
  params: idParamSchema,
};
