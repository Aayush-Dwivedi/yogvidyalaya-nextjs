import { Schema } from 'mongoose';
import { IStorageImage, ISEOMetadata } from '../types/content.types';

/**
 * Reusable Supabase Storage image metadata sub-schema
 */
export const StorageImageSchema = new Schema<IStorageImage>(
  {
    url: { type: String, required: true, trim: true },
    path: { type: String, default: 'media/image.jpg', trim: true },
    bucket: { type: String, default: 'kalptaru-media', trim: true },
    size: { type: Number },
    mimeType: { type: String, trim: true },
    alt: { type: String, trim: true, default: '' },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

/**
 * Reusable SEO metadata sub-schema
 */
export const SEOMetadataSchema = new Schema<ISEOMetadata>(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 200 },
    keywords: [{ type: String, trim: true }],
    ogImage: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
  },
  { _id: false }
);
