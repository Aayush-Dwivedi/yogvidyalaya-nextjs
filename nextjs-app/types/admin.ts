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
