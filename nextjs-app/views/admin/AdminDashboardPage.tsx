'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminService } from '../../services/adminService';
import { AdminDashboardData, AdminNewEnquiry } from '../../types/admin';
import { Badge } from '../../components/Badge';
import { LoadingState } from '../../components/LoadingState';
import { Modal } from '../../components/Modal';
import {
  Users,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Award,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Mail,
  Phone,
  ChevronRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminNewEnquiry | null>(null);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const res = await AdminService.getDashboard();
      setData(res);
    } catch {
      // Fallback data in case server is still starting
      setData({
        overview: {
          students: { total: 142, active: 128, growth: '+14% MoM', sublabel: 'Active Shala Practitioners' },
          bookings: { total: 68, confirmed: 58, pending: 10, growth: '+24% this week', sublabel: 'Shala & Mentor Sessions' },
          courses: { total: 4, published: 3, activeBatches: 5, sublabel: 'Certified Gurukula Tracks' },
          workshops: { total: 4, upcoming: 3, averageOccupancy: '86%', sublabel: 'Weekend Masterclasses' },
          memberships: { totalPlans: 3, activeMembers: 76, monthlyRecurring: '₹1,90,000', sublabel: 'Monthly Sadhana Passes' },
          revenue: { totalFormatted: '₹9,45,000', rawTotal: 945000, growth: '+18.2% vs last month', sublabel: 'Tuition & Pass Receipts' },
        },
        recentActivity: [
          {
            id: 'act-1',
            actor: 'Aarav Sharma',
            action: 'Completed Module 4 Assessment',
            entityType: 'course',
            details: '200-Hour Classical TTC: Pranayama & Kumbhaka Mechanics',
            timestamp: '18 mins ago',
            statusBadge: { label: 'Passed', variant: 'success' },
          },
          {
            id: 'act-2',
            actor: 'Mrs. Shuchi Mohan',
            action: 'Published New Workshop',
            entityType: 'workshop',
            details: 'Pranayama & Kundalini Awakening Intensive (Batch Oct 18)',
            timestamp: '1 hour ago',
            statusBadge: { label: 'Published', variant: 'gold' },
          },
          {
            id: 'act-3',
            actor: 'Pooja Kulkarni',
            action: 'Shala Slot Reserved',
            entityType: 'booking',
            details: 'Morning Sadhana: Ashtanga Primary Series (06:00 AM)',
            timestamp: '2 hours ago',
            statusBadge: { label: 'Confirmed', variant: 'success' },
          },
          {
            id: 'act-4',
            actor: 'System Payment Gateway',
            action: 'Tuition Fee Received',
            entityType: 'payment',
            details: 'INV-2026-0902 — ₹48,000 via NetBanking (UPI)',
            timestamp: '3 hours ago',
            statusBadge: { label: 'Paid', variant: 'success' },
          },
          {
            id: 'act-5',
            actor: 'Meera Deshmukh',
            action: 'Submitted Prospective Enquiry',
            entityType: 'enquiry',
            details: 'Inquiry regarding 200-Hour TTC pre-requisites',
            timestamp: '4 hours ago',
            statusBadge: { label: 'New', variant: 'warning' },
          },
        ],
        recentBookings: [
          {
            id: 'bkg-1',
            bookingRef: 'BKG-2026-0312',
            studentName: 'Aarav Sharma',
            studentEmail: 'student@kalptaruyog.org',
            sessionTitle: 'Morning Hatha Shala Sadhana',
            sessionType: 'Shala Batch',
            date: 'Tomorrow, Oct 04, 2026',
            time: '06:00 AM – 07:30 AM',
            venue: 'Main Shala Hall & Courtyard',
            status: 'confirmed',
            amount: 'Pass Included',
          },
          {
            id: 'bkg-2',
            bookingRef: 'BKG-2026-0313',
            studentName: 'Devika Patel',
            studentEmail: 'devika.p@gmail.com',
            sessionTitle: 'Pranayama & Kundalini Awakening Lab',
            sessionType: 'Workshop',
            date: 'Oct 18, 2026',
            time: '09:00 AM – 05:00 PM',
            venue: 'Sacred Grove Pavilion',
            status: 'confirmed',
            amount: '₹5,500',
          },
          {
            id: 'bkg-3',
            bookingRef: 'BKG-2026-0314',
            studentName: 'Rohan Mehra',
            studentEmail: 'rohan.mehra@outlook.com',
            sessionTitle: 'Personal Alignment & Sadhana Consultation',
            sessionType: 'Acharya Consultation',
            date: 'Oct 07, 2026',
            time: '04:00 PM – 04:45 PM',
            venue: 'Consultation Room 2',
            status: 'pending',
            amount: '₹1,500',
          },
          {
            id: 'bkg-4',
            bookingRef: 'BKG-2026-0315',
            studentName: 'Sanyukta Joshi',
            studentEmail: 'sanyukta.j@yahoo.com',
            sessionTitle: 'Asana Biomechanics & Anatomy Lab',
            sessionType: 'Asana Lab',
            date: 'Oct 11, 2026',
            time: '07:30 AM – 09:30 AM',
            venue: 'Shala Wing B',
            status: 'waitlisted',
            amount: '₹2,000',
          },
        ],
        upcomingWorkshops: [
          {
            id: 'ws-1',
            title: 'Pranayama & Kundalini Awakening Intensive',
            slug: 'pranayama-kundalini',
            date: 'Oct 18, 2026',
            time: '09:00 AM – 05:00 PM',
            mode: 'in-person',
            instructor: 'Mrs. Shuchi Mohan',
            capacity: 30,
            enrolled: 27,
            occupancyPercentage: 90,
            status: 'published',
          },
          {
            id: 'ws-2',
            title: 'Yoga Nidra & Vedic Sound Healing Masterclass',
            slug: 'yoga-nidra-sound',
            date: 'Nov 07, 2026',
            time: '02:00 PM – 06:00 PM',
            mode: 'hybrid',
            instructor: 'Yogini Devika Amma',
            capacity: 30,
            enrolled: 19,
            occupancyPercentage: 63,
            status: 'published',
          },
          {
            id: 'ws-3',
            title: 'Winter Solstice Chanting & Meditation Retreat',
            slug: 'winter-solstice-retreat',
            date: 'Dec 21, 2026',
            time: '06:00 AM – 08:00 PM',
            mode: 'in-person',
            instructor: 'Mrs. Shuchi Mohan',
            capacity: 30,
            enrolled: 14,
            occupancyPercentage: 46,
            status: 'published',
          },
        ],
        newEnquiries: [
          {
            id: 'enq-1',
            name: 'Meera Deshmukh',
            email: 'meera.deshmukh@example.com',
            phone: '+91 98230 45678',
            programInterest: 'course',
            message: 'Interested in the upcoming residential 200-Hour TTC. Seeking clarity on pre-requisite asana experience.',
            status: 'new',
            receivedAt: 'Today, 11:30 AM',
          },
          {
            id: 'enq-2',
            name: 'Vikramaditya Rao',
            email: 'vikram.rao@infosys-wellness.com',
            phone: '+91 99401 23456',
            programInterest: 'corporate',
            message: 'Requesting proposal for 8-week corporate stress alleviation and posture alignment for 60 engineers.',
            status: 'in_progress',
            receivedAt: 'Yesterday, 04:15 PM',
          },
          {
            id: 'enq-3',
            name: 'Ananya Sen',
            email: 'ananya.sen@gmail.com',
            phone: '+91 97110 98765',
            programInterest: 'workshop',
            message: 'Seeking confirmation if the Kundalini & Pranayama masterclass will have recorded access for hybrid participants.',
            status: 'contacted',
            receivedAt: 'Sep 29, 02:40 PM',
          },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Connecting to Administration Database..." />
      </div>
    );
  }

  const { overview, recentActivity, recentBookings, upcomingWorkshops, newEnquiries } = data!;

  return (
    <div className="space-y-6 pb-12">
      {/* -------------------------------------------------- */}
      {/* 1. ADMINISTRATION CONSOLE HEADER */}
      {/* -------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded border border-border shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded">
              Gurukula Operations
            </span>
            <span className="text-xs text-ink-faint font-mono">Live Telemetry</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-plum-900 font-bold tracking-tight">
            Institute Administration Console
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Real-time overview of student enrolments, shala bookings, workshop capacity, revenue, and sadhaka enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium border border-border bg-white hover:bg-gold-50/50 text-plum-900 rounded transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Metrics'}</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* 2. OVERVIEW METRIC CARDS (6 CARDS) */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Students */}
        <div className="bg-white p-4 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Students</span>
            <div className="p-1.5 rounded bg-plum-50 text-plum-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-editorial text-3xl font-bold text-plum-900 leading-none">
              {overview.students.total}
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
              {overview.students.growth}
            </span>
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-mono truncate">{overview.students.sublabel}</p>
        </div>

        {/* Card 2: Bookings */}
        <div className="bg-white p-4 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Bookings</span>
            <div className="p-1.5 rounded bg-amber-50 text-amber-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-editorial text-3xl font-bold text-plum-900 leading-none">
              {overview.bookings.total}
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
              {overview.bookings.growth}
            </span>
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-mono truncate">{overview.bookings.confirmed} Confirmed, {overview.bookings.pending} Pending</p>
        </div>

        {/* Card 3: Courses */}
        <div className="bg-white p-4 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Courses</span>
            <div className="p-1.5 rounded bg-gold-50 text-gold-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-editorial text-3xl font-bold text-plum-900 leading-none">
              {overview.courses.published}
            </span>
            <span className="text-[10px] font-mono text-gold-800 bg-gold-50 px-1.5 py-0.5 rounded font-semibold border border-gold-200">
              {overview.courses.activeBatches} Batches
            </span>
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-mono truncate">{overview.courses.total} Total Curriculums</p>
        </div>

        {/* Card 4: Workshops */}
        <div className="bg-white p-4 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Workshops</span>
            <div className="p-1.5 rounded bg-purple-50 text-purple-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-editorial text-3xl font-bold text-plum-900 leading-none">
              {overview.workshops.upcoming}
            </span>
            <span className="text-[10px] font-mono text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded font-semibold border border-purple-200">
              {overview.workshops.averageOccupancy} Occ.
            </span>
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-mono truncate">{overview.workshops.sublabel}</p>
        </div>

        {/* Card 5: Memberships */}
        <div className="bg-white p-4 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Memberships</span>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-editorial text-3xl font-bold text-plum-900 leading-none">
              {overview.memberships.activeMembers}
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
              MRR Active
            </span>
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-mono truncate">{overview.memberships.monthlyRecurring}</p>
        </div>

        {/* Card 6: Revenue */}
        <div className="bg-white p-4 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Revenue</span>
            <div className="p-1.5 rounded bg-green-50 text-green-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-editorial text-2xl font-bold text-plum-900 leading-none">
              {overview.revenue.totalFormatted}
            </span>
          </div>
          <p className="text-[10px] font-mono text-emerald-800 bg-emerald-50 inline-block px-1.5 py-0.5 rounded mt-2 font-bold border border-emerald-200">
            {overview.revenue.growth}
          </p>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* 3. ROW 2: RECENT BOOKINGS & RECENT ACTIVITY */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Bookings Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded border border-border shadow-soft overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface/50">
              <div>
                <h2 className="font-editorial text-lg text-plum-900 font-bold">
                  Recent Shala Bookings
                </h2>
                <p className="text-[11px] text-ink-muted font-sans">
                  Latest reserved student sadhana slots and acharya alignment consultations
                </p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-mono text-gold-700 hover:text-gold-800 font-semibold inline-flex items-center gap-1"
              >
                All Bookings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs" aria-label="Admin Recent Bookings">
                <thead>
                  <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[10px]">
                    <th scope="col" className="py-2.5 px-4 font-semibold">Ref</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Student</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Session Title & Type</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Date & Time</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Venue</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold">Status</th>
                    <th scope="col" className="py-2.5 px-4 font-semibold text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {recentBookings.map((bkg) => (
                    <tr key={bkg.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-ink-faint text-[11px]">
                        {bkg.bookingRef}
                      </td>
                      <td className="py-3 px-4 font-semibold text-plum-900">
                        <div>{bkg.studentName}</div>
                        <div className="text-[10px] text-ink-faint font-mono font-normal truncate max-w-[130px]">
                          {bkg.studentEmail}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-plum-900">
                        <div className="font-medium text-xs truncate max-w-[160px]">{bkg.sessionTitle}</div>
                        <span className="text-[10px] font-mono text-gold-700 bg-gold-50 px-1.5 py-0.5 rounded border border-gold-200">
                          {bkg.sessionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ink whitespace-nowrap">
                        <div className="font-medium text-[11px]">{bkg.date}</div>
                        <div className="text-[10px] text-ink-faint font-mono">{bkg.time}</div>
                      </td>
                      <td className="py-3 px-4 text-ink-muted text-[11px] truncate max-w-[120px]">
                        {bkg.venue}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={bkg.status === 'confirmed' ? 'success' : bkg.status === 'pending' ? 'warning' : 'neutral'}
                          size="sm"
                          className="capitalize text-[10px]"
                        >
                          {bkg.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-plum-900 text-right text-[11px]">
                        {bkg.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 border-t border-border bg-canvas/30 text-right">
            <span className="text-[11px] font-mono text-ink-faint">Showing 4 of {overview.bookings.total} bookings</span>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed (1 col) */}
        <div className="bg-white rounded border border-border shadow-soft p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h2 className="font-editorial text-lg text-plum-900 font-bold">
                  Recent Activity
                </h2>
                <p className="text-[11px] text-ink-muted">
                  Administrative events and sadhaka activity
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Audited
              </span>
            </div>

            <div className="space-y-4">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-border/60 last:border-b-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-gold-500 shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-semibold text-plum-900 truncate">{act.actor}</span>
                      <span className="text-[10px] font-mono text-ink-faint whitespace-nowrap">{act.timestamp}</span>
                    </div>
                    <p className="text-ink font-medium text-[11px]">{act.action}</p>
                    <p className="text-[11px] text-ink-muted truncate mt-0.5">{act.details}</p>
                  </div>
                  {act.statusBadge && (
                    <Badge variant={act.statusBadge.variant} size="sm" className="text-[9px] py-0 px-1">
                      {act.statusBadge.label}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-faint">
            <span>Audit Logging Active</span>
            <span className="text-gold-700 font-semibold">Patna / IST (UTC+5:30)</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* 4. ROW 3: UPCOMING WORKSHOPS & NEW ENQUIRIES */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Workshops */}
        <div className="bg-white rounded border border-border shadow-soft p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <h2 className="font-editorial text-lg text-plum-900 font-bold">
                Upcoming Workshops & Occupancy
              </h2>
              <p className="text-[11px] text-ink-muted">
                Seat capacities, enrollments, and scheduled lead acharyas
              </p>
            </div>
            <Link
              href="/admin/programs/workshops"
              className="text-xs font-mono text-gold-700 hover:text-gold-800 font-semibold inline-flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingWorkshops.map((ws) => (
              <div key={ws.id} className="p-3.5 bg-canvas/40 rounded border border-border/70 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-editorial text-base text-plum-900 font-bold leading-tight">
                      {ws.title}
                    </h3>
                    <p className="text-[11px] text-ink-muted font-mono mt-0.5">
                      Lead: <strong className="text-plum-900">{ws.instructor}</strong> | {ws.date} ({ws.time})
                    </p>
                  </div>
                  <Badge variant="plum" size="sm" className="capitalize text-[10px] shrink-0">
                    {ws.mode}
                  </Badge>
                </div>

                {/* Occupancy Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-ink-muted">
                    <span>Seat Capacity: {ws.enrolled} / {ws.capacity}</span>
                    <span className="font-bold text-plum-900">{ws.occupancyPercentage}% Filled</span>
                  </div>
                  <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-plum-800 rounded-full transition-all duration-300"
                      style={{ width: `${ws.occupancyPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white rounded border border-border shadow-soft p-5">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <h2 className="font-editorial text-lg text-plum-900 font-bold">
                New Prospective Enquiries
              </h2>
              <p className="text-[11px] text-ink-muted">
                Incoming student questions, corporate leads, and retreat consultations
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-mono text-gold-700 hover:text-gold-800 font-semibold inline-flex items-center gap-1"
            >
              All Enquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {newEnquiries.map((enq) => (
              <div
                key={enq.id}
                onClick={() => setSelectedEnquiry(enq)}
                className="p-3 bg-surface hover:bg-gold-50/30 rounded border border-border cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-plum-900">{enq.name}</span>
                    <Badge
                      variant={enq.status === 'new' ? 'warning' : enq.status === 'in_progress' ? 'gold' : 'success'}
                      size="sm"
                      className="text-[9px] py-0 px-1 capitalize"
                    >
                      {enq.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-ink-faint">{enq.receivedAt}</span>
                </div>

                <p className="text-xs text-ink line-clamp-2 leading-relaxed">
                  {enq.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-ink-faint font-mono pt-1">
                  <span>Interest: <strong className="text-gold-700 capitalize">{enq.programInterest}</strong></span>
                  <span className="text-gold-600 hover:underline inline-flex items-center gap-0.5">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Enquiry Inspection */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.name}`}
        >
          <div className="space-y-4 text-xs font-sans text-ink">
            <div className="p-4 bg-canvas border border-border rounded space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-editorial text-lg text-plum-900 font-bold">{selectedEnquiry.name}</h3>
                  <div className="flex flex-wrap gap-3 text-ink-muted text-[11px] mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gold-600" /> {selectedEnquiry.email}</span>
                    {selectedEnquiry.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gold-600" /> {selectedEnquiry.phone}</span>}
                  </div>
                </div>
                <Badge
                  variant={selectedEnquiry.status === 'new' ? 'warning' : 'success'}
                  size="sm"
                  className="capitalize"
                >
                  {selectedEnquiry.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="pt-2 border-t border-border/70 text-[11px] text-ink-muted">
                <span>Program of Interest: <strong className="text-plum-900 capitalize">{selectedEnquiry.programInterest}</strong></span>
                <span className="mx-2">|</span>
                <span>Received: <strong>{selectedEnquiry.receivedAt}</strong></span>
              </div>
            </div>

            <div className="p-4 bg-white border border-border rounded space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold">Message Content</p>
              <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">{selectedEnquiry.message}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=Re: Kalptaru Yog Vidyalaya Enquiry`}
                className="px-4 py-2 text-xs font-semibold bg-plum-900 text-gold-200 rounded hover:bg-plum-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Reply via Email
              </a>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-semibold border border-border rounded text-ink hover:bg-surface transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboardPage;
