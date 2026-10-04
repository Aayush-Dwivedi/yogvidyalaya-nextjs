import { z } from 'zod';
import {
  idParamSchema,
  idOrSlugParamSchema,
  paginationQuerySchema,
} from './common.validator';

const membershipBatchSchema = z.object({
  name: z.string().trim().min(2, 'Batch name is required'),
  timing: z.string().trim().min(2, 'Timing is required (e.g. 06:00 AM - 07:30 AM)'),
  days: z.string().trim().min(2, 'Days are required (e.g. Mon to Fri)'),
});

const membershipPriceSchema = z.object({
  amount: z.number().min(0, 'Price cannot be negative'),
  currency: z.string().default('INR'),
  discountPercentage: z.number().min(0).max(100).default(0),
  originalAmount: z.number().optional(),
});

export const getMembershipPlansSchema = {
  query: paginationQuerySchema.extend({
    billingCycle: z.enum(['monthly', 'quarterly', 'half-yearly', 'annual']).optional(),
  }),
};

export const getMembershipPlanByIdOrSlugSchema = {
  params: idOrSlugParamSchema,
};

export const createMembershipPlanSchema = {
  body: z.object({
    title: z.string().trim().min(3, 'Title is required'),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
      .optional(),
    billingCycle: z.enum(['monthly', 'quarterly', 'half-yearly', 'annual']),
    price: membershipPriceSchema,
    description: z.string().trim().min(5, 'Description is required'),
    batches: z.array(membershipBatchSchema).default([]),
    features: z.array(z.string().trim()).min(1, 'At least one feature is required'),
    popular: z.boolean().default(false),
    order: z.number().int().default(0),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    termsAndConditions: z.array(z.string().trim()).default([]),
  }),
};

export const updateMembershipPlanSchema = {
  params: idParamSchema,
  body: createMembershipPlanSchema.body.partial(),
};

export const deleteMembershipPlanSchema = {
  params: idParamSchema,
};
