import { z } from 'zod';
import { idParamSchema, paginationQuerySchema } from './common.validator';

export const getBenefitsSchema = {
  query: paginationQuerySchema.extend({
    category: z.enum(['physical', 'mental', 'spiritual', 'general']).optional(),
    active: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
  }),
};

export const getBenefitByIdSchema = {
  params: idParamSchema,
};

export const createBenefitSchema = {
  body: z.object({
    title: z.string().trim().min(2, 'Title is required'),
    sanskritTerm: z.string().trim().optional(),
    description: z.string().trim().min(5, 'Description is required'),
    scriptureRef: z.string().trim().optional(),
    icon: z.string().trim().optional(),
    category: z.enum(['physical', 'mental', 'spiritual', 'general']).default('general'),
    order: z.number().int().default(0),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    active: z.boolean().optional(),
  }),
};

export const updateBenefitSchema = {
  params: idParamSchema,
  body: createBenefitSchema.body.partial(),
};

export const deleteBenefitSchema = {
  params: idParamSchema,
};
