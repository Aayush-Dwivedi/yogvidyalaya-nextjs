import { z } from 'zod';
import {
  idParamSchema,
  idOrSlugParamSchema,
  paginationQuerySchema,
  storageImageSchema,
  seoSchema,
  objectIdSchema,
} from './common.validator';

export const getProgramsSchema = {
  query: paginationQuerySchema.extend({
    programType: z.enum(['course', 'workshop', 'corporate', 'membership']).optional(),
  }),
};

export const getProgramByIdOrSlugSchema = {
  params: idOrSlugParamSchema,
};

export const createProgramSchema = {
  body: z.object({
    title: z.string().trim().min(2, 'Title is required'),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    programType: z.enum(['course', 'workshop', 'corporate', 'membership']),
    tagline: z.string().trim().optional(),
    shortDescription: z.string().trim().min(5, 'Short description is required'),
    description: z.string().trim().min(10, 'Full description is required'),
    coverImage: storageImageSchema.optional(),
    icon: z.string().trim().optional(),
    badge: z.string().trim().optional(),
    highlights: z.array(z.string().trim()).default([]),
    refModel: z.enum(['Course', 'Workshop', 'CorporateProgram', 'MembershipPlan']).optional(),
    referenceId: objectIdSchema.optional(),
    order: z.number().int().default(0),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    featured: z.boolean().default(false),
    seo: seoSchema.optional(),
  }),
};

export const updateProgramSchema = {
  params: idParamSchema,
  body: createProgramSchema.body.partial(),
};

export const deleteProgramSchema = {
  params: idParamSchema,
};
