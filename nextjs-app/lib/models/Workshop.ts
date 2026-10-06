import { Schema, model, Document, Types, models, Model } from 'mongoose';
import { StorageImageSchema, SEOMetadataSchema } from './common.schema';
import { IProgramSchedule, ProgramScheduleSchema } from './Course';
import {
  IStorageImage,
  ISEOMetadata,
  IPrice,
  DeliveryMode,
  ContentStatus,
} from '../types/content.types';

export interface IWorkshopLocation {
  venue: string;
  address?: string;
  city?: string;
  mapUrl?: string;
  onlineLink?: string;
}

export interface IWorkshopCapacity {
  total: number;
  booked?: number;
}

export interface IWorkshopInstructor {
  name: string;
  title?: string;
  bio?: string;
  image?: IStorageImage;
  founderRef?: Types.ObjectId;
}

export interface IWorkshop extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage: IStorageImage;
  image?: IStorageImage;
  date: Date;
  endDate?: Date;
  startTime: string;
  endTime: string;
  time?: string;
  duration: string;
  mode: DeliveryMode;
  location: IWorkshopLocation;
  capacity: IWorkshopCapacity;
  schedules?: IProgramSchedule[];
  price: IPrice;
  instructor: IWorkshopInstructor;
  registrationDeadline?: Date;
  prerequisites?: string[];
  status: ContentStatus;
  featured: boolean;
  seo?: ISEOMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<IWorkshopLocation>(
  {
    venue: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    mapUrl: { type: String, trim: true },
    onlineLink: { type: String, trim: true },
  },
  { _id: false }
);

const CapacitySchema = new Schema<IWorkshopCapacity>(
  {
    total: { type: Number, required: true, min: 1 },
    booked: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const WorkshopInstructorSchema = new Schema<IWorkshopInstructor>(
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

const WorkshopSchema = new Schema<IWorkshop>(
  {
    title: {
      type: String,
      required: [true, 'Workshop title is required'],
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
      required: [true, 'Description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: StorageImageSchema,
      required: [true, 'Cover image is required'],
    },
    date: {
      type: Date,
      required: [true, 'Workshop date is required'],
      index: true,
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    mode: {
      type: String,
      enum: ['in-person', 'residential', 'online', 'hybrid'],
      default: 'in-person',
      index: true,
    },
    location: {
      type: LocationSchema,
      required: [true, 'Location details are required'],
    },
    capacity: {
      type: CapacitySchema,
      required: [true, 'Capacity details are required'],
    },
    schedules: {
      type: [ProgramScheduleSchema],
      default: () => [],
    },
    price: {
      type: PriceSchema,
      required: [true, 'Price details are required'],
    },
    instructor: {
      type: WorkshopInstructorSchema,
      required: [true, 'Instructor details are required'],
    },
    registrationDeadline: {
      type: Date,
      index: true,
    },
    prerequisites: [{ type: String, trim: true }],
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
WorkshopSchema.virtual('image')
  .get(function (this: IWorkshop) {
    return this.coverImage;
  })
  .set(function (this: IWorkshop, val: IStorageImage) {
    this.coverImage = val;
  });

// Virtual for readable combined `time`
WorkshopSchema.virtual('time').get(function (this: IWorkshop) {
  if (this.startTime && this.endTime) {
    return `${this.startTime} - ${this.endTime}`;
  }
  return this.startTime || '';
});

// Pre-validate hook
WorkshopSchema.pre('validate', function () {
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.slice(0, 160).trim();
  }
});

WorkshopSchema.index({ title: 'text', description: 'text' });

export const Workshop = (models.Workshop as Model<IWorkshop>) || model<IWorkshop>('Workshop', WorkshopSchema);
