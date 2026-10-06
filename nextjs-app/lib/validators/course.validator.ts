import { z } from 'zod';
import {
  idParamSchema,
  idOrSlugParamSchema,
  paginationQuerySchema,
  storageImageSchema,
  seoSchema,
  priceSchema,
  objectIdSchema,
} from './common.validator';

const curriculumModuleSchema = z.object({
  moduleNumber: z.coerce.number().int().default(1),
  title: z.string().trim().min(1, 'Module title is required'),
  description: z.string().trim().optional(),
  topics: z.array(z.string().trim()).default([]),
});

const courseInstructorSchema = z
  .object({
    name: z.string().trim().min(1).default('Mrs. Shuchi Mohan'),
    title: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    image: storageImageSchema.optional(),
    founderRef: z
      .string()
      .trim()
      .optional()
      .transform((val) => (val && val.length === 24 ? val : undefined)),
  })
  .default({ name: 'Mrs. Shuchi Mohan', founderRef: undefined });

const courseCapacitySchema = z.object({
  total: z.coerce.number().int().positive().default(30),
  enrolled: z.coerce.number().int().nonnegative().default(0),
});

export const getCoursesSchema = {
  query: paginationQuerySchema.extend({
    level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']).optional(),
    mode: z.enum(['residential', 'in-person', 'online', 'hybrid']).optional(),
  }),
};

export const getCourseByIdOrSlugSchema = {
  params: idOrSlugParamSchema,
};

export const createCourseSchema = {
  body: z
    .object({
      title: z.string().trim().min(2, 'Course title must have at least 2 characters'),
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
      description: z.string().trim().min(5, 'Description must have at least 5 characters'),
      shortDescription: z.string().trim().optional(),
      coverImage: storageImageSchema.optional(),
      image: storageImageSchema.optional(),
      gallery: z.array(storageImageSchema).default([]),
      duration: z.string().trim().min(1, 'Duration is required'),
      level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']).default('all-levels'),
      mode: z.enum(['residential', 'in-person', 'online', 'hybrid']).default('in-person'),
      price: priceSchema.default({ amount: 0, currency: 'INR', isFree: false }),
      features: z.array(z.string().trim()).default([]),
      benefits: z.array(z.string().trim()).default([]),
      curriculum: z.array(curriculumModuleSchema).default([]),
      instructor: courseInstructorSchema,
      certification: z.string().trim().optional(),
      eligibility: z.string().trim().optional(),
      schedule: z.string().trim().optional(),
      capacity: courseCapacitySchema.optional(),
      order: z.coerce.number().int().optional().default(0),
      status: z.enum(['draft', 'published', 'archived']).default('published'),
      featured: z.boolean().default(false),
      seo: seoSchema.optional(),
    })
    .transform((data) => {
      // Map image -> coverImage if coverImage is omitted
      if (!data.coverImage && data.image) {
        data.coverImage = data.image;
      }
      if (!data.shortDescription && data.description) {
        data.shortDescription = data.description.slice(0, 160).trim();
      }
      if (data.benefits.length > 0 && data.features.length === 0) {
        data.features = [...data.benefits];
      } else if (data.features.length > 0 && data.benefits.length === 0) {
        data.benefits = [...data.features];
      }
      return data;
    }),
};

export const updateCourseSchema = {
  params: idParamSchema,
  body: z
    .object({
      title: z.string().trim().min(2).optional(),
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
      description: z.string().trim().min(5).optional(),
      shortDescription: z.string().trim().optional(),
      coverImage: storageImageSchema.optional(),
      image: storageImageSchema.optional(),
      gallery: z.array(storageImageSchema).optional(),
      duration: z.string().trim().optional(),
      level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']).optional(),
      mode: z.enum(['residential', 'in-person', 'online', 'hybrid']).optional(),
      price: priceSchema.optional(),
      features: z.array(z.string().trim()).optional(),
      benefits: z.array(z.string().trim()).optional(),
      curriculum: z.array(curriculumModuleSchema).optional(),
      instructor: courseInstructorSchema.optional(),
      certification: z.string().trim().optional(),
      eligibility: z.string().trim().optional(),
      schedule: z.string().trim().optional(),
      capacity: courseCapacitySchema.optional(),
      order: z.coerce.number().int().optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      featured: z.boolean().optional(),
      seo: seoSchema.optional(),
    })
    .transform((data) => {
      if (!data.coverImage && data.image) {
        data.coverImage = data.image;
      }
      if (data.benefits && (!data.features || data.features.length === 0)) {
        data.features = [...data.benefits];
      } else if (data.features && (!data.benefits || data.benefits.length === 0)) {
        data.benefits = [...data.features];
      }
      return data;
    }),
};

export const reorderCoursesSchema = {
  body: z.object({
    courses: z
      .array(
        z.object({
          id: z.string().min(1, 'Course ID is required'),
          order: z.number().int(),
        })
      )
      .optional(),
    courseIds: z.array(z.string().min(1)).optional(),
  }),
};

export const deleteCourseSchema = {
  params: idParamSchema,
};
