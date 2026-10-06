import { Types } from 'mongoose';
import { Booking, IBooking, BookingStatus, PaymentStatus, BookingProgramType } from '../models/Booking';
import { Course } from '../models/Course';
import { Workshop } from '../models/Workshop';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { PaginationMeta } from '../types/content.types';
import { EmailService } from './email.service';

export interface CreateBookingDTO {
  programType: BookingProgramType;
  programId: string;
  schedule?: {
    scheduleId?: string;
    date?: string | Date;
    endDate?: string | Date;
    startTime?: string;
    endTime?: string;
    time?: string;
    batch?: string;
    duration?: string;
    mode?: string;
    venue?: string;
    location?: string;
  };
  attendeeDetails?: {
    fullName?: string;
    email?: string;
    phone?: string;
    gender?: string;
    age?: number;
    city?: string;
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
  programId?: string;
  program?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

const ALLOWED_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  new: ['new', 'contacted', 'confirmed', 'completed', 'cancelled'],
  contacted: ['contacted', 'confirmed', 'completed', 'cancelled', 'new'],
  confirmed: ['confirmed', 'completed', 'cancelled', 'contacted'],
  completed: ['completed', 'cancelled'],
  cancelled: ['cancelled', 'confirmed', 'new'],
  pending: ['pending', 'new', 'contacted', 'confirmed', 'cancelled', 'completed'],
  refunded: ['refunded', 'cancelled'],
};

export class BookingService {
  /**
   * Generates a unique, elegant booking reference (format: KYV-2026-XXXXX)
   */
  private static async generateBookingReference(): Promise<string> {
    const year = new Date().getFullYear();
    for (let attempts = 0; attempts < 10; attempts++) {
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      const ref = `KYV-${year}-${randomPart}`;
      const exists = await Booking.findOne({ bookingReference: ref });
      if (!exists) return ref;
    }
    return `KYV-${year}-${Date.now().toString().slice(-5)}`;
  }

  /**
   * Create a new booking request with atomic server-side capacity check and duplicate booking prevention.
   * Public visitors do not require accounts.
   */
  static async createBooking(dto: CreateBookingDTO, studentId?: string): Promise<IBooking> {
    let studentUser: any = null;
    if (studentId) {
      studentUser = await User.findById(studentId);
    }

    const fullName = (dto.attendeeDetails?.fullName || studentUser?.name || '').trim();
    const email = (dto.attendeeDetails?.email || studentUser?.email || '').trim().toLowerCase();
    const phone = (dto.attendeeDetails?.phone || studentUser?.phone || '').trim();

    if (!fullName) {
      throw AppError.badRequest('Full name is required.');
    }
    if (!email) {
      throw AppError.badRequest('Valid email address is required.');
    }
    if (!phone) {
      throw AppError.badRequest('Valid phone number is required.');
    }

    const bookingRef = await this.generateBookingReference();
    let programTitle = '';
    let programSlug = '';
    let totalAmount = 0;
    let currency = 'INR';
    let displayAmount = '₹0';
    const scheduleData: any = { ...(dto.schedule || {}) };

    let targetScheduleId: string | undefined = dto.schedule?.scheduleId;
    let capacityRollbackFn: (() => Promise<void>) | null = null;

    if (dto.programType === 'course') {
      const course = await Course.findById(dto.programId);
      if (!course) {
        throw AppError.notFound(`Course not found with ID: ${dto.programId}`);
      }
      if (course.status !== 'published') {
        throw AppError.badRequest('This course is not open for public student enrollments.');
      }

      // Check if selected schedule exists on this course
      let targetSchedule: any = null;
      if (targetScheduleId && course.schedules && course.schedules.length > 0) {
        targetSchedule = (course.schedules as any).find(
          (s: any) => s._id?.toString() === targetScheduleId || s.id === targetScheduleId
        );
        if (!targetSchedule) {
          throw AppError.badRequest('The requested schedule does not belong to this course.');
        }
        if (targetSchedule.status && targetSchedule.status !== 'active') {
          throw AppError.badRequest(`This schedule is currently ${targetSchedule.status}.`);
        }
      }

      // Duplicate Booking Check (Visitor cannot have duplicate active requests for same course/schedule)
      const duplicateQuery: any = {
        'program.programId': course._id,
        bookingStatus: { $in: ['new', 'contacted', 'confirmed', 'pending'] },
        $or: [
          { 'attendeeDetails.email': email },
          { 'attendeeDetails.phone': phone },
        ],
      };
      if (targetScheduleId) {
        duplicateQuery['schedule.scheduleId'] = targetScheduleId;
      }
      const existing = await Booking.findOne(duplicateQuery);
      if (existing) {
        throw AppError.conflict(
          `An active booking request (${existing.bookingReference}) already exists for this email or phone for "${course.title}". Kalptaru will contact you shortly.`
        );
      }

      // Authoritative Capacity Verification
      const maxCapacity = targetSchedule?.capacity || course.capacity?.total || 30;
      const countFilter: any = {
        'program.programId': course._id,
        bookingStatus: { $in: ['confirmed', 'pending'] },
      };
      if (targetScheduleId) {
        countFilter['schedule.scheduleId'] = targetScheduleId;
      }
      const activeBookingsCount = await Booking.countDocuments(countFilter);

      if (activeBookingsCount >= maxCapacity) {
        throw AppError.badRequest(
          `This course cohort has reached its maximum capacity of ${maxCapacity} students. Further bookings cannot be accepted.`
        );
      }

      // Concurrency-safe atomic seat allocation
      if (targetSchedule) {
        const updatedCourse = await Course.findOneAndUpdate(
          {
            _id: course._id,
            'schedules._id': targetSchedule._id,
            $or: [
              { 'schedules.enrolled': { $exists: false } },
              { 'schedules.enrolled': { $lt: maxCapacity } },
            ],
          },
          {
            $inc: { 'schedules.$.enrolled': 1, 'capacity.enrolled': 1 },
          },
          { new: true }
        );
        if (!updatedCourse) {
          throw AppError.badRequest(
            `This course cohort has reached maximum capacity (${maxCapacity} students).`
          );
        }
        capacityRollbackFn = async () => {
          await Course.findOneAndUpdate(
            { _id: course._id, 'schedules._id': targetSchedule._id },
            { $inc: { 'schedules.$.enrolled': -1, 'capacity.enrolled': -1 } }
          );
        };
      } else {
        const updatedCourse = await Course.findOneAndUpdate(
          {
            _id: course._id,
            $or: [
              { 'capacity.enrolled': { $exists: false } },
              { 'capacity.enrolled': { $lt: maxCapacity } },
            ],
          },
          {
            $inc: { 'capacity.enrolled': 1 },
          },
          { new: true }
        );
        if (!updatedCourse) {
          throw AppError.badRequest(
            `This course cohort has reached maximum capacity (${maxCapacity} students).`
          );
        }
        capacityRollbackFn = async () => {
          await Course.findByIdAndUpdate(course._id, { $inc: { 'capacity.enrolled': -1 } });
        };
      }

      programTitle = course.title;
      programSlug = course.slug;
      totalAmount = course.price?.amount || 0;
      currency = course.price?.currency || 'INR';
      displayAmount = course.price?.displayPrice || (totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : 'Free');

      scheduleData.scheduleId = targetScheduleId || targetSchedule?._id?.toString();
      scheduleData.duration = scheduleData.duration || targetSchedule?.duration || course.duration;
      scheduleData.mode = scheduleData.mode || targetSchedule?.mode || course.mode;
      scheduleData.batch = scheduleData.batch || targetSchedule?.batch || course.schedule || 'Morning Gurukula Batch';
      scheduleData.time =
        scheduleData.time ||
        targetSchedule?.time ||
        (targetSchedule?.startTime ? `${targetSchedule.startTime} – ${targetSchedule.endTime}` : course.schedule || '6:00 AM – 8:30 AM');
      scheduleData.venue = scheduleData.venue || targetSchedule?.venue || targetSchedule?.location || 'Kalptaru Tapovan Shala';
      scheduleData.location = scheduleData.location || scheduleData.venue;
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
          `The registration deadline for "${workshop.title}" has passed (${new Date(
            workshop.registrationDeadline
          ).toLocaleDateString()}).`
        );
      }

      // Check if selected schedule exists on this workshop
      let targetSchedule: any = null;
      if (targetScheduleId && workshop.schedules && workshop.schedules.length > 0) {
        targetSchedule = (workshop.schedules as any).find(
          (s: any) => s._id?.toString() === targetScheduleId || s.id === targetScheduleId
        );
        if (!targetSchedule) {
          throw AppError.badRequest('The requested schedule does not belong to this workshop.');
        }
        if (targetSchedule.status && targetSchedule.status !== 'active') {
          throw AppError.badRequest(`This workshop schedule is currently ${targetSchedule.status}.`);
        }
      }

      // Duplicate Booking Check (Visitor cannot have duplicate active requests for same workshop/schedule)
      const duplicateQuery: any = {
        'program.programId': workshop._id,
        bookingStatus: { $in: ['new', 'contacted', 'confirmed', 'pending'] },
        $or: [
          { 'attendeeDetails.email': email },
          { 'attendeeDetails.phone': phone },
        ],
      };
      if (targetScheduleId) {
        duplicateQuery['schedule.scheduleId'] = targetScheduleId;
      }
      const existing = await Booking.findOne(duplicateQuery);
      if (existing) {
        throw AppError.conflict(
          `An active booking request (${existing.bookingReference}) already exists for this email or phone for "${workshop.title}". Kalptaru will contact you shortly.`
        );
      }

      // Authoritative Capacity Verification
      const maxCapacity = targetSchedule?.capacity || workshop.capacity?.total || 25;
      const countFilter: any = {
        'program.programId': workshop._id,
        bookingStatus: { $in: ['confirmed', 'pending'] },
      };
      if (targetScheduleId) {
        countFilter['schedule.scheduleId'] = targetScheduleId;
      }
      const activeBookingsCount = await Booking.countDocuments(countFilter);

      if (activeBookingsCount >= maxCapacity) {
        throw AppError.badRequest(
          `This workshop has reached maximum capacity (${maxCapacity} attendees). No additional seats are available.`
        );
      }

      // Concurrency-safe atomic seat allocation
      if (targetSchedule) {
        const updatedWorkshop = await Workshop.findOneAndUpdate(
          {
            _id: workshop._id,
            'schedules._id': targetSchedule._id,
            $or: [
              { 'schedules.enrolled': { $exists: false } },
              { 'schedules.enrolled': { $lt: maxCapacity } },
            ],
          },
          {
            $inc: { 'schedules.$.enrolled': 1, 'capacity.booked': 1 },
          },
          { new: true }
        );
        if (!updatedWorkshop) {
          throw AppError.badRequest(
            `This workshop schedule has reached maximum capacity (${maxCapacity} attendees).`
          );
        }
        capacityRollbackFn = async () => {
          await Workshop.findOneAndUpdate(
            { _id: workshop._id, 'schedules._id': targetSchedule._id },
            { $inc: { 'schedules.$.enrolled': -1, 'capacity.booked': -1 } }
          );
        };
      } else {
        const updatedWorkshop = await Workshop.findOneAndUpdate(
          {
            _id: workshop._id,
            $or: [
              { 'capacity.booked': { $exists: false } },
              { 'capacity.booked': { $lt: maxCapacity } },
            ],
          },
          {
            $inc: { 'capacity.booked': 1 },
          },
          { new: true }
        );
        if (!updatedWorkshop) {
          throw AppError.badRequest(
            `This workshop has reached maximum capacity (${maxCapacity} attendees).`
          );
        }
        capacityRollbackFn = async () => {
          await Workshop.findByIdAndUpdate(workshop._id, { $inc: { 'capacity.booked': -1 } });
        };
      }

      programTitle = workshop.title;
      programSlug = workshop.slug;
      totalAmount = workshop.price?.amount || 0;
      currency = workshop.price?.currency || 'INR';
      displayAmount = workshop.price?.displayPrice || (totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : 'Free');

      scheduleData.scheduleId = targetScheduleId || targetSchedule?._id?.toString();
      scheduleData.date = scheduleData.date || targetSchedule?.date || workshop.date;
      scheduleData.startTime = scheduleData.startTime || targetSchedule?.startTime || workshop.startTime;
      scheduleData.endTime = scheduleData.endTime || targetSchedule?.endTime || workshop.endTime;
      scheduleData.time =
        scheduleData.time ||
        targetSchedule?.time ||
        (workshop.startTime ? `${workshop.startTime} – ${workshop.endTime}` : '09:00 AM – 05:00 PM');
      scheduleData.duration = scheduleData.duration || targetSchedule?.duration || workshop.duration;
      scheduleData.mode = scheduleData.mode || targetSchedule?.mode || workshop.mode;
      scheduleData.venue = scheduleData.venue || targetSchedule?.venue || targetSchedule?.location || workshop.location?.venue || 'Tapovan Shala';
      scheduleData.location = scheduleData.location || scheduleData.venue;
    }

    const attendeeDetails = {
      fullName,
      email,
      phone,
      gender: dto.attendeeDetails?.gender || '',
      age: dto.attendeeDetails?.age || undefined,
      city: dto.attendeeDetails?.city || '',
      message: (dto.attendeeDetails as any)?.message || dto.notes || '',
    };

    try {
      const booking = await Booking.create({
        bookingReference: bookingRef,
        student: studentUser ? studentUser._id : undefined,
        program: {
          programType: dto.programType,
          programId: new Types.ObjectId(dto.programId),
          programRef: dto.programType === 'course' ? 'Course' : 'Workshop',
          title: programTitle,
          slug: programSlug,
        },
        schedule: scheduleData,
        attendeeDetails,
        bookingStatus: 'new',
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

      // Dispatch confirmation & admin notification emails asynchronously
      const schedSummary = [
        scheduleData.batch,
        scheduleData.date ? new Date(scheduleData.date).toLocaleDateString('en-IN') : null,
        scheduleData.time,
        scheduleData.venue,
      ].filter(Boolean).join(' • ') || 'Scheduled Session';

      EmailService.handleNewBookingRequest({
        bookingReference: bookingRef,
        visitorName: fullName,
        visitorEmail: email,
        visitorPhone: phone,
        programTitle,
        scheduleDetails: schedSummary,
        message: attendeeDetails.message,
      }).catch(() => {});

      return (await Booking.findById(booking._id).populate('student', 'name email phone avatar'))!;
    } catch (createErr) {
      if (capacityRollbackFn) {
        await capacityRollbackFn().catch(() => {});
      }
      throw createErr;
    }
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

    if (query.programId && query.programId !== 'all') {
      filter['program.programId'] = query.programId;
    } else if (query.program && query.program !== 'all') {
      filter.$or = [
        ...(filter.$or || []),
        { 'program.programId': query.program },
        { 'program.title': new RegExp(query.program.trim(), 'i') },
      ];
    }

    if (query.date) {
      const start = new Date(query.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(query.date);
      end.setHours(23, 59, 59, 999);
      filter.bookingDate = { $gte: start, $lte: end };
    } else if (query.startDate || query.endDate) {
      const dateFilter: Record<string, any> = {};
      if (query.startDate) dateFilter.$gte = new Date(query.startDate);
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      filter.bookingDate = dateFilter;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        ...(filter.$or || []),
        { bookingReference: searchRegex },
        { 'program.title': searchRegex },
        { 'schedule.venue': searchRegex },
        { 'attendeeDetails.fullName': searchRegex },
        { 'attendeeDetails.email': searchRegex },
        { 'attendeeDetails.phone': searchRegex },
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
   * Get single booking by ID with authorization checks (prevents IDOR)
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
   * Admin status update with automatic capacity adjustment and transition validation
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

    // Validate Status Transitions
    if (payload.bookingStatus && payload.bookingStatus !== oldStatus) {
      const allowed = ALLOWED_STATUS_TRANSITIONS[oldStatus] || [];
      if (!allowed.includes(payload.bookingStatus)) {
        throw AppError.badRequest(
          `Invalid booking status transition from "${oldStatus}" to "${payload.bookingStatus}". Allowed transitions: ${allowed.join(', ')}`
        );
      }
    }

    // Handle seat release when cancelling or refunding
    if (
      ['confirmed', 'pending'].includes(oldStatus) &&
      ['cancelled', 'refunded'].includes(newStatus)
    ) {
      const scheduleId = booking.schedule?.scheduleId;
      if (booking.program.programType === 'course') {
        if (scheduleId && Types.ObjectId.isValid(scheduleId)) {
          await Course.findOneAndUpdate(
            { _id: booking.program.programId, 'schedules._id': scheduleId },
            { $inc: { 'schedules.$.enrolled': -1, 'capacity.enrolled': -1 } }
          );
        } else {
          await Course.findByIdAndUpdate(booking.program.programId, {
            $inc: { 'capacity.enrolled': -1 },
          });
        }
      } else if (booking.program.programType === 'workshop') {
        if (scheduleId && Types.ObjectId.isValid(scheduleId)) {
          await Workshop.findOneAndUpdate(
            { _id: booking.program.programId, 'schedules._id': scheduleId },
            { $inc: { 'schedules.$.enrolled': -1, 'capacity.booked': -1 } }
          );
        } else {
          await Workshop.findByIdAndUpdate(booking.program.programId, {
            $inc: { 'capacity.booked': -1 },
          });
        }
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
      const scheduleId = booking.schedule?.scheduleId;
      if (booking.program.programType === 'course') {
        const course = await Course.findById(booking.program.programId);
        const maxCap = course?.capacity?.total || 30;
        const countFilter: any = {
          'program.programId': booking.program.programId,
          bookingStatus: { $in: ['confirmed', 'pending'] },
        };
        if (scheduleId) countFilter['schedule.scheduleId'] = scheduleId;
        const count = await Booking.countDocuments(countFilter);
        if (count >= maxCap) {
          throw AppError.badRequest('Cannot re-confirm booking: course cohort is now at full capacity.');
        }

        if (scheduleId && Types.ObjectId.isValid(scheduleId)) {
          await Course.findOneAndUpdate(
            { _id: booking.program.programId, 'schedules._id': scheduleId },
            { $inc: { 'schedules.$.enrolled': 1, 'capacity.enrolled': 1 } }
          );
        } else {
          await Course.findByIdAndUpdate(booking.program.programId, {
            $inc: { 'capacity.enrolled': 1 },
          });
        }
      } else if (booking.program.programType === 'workshop') {
        const workshop = await Workshop.findById(booking.program.programId);
        const maxCap = workshop?.capacity?.total || 25;
        const countFilter: any = {
          'program.programId': booking.program.programId,
          bookingStatus: { $in: ['confirmed', 'pending'] },
        };
        if (scheduleId) countFilter['schedule.scheduleId'] = scheduleId;
        const count = await Booking.countDocuments(countFilter);
        if (count >= maxCap) {
          throw AppError.badRequest('Cannot re-confirm booking: workshop is now at full capacity.');
        }

        if (scheduleId && Types.ObjectId.isValid(scheduleId)) {
          await Workshop.findOneAndUpdate(
            { _id: booking.program.programId, 'schedules._id': scheduleId },
            { $inc: { 'schedules.$.enrolled': 1, 'capacity.booked': 1 } }
          );
        } else {
          await Workshop.findByIdAndUpdate(booking.program.programId, {
            $inc: { 'capacity.booked': 1 },
          });
        }
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

    const isOwner = booking.student
      ? booking.student.toString() === requestingUser._id.toString()
      : false;
    const isAdmin = ['admin', 'super_admin'].includes(requestingUser.role);

    if (!isOwner && !isAdmin) {
      throw AppError.forbidden('You do not have permission to cancel this booking.');
    }

    if (booking.bookingStatus === 'cancelled') {
      throw AppError.badRequest('This booking is already cancelled.');
    }

    // Release capacity if it was actively confirmed/pending
    if (['confirmed', 'pending'].includes(booking.bookingStatus)) {
      const scheduleId = booking.schedule?.scheduleId;
      if (booking.program.programType === 'course') {
        if (scheduleId && Types.ObjectId.isValid(scheduleId)) {
          await Course.findOneAndUpdate(
            { _id: booking.program.programId, 'schedules._id': scheduleId },
            { $inc: { 'schedules.$.enrolled': -1, 'capacity.enrolled': -1 } }
          );
        } else {
          await Course.findByIdAndUpdate(booking.program.programId, {
            $inc: { 'capacity.enrolled': -1 },
          });
        }
      } else if (booking.program.programType === 'workshop') {
        if (scheduleId && Types.ObjectId.isValid(scheduleId)) {
          await Workshop.findOneAndUpdate(
            { _id: booking.program.programId, 'schedules._id': scheduleId },
            { $inc: { 'schedules.$.enrolled': -1, 'capacity.booked': -1 } }
          );
        } else {
          await Workshop.findByIdAndUpdate(booking.program.programId, {
            $inc: { 'capacity.booked': -1 },
          });
        }
      }
    }

    booking.bookingStatus = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'Cancelled by student request';

    await booking.save();
    return (await Booking.findById(id).populate('student', 'name email phone avatar'))!;
  }

  /**
   * Authoritative server-side schedule retrieval with real-time seat availability
   */
  static async getProgramSchedules(
    programType: 'course' | 'workshop',
    idOrSlug: string
  ): Promise<{
    program: {
      id: string;
      title: string;
      slug: string;
      price: any;
      mode: string;
      duration?: string;
    };
    schedules: Array<{
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
    }>;
  }> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug) && idOrSlug.length === 24;

    if (programType === 'course') {
      const course = isObjectId
        ? await Course.findById(idOrSlug)
        : await Course.findOne({ slug: idOrSlug });

      if (!course) {
        throw AppError.notFound(`Course not found: ${idOrSlug}`);
      }

      const schedulesList = [];

      if (course.schedules && course.schedules.length > 0) {
        for (const s of course.schedules) {
          const sId = (s as any)._id?.toString() || (s as any).id;
          const activeCount = await Booking.countDocuments({
            'program.programId': course._id,
            'schedule.scheduleId': sId,
            bookingStatus: { $in: ['confirmed', 'pending'] },
          });
          const cap = s.capacity || course.capacity?.total || 30;
          const avail = Math.max(0, cap - activeCount);
          schedulesList.push({
            id: sId,
            batch: s.batch || course.schedule || 'Regular Gurukula Batch',
            date: s.date ? s.date.toISOString() : undefined,
            endDate: s.endDate ? s.endDate.toISOString() : undefined,
            startTime: s.startTime,
            endTime: s.endTime,
            time: s.time || (s.startTime ? `${s.startTime} – ${s.endTime}` : course.schedule || '6:00 AM – 8:30 AM'),
            duration: s.duration || course.duration,
            mode: s.mode || course.mode || 'in-person',
            venue: s.venue || s.location || 'Kalptaru Tapovan Shala',
            location: s.location || s.venue || 'Kalptaru Tapovan Shala',
            totalCapacity: cap,
            enrolled: activeCount,
            availableSeats: avail,
            status: s.status || (avail <= 0 ? 'full' : 'active'),
            isFull: avail <= 0,
          });
        }
      } else {
        // Synthesize authoritative default schedules
        const defaultBatches = [
          {
            id: `course-${course._id}-morning`,
            batch: 'Morning Gurukula Batch',
            time: '06:00 AM – 08:30 AM',
            startTime: '06:00 AM',
            endTime: '08:30 AM',
            mode: course.mode || 'in-person',
            venue: 'Kalptaru Tapovan Shala',
          },
          {
            id: `course-${course._id}-evening`,
            batch: 'Evening Sadhana Batch',
            time: '05:30 PM – 08:00 PM',
            startTime: '05:30 PM',
            endTime: '08:00 PM',
            mode: course.mode || 'hybrid',
            venue: 'Sacred Grove Pavilion',
          },
        ];

        for (const b of defaultBatches) {
          const activeCount = await Booking.countDocuments({
            'program.programId': course._id,
            $or: [
              { 'schedule.scheduleId': b.id },
              { 'schedule.batch': b.batch },
            ],
            bookingStatus: { $in: ['confirmed', 'pending'] },
          });
          const cap = course.capacity?.total || 30;
          const avail = Math.max(0, cap - activeCount);
          schedulesList.push({
            id: b.id,
            batch: b.batch,
            time: b.time,
            startTime: b.startTime,
            endTime: b.endTime,
            duration: course.duration,
            mode: b.mode,
            venue: b.venue,
            location: b.venue,
            totalCapacity: cap,
            enrolled: activeCount,
            availableSeats: avail,
            status: avail <= 0 ? 'full' : 'active',
            isFull: avail <= 0,
          });
        }
      }

      return {
        program: {
          id: course._id.toString(),
          title: course.title,
          slug: course.slug,
          price: course.price,
          mode: course.mode,
          duration: course.duration,
        },
        schedules: schedulesList,
      };
    } else {
      const workshop = isObjectId
        ? await Workshop.findById(idOrSlug)
        : await Workshop.findOne({ slug: idOrSlug });

      if (!workshop) {
        throw AppError.notFound(`Workshop not found: ${idOrSlug}`);
      }

      const schedulesList = [];

      if (workshop.schedules && workshop.schedules.length > 0) {
        for (const s of workshop.schedules) {
          const sId = (s as any)._id?.toString() || (s as any).id;
          const activeCount = await Booking.countDocuments({
            'program.programId': workshop._id,
            'schedule.scheduleId': sId,
            bookingStatus: { $in: ['confirmed', 'pending'] },
          });
          const cap = s.capacity || workshop.capacity?.total || 25;
          const avail = Math.max(0, cap - activeCount);
          schedulesList.push({
            id: sId,
            batch: s.batch || 'Weekend Immersion Session',
            date: s.date ? s.date.toISOString() : (workshop.date ? new Date(workshop.date).toISOString() : undefined),
            endDate: s.endDate ? s.endDate.toISOString() : undefined,
            startTime: s.startTime || workshop.startTime,
            endTime: s.endTime || workshop.endTime,
            time: s.time || `${s.startTime || workshop.startTime} – ${s.endTime || workshop.endTime}`,
            duration: s.duration || workshop.duration,
            mode: s.mode || workshop.mode || 'in-person',
            venue: s.venue || s.location || workshop.location?.venue || 'Tapovan Shala',
            location: s.location || s.venue || workshop.location?.venue || 'Tapovan Shala',
            totalCapacity: cap,
            enrolled: activeCount,
            availableSeats: avail,
            status: s.status || (avail <= 0 ? 'full' : 'active'),
            isFull: avail <= 0,
          });
        }
      } else {
        const sId = `workshop-${workshop._id}-standard`;
        const activeCount = await Booking.countDocuments({
          'program.programId': workshop._id,
          bookingStatus: { $in: ['confirmed', 'pending'] },
        });
        const cap = workshop.capacity?.total || 25;
        const avail = Math.max(0, cap - activeCount);
        schedulesList.push({
          id: sId,
          batch: 'Weekend Intensive Immersion',
          date: workshop.date ? new Date(workshop.date).toISOString() : undefined,
          endDate: workshop.endDate ? new Date(workshop.endDate).toISOString() : undefined,
          startTime: workshop.startTime,
          endTime: workshop.endTime,
          time: `${workshop.startTime} – ${workshop.endTime}`,
          duration: workshop.duration,
          mode: workshop.mode || 'in-person',
          venue: workshop.location?.venue || 'Tapovan Shala',
          location: workshop.location?.venue || 'Tapovan Shala',
          totalCapacity: cap,
          enrolled: activeCount,
          availableSeats: avail,
          status: avail <= 0 ? 'full' : 'active',
          isFull: avail <= 0,
        });
      }

      return {
        program: {
          id: workshop._id.toString(),
          title: workshop.title,
          slug: workshop.slug,
          price: workshop.price,
          mode: workshop.mode,
          duration: workshop.duration,
        },
        schedules: schedulesList,
      };
    }
  }
}
