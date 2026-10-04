'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { StudentService } from '../../services/studentService';
import { StudentDashboardData } from '../../types/student';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import {
  Calendar,
  Clock,
  MapPin,
  Flame,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ExternalLink,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const result = await StudentService.getDashboard();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errObj = err as { message?: string };
          setError(errObj?.message || 'Could not fetch dashboard overview.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-16">
        <LoadingState message="Loading your sadhana dashboard..." />
      </div>
    );
  }

  // Fallback data if needed
  const welcome = data?.welcome || {
    greeting: `Namaste, ${user?.name ? user.name.split(' ')[0] : 'Sadhaka'}`,
    studentName: user?.name || 'Aarav Sharma',
    sanskritQuote: '“Yogena chittasya padena vacham — Yoga purifies the mind, as speech purifies thought.”',
    streakDays: 14,
    hoursPracticed: 38,
  };

  const currentMembership = data?.currentMembership;
  const upcomingBookings = data?.upcomingBookings || [];
  const recentPurchases = data?.recentPurchases || [];
  const upcomingWorkshops = data?.upcomingWorkshops || [];
  const courseEnrollments = data?.courseEnrollments || [];

  return (
    <div className="space-y-8 pb-12">
      {/* -------------------------------------------------- */}
      {/* 1. WELCOME MESSAGE & SADHANA STREAK */}
      {/* -------------------------------------------------- */}
      <section aria-labelledby="welcome-heading" className="bg-surface border border-border rounded p-6 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold">
                Daily Sadhana Log
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-ink-faint">Session Active</span>
            </div>
            <h1 id="welcome-heading" className="font-editorial text-3xl sm:text-4xl text-plum-900 font-normal">
              {welcome.greeting}
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-ink-muted mt-2 max-w-2xl leading-relaxed">
              {welcome.sanskritQuote}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-canvas border border-border px-4 py-3 rounded text-center min-w-[100px]">
              <div className="flex items-center justify-center text-amber-600 gap-1 mb-1">
                <Flame className="w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase">Streak</span>
              </div>
              <p className="font-editorial text-2xl text-plum-900 font-bold leading-none">
                {welcome.streakDays}
              </p>
              <span className="text-[10px] text-ink-faint font-mono">Days Regular</span>
            </div>

            <div className="bg-canvas border border-border px-4 py-3 rounded text-center min-w-[100px]">
              <div className="flex items-center justify-center text-plum-700 gap-1 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase">Practice</span>
              </div>
              <p className="font-editorial text-2xl text-plum-900 font-bold leading-none">
                {welcome.hoursPracticed}h
              </p>
              <span className="text-[10px] text-ink-faint font-mono">Total Hours</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Notice: Displaying offline student preview. {error}</span>
          </div>
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. CURRENT MEMBERSHIP & QUICK STATS */}
      {/* -------------------------------------------------- */}
      <section aria-labelledby="membership-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="membership-heading" className="font-editorial text-2xl text-plum-900 font-semibold">
              Current Membership
            </h2>
            <p className="text-xs text-ink-muted">Your active shala access tier and studio privileges</p>
          </div>
          <Link href="/dashboard/membership"
            className="text-xs font-medium text-gold-600 hover:text-gold-700 inline-flex items-center gap-1 font-mono tracking-wide"
          >
            Manage Membership <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {currentMembership ? (
          <div className="bg-surface border border-border rounded p-6 shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Membership Title & Badge */}
              <div className="space-y-2 border-b md:border-b-0 md:border-r border-border/80 pb-4 md:pb-0 md:pr-6">
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm" className="capitalize">
                    {currentMembership.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-ink-faint capitalize font-mono">
                    {currentMembership.billingCycle} Renewal
                  </span>
                </div>
                <h3 className="font-editorial text-2xl text-plum-900 font-bold">
                  {currentMembership.planName}
                </h3>
                <p className="text-xs text-ink-muted">
                  Batch: <strong className="text-plum-900">{currentMembership.batch}</strong>
                </p>
                <p className="text-xs text-ink-faint">
                  Valid Until: <span className="text-plum-900 font-medium">{currentMembership.validUntil}</span>
                </p>
              </div>

              {/* Included Perks */}
              <div className="md:col-span-2 space-y-3">
                <p className="text-xs uppercase font-mono tracking-widest text-ink-muted font-semibold">
                  Active Tier Privileges
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentMembership.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-plum-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Active Membership"
            description="You do not currently have an active Shala Sadhana pass. Explore our tiers to join daily morning and evening practice."
            action={
              <Link href="/programs/membership"
                className="inline-flex items-center text-xs font-semibold text-plum-900 border border-gold-500/70 px-4 py-2 rounded bg-surface hover:bg-gold-50 transition-colors"
              >
                Browse Membership Plans
              </Link>
            }
          />
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. UPCOMING BOOKINGS */}
      {/* -------------------------------------------------- */}
      <section aria-labelledby="bookings-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="bookings-heading" className="font-editorial text-2xl text-plum-900 font-semibold">
              Upcoming Bookings
            </h2>
            <p className="text-xs text-ink-muted">Reserved shala sessions, masterclasses, and mentor consultations</p>
          </div>
          <Link href="/dashboard/bookings"
            className="text-xs font-medium text-gold-600 hover:text-gold-700 inline-flex items-center gap-1 font-mono tracking-wide"
          >
            All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="bg-surface border border-border rounded overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs" aria-label="Upcoming Bookings Table">
                <thead>
                  <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                    <th scope="col" className="py-3.5 px-4 font-semibold">Session & Type</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Date & Timing</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Shala / Venue</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Acharya / Mentor</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {upcomingBookings.map((bkg) => (
                    <tr key={bkg.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-plum-900">
                        <div className="font-semibold text-sm">{bkg.title}</div>
                        <span className="text-[11px] text-gold-700 font-mono">{bkg.type}</span>
                      </td>
                      <td className="py-3.5 px-4 text-ink">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-ink-faint" />
                          <span>{bkg.date}</span>
                        </div>
                        <div className="text-[11px] text-ink-faint mt-0.5">{bkg.time}</div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                          <span className="truncate max-w-[180px]">{bkg.venue}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-plum-900 font-medium">
                        {bkg.instructor}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={bkg.status === 'confirmed' ? 'success' : 'warning'}
                          size="sm"
                          className="capitalize"
                        >
                          {bkg.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href="/dashboard/bookings"
                          className="text-[11px] font-mono text-gold-600 hover:text-gold-700 underline underline-offset-2"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Upcoming Bookings"
            description="You have no shala slots or consultation sessions scheduled this week."
            action={
              <Link href="/programs"
                className="inline-flex items-center text-xs font-semibold text-plum-900 border border-gold-500/70 px-4 py-2 rounded bg-surface hover:bg-gold-50 transition-colors"
              >
                Reserve Shala Slot
              </Link>
            }
          />
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 4. COURSE ENROLLMENTS */}
      {/* -------------------------------------------------- */}
      <section aria-labelledby="courses-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="courses-heading" className="font-editorial text-2xl text-plum-900 font-semibold">
              Course Enrollments
            </h2>
            <p className="text-xs text-ink-muted">Active certifications, teacher trainings, and curriculum modules</p>
          </div>
          <Link href="/dashboard/courses"
            className="text-xs font-medium text-gold-600 hover:text-gold-700 inline-flex items-center gap-1 font-mono tracking-wide"
          >
            All Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {courseEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseEnrollments.map((course) => (
              <Card key={course.id} className="p-5 flex flex-col justify-between hover:shadow-card transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="plum" size="sm" className="capitalize">
                      {course.level}
                    </Badge>
                    <Badge
                      variant={course.certificationStatus === 'completed' ? 'success' : 'gold'}
                      size="sm"
                      className="capitalize"
                    >
                      {course.certificationStatus.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-editorial text-xl text-plum-900 font-bold leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-ink-faint font-mono mt-0.5">
                      Batch: {course.batch}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono text-ink-muted">
                      <span>Curriculum Progress</span>
                      <span className="font-bold text-plum-900">{course.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-canvas border border-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 to-plum-700 transition-all duration-300 rounded-full"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-ink-faint">
                      {course.completedModules} of {course.totalModules} modules completed
                    </p>
                  </div>

                  <div className="bg-canvas p-2.5 rounded border border-border/70 text-xs">
                    <span className="text-[10px] uppercase font-mono text-gold-600 block font-semibold">
                      Current Lesson:
                    </span>
                    <span className="text-plum-900 font-medium">{course.nextLesson}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between">
                  <Link href="/dashboard/courses"
                    className="text-xs font-semibold text-plum-900 hover:text-plum-700 inline-flex items-center gap-1"
                  >
                    Resume Study <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href={`/programs/courses`}
                    className="text-[11px] font-mono text-ink-muted hover:text-plum-900 inline-flex items-center gap-1"
                  >
                    Syllabus <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Course Enrollments"
            description="You are not currently enrolled in any academic or teacher training courses."
            action={
              <Link href="/programs/courses"
                className="inline-flex items-center text-xs font-semibold text-plum-900 border border-gold-500/70 px-4 py-2 rounded bg-surface hover:bg-gold-50 transition-colors"
              >
                Explore Courses
              </Link>
            }
          />
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 5. UPCOMING WORKSHOPS */}
      {/* -------------------------------------------------- */}
      <section aria-labelledby="workshops-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="workshops-heading" className="font-editorial text-2xl text-plum-900 font-semibold">
              Upcoming Workshops
            </h2>
            <p className="text-xs text-ink-muted">Masterclasses, intensive weekend immersions, and special lectures</p>
          </div>
          <Link href="/dashboard/workshops"
            className="text-xs font-medium text-gold-600 hover:text-gold-700 inline-flex items-center gap-1 font-mono tracking-wide"
          >
            Full Schedule <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingWorkshops.map((ws) => (
              <div
                key={ws.id}
                className="bg-surface border border-border p-5 rounded flex flex-col justify-between shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={ws.attendanceStatus === 'registered' ? 'success' : 'warning'} size="sm">
                      {ws.attendanceStatus === 'registered' ? 'Confirmed Seat' : 'Waitlisted'}
                    </Badge>
                    <span className="text-[11px] font-mono text-ink-faint capitalize">{ws.mode}</span>
                  </div>

                  <h3 className="font-editorial text-lg text-plum-900 font-semibold leading-tight">
                    {ws.title}
                  </h3>

                  <div className="text-xs text-ink-muted space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-600" />
                      <span>{ws.date}</span>
                      <span className="text-ink-faint">({ws.time})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gold-600" />
                      <span>Instructor: <strong className="text-plum-900">{ws.instructor}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border/70 flex items-center justify-between">
                  <Link href="/dashboard/workshops"
                    className="text-xs font-medium text-gold-600 hover:text-gold-700"
                  >
                    View Workshop Pass
                  </Link>
                  <span className="text-[11px] text-ink-faint font-mono">Shala Hall A</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Workshop Registrations"
            description="You have not enrolled in any upcoming weekend masterclasses or retreats."
            action={
              <Link href="/programs/workshops"
                className="inline-flex items-center text-xs font-semibold text-plum-900 border border-gold-500/70 px-4 py-2 rounded bg-surface hover:bg-gold-50 transition-colors"
              >
                Browse Workshops
              </Link>
            }
          />
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* 6. RECENT PURCHASES */}
      {/* -------------------------------------------------- */}
      <section aria-labelledby="purchases-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="purchases-heading" className="font-editorial text-2xl text-plum-900 font-semibold">
              Recent Purchases
            </h2>
            <p className="text-xs text-ink-muted">Invoices, enrollment receipts, and payment transactions</p>
          </div>
          <Link href="/dashboard/purchases"
            className="text-xs font-medium text-gold-600 hover:text-gold-700 inline-flex items-center gap-1 font-mono tracking-wide"
          >
            All Purchases <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPurchases.length > 0 ? (
          <div className="bg-surface border border-border rounded overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs" aria-label="Recent Purchases Table">
                <thead>
                  <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                    <th scope="col" className="py-3.5 px-4 font-semibold">Invoice #</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Item & Type</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Date</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Payment Mode</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Amount</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                    <th scope="col" className="py-3.5 px-4 font-semibold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {recentPurchases.map((pur) => (
                    <tr key={pur.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-plum-900">
                        {pur.invoiceNo}
                      </td>
                      <td className="py-3.5 px-4 text-plum-900">
                        <div className="font-medium text-xs">{pur.itemTitle}</div>
                        <span className="text-[10px] text-ink-faint font-mono">{pur.itemType}</span>
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted whitespace-nowrap">
                        {pur.date}
                      </td>
                      <td className="py-3.5 px-4 text-ink-faint font-mono text-[11px]">
                        {pur.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-plum-900">
                        {pur.amount}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={pur.status === 'paid' ? 'success' : 'warning'}
                          size="sm"
                          className="capitalize"
                        >
                          {pur.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href="/dashboard/purchases"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-gold-600 hover:text-gold-700"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Purchases Recorded"
            description="You have not made any fee payments or course purchases yet."
          />
        )}
      </section>
    </div>
  );
};

export default DashboardOverview;
