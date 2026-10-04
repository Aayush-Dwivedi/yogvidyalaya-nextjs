export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'waived';
export type BookingProgramType = 'course' | 'workshop';

export interface BookingStudent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface BookingProgram {
  programType: BookingProgramType;
  programId: string;
  programRef: 'Course' | 'Workshop';
  title: string;
  slug?: string;
}

export interface BookingSchedule {
  date?: string;
  time?: string;
  batch?: string;
  duration?: string;
  mode?: string;
  venue?: string;
}

export interface BookingAmount {
  total: number;
  currency: string;
  displayAmount?: string;
}

export interface BookingMetadata {
  sadhanaExperience?: string;
  healthConditions?: string;
  dietaryPreferences?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  intakeAnswers?: Record<string, string>;
  [key: string]: any;
}

export interface Booking {
  _id: string;
  bookingReference: string;
  student: BookingStudent;
  program: BookingProgram;
  schedule: BookingSchedule;
  bookingStatus: BookingStatus;
  amount: BookingAmount;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  metadata: BookingMetadata;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  programType: BookingProgramType;
  programId: string;
  schedule?: BookingSchedule;
  metadata?: BookingMetadata;
  notes?: string;
}

export interface BookingFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  programType?: string;
  sort?: string;
}

export interface UpdateBookingStatusPayload {
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  cancellationReason?: string;
}
