import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageImageSchema } from './common.schema';
import { IStorageImage, ContentStatus } from '../types/content.types';

export interface ITestimonial extends Document {
  name: string;
  roleOrTitle: string;
  programOrCourse?: string;
  quote: string;
  rating: number;
  avatar?: IStorageImage;
  location?: string;
  order: number;
  status: ContentStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Student/Client name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    roleOrTitle: {
      type: String,
      required: [true, 'Role or designation is required'],
      trim: true,
      maxlength: [100, 'Role or title cannot exceed 100 characters'],
    },
    programOrCourse: {
      type: String,
      trim: true,
      default: 'Yoga Sadhak',
      maxlength: [100, 'Program name cannot exceed 100 characters'],
    },
    quote: {
      type: String,
      required: [true, 'Testimonial quote is required'],
      trim: true,
      maxlength: [500, 'Testimonial quote cannot exceed 500 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    avatar: {
      type: StorageImageSchema,
    },
    location: {
      type: String,
      trim: true,
      default: 'India',
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
    featured: {
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

export const Testimonial =
  (models.Testimonial as Model<ITestimonial>) ||
  model<ITestimonial>('Testimonial', TestimonialSchema);
