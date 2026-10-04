import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageImageSchema } from './common.schema';
import { IStorageImage, ContentStatus } from '../types/content.types';

export interface IFounder extends Document {
  name: string;
  title: string;
  slug: string;
  bio: string;
  shortBio?: string;
  quote?: string;
  image: IStorageImage;
  lineage?: string;
  qualifications: string[];
  experienceYears?: number;
  specializations: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  order: number;
  status: ContentStatus;
  featured: boolean;
  designation?: string;
  biography?: string;
  achievements?: string[];
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FounderSchema = new Schema<IFounder>(
  {
    name: {
      type: String,
      required: [true, 'Founder name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Founder title is required'],
      trim: true,
      default: 'Founder & Spiritual Director',
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
    },
    shortBio: {
      type: String,
      trim: true,
    },
    quote: {
      type: String,
      trim: true,
    },
    image: {
      type: StorageImageSchema,
      required: [true, 'Founder portrait image is required'],
    },
    lineage: {
      type: String,
      trim: true,
    },
    qualifications: [{ type: String, trim: true }],
    experienceYears: {
      type: Number,
      default: 0,
    },
    specializations: [{ type: String, trim: true }],
    socialLinks: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      website: { type: String, default: '' },
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
    designation: {
      type: String,
      trim: true,
    },
    biography: {
      type: String,
      trim: true,
    },
    achievements: [{ type: String, trim: true }],
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

FounderSchema.pre('validate', function () {
  if (this.designation && !this.title) {
    this.title = this.designation;
  } else if (this.title && !this.designation) {
    this.designation = this.title;
  }

  if (this.biography && !this.bio) {
    this.bio = this.biography;
  } else if (this.bio && !this.biography) {
    this.biography = this.bio;
  }

  if (this.message && !this.quote) {
    this.quote = this.message;
  } else if (this.quote && !this.message) {
    this.message = this.quote;
  }
});

export const Founder = (models.Founder as Model<IFounder>) || model<IFounder>('Founder', FounderSchema);
