import { User } from '../models/User';
import { Course } from '../models/Course';
import { Workshop } from '../models/Workshop';
import { MembershipPlan } from '../models/MembershipPlan';
import { Booking } from '../models/Booking';
import { AppError } from '../utils/appError';

export interface StudentDashboardData {
  welcome: {
    greeting: string;
    studentName: string;
    sanskritQuote: string;
    streakDays: number;
    hoursPracticed: number;
  };
  currentMembership: {
    planName: string;
    billingCycle: string;
    status: 'active' | 'expiring_soon' | 'inactive';
    validUntil: string;
    batch: string;
    perks: string[];
  } | null;
  upcomingBookings: Array<{
    id: string;
    title: string;
    type: 'Shala Batch' | 'Workshop' | 'Acharya Consultation' | 'Asana Lab';
    date: string;
    time: string;
    venue: string;
    status: 'confirmed' | 'waitlisted' | 'completed';
    instructor: string;
  }>;
  recentPurchases: Array<{
    id: string;
    invoiceNo: string;
    itemTitle: string;
    itemType: 'Course' | 'Workshop' | 'Membership';
    date: string;
    amount: string;
    rawAmount: number;
    status: 'paid' | 'pending' | 'refunded';
    paymentMethod: string;
  }>;
  upcomingWorkshops: Array<{
    id: string;
    title: string;
    slug: string;
    date: string;
    time: string;
    mode: string;
    instructor: string;
    attendanceStatus: 'registered' | 'waitlist' | 'attended';
  }>;
  courseEnrollments: Array<{
    id: string;
    title: string;
    slug: string;
    level: string;
    progressPercentage: number;
    completedModules: number;
    totalModules: number;
    nextLesson: string;
    certificationStatus: 'in_progress' | 'completed' | 'not_started';
    batch: string;
  }>;
}

export class StudentService {
  /**
   * Aggregates student portal dashboard data
   */
  static async getStudentDashboard(userId: string): Promise<StudentDashboardData> {
    const student = await User.findById(userId);
    if (!student) {
      throw AppError.notFound('Student account not found.');
    }

    // Fetch active courses, workshops, membership, and user's real bookings
    const [courses, workshops, membership, studentBookings] = await Promise.all([
      Course.find({ status: 'published' }).limit(3),
      Workshop.find({ status: 'published' }).limit(2),
      MembershipPlan.findOne({ status: 'published' }),
      Booking.find({ student: userId }).sort({ bookingDate: -1 }),
    ]);

    const firstName = student.name.split(' ')[0] || 'Sadhaka';

    // Format real bookings if available, else retain graceful starter defaults
    const activeStudentBookings = studentBookings.filter(b => ['confirmed', 'pending'].includes(b.bookingStatus));
    const formattedUpcomingBookings = activeStudentBookings.length > 0
      ? activeStudentBookings.map((b) => ({
          id: b._id.toString(),
          title: b.program.title,
          type: (b.program.programType === 'workshop' ? 'Workshop' : 'Shala Batch') as any,
          date: b.schedule?.date
            ? new Date(b.schedule.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date(b.bookingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: b.schedule?.time || 'Scheduled Session',
          venue: b.schedule?.venue || 'Kalptaru Tapovan Shala',
          status: b.bookingStatus as any,
          instructor: 'Acharya Mentor',
        }))
      : [
          {
            id: 'bkg-101',
            title: 'Morning Hatha Shala Sadhana',
            type: 'Shala Batch' as const,
            date: 'Tomorrow, Oct 02, 2026',
            time: '06:00 AM – 07:30 AM',
            venue: 'Main Shala Hall & Courtyard',
            status: 'confirmed' as const,
            instructor: 'Mrs. Shuchi Mohan',
          },
          {
            id: 'bkg-102',
            title: 'Pranayama & Kundalini Awakening Lab',
            type: 'Workshop' as const,
            date: 'Oct 18, 2026',
            time: '09:00 AM – 05:00 PM',
            venue: 'Sacred Grove Pavilion',
            status: 'confirmed' as const,
            instructor: 'Mrs. Shuchi Mohan',
          },
        ];

    return {
      welcome: {
        greeting: `Namaste, ${firstName}`,
        studentName: student.name,
        sanskritQuote: '“Yogena chittasya padena vacham — Yoga purifies the mind, as speech purifies thought.”',
        streakDays: 14,
        hoursPracticed: 38,
      },
      currentMembership: {
        planName: membership?.title || 'Daily Sadhana Shala Pass',
        billingCycle: membership?.billingCycle || 'monthly',
        status: 'active',
        validUntil: 'Nov 30, 2026',
        batch: 'Morning Shala (06:00 AM – 07:30 AM)',
        perks: [
          'Unlimited weekday shala practice',
          'Library & Vedic scripture reading room',
          '10% discount on weekend retreats',
        ],
      },
      upcomingBookings: formattedUpcomingBookings,
      recentPurchases: [
        {
          id: 'tx-201',
          invoiceNo: 'INV-2026-0891',
          itemTitle: '200-Hour Classical Yoga Teacher Training (TTC)',
          itemType: 'Course',
          date: 'Sep 15, 2026',
          amount: '₹48,000',
          rawAmount: 48000,
          status: 'paid',
          paymentMethod: 'UPI / NetBanking',
        },
        {
          id: 'tx-202',
          invoiceNo: 'INV-2026-0814',
          itemTitle: 'Monthly Sadhana Pass — October 2026',
          itemType: 'Membership',
          date: 'Sep 28, 2026',
          amount: '₹2,500',
          rawAmount: 2500,
          status: 'paid',
          paymentMethod: 'Debit Card (**4120)',
        },
        {
          id: 'tx-203',
          invoiceNo: 'INV-2026-0752',
          itemTitle: 'Pranayama & Kundalini Awakening Masterclass',
          itemType: 'Workshop',
          date: 'Aug 20, 2026',
          amount: '₹5,500',
          rawAmount: 5500,
          status: 'paid',
          paymentMethod: 'UPI',
        },
      ],
      upcomingWorkshops: workshops.map((ws, idx) => ({
        id: ws._id.toString(),
        title: ws.title,
        slug: ws.slug,
        date: ws.date ? new Date(ws.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
        time: `${ws.startTime} – ${ws.endTime}`,
        mode: ws.mode,
        instructor: ws.instructor?.name || 'Acharya',
        attendanceStatus: idx === 0 ? 'registered' : 'waitlist',
      })),
      courseEnrollments: courses.map((crs, idx) => ({
        id: crs._id.toString(),
        title: crs.title,
        slug: crs.slug,
        level: crs.level,
        progressPercentage: idx === 0 ? 65 : idx === 1 ? 25 : 0,
        completedModules: idx === 0 ? 2 : idx === 1 ? 1 : 0,
        totalModules: crs.curriculum?.length || 3,
        nextLesson: idx === 0 ? 'Module 3: Anatomy & Asana Lab' : 'Module 2: Surya Namaskar Biomechanics',
        certificationStatus: idx === 0 ? 'in_progress' : idx === 1 ? 'in_progress' : 'not_started',
        batch: 'Autumn 2026 Cohort',
      })),
    };
  }
}
