export interface AdminOverviewCards {
  students: {
    total: number;
    active: number;
    growth: string;
    sublabel: string;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    growth: string;
    sublabel: string;
  };
  courses: {
    total: number;
    published: number;
    activeBatches: number;
    sublabel: string;
  };
  workshops: {
    total: number;
    upcoming: number;
    averageOccupancy: string;
    sublabel: string;
  };
  memberships: {
    totalPlans: number;
    activeMembers: number;
    monthlyRecurring: string;
    sublabel: string;
  };
  revenue: {
    totalFormatted: string;
    rawTotal: number;
    growth: string;
    sublabel: string;
  };
}

export interface AdminRecentActivity {
  id: string;
  actor: string;
  action: string;
  entityType: 'student' | 'booking' | 'course' | 'workshop' | 'enquiry' | 'payment';
  details: string;
  timestamp: string;
  statusBadge?: {
    label: string;
    variant: 'success' | 'warning' | 'gold' | 'plum' | 'neutral';
  };
}

export interface AdminRecentBooking {
  id: string;
  bookingRef: string;
  studentName: string;
  studentEmail: string;
  sessionTitle: string;
  sessionType: 'Shala Batch' | 'Workshop' | 'Acharya Consultation' | 'Asana Lab';
  date: string;
  time: string;
  venue: string;
  status: 'confirmed' | 'waitlisted' | 'pending';
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
  occupancyPercentage: number;
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
  overview: AdminOverviewCards;
  recentActivity: AdminRecentActivity[];
  recentBookings: AdminRecentBooking[];
  upcomingWorkshops: AdminUpcomingWorkshop[];
  newEnquiries: AdminNewEnquiry[];
}
