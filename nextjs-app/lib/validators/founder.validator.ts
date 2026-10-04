import { z } from 'zod';
import {
  idParamSchema,
  idOrSlugParamSchema,
  paginationQuerySchema,
  storageImageSchema,
} from './common.validator';

export const getFoundersSchema = {
  query: paginationQuerySchema,
};

export const getFounderByIdOrSlugSchema = {
  params: idOrSlugParamSchema,
};

export const createFounderSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters'),
    title: z.string().trim().min(2, 'Title must have at least 2 characters').optional(),
    designation: z.string().trim().optional(),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    bio: z.string().trim().min(10, 'Bio must have at least 10 characters').optional(),
    biography: z.string().trim().optional(),
    shortBio: z.string().trim().optional(),
    quote: z.string().trim().optional(),
    message: z.string().trim().optional(),
    image: storageImageSchema,
    lineage: z.string().trim().optional(),
    qualifications: z.array(z.string().trim()).default([]),
    achievements: z.array(z.string().trim()).default([]),
    experienceYears: z.number().int().nonnegative().optional(),
    specializations: z.array(z.string().trim()).default([]),
    socialLinks: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
    order: z.number().int().default(0),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    featured: z.boolean().default(true),
  }),
};

export const updateFounderSchema = {
  params: idParamSchema,
  body: createFounderSchema.body.partial(),
};

export const deleteFounderSchema = {
  params: idParamSchema,
};
