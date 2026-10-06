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

export const founderImageSchema = z
  .union([
    z.string().min(1, 'Image URL cannot be empty'),
    z.object({
      url: z.string().min(1, 'Image URL cannot be empty'),
      path: z.string().optional().default('trainers/profile.jpg'),
      bucket: z.string().optional().default('kalptaru-media'),
      size: z.number().nonnegative().optional(),
      mimeType: z.string().optional(),
      alt: z.string().optional().default('Trainer Photo'),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    }),
  ])
  .transform((val) => {
    if (typeof val === 'string') {
      return {
        url: val,
        path: 'trainers/profile.jpg',
        bucket: 'kalptaru-media',
        alt: 'Trainer Portrait',
      };
    }
    return {
      ...val,
      path: val.path && val.path.trim().length > 0 ? val.path.trim() : 'trainers/profile.jpg',
      bucket: val.bucket || 'kalptaru-media',
      alt: val.alt || 'Trainer Portrait',
    };
  });

export const createFounderSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters'),
    title: z.string().trim().optional(),
    designation: z.string().trim().optional(),
    slug: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    biography: z.string().trim().optional(),
    shortBio: z.string().trim().optional(),
    quote: z.string().trim().optional(),
    message: z.string().trim().optional(),
    image: founderImageSchema,
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
