import { Schema, model, Document, models, Model } from 'mongoose';
import { BenefitCategory, ContentStatus } from '../types/content.types';

export interface IBenefit extends Document {
  title: string;
  sanskritTerm?: string;
  description: string;
  scriptureRef?: string;
  icon?: string;
  category: BenefitCategory;
  order: number;
  status: ContentStatus;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BenefitSchema = new Schema<IBenefit>(
  {
    title: {
      type: String,
      required: [true, 'Benefit title is required'],
      trim: true,
    },
    sanskritTerm: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    scriptureRef: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['physical', 'mental', 'spiritual', 'general'],
      default: 'general',
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

BenefitSchema.pre('validate', function () {
  if (this.active !== undefined) {
    if (this.active === false && this.status === 'published') {
      this.status = 'draft';
    } else if (this.active === true && this.status === 'draft') {
      this.status = 'published';
    }
  } else if (this.status) {
    this.active = this.status === 'published';
  }
});

export const Benefit = (models.Benefit as Model<IBenefit>) || model<IBenefit>('Benefit', BenefitSchema);
