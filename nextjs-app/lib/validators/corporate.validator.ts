import { z } from 'zod';
import {
  idParamSchema,
  idOrSlugParamSchema,
  paginationQuerySchema,
  storageImageSchema,
  seoSchema,
} from './common.validator';

const corporateModuleSchema = z.object({
  title: z.string().trim().min(2, 'Module title is required'),
  duration: z.string().trim().optional(),
  description: z.string().trim().min(5, 'Module description is required'),
});

export const getCorporateProgramsSchema = {
  query: paginationQuerySchema.extend({
    format: z.enum(['on-site', 'virtual', 'retreat', 'hybrid']).optional(),
  }),
};

export const getCorporateProgramByIdOrSlugSchema = {
  params: idOrSlugParamSchema,
};

export const createCorporateProgramSchema = {
  body: z.object({
    title: z.string().trim().min(3, 'Title is required'),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    tagline: z.string().trim().optional(),
    description: z.string().trim().min(10, 'Full description is required'),
    shortDescription: z.string().trim().min(5, 'Short description is required'),
    coverImage: storageImageSchema.optional(),
    format: z.enum(['on-site', 'virtual', 'retreat', 'hybrid']).default('on-site'),
    duration: z.string().trim().optional(),
    targetAudience: z.string().trim().optional(),
    deliverables: z.array(z.string().trim()).default([]),
    modules: z.array(corporateModuleSchema).default([]),
    caseStudiesOrClients: z.array(z.string().trim()).default([]),
    pricingModel: z.enum(['custom-quote', 'fixed-package', 'per-seat']).default('custom-quote'),
    startingPrice: z
      .object({
        amount: z.number().min(0),
        currency: z.string().default('INR'),
      })
      .optional(),
    order: z.number().int().default(0),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    featured: z.boolean().default(false),
    seo: seoSchema.optional(),
  }),
};

export const updateCorporateProgramSchema = {
  params: idParamSchema,
  body: createCorporateProgramSchema.body.partial(),
};

export const deleteCorporateProgramSchema = {
  params: idParamSchema,
};
