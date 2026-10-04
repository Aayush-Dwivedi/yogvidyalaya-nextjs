import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageImageSchema, SEOMetadataSchema } from './common.schema';
import {
  IStorageImage,
  ISEOMetadata,
  CorporateFormat,
  CorporatePricingModel,
  ContentStatus,
} from '../types/content.types';

export interface ICorporateModule {
  title: string;
  duration?: string;
  description: string;
}

export interface ICorporateProgram extends Document {
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  shortDescription: string;
  coverImage?: IStorageImage;
  format: CorporateFormat;
  duration?: string;
  targetAudience?: string;
  deliverables: string[];
  modules: ICorporateModule[];
  caseStudiesOrClients: string[];
  pricingModel: CorporatePricingModel;
  startingPrice?: {
    amount: number;
    currency: string;
  };
  order: number;
  status: ContentStatus;
  featured: boolean;
  seo?: ISEOMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const CorporateModuleSchema = new Schema<ICorporateModule>(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CorporateProgramSchema = new Schema<ICorporateProgram>(
  {
    title: {
      type: String,
      required: [true, 'Corporate program title is required'],
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
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    coverImage: {
      type: StorageImageSchema,
    },
    format: {
      type: String,
      enum: ['on-site', 'virtual', 'retreat', 'hybrid'],
      default: 'on-site',
      index: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    targetAudience: {
      type: String,
      trim: true,
    },
    deliverables: [{ type: String, trim: true }],
    modules: [CorporateModuleSchema],
    caseStudiesOrClients: [{ type: String, trim: true }],
    pricingModel: {
      type: String,
      enum: ['custom-quote', 'fixed-package', 'per-seat'],
      default: 'custom-quote',
    },
    startingPrice: {
      amount: { type: Number },
      currency: { type: String, default: 'INR' },
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

export const CorporateProgram = model<ICorporateProgram>(
  'CorporateProgram',
  CorporateProgramSchema
);
