import { Schema, model, Document, Types, models, Model } from 'mongoose';
import { StorageImageSchema } from './common.schema';
import { IStorageImage, ContentStatus } from '../types/content.types';

export interface IGalleryImage extends Document {
  image: IStorageImage;
  title: string;
  description?: string;
  category?: Types.ObjectId;
  categorySlug?: string;
  event?: string;
  featured: boolean;
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    image: {
      type: StorageImageSchema,
      required: [true, 'Gallery image metadata is required'],
    },
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'GalleryCategory',
      index: true,
    },
    categorySlug: {
      type: String,
      trim: true,
      index: true,
    },
    event: {
      type: String,
      trim: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GalleryImageSchema.index({ title: 'text', description: 'text', event: 'text' });

export const GalleryImage = model<IGalleryImage>(
  'GalleryImage',
  GalleryImageSchema
);
