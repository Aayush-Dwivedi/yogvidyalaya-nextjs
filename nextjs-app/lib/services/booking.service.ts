import { Types } from 'mongoose';
import { Booking, IBooking, BookingStatus, PaymentStatus, BookingProgramType } from '../models/Booking';
import { Course } from '../models/Course';
import { Workshop } from '../models/Workshop';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { PaginationMeta } from '../types/content.types';

export interface CreateBookingDTO {
  programType: BookingProgramType;
  programId: string;
  schedule?: {
    date?: string | Date;
    time?: string;
    batch?: string;
    duration?: string;
    mode?: string;
    venue?: string;
  };
  metadata?: Record<string, any>;
  notes?: string;
}

export interface BookingFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  programType?: string;
  sort?: string;
}

export class BookingService {
  /**
   * Generates a unique, elegant booking reference (e.g., BK-2026-84912)
   */
  private static async generateBookingReference(): Promise<string> {
    const year = new Date().getFullYear();
    for (let attempts = 0; attempts < 10; attempts++) {
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      const ref = `BK-${year}-${randomPart}`;
      const exists = await Booking.findOne({ bookingReference: ref });
      if (!exists) return ref;
    }
    return `BK-${year}-${Date.now().toString().slice(-6)}`;
  }

  /**
   * Create a new booking with atomic server-side capacity check
   */
  static async createBooking(studentId: string, dto: CreateBookingDTO): Promise<IBooking> {
    const student = await User.findById(studentId);
    if (!student) {
      throw AppError.notFound('Student user account not found.');
    }

    const bookingRef = await this.generateBookingReference();
    let programTitle = '';
    let programSlug = '';
    let totalAmount = 0;
    let currency = 'INR';
    let displayAmount = '₹0';
    const scheduleData: any = { ...(dto.schedule || {}) };

    if (dto.programType === 'course') {
      const course = await Course.findById(dto.programId);
      if (!course) {
        throw AppError.notFound(`Course not found with ID: ${dto.programId}`);
      }
      if (course.status !== 'published') {
        throw AppError.badRequest('This course is not open for public student enrollments.');
      }

      // Check for double booking
      const existing = await Booking.findOne({
        student: studentId,
        'program.programId': course._id,
        bookingStatus: { $in: ['confirmed', 'pending'] },
      });
      if (existing) {
        throw AppError.conflict(
          `You already have an active booking reservation (${existing.bookingReference}) for "${course.title}".`
        );
      }

      // Server-Side Capacity Verification
      const maxCapacity = course.capacity?.total || 30;
      const activeBookingsCount = await Booking.countDocuments({
        'program.programId': course._id,
        bookingStatus: { $in: ['confirmed', 'pending'] },
      });

      if (activeBookingsCount >= maxCapacity || (course.capacity?.enrolled || 0) >= maxCapacity) {
        throw AppError.badRequest(
          `This course cohort has reached its maximum capacity of ${maxCapacity} students. Further bookings cannot be accepted.`
        );
      }

      programTitle = course.title;
      programSlug = course.slug;
      totalAmount = course.price?.amount || 0;
      currency = course.price?.currency || 'INR';
      displayAmount = course.price?.displayPrice || (totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : 'Free');

      scheduleData.duration = scheduleData.duration || course.duration;
      scheduleData.mode = scheduleData.mode || course.mode;
      scheduleData.batch = scheduleData.batch || course.schedule || 'Morning Gurukula Batch';
      scheduleData.time = scheduleData.time || course.schedule || '6:00 AM – 8:30 AM';
      scheduleData.venue = scheduleData.venue || 'Kalptaru Tapovan Shala';

      // Increment course capacity
      await Course.findByIdAndUpdate(course._id, { $inc: { 'capacity.enrolled': 1 } });
    } else if (dto.programType === 'workshop') {
      const workshop = await Workshop.findById(dto.programId);
      if (!workshop) {
        throw AppError.notFound(`Workshop not found with ID: ${dto.programId}`);
      }
      if (workshop.status !== 'published') {
        throw AppError.badRequest('This workshop is not open for public registrations.');
      }

      // Check registration deadline
      if (workshop.registrationDeadline && new Date() > new Date(workshop.registrationDeadline)) {
        throw AppError.badRequest(
          `The registration deadline for "${workshop.title}" has expired (${new Date(
            workshop.registrationDeadline
          ).toLocaleDateString()}).`
        );
      }

      // Check for double booking
      const existing = await Booking.findOne({
        student: studentId,
        'program.programId': workshop._id,
        bookingStatus: { $in: ['confirmed', 'pending'] },
      });
      if (existing) {
        throw AppError.conflict(
          `You already have an active reservation (${existing.bookingReference}) for "${workshop.title}".`
        );
      }

      // Server-Side Capacity Verification
      const maxCapacity = workshop.capacity?.total || 25;
      const activeBookingsCount = await Booking.countDocuments({
        'program.programId': workshop._id,
        bookingStatus: { $in: ['confirmed', 'pending'] },
      });

      if (activeBookingsCount >= maxCapacity || (workshop.capacity?.booked || 0) >= maxCapacity) {
        throw AppError.badRequest(
          `This workshop has reached maximum capacity (${maxCapacity} attendees). No additional seats are available.`
        );
      }

      programTitle = workshop.title;
      programSlug = workshop.slug;
      totalAmount = workshop.price?.amount || 0;
      currency = workshop.price?.currency || 'INR';
      displayAmount = workshop.price?.displayPrice || (totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : 'Free');

      scheduleData.date = scheduleData.date || workshop.date;
      scheduleData.time = scheduleData.time || `${workshop.startTime} – ${workshop.endTime}`;
      scheduleData.duration = scheduleData.duration || workshop.duration;
      scheduleData.mode = scheduleData.mode || workshop.mode;
      scheduleData.venue = scheduleData.venue || workshop.location?.venue || 'Tapovan Shala';

      // Increment workshop capacity
      await Workshop.findByIdAndUpdate(workshop._id, { $inc: { 'capacity.booked': 1 } });
    }

    const booking = await Booking.create({
      bookingReference: bookingRef,
      student: student._id,
      program: {
        programType: dto.programType,
        programId: new Types.ObjectId(dto.programId),
        programRef: dto.programType === 'course' ? 'Course' : 'Workshop',
        title: programTitle,
        slug: programSlug,
      },
      schedule: scheduleData,
      bookingStatus: 'confirmed',
      amount: {
        total: totalAmount,
        currency,
        displayAmount,
      },
      paymentStatus: totalAmount === 0 ? 'waived' : 'pending',
      bookingDate: new Date(),
      metadata: dto.metadata || {},
      notes: dto.notes,
    });

    return (await Booking.findById(booking._id).populate('student', 'name email phone avatar'))!;
  }

  /**
   * Get paginated bookings with flexible searching and filters
   */
  static async getBookings(
    query: BookingFilterQuery,
    studentId?: string
  ): Promise<{ items: IBooking[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (studentId) {
      filter.student = studentId;
    }

    if (query.status && query.status !== 'all') {
      filter.bookingStatus = query.status;
    }

    if (query.paymentStatus && query.paymentStatus !== 'all') {
      filter.paymentStatus = query.paymentStatus;
    }

    if (query.programType && query.programType !== 'all') {
      filter['program.programType'] = query.programType;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { bookingReference: searchRegex },
        { 'program.title': searchRegex },
        { 'schedule.venue': searchRegex },
        { notes: searchRegex },
      ];
    }

    const sortOption: any = query.sort || { bookingDate: -1, createdAt: -1 };

    const [items, total] = await Promise.all([
      Booking.find(filter)
        .populate('student', 'name email phone avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get single booking by ID with authorization checks
   */
  static async getBookingById(
    id: string,
    requestingUser: { _id: string; role: string }
  ): Promise<IBooking> {
    const booking = await Booking.findById(id).populate('student', 'name email phone avatar');
    if (!booking) {
      throw AppError.notFound(`Booking not found with ID: ${id}`);
    }

    const isOwner = booking.student && (booking.student as any)._id?.toString() === requestingUser._id.toString();
    const isAdmin = ['admin', 'super_admin'].includes(requestingUser.role);

    if (!isOwner && !isAdmin) {
      throw AppError.forbidden('You do not have permission to view this booking reservation.');
    }

    return booking;
  }

  /**
   * Admin status update with automatic capacity adjustment
   */
  static async updateBookingStatus(
    id: string,
    payload: {
      bookingStatus?: BookingStatus;
      paymentStatus?: PaymentStatus;
      notes?: string;
      cancellationReason?: string;
    }
  ): Promise<IBooking> {
    const booking = await Booking.findById(id);
    if (!booking) {
      throw AppError.notFound(`Booking not found with ID: ${id}`);
    }

    const oldStatus = booking.bookingStatus;
    const newStatus = payload.bookingStatus || oldStatus;

    // Handle seat release when cancelling or refunding
    if (
      ['confirmed', 'pending'].includes(oldStatus) &&
      ['cancelled', 'refunded'].includes(newStatus)
    ) {
      if (booking.program.programType === 'course') {
        await Course.findByIdAndUpdate(booking.program.programId, {
          $inc: { 'capacity.enrolled': -1 },
        });
      } else if (booking.program.programType === 'workshop') {
        await Workshop.findByIdAndUpdate(booking.program.programId, {
          $inc: { 'capacity.booked': -1 },
        });
      }
      booking.cancelledAt = new Date();
      if (payload.cancellationReason) {
        booking.cancellationReason = payload.cancellationReason;
      }
    }

    // Handle seat reclaim if re-confirming a cancelled booking
    if (
      ['cancelled', 'refunded'].includes(oldStatus) &&
      newStatus === 'confirmed'
    ) {
      // Re-verify capacity before re-confirming
      if (booking.program.programType === 'course') {
        const course = await Course.findById(booking.program.programId);
        const maxCap = course?.capacity?.total || 30;
        const count = await Booking.countDocuments({
          'program.programId': booking.program.programId,
          bookingStatus: { $in: ['confirmed', 'pending'] },
        });
        if (count >= maxCap) {
          throw AppError.badRequest('Cannot re-confirm booking: course cohort is now at full capacity.');
        }
        await Course.findByIdAndUpdate(booking.program.programId, {
          $inc: { 'capacity.enrolled': 1 },
        });
      } else if (booking.program.programType === 'workshop') {
        const workshop = await Workshop.findById(booking.program.programId);
        const maxCap = workshop?.capacity?.total || 25;
        const count = await Booking.countDocuments({
          'program.programId': booking.program.programId,
          bookingStatus: { $in: ['confirmed', 'pending'] },
        });
        if (count >= maxCap) {
          throw AppError.badRequest('Cannot re-confirm booking: workshop is now at full capacity.');
        }
        await Workshop.findByIdAndUpdate(booking.program.programId, {
          $inc: { 'capacity.booked': 1 },
        });
      }
      booking.cancelledAt = undefined;
      booking.cancellationReason = undefined;
    }

    if (payload.bookingStatus) booking.bookingStatus = payload.bookingStatus;
    if (payload.paymentStatus) booking.paymentStatus = payload.paymentStatus;
    if (payload.notes !== undefined) booking.notes = payload.notes;

    await booking.save();
    return (await Booking.findById(id).populate('student', 'name email phone avatar'))!;
  }

  /**
   * Cancel booking (by student or administrator) and release capacity
   */
  static async cancelBooking(
    id: string,
    requestingUser: { _id: string; role: string },
    reason?: string
  ): Promise<IBooking> {
    const booking = await Booking.findById(id);
    if (!booking) {
      throw AppError.notFound(`Booking not found with ID: ${id}`);
    }

    const isOwner = booking.student.toString() === requestingUser._id.toString();
    const isAdmin = ['admin', 'super_admin'].includes(requestingUser.role);

    if (!isOwner && !isAdmin) {
      throw AppError.forbidden('You do not have permission to cancel this booking.');
    }

    if (booking.bookingStatus === 'cancelled') {
      throw AppError.badRequest('This booking is already cancelled.');
    }

    // Release capacity if it was actively confirmed/pending
    if (['confirmed', 'pending'].includes(booking.bookingStatus)) {
      if (booking.program.programType === 'course') {
        await Course.findByIdAndUpdate(booking.program.programId, {
          $inc: { 'capacity.enrolled': -1 },
        });
      } else if (booking.program.programType === 'workshop') {
        await Workshop.findByIdAndUpdate(booking.program.programId, {
          $inc: { 'capacity.booked': -1 },
        });
      }
    }

    booking.bookingStatus = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'Cancelled by student';

    await booking.save();
    return (await Booking.findById(id).populate('student', 'name email phone avatar'))!;
  }
}
