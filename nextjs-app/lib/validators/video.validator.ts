import { z } from 'zod';
import {
  idParamSchema,
  paginationQuerySchema,
  storageImageSchema,
} from './common.validator';

export const getVideosSchema = {
  query: paginationQuerySchema.extend({
    category: z.string().trim().optional(),
    speaker: z.string().trim().optional(),
  }),
};

export const getVideoByIdSchema = {
  params: idParamSchema,
};

export const createVideoSchema = {
  body: z.object({
    youtubeUrl: z.string().url('YouTube URL must be a valid URL'),
    youtubeVideoId: z.string().trim().min(3, 'YouTube video ID is required').optional(),
    title: z.string().trim().min(3, 'Video title must have at least 3 characters'),
    description: z.string().trim().optional(),
    thumbnail: storageImageSchema.optional(),
    category: z.string().trim().default('Discourse'),
    speaker: z.string().trim().optional(),
    duration: z.string().trim().optional(),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
  }),
};

export const updateVideoSchema = {
  params: idParamSchema,
  body: createVideoSchema.body.partial(),
};

export const deleteVideoSchema = {
  params: idParamSchema,
};
