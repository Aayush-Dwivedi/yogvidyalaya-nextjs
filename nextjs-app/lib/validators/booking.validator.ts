import { z } from 'zod';
import { idParamSchema, objectIdSchema, paginationQuerySchema } from './common.validator';

export const createBookingSchema = {
  body: z.object({
    programType: z.enum(['course', 'workshop']),
    programId: objectIdSchema,
    schedule: z
      .object({
        scheduleId: z.string().trim().optional(),
        date: z.string().or(z.date()).optional(),
        time: z.string().trim().optional(),
        startTime: z.string().trim().optional(),
        endTime: z.string().trim().optional(),
        batch: z.string().trim().optional(),
        duration: z.string().trim().optional(),
        mode: z.string().trim().optional(),
        venue: z.string().trim().optional(),
        location: z.string().trim().optional(),
      })
      .optional()
      .default({}),
    attendeeDetails: z.object({
      fullName: z.string().trim().min(2, 'Full name is required'),
      email: z.string().trim().email('Please provide a valid email address'),
      phone: z.string().trim().min(8, 'Please provide a valid phone number'),
      gender: z.string().trim().optional(),
      age: z.number().optional(),
      city: z.string().trim().optional(),
      message: z.string().trim().optional(),
    }),
    metadata: z.record(z.string(), z.any()).optional().default({}),
    notes: z.string().trim().optional(),
  }),
};

export const updateBookingStatusSchema = {
  params: idParamSchema,
  body: z.object({
    bookingStatus: z
      .enum(['new', 'contacted', 'confirmed', 'completed', 'cancelled', 'pending', 'refunded'])
      .optional(),
    paymentStatus: z
      .enum(['pending', 'paid', 'failed', 'refunded', 'waived'])
      .optional(),
    notes: z.string().trim().optional(),
    cancellationReason: z.string().trim().optional(),
  }),
};

export const cancelBookingSchema = {
  params: idParamSchema,
  body: z.object({
    reason: z.string().trim().optional(),
  }),
};

export const getBookingsSchema = {
  query: paginationQuerySchema.extend({
    status: z
      .enum(['pending', 'confirmed', 'cancelled', 'completed', 'refunded', 'all'])
      .optional(),
    paymentStatus: z
      .enum(['pending', 'paid', 'failed', 'refunded', 'waived', 'all'])
      .optional(),
    programType: z.enum(['course', 'workshop', 'all']).optional(),
  }),
};
