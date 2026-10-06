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
  amount: z.coerce.number().min(0, 'Price cannot be negative').default(0),
  currency: z.string().default('INR'),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  originalAmount: z.coerce.number().optional(),
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
    title: z.string().trim().min(2, 'Title is required'),
    slug: z
      .string()
      .trim()
      .optional()
      .transform((val) => {
        if (!val || val.trim().length === 0) return undefined;
        return val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }),
    billingCycle: z.enum(['monthly', 'quarterly', 'half-yearly', 'annual']).default('monthly'),
    price: membershipPriceSchema.default({ amount: 0, currency: 'INR', discountPercentage: 0 }),
    description: z.string().trim().min(3, 'Description is required'),
    batches: z.array(membershipBatchSchema).default([]),
    features: z.array(z.string().trim()).default([]),
    popular: z.boolean().default(false),
    order: z.coerce.number().int().default(0),
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
