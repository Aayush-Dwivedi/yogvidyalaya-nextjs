import { Schema, model, Document, models, Model } from 'mongoose';
import { BillingCycle, ContentStatus } from '../types/content.types';

export interface IMembershipBatch {
  name: string;
  timing: string;
  days: string;
}

export interface IMembershipPrice {
  amount: number;
  currency: string;
  discountPercentage?: number;
  originalAmount?: number;
}

export interface IMembershipPlan extends Document {
  title: string;
  slug: string;
  billingCycle: BillingCycle;
  price: IMembershipPrice;
  description: string;
  batches: IMembershipBatch[];
  features: string[];
  popular: boolean;
  order: number;
  status: ContentStatus;
  termsAndConditions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MembershipBatchSchema = new Schema<IMembershipBatch>(
  {
    name: { type: String, required: true, trim: true },
    timing: { type: String, required: true, trim: true },
    days: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const MembershipPriceSchema = new Schema<IMembershipPrice>(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', trim: true },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    originalAmount: { type: Number },
  },
  { _id: false }
);

const MembershipPlanSchema = new Schema<IMembershipPlan>(
  {
    title: {
      type: String,
      required: [true, 'Membership plan title is required'],
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
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'half-yearly', 'annual'],
      required: [true, 'Billing cycle is required'],
      index: true,
    },
    price: {
      type: MembershipPriceSchema,
      required: [true, 'Price details are required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    batches: [MembershipBatchSchema],
    features: [{ type: String, trim: true }],
    popular: {
      type: Boolean,
      default: false,
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
    termsAndConditions: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const MembershipPlan = model<IMembershipPlan>(
  'MembershipPlan',
  MembershipPlanSchema
);
