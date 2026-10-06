export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled' | 'pending' | 'refunded';
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
  scheduleId?: string;
  date?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  batch?: string;
  duration?: string;
  mode?: string;
  venue?: string;
  location?: string;
}

export interface BookingAttendeeDetails {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  age?: number;
  city?: string;
  message?: string;
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
  student?: BookingStudent;
  program: BookingProgram;
  schedule: BookingSchedule;
  attendeeDetails?: BookingAttendeeDetails;
  bookingStatus: BookingStatus;
  status?: BookingStatus;
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
  attendeeDetails?: BookingAttendeeDetails;
  metadata?: BookingMetadata;
  notes?: string;
}

export interface ProgramScheduleOption {
  id: string;
  batch: string;
  date?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  duration?: string;
  mode: string;
  venue: string;
  location?: string;
  totalCapacity: number;
  enrolled: number;
  availableSeats: number;
  status: string;
  isFull: boolean;
}

export interface BookingFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  programType?: string;
  programId?: string;
  program?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

export interface UpdateBookingStatusPayload {
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  cancellationReason?: string;
}
