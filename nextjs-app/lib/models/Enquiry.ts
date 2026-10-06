import mongoose, { Document, Schema, models, Model } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  programInterest: 'course' | 'workshop' | 'corporate' | 'membership' | 'general';
  message: string;
  status: 'new' | 'in_progress' | 'contacted' | 'resolved';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: [true, 'Enquiry sender name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Enquiry email address is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    programInterest: {
      type: String,
      enum: ['course', 'workshop', 'corporate', 'membership', 'general'],
      default: 'general',
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Enquiry message is required'],
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'contacted', 'resolved'],
      default: 'new',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry =
  (models.Enquiry as Model<IEnquiry>) ||
  mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
