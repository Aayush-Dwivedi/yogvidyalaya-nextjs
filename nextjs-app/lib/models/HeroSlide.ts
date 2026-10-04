import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageImageSchema } from './common.schema';
import { IStorageImage } from '../types/content.types';

export interface IHeroSlide extends Document {
  image: IStorageImage;
  heading: string;
  subheading?: string;
  description: string;
  quote?: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    image: {
      type: StorageImageSchema,
      required: [true, 'Hero slide image is required'],
    },
    heading: {
      type: String,
      required: [true, 'Heading is required'],
      trim: true,
    },
    subheading: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    quote: {
      type: String,
      trim: true,
    },
    ctaText: {
      type: String,
      default: 'Explore Programs',
      trim: true,
    },
    ctaUrl: {
      type: String,
      default: '/programs',
      trim: true,
    },
    secondaryCtaText: {
      type: String,
      trim: true,
    },
    secondaryCtaUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    active: {
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

export const HeroSlide = (models.HeroSlide as Model<IHeroSlide>) || model<IHeroSlide>('HeroSlide', HeroSlideSchema);
