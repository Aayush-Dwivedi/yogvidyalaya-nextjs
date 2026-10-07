import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageImageSchema, SEOMetadataSchema } from './common.schema';
import { IStorageImage, ISEOMetadata } from '../types/content.types';

export interface IAccreditation {
  name: string;
  authority: string;
  logo?: IStorageImage;
  certificateNumber?: string;
  validUntil?: Date;
}

export interface IInstituteContact {
  email: string;
  phone: string;
  alternatePhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    mapUrl?: string;
  };
  hours?: string;
}

export interface ISocialLinks {
  instagram?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
}

export interface IInstituteStat {
  label: string;
  value: string;
  detail?: string;
  order?: number;
}

export interface IInstitute extends Document {
  name: string;
  tagline: string;
  mission: string;
  vision: string;
  philosophy: string;
  history: string;
  establishedYear: number;
  accreditations: IAccreditation[];
  contact: IInstituteContact;
  socialLinks: ISocialLinks;
  stats: IInstituteStat[];
  branding: {
    logo?: IStorageImage;
    favicon?: string;
    coverImage?: IStorageImage;
  };
  description?: string;
  eyebrow?: string;
  affiliationText?: string;
  pillars?: { title: string; subtitle?: string; description: string }[];
  images?: IStorageImage[];
  homepageCta?: {
    badge?: string;
    title?: string;
    description?: string;
    primaryCtaText?: string;
    primaryCtaUrl?: string;
    secondaryCtaText?: string;
    secondaryCtaUrl?: string;
  };
  seo?: ISEOMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const AccreditationSchema = new Schema<IAccreditation>(
  {
    name: { type: String, required: true, trim: true },
    authority: { type: String, required: true, trim: true },
    logo: { type: StorageImageSchema },
    certificateNumber: { type: String, trim: true },
    validUntil: { type: Date },
  },
  { _id: false }
);

const InstituteStatSchema = new Schema<IInstituteStat>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    detail: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const InstituteSchema = new Schema<IInstitute>(
  {
    name: {
      type: String,
      required: [true, 'Institute name is required'],
      trim: true,
      default: 'Kalptaruu Yoga Vidhyalaya',
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Ancient Wisdom for Modern Transformation',
    },
    mission: {
      type: String,
      trim: true,
      default: '',
    },
    vision: {
      type: String,
      trim: true,
      default: '',
    },
    philosophy: {
      type: String,
      trim: true,
      default: '',
    },
    history: {
      type: String,
      trim: true,
      default: '',
    },
    establishedYear: {
      type: Number,
      default: 2011,
    },
    accreditations: [AccreditationSchema],
    contact: {
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      alternatePhone: { type: String, trim: true },
      address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: 'India' },
        mapUrl: { type: String, default: '' },
      },
      hours: { type: String, default: 'Mon - Sat: 06:00 AM - 08:00 PM' },
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    stats: [InstituteStatSchema],
    branding: {
      logo: { type: StorageImageSchema },
      favicon: { type: String, default: '/favicon.ico' },
      coverImage: { type: StorageImageSchema },
    },
    seo: { type: SEOMetadataSchema },
    description: { type: String, trim: true, default: '' },
    eyebrow: { type: String, trim: true, default: 'Sanctuary of Traditional Yoga & Clinical Physiotherapy' },
    affiliationText: { type: String, trim: true, default: 'Affiliated with Indian Yoga Association (IYA)' },
    pillars: [
      {
        title: { type: String, trim: true },
        subtitle: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    images: [{ type: StorageImageSchema }],
    homepageCta: {
      badge: { type: String, default: 'Traditional Yoga & Wellness' },
      title: { type: String, default: 'JOIN Our Classes' },
      description: {
        type: String,
        default:
          "Whether you're looking to get fit, manage a health condition, or become a yoga teacher, we have a program for you. Get in touch to learn more.",
      },
      primaryCtaText: { type: String, default: 'Browse Courses' },
      primaryCtaUrl: { type: String, default: '/programs/courses' },
      secondaryCtaText: { type: String, default: 'Get in Touch' },
      secondaryCtaUrl: { type: String, default: '/contact/enquiry' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Institute = (models.Institute as Model<IInstitute>) || model<IInstitute>('Institute', InstituteSchema);
