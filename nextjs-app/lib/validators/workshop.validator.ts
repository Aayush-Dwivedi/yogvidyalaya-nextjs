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

const workshopLocationSchema = z.object({
  venue: z.string().trim().min(2, 'Venue is required'),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  mapUrl: z.string().url().optional().or(z.literal('')),
  onlineLink: z.string().url().optional().or(z.literal('')),
});

const workshopCapacitySchema = z.object({
  total: z.number().int().positive('Total capacity must be > 0'),
  booked: z.number().int().nonnegative().default(0),
});

const workshopInstructorSchema = z.object({
  name: z.string().trim().min(2, 'Instructor name is required'),
  title: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  image: storageImageSchema.optional(),
  founderRef: objectIdSchema.optional(),
});

export const getWorkshopsSchema = {
  query: paginationQuerySchema.extend({
    mode: z.enum(['in-person', 'residential', 'online', 'hybrid']).optional(),
    upcomingOnly: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
  }),
};

export const getWorkshopByIdOrSlugSchema = {
  params: idOrSlugParamSchema,
};

export const createWorkshopSchema = {
  body: z
    .object({
      title: z.string().trim().min(3, 'Workshop title must have at least 3 characters'),
      slug: z
        .string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
        .optional(),
      description: z.string().trim().min(10, 'Description must have at least 10 characters'),
      shortDescription: z.string().trim().optional(),
      coverImage: storageImageSchema.optional(),
      image: storageImageSchema.optional(),
      date: z.string().or(z.date()),
      endDate: z.string().or(z.date()).optional(),
      startTime: z.string().trim().optional(),
      endTime: z.string().trim().optional(),
      time: z.string().trim().optional(),
      duration: z.string().trim().min(1, 'Duration is required'),
      mode: z.enum(['in-person', 'residential', 'online', 'hybrid']).default('in-person'),
      location: workshopLocationSchema,
      capacity: workshopCapacitySchema,
      price: priceSchema,
      instructor: workshopInstructorSchema,
      registrationDeadline: z.string().or(z.date()).optional(),
      prerequisites: z.array(z.string().trim()).default([]),
      status: z.enum(['draft', 'published', 'archived']).default('published'),
      featured: z.boolean().default(false),
      seo: seoSchema.optional(),
    })
    .transform((data) => {
      if (!data.coverImage && data.image) {
        data.coverImage = data.image;
      }
      if (!data.startTime && data.time) {
        const parts = data.time.split('-');
        data.startTime = parts[0]?.trim() || '09:00 AM';
        data.endTime = parts[1]?.trim() || '05:00 PM';
      }
      if (!data.startTime) data.startTime = '09:00 AM';
      if (!data.endTime) data.endTime = '05:00 PM';
      if (!data.shortDescription && data.description) {
        data.shortDescription = data.description.slice(0, 160).trim();
      }
      return data;
    }),
};

export const updateWorkshopSchema = {
  params: idParamSchema,
  body: z
    .object({
      title: z.string().trim().min(3).optional(),
      slug: z
        .string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional(),
      description: z.string().trim().min(10).optional(),
      shortDescription: z.string().trim().optional(),
      coverImage: storageImageSchema.optional(),
      image: storageImageSchema.optional(),
      date: z.string().or(z.date()).optional(),
      endDate: z.string().or(z.date()).optional(),
      startTime: z.string().trim().optional(),
      endTime: z.string().trim().optional(),
      time: z.string().trim().optional(),
      duration: z.string().trim().optional(),
      mode: z.enum(['in-person', 'residential', 'online', 'hybrid']).optional(),
      location: workshopLocationSchema.partial().optional(),
      capacity: workshopCapacitySchema.partial().optional(),
      price: priceSchema.partial().optional(),
      instructor: workshopInstructorSchema.partial().optional(),
      registrationDeadline: z.string().or(z.date()).optional(),
      prerequisites: z.array(z.string().trim()).optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      featured: z.boolean().optional(),
      seo: seoSchema.optional(),
    })
    .transform((data) => {
      if (!data.coverImage && data.image) {
        data.coverImage = data.image;
      }
      if (data.time && (!data.startTime || !data.endTime)) {
        const parts = data.time.split('-');
        if (parts[0] && !data.startTime) data.startTime = parts[0].trim();
        if (parts[1] && !data.endTime) data.endTime = parts[1].trim();
      }
      return data;
    }),
};

export const deleteWorkshopSchema = {
  params: idParamSchema,
};
