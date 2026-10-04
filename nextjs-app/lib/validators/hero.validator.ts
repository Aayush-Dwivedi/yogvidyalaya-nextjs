import { z } from 'zod';
import { idParamSchema, storageImageSchema } from './common.validator';

export const getHeroSlidesSchema = {
  query: z.object({
    activeOnly: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
  }),
};

export const getHeroSlideByIdSchema = {
  params: idParamSchema,
};

export const createHeroSlideSchema = {
  body: z.object({
    image: storageImageSchema,
    heading: z.string().trim().min(2, 'Heading is required'),
    subheading: z.string().trim().optional(),
    description: z.string().trim().min(5, 'Description is required'),
    quote: z.string().trim().optional(),
    ctaText: z.string().trim().default('Explore Programs'),
    ctaUrl: z.string().trim().default('/programs'),
    secondaryCtaText: z.string().trim().optional(),
    secondaryCtaUrl: z.string().trim().optional(),
    order: z.number().int().default(0),
    active: z.boolean().default(true),
  }),
};

export const updateHeroSlideSchema = {
  params: idParamSchema,
  body: createHeroSlideSchema.body.partial(),
};

export const reorderHeroSlidesSchema = {
  body: z.object({
    slides: z.array(
      z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid slide ID'),
        order: z.number().int(),
      })
    ),
  }),
};

export const deleteHeroSlideSchema = {
  params: idParamSchema,
};
