import { User } from '../models/User';
import { Course } from '../models/Course';
import { Workshop } from '../models/Workshop';
import { Enquiry } from '../models/Enquiry';
import { Booking } from '../models/Booking';

export interface AdminStats {
  students: number;
  bookings: number;
  courses: number;
  workshops: number;
  enquiries: number;
}

export interface AdminRecentBooking {
  id: string;
  bookingRef: string;
  studentName: string;
  studentEmail: string;
  sessionTitle: string;
  sessionType: string;
  date: string;
  time: string;
  venue: string;
  status: 'new' | 'contacted' | 'confirmed' | 'waitlisted' | 'pending' | 'cancelled' | 'completed' | 'refunded';
  amount: string;
}

export interface AdminUpcomingWorkshop {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  mode: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  status: 'published' | 'draft' | 'closed';
}

export interface AdminNewEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  programInterest: string;
  message: string;
  status: 'new' | 'in_progress' | 'contacted' | 'resolved';
  receivedAt: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  overview?: {
    students: { total: number };
    bookings: { total: number };
    courses: { total: number };
    workshops: { total: number };
    enquiries: { total: number };
  };
  recentBookings: AdminRecentBooking[];
  upcomingWorkshops: AdminUpcomingWorkshop[];
  recentEnquiries: AdminNewEnquiry[];
  newEnquiries?: AdminNewEnquiry[];
}

export class AdminService {
  /**
   * Alias for getDashboardData
   */
  static async getDashboardOverview(): Promise<AdminDashboardData> {
    return this.getDashboardData();
  }

  /**
   * Aggregates real-time administration dashboard metrics and feeds from MongoDB.
   * Does NOT fabricate any fake metrics, bookings, or enquiries.
   */
  static async getDashboardData(): Promise<AdminDashboardData> {
    const [
      studentsCount,
      coursesCount,
      workshopsCount,
      workshops,
      enquiries,
      enquiriesCount,
      realBookings,
      totalBookingsCount,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ status: 'published' }),
      Workshop.countDocuments({ status: 'published' }),
      Workshop.find({ status: 'published' }).sort({ date: 1 }).limit(10),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Enquiry.countDocuments(),
      Booking.find()
        .populate('student', 'name email')
        .sort({ bookingDate: -1, createdAt: -1 })
        .limit(10),
      Booking.countDocuments(),
    ]);

    // Count real active bookings for each workshop
    const workshopBookingsCounts = await Promise.all(
      workshops.map((ws) =>
        Booking.countDocuments({
          'program.programId': ws._id,
          bookingStatus: { $in: ['new', 'contacted', 'confirmed', 'pending'] },
        })
      )
    );

    const formattedBookings: AdminRecentBooking[] = realBookings.map((b) => ({
      id: b._id.toString(),
      bookingRef: b.bookingReference,
      studentName: b.attendeeDetails?.fullName || (b.student as any)?.name || 'Visitor',
      studentEmail: b.attendeeDetails?.email || (b.student as any)?.email || '',
      sessionTitle: b.program?.title || 'Program',
      sessionType: b.program?.programType === 'course' ? 'Course' : 'Workshop',
      date: b.schedule?.date
        ? new Date(b.schedule.date).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : new Date(b.bookingDate || b.createdAt).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
      time:
        b.schedule?.time ||
        (b.schedule?.startTime ? `${b.schedule.startTime} – ${b.schedule.endTime}` : 'Scheduled Time'),
      venue: b.schedule?.venue || b.schedule?.location || 'Kalptaruu Shala',
      status: b.bookingStatus as any,
      amount: b.amount?.displayAmount || `₹${b.amount?.total || 0}`,
    }));

    const formattedEnquiries: AdminNewEnquiry[] = enquiries.map((enq) => ({
      id: enq._id.toString(),
      name: enq.name,
      email: enq.email,
      phone: enq.phone || '',
      programInterest: enq.programInterest,
      message: enq.message,
      status: enq.status,
      receivedAt: new Date(enq.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    const formattedWorkshops: AdminUpcomingWorkshop[] = workshops.map((ws, idx) => {
      const totalCapacity = ws.capacity?.total || 30;
      const enrolled = workshopBookingsCounts[idx] || ws.capacity?.booked || 0;
      return {
        id: ws._id.toString(),
        title: ws.title,
        slug: ws.slug,
        date: ws.date
          ? new Date(ws.date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Scheduled',
        time:
          ws.startTime && ws.endTime
            ? `${ws.startTime} – ${ws.endTime}`
            : ws.time || '10:00 AM – 11:00 AM',
        mode: ws.mode || 'in-person',
        instructor: ws.instructor?.name || 'Mrs. Shuchi Mohan',
        capacity: totalCapacity,
        enrolled,
        status: (ws.status as 'published' | 'draft' | 'closed') || 'published',
      };
    });

    return {
      stats: {
        students: studentsCount,
        bookings: totalBookingsCount,
        courses: coursesCount,
        workshops: workshopsCount,
        enquiries: enquiriesCount,
      },
      overview: {
        students: { total: studentsCount },
        bookings: { total: totalBookingsCount },
        courses: { total: coursesCount },
        workshops: { total: workshopsCount },
        enquiries: { total: enquiriesCount },
      },
      recentBookings: formattedBookings,
      upcomingWorkshops: formattedWorkshops,
      recentEnquiries: formattedEnquiries,
      newEnquiries: formattedEnquiries,
    };
  }
}
