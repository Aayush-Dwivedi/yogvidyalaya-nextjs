import { Schema, model, Document, Types, models, Model } from 'mongoose';
import { DeliveryMode } from '../types/content.types';

export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled' | 'pending' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'waived';
export type BookingProgramType = 'course' | 'workshop';

export interface IBookingProgram {
  programType: BookingProgramType;
  programId: Types.ObjectId;
  programRef: 'Course' | 'Workshop';
  title: string;
  slug?: string;
}

export interface IBookingSchedule {
  scheduleId?: string;
  date?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  time?: string;
  batch?: string;
  duration?: string;
  mode?: DeliveryMode | string;
  venue?: string;
  location?: string;
}

export interface IBookingAttendeeDetails {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  age?: number;
  city?: string;
  message?: string;
}

export interface IBookingAmount {
  total: number;
  currency: string;
  displayAmount?: string;
}

export interface IBookingMetadata {
  sadhanaExperience?: string;
  healthConditions?: string;
  dietaryPreferences?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  intakeAnswers?: Record<string, string>;
  [key: string]: any;
}

export interface IBooking extends Document {
  bookingReference: string;
  student?: Types.ObjectId;
  program: IBookingProgram;
  schedule: IBookingSchedule;
  attendeeDetails?: IBookingAttendeeDetails;
  bookingStatus: BookingStatus;
  status: BookingStatus;
  amount: IBookingAmount;
  paymentStatus: PaymentStatus;
  bookingDate: Date;
  metadata: IBookingMetadata;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingProgramSchema = new Schema<IBookingProgram>(
  {
    programType: {
      type: String,
      enum: ['course', 'workshop'],
      required: [true, 'Program type is required'],
    },
    programId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Program ID is required'],
      refPath: 'program.programRef',
      index: true,
    },
    programRef: {
      type: String,
      required: true,
      enum: ['Course', 'Workshop'],
    },
    title: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const BookingScheduleSchema = new Schema<IBookingSchedule>(
  {
    scheduleId: { type: String, trim: true },
    date: { type: Date },
    endDate: { type: Date },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    time: { type: String, trim: true },
    batch: { type: String, trim: true },
    duration: { type: String, trim: true },
    mode: { type: String, trim: true },
    venue: { type: String, trim: true },
    location: { type: String, trim: true },
  },
  { _id: false }
);

const AttendeeDetailsSchema = new Schema<IBookingAttendeeDetails>(
  {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    gender: { type: String, trim: true },
    age: { type: Number },
    city: { type: String, trim: true },
    message: { type: String, trim: true },
  },
  { _id: false }
);

const BookingAmountSchema = new Schema<IBookingAmount>(
  {
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', trim: true },
    displayAmount: { type: String, trim: true },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    program: {
      type: BookingProgramSchema,
      required: true,
    },
    schedule: {
      type: BookingScheduleSchema,
      default: () => ({}),
    },
    attendeeDetails: {
      type: AttendeeDetailsSchema,
      default: () => ({}),
    },
    bookingStatus: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'completed', 'cancelled', 'pending', 'refunded'],
      default: 'new',
      index: true,
    },
    amount: {
      type: BookingAmountSchema,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'waived'],
      default: 'pending',
      index: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
    notes: {
      type: String,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for alias `status` -> `bookingStatus`
BookingSchema.virtual('status')
  .get(function (this: IBooking) {
    return this.bookingStatus;
  })
  .set(function (this: IBooking, val: BookingStatus) {
    this.bookingStatus = val;
  });

// Indexes for high-performance querying
BookingSchema.index({ student: 1, bookingStatus: 1 });
BookingSchema.index({ 'program.programId': 1, bookingStatus: 1 });
BookingSchema.index({ bookingDate: -1 });

export const Booking = (models.Booking as Model<IBooking>) || model<IBooking>('Booking', BookingSchema);
