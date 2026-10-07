'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  MessageSquare,
  RefreshCw,
  ArrowRight,
  Mail,
  Phone,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminNewEnquiry | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await AdminService.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading dashboard..." />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-white p-8 rounded border border-border shadow-soft text-center space-y-4 max-w-lg mx-auto mt-12">
        <p className="text-sm text-plum-900 font-medium">{error}</p>
        <button
          type="button"
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-plum-900 text-gold-200 rounded hover:bg-plum-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const stats = data?.stats || {
    students: data?.overview?.students.total || 0,
    bookings: data?.overview?.bookings.total || 0,
    courses: data?.overview?.courses.total || 0,
    workshops: data?.overview?.workshops.total || 0,
    enquiries: data?.overview?.enquiries.total || 0,
  };

  const recentBookings = data?.recentBookings || [];
  const upcomingWorkshops = data?.upcomingWorkshops || [];
  const recentEnquiries = data?.recentEnquiries || data?.newEnquiries || [];

  return (
    <div className="space-y-8 pb-12">
      {/* -------------------------------------------------- */}
      {/* HEADER                                             */}
      {/* -------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded border border-border shadow-soft">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-plum-900 font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Here&apos;s what&apos;s happening at Kalptaruu Yoga Vidhyalaya.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium border border-border bg-white hover:bg-surface text-plum-900 rounded transition-colors self-start sm:self-center disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gold-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* -------------------------------------------------- */}
      {/* 4 HIGH-LEVEL INSTITUTE STATISTICS                   */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Bookings */}
        <div className="bg-white p-5 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gold-800">
              Bookings
            </span>
            <div className="p-1.5 rounded bg-amber-50 text-amber-800">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-3xl font-bold text-plum-900 leading-none">
            {stats.bookings}
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-sans">Total booking requests</p>
        </div>

        {/* Stat 2: Courses */}
        <div className="bg-white p-5 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gold-800">
              Courses
            </span>
            <div className="p-1.5 rounded bg-gold-50 text-gold-800">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-3xl font-bold text-plum-900 leading-none">
            {stats.courses}
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-sans">Active curriculums</p>
        </div>

        {/* Stat 3: Workshops */}
        <div className="bg-white p-5 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gold-800">
              Workshops
            </span>
            <div className="p-1.5 rounded bg-purple-50 text-purple-800">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-3xl font-bold text-plum-900 leading-none">
            {stats.workshops}
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-sans">Scheduled masterclasses</p>
        </div>

        {/* Stat 4: Enquiries */}
        <div className="bg-white p-5 rounded border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gold-800">
              Enquiries
            </span>
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-800">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-3xl font-bold text-plum-900 leading-none">
            {stats.enquiries}
          </div>
          <p className="text-[11px] text-ink-faint mt-2 font-sans">Prospective enquiries</p>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* RECENT BOOKINGS TABLE                              */}
      {/* -------------------------------------------------- */}
      <div className="bg-white rounded border border-border shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-lg text-plum-900 font-bold">
              Recent Bookings
            </h2>
            <p className="text-xs text-ink-muted">
              Latest visitor booking requests and allocations
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-mono text-gold-700 hover:text-gold-900 font-semibold inline-flex items-center gap-1"
          >
            All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-xs sm:text-sm text-ink-muted">No bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs" aria-label="Recent Bookings">
              <thead>
                <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[10px]">
                  <th scope="col" className="py-3 px-6 font-semibold">Visitor / Contact</th>
                  <th scope="col" className="py-3 px-6 font-semibold">Program</th>
                  <th scope="col" className="py-3 px-6 font-semibold">Date</th>
                  <th scope="col" className="py-3 px-6 font-semibold">Status</th>
                  <th scope="col" className="py-3 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentBookings.map((bkg) => (
                  <tr key={bkg.id} className="hover:bg-canvas/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-plum-900">
                      <div>{bkg.studentName}</div>
                      {bkg.studentEmail && (
                        <div className="text-[10px] text-ink-faint font-mono font-normal truncate max-w-[180px]">
                          {bkg.studentEmail}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-plum-900">
                      <div className="font-medium">{bkg.sessionTitle}</div>
                      <span className="text-[10px] font-mono text-gold-800">
                        {bkg.sessionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-ink-muted whitespace-nowrap">
                      <div>{bkg.date}</div>
                      <div className="text-[10px] text-ink-faint font-mono">{bkg.time}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge
                        variant={
                          bkg.status === 'confirmed'
                            ? 'success'
                            : bkg.status === 'new'
                            ? 'plum'
                            : bkg.status === 'contacted'
                            ? 'warning'
                            : bkg.status === 'pending'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                        className="capitalize text-[10px]"
                      >
                        {bkg.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/admin/bookings`}
                        className="text-xs font-mono text-gold-700 hover:text-gold-900 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* 2 COLUMNS: UPCOMING WORKSHOPS & RECENT ENQUIRIES   */}
      {/* -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Workshops */}
        <div className="bg-white rounded border border-border shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h2 className="font-editorial text-lg text-plum-900 font-bold">
                  Upcoming Workshops
                </h2>
                <p className="text-xs text-ink-muted">
                  Schedule and seat occupancy
                </p>
              </div>
              <Link
                href="/admin/programs/workshops"
                className="text-xs font-mono text-gold-700 hover:text-gold-900 font-semibold inline-flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingWorkshops.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs sm:text-sm text-ink-muted">No upcoming workshops.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingWorkshops.map((ws) => (
                  <div
                    key={ws.id}
                    className="p-4 bg-canvas/40 rounded border border-border/70 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-editorial text-sm sm:text-base text-plum-900 font-bold leading-tight truncate">
                        {ws.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gold-600" />
                          {ws.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-600" />
                          {ws.time}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-ink-muted pt-0.5">
                        Seats: <strong className="text-plum-900">{ws.enrolled}</strong> / {ws.capacity} booked
                      </div>
                    </div>

                    <Link
                      href="/admin/programs/workshops"
                      className="px-3 py-1.5 text-xs font-mono text-gold-800 hover:text-plum-900 border border-border rounded bg-white hover:bg-surface shrink-0 font-medium transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded border border-border shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h2 className="font-editorial text-lg text-plum-900 font-bold">
                  Recent Enquiries
                </h2>
                <p className="text-xs text-ink-muted">
                  Prospective student questions and messages
                </p>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs font-mono text-gold-700 hover:text-gold-900 font-semibold inline-flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentEnquiries.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs sm:text-sm text-ink-muted">No enquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className="p-3.5 bg-surface hover:bg-gold-50/20 rounded border border-border cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-plum-900">{enq.name}</span>
                        <Badge
                          variant={enq.status === 'new' ? 'warning' : 'neutral'}
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
                      <span>Interest: <strong className="text-gold-800 capitalize">{enq.programInterest}</strong></span>
                      <span className="text-gold-700 hover:underline">View details</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gold-600" /> {selectedEnquiry.email}
                    </span>
                    {selectedEnquiry.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gold-600" /> {selectedEnquiry.phone}
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant={selectedEnquiry.status === 'new' ? 'warning' : 'neutral'}
                  size="sm"
                  className="capitalize"
                >
                  {selectedEnquiry.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="pt-2 border-t border-border/70 text-[11px] text-ink-muted">
                <span>Program: <strong className="text-plum-900 capitalize">{selectedEnquiry.programInterest}</strong></span>
                <span className="mx-2">•</span>
                <span>Received: <strong>{selectedEnquiry.receivedAt}</strong></span>
              </div>
            </div>

            <div className="p-4 bg-white border border-border rounded space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-ink-faint font-semibold">Message</p>
              <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">{selectedEnquiry.message}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {selectedEnquiry.email && (
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: Kalptaruu Yoga Vidhyalaya`}
                  className="px-4 py-2 text-xs font-semibold bg-plum-900 text-gold-200 rounded hover:bg-plum-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Reply
                </a>
              )}
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
