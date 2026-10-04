export interface StudentWelcome {
  greeting: string;
  studentName: string;
  sanskritQuote: string;
  streakDays: number;
  hoursPracticed: number;
}

export interface StudentMembership {
  planName: string;
  billingCycle: string;
  status: 'active' | 'expiring_soon' | 'inactive';
  validUntil: string;
  batch: string;
  perks: string[];
}

export interface StudentBooking {
  id: string;
  title: string;
  type: 'Shala Batch' | 'Workshop' | 'Acharya Consultation' | 'Asana Lab';
  date: string;
  time: string;
  venue: string;
  status: 'confirmed' | 'waitlisted' | 'completed';
  instructor: string;
}

export interface StudentPurchase {
  id: string;
  invoiceNo: string;
  itemTitle: string;
  itemType: 'Course' | 'Workshop' | 'Membership';
  date: string;
  amount: string;
  rawAmount: number;
  status: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
}

export interface StudentWorkshop {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  mode: string;
  instructor: string;
  attendanceStatus: 'registered' | 'waitlist' | 'attended';
}

export interface StudentCourseEnrollment {
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
}

export interface StudentDashboardData {
  welcome: StudentWelcome;
  currentMembership: StudentMembership | null;
  upcomingBookings: StudentBooking[];
  recentPurchases: StudentPurchase[];
  upcomingWorkshops: StudentWorkshop[];
  courseEnrollments: StudentCourseEnrollment[];
}
