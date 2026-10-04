import { Schema, model, Document, Types, models, Model } from 'mongoose';
import { StorageImageSchema, SEOMetadataSchema } from './common.schema';
import {
  IStorageImage,
  ISEOMetadata,
  ProgramType,
  ContentStatus,
} from '../types/content.types';

export interface IProgram extends Document {
  title: string;
  slug: string;
  programType: ProgramType;
  tagline?: string;
  shortDescription: string;
  description: string;
  coverImage?: IStorageImage;
  icon?: string;
  badge?: string;
  highlights: string[];
  refModel?: 'Course' | 'Workshop' | 'CorporateProgram' | 'MembershipPlan';
  referenceId?: Types.ObjectId;
  order: number;
  status: ContentStatus;
  featured: boolean;
  seo?: ISEOMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    title: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    programType: {
      type: String,
      enum: ['course', 'workshop', 'corporate', 'membership'],
      required: [true, 'Program type is required'],
      index: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    coverImage: {
      type: StorageImageSchema,
    },
    icon: {
      type: String,
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
    },
    highlights: [{ type: String, trim: true }],
    refModel: {
      type: String,
      enum: ['Course', 'Workshop', 'CorporateProgram', 'MembershipPlan'],
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      refPath: 'refModel',
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
      default: false,
      index: true,
    },
    seo: {
      type: SEOMetadataSchema,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Program = (models.Program as Model<IProgram>) || model<IProgram>('Program', ProgramSchema);
