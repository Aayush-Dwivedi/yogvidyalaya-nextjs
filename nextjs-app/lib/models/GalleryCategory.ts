import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageImageSchema } from './common.schema';
import { IStorageImage } from '../types/content.types';

export interface IGalleryCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  coverImage?: IStorageImage;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryCategorySchema = new Schema<IGalleryCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: StorageImageSchema,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const GalleryCategory = model<IGalleryCategory>(
  'GalleryCategory',
  GalleryCategorySchema
);
