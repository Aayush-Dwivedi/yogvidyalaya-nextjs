import { Schema, model, Document, Types, models, Model } from 'mongoose';
import { StorageImageSchema, SEOMetadataSchema } from './common.schema';
import {
  IStorageImage,
  ISEOMetadata,
  IPrice,
  CourseLevel,
  DeliveryMode,
  ContentStatus,
} from '../types/content.types';

export interface ICurriculumModule {
  moduleNumber: number;
  title: string;
  description?: string;
  topics: string[];
}

export interface ICourseCapacity {
  total: number;
  enrolled?: number;
}

export interface ICourseInstructor {
  name: string;
  title?: string;
  bio?: string;
  image?: IStorageImage;
  founderRef?: Types.ObjectId;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: IStorageImage;
  image?: IStorageImage;
  gallery: IStorageImage[];
  duration: string;
  level: CourseLevel;
  mode: DeliveryMode;
  price: IPrice;
  features: string[];
  benefits: string[];
  curriculum: ICurriculumModule[];
  instructor: ICourseInstructor;
  certification?: string;
  eligibility?: string;
  schedule?: string;
  capacity: ICourseCapacity;
  order: number;
  status: ContentStatus;
  featured: boolean;
  seo?: ISEOMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const CurriculumModuleSchema = new Schema<ICurriculumModule>(
  {
    moduleNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    topics: [{ type: String, trim: true }],
  },
  { _id: false }
);

const CourseInstructorSchema = new Schema<ICourseInstructor>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    bio: { type: String, trim: true },
    image: { type: StorageImageSchema },
    founderRef: { type: Schema.Types.ObjectId, ref: 'Founder' },
  },
  { _id: false }
);

const PriceSchema = new Schema<IPrice>(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', trim: true },
    isFree: { type: Boolean, default: false },
    displayPrice: { type: String, trim: true },
  },
  { _id: false }
);

const CourseCapacitySchema = new Schema<ICourseCapacity>(
  {
    total: { type: Number, default: 30, min: 1 },
    enrolled: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
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
    description: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    coverImage: {
      type: StorageImageSchema,
      required: [true, 'Cover image is required'],
    },
    gallery: [StorageImageSchema],
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'all-levels',
      index: true,
    },
    mode: {
      type: String,
      enum: ['residential', 'in-person', 'online', 'hybrid'],
      default: 'in-person',
      index: true,
    },
    price: {
      type: PriceSchema,
      required: [true, 'Price details are required'],
    },
    features: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    curriculum: [CurriculumModuleSchema],
    instructor: {
      type: CourseInstructorSchema,
      required: [true, 'Instructor details are required'],
    },
    certification: {
      type: String,
      trim: true,
    },
    eligibility: {
      type: String,
      trim: true,
    },
    schedule: {
      type: String,
      trim: true,
    },
    capacity: {
      type: CourseCapacitySchema,
      default: () => ({ total: 30, enrolled: 0 }),
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

// Virtual for alias `image` -> `coverImage`
CourseSchema.virtual('image')
  .get(function (this: ICourse) {
    return this.coverImage;
  })
  .set(function (this: ICourse, val: IStorageImage) {
    this.coverImage = val;
  });

// Pre-validate hook to sync benefits <-> features and image <-> coverImage
CourseSchema.pre('validate', function () {
  if (this.benefits && this.benefits.length > 0 && (!this.features || this.features.length === 0)) {
    this.features = [...this.benefits];
  } else if (this.features && this.features.length > 0 && (!this.benefits || this.benefits.length === 0)) {
    this.benefits = [...this.features];
  }
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.slice(0, 160).trim();
  }
});

// Full text search index on title and description
CourseSchema.index({ title: 'text', shortDescription: 'text', description: 'text' });

export const Course = (models.Course as Model<ICourse>) || model<ICourse>('Course', CourseSchema);
