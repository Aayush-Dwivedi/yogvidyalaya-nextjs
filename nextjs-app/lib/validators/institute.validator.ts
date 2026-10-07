import { z } from 'zod';
import { storageImageSchema, seoSchema } from './common.validator';

const accreditationSchema = z.object({
  name: z.string().trim().min(1, 'Accreditation name is required'),
  authority: z.string().trim().min(1, 'Authority is required'),
  logo: storageImageSchema.optional(),
  certificateNumber: z.string().optional(),
  validUntil: z.string().datetime().or(z.date()).optional(),
});

const instituteStatSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
  detail: z.string().optional(),
  order: z.number().int().optional(),
});

export const updateInstituteSchema = {
  body: z.object({
    name: z.string().trim().min(1).optional(),
    tagline: z.string().trim().optional(),
    mission: z.string().trim().optional(),
    vision: z.string().trim().optional(),
    philosophy: z.string().trim().optional(),
    history: z.string().trim().optional(),
    establishedYear: z.number().int().min(1800).max(2100).optional(),
    accreditations: z.array(accreditationSchema).optional(),
    contact: z
      .object({
        email: z.string().email(),
        phone: z.string().min(5),
        alternatePhone: z.string().optional(),
        address: z
          .object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string().optional(),
            mapUrl: z.string().optional(),
          })
          .optional(),
        hours: z.string().optional(),
      })
      .optional(),
    socialLinks: z
      .object({
        instagram: z.string().optional(),
        youtube: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .optional(),
    stats: z.array(instituteStatSchema).optional(),
    branding: z
      .object({
        logo: storageImageSchema.optional(),
        favicon: z.string().optional(),
        coverImage: storageImageSchema.optional(),
      })
      .optional(),
    description: z.string().trim().optional(),
    eyebrow: z.string().trim().optional(),
    affiliationText: z.string().trim().optional(),
    pillars: z
      .array(
        z.object({
          title: z.string().trim(),
          subtitle: z.string().trim().optional(),
          description: z.string().trim(),
        })
      )
      .optional(),
    images: z.array(storageImageSchema).optional(),
    homepageCta: z
      .object({
        badge: z.string().trim().optional(),
        title: z.string().trim().optional(),
        description: z.string().trim().optional(),
        primaryCtaText: z.string().trim().optional(),
        primaryCtaUrl: z.string().trim().optional(),
        secondaryCtaText: z.string().trim().optional(),
        secondaryCtaUrl: z.string().trim().optional(),
      })
      .optional(),
    seo: seoSchema.optional(),
  }),
};
