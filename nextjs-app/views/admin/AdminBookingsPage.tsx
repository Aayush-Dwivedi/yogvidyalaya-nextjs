'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { BookingService } from '../../services/bookingService';
import { Booking, BookingStatus, PaymentStatus } from '../../types/booking';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import {
  Clock,
  Search,
  RefreshCw,
  Eye,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  User,
  ShieldAlert,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [programTypeFilter, setProgramTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Modals
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);
  const [statusModalBooking, setStatusModalBooking] = useState<Booking | null>(null);

  // Status Form Edit State
  const [newBookingStatus, setNewBookingStatus] = useState<BookingStatus>('confirmed');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await BookingService.getAllBookings({
        search: searchQuery.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
        programType: programTypeFilter !== 'all' ? programTypeFilter : undefined,
        date: dateFilter || undefined,
        limit: 50,
      });
      setBookings(res.items || []);
      setTotalCount(res.meta?.total || (res.items?.length || 0));
    } catch (err: any) {
      console.error('Failed to load bookings for admin:', err);
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to fetch bookings.' });
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, paymentFilter, programTypeFilter, dateFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Open Status Edit Modal
  const openStatusEditor = (booking: Booking) => {
    setStatusModalBooking(booking);
    setNewBookingStatus(booking.bookingStatus);
    setNewPaymentStatus(booking.paymentStatus);
    setAdminNotes(booking.notes || '');
    setCancellationReason(booking.cancellationReason || '');
    setFeedbackMessage(null);
  };

  // Submit Status Change
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalBooking) return;

    setUpdating(true);
    setFeedbackMessage(null);

    try {
      const updated = await BookingService.updateBookingStatus(statusModalBooking._id, {
        bookingStatus: newBookingStatus,
        paymentStatus: newPaymentStatus,
        notes: adminNotes.trim() || undefined,
        cancellationReason:
          ['cancelled', 'refunded'].includes(newBookingStatus)
            ? cancellationReason.trim() || 'Status updated by administration'
            : undefined,
      });

      setFeedbackMessage({
        type: 'success',
        text: `Booking ${updated.bookingReference} status updated successfully.`,
      });
      setStatusModalBooking(null);
      fetchBookings();
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Failed to update booking status.',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Metrics summary
  const newCount = bookings.filter((b) => b.bookingStatus === 'new').length;
  const contactedCount = bookings.filter((b) => b.bookingStatus === 'contacted').length;
  const confirmedCount = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const closedCount = bookings.filter((b) =>
    ['completed', 'cancelled', 'refunded'].includes(b.bookingStatus)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
            Admissions &amp; Visitor Operations
          </span>
          <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
            Bookings Ledger
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Real-time visitor booking requests, batch allocation, and contact records.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBookings}
          className="self-start sm:self-auto px-4 py-2 bg-surface border border-border rounded-lg text-xs font-medium text-ink hover:text-plum-900 flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-4 rounded-xl shadow-soft">
          <span className="text-[10px] font-mono uppercase text-ink-faint block">Total Requests</span>
          <span className="text-2xl font-editorial font-semibold text-plum-900 mt-1 block">
            {totalCount}
          </span>
          <span className="text-[11px] text-ink-muted">Across all programs</span>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl shadow-soft">
          <span className="text-[10px] font-mono uppercase text-ink-faint block">New Requests</span>
          <span className="text-2xl font-editorial font-semibold text-plum-900 mt-1 block">
            {newCount}
          </span>
          <span className="text-[11px] text-gold-700/80">Awaiting contact</span>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl shadow-soft">
          <span className="text-[10px] font-mono uppercase text-ink-faint block">Contacted / Confirmed</span>
          <span className="text-2xl font-editorial font-semibold text-emerald-700 mt-1 block">
            {contactedCount + confirmedCount}
          </span>
          <span className="text-[11px] text-emerald-600/80">In communication / enrolled</span>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl shadow-soft">
          <span className="text-[10px] font-mono uppercase text-ink-faint block">Completed / Cancelled</span>
          <span className="text-2xl font-editorial font-semibold text-ink-muted mt-1 block">
            {closedCount}
          </span>
          <span className="text-[11px] text-ink-faint">Concluded requests</span>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="hover:opacity-70 text-base leading-none font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Search & Filters Filter Bar */}
      <div className="bg-surface border border-border p-4 rounded-xl shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by visitor name, email, phone, reference (e.g. KYV-2026-00124), or program title..."
            className="w-full pl-9 pr-3 py-2 bg-canvas border border-border rounded-lg outline-none focus:border-gold-500 shadow-sm"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Booking Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-canvas border border-border rounded-lg px-3 py-2 outline-none focus:border-gold-500 shadow-sm"
          >
            <option value="all">All Request Statuses</option>
            <option value="new">New Request</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending (Legacy)</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-canvas border border-border rounded-lg px-3 py-2 outline-none focus:border-gold-500 shadow-sm"
          >
            <option value="all">All Payment States</option>
            <option value="pending">Payment: Pending</option>
            <option value="paid">Payment: Paid</option>
            <option value="waived">Payment: Waived</option>
            <option value="refunded">Payment: Refunded</option>
            <option value="failed">Payment: Failed</option>
          </select>

          {/* Program Type Filter */}
          <select
            value={programTypeFilter}
            onChange={(e) => setProgramTypeFilter(e.target.value)}
            className="bg-canvas border border-border rounded-lg px-3 py-2 outline-none focus:border-gold-500 shadow-sm"
          >
            <option value="all">All Program Types</option>
            <option value="course">Courses Only</option>
            <option value="workshop">Workshops Only</option>
          </select>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-canvas border border-border rounded-lg px-2.5 py-1.5 shadow-sm">
            <span className="text-[11px] text-ink-muted">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent outline-none text-xs text-ink cursor-pointer"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="text-ink-muted hover:text-ink text-[11px] font-bold px-1"
                title="Clear date filter"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bookings Ledger Table */}
      {loading ? (
        <LoadingState message="Querying admissions and booking registry..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No Bookings Match Criteria"
          description="Try broadening your search or resetting filters to inspect the full admissions ledger."
        />
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs" aria-label="Admin Bookings Ledger">
              <thead>
                <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3.5 px-4 font-semibold">Reference</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Visitor / Contact</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Program &amp; Type</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Schedule &amp; Batch</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Tuition / Payment</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Request Status</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {bookings.map((bkg) => (
                  <tr key={bkg._id} className="hover:bg-canvas/50 transition-colors">
                    {/* Booking Reference */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-plum-900 text-xs block">
                        {bkg.bookingReference}
                      </span>
                      <span className="text-[10px] text-ink-faint">
                        {new Date(bkg.bookingDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Visitor Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-plum-900">
                        {bkg.attendeeDetails?.fullName || bkg.student?.name || 'Visitor'}
                      </div>
                      <div className="text-[11px] text-ink-muted truncate max-w-[170px]">
                        {bkg.attendeeDetails?.email || bkg.student?.email || '—'}
                      </div>
                      {(bkg.attendeeDetails?.phone || bkg.student?.phone) && (
                        <div className="text-[10px] font-mono text-ink-faint">
                          {bkg.attendeeDetails?.phone || bkg.student?.phone}
                        </div>
                      )}
                    </td>

                    {/* Program Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-plum-900 max-w-[200px] truncate">
                        {bkg.program.title}
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border inline-block mt-0.5 ${
                          bkg.program.programType === 'course'
                            ? 'bg-plum-50 border-plum-200 text-plum-800'
                            : 'bg-gold-50 border-gold-200 text-gold-800'
                        }`}
                      >
                        {bkg.program.programType}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 text-ink">
                      <div className="font-medium">{bkg.schedule.batch || 'Standard Cohort'}</div>
                      <div className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-ink-faint shrink-0" />
                        <span className="truncate max-w-[150px]">{bkg.schedule.time || 'Shala Timing'}</span>
                      </div>
                    </td>

                    {/* Tuition & Payment Status */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-plum-900">
                        {bkg.amount.displayAmount || `₹${bkg.amount.total.toLocaleString()}`}
                      </div>
                      <span className="text-[10px] font-mono text-ink-faint block mt-0.5">
                        Offline settlement
                      </span>
                    </td>

                    {/* Booking Status Badge */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          bkg.bookingStatus === 'confirmed'
                            ? 'success'
                            : bkg.bookingStatus === 'new'
                            ? 'plum'
                            : bkg.bookingStatus === 'contacted'
                            ? 'gold'
                            : bkg.bookingStatus === 'completed'
                            ? 'earth'
                            : bkg.bookingStatus === 'cancelled'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {bkg.bookingStatus}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setInspectBooking(bkg)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted hover:text-plum-900 bg-canvas border border-border px-2.5 py-1 rounded-lg transition-colors"
                        title="View complete student & booking details"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-600" />
                        <span>Inspect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openStatusEditor(bkg)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-gold-700 hover:text-gold-900 bg-gold-50 border border-gold-200 px-2.5 py-1 rounded-lg transition-colors"
                        title="Change booking and payment status"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. INSPECT BOOKING / VISITOR / PROGRAM MODAL                             */}
      {/* ========================================================================= */}
      {inspectBooking && (
        <Modal
          isOpen={!!inspectBooking}
          onClose={() => setInspectBooking(null)}
          title={`Booking Request — ${inspectBooking.bookingReference}`}
          description={`Submitted on ${new Date(inspectBooking.bookingDate).toLocaleString()}`}
          size="lg"
        >
          <div className="space-y-5 text-xs text-ink">
            {/* Visitor Contact Card */}
            <div className="bg-canvas border border-border p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-plum-900 font-semibold font-editorial text-sm">
                <User className="w-4 h-4 text-gold-600" />
                <span>Visitor Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Full Name</span>
                  <span className="font-semibold text-plum-900">
                    {inspectBooking.attendeeDetails?.fullName || inspectBooking.student?.name || 'Visitor'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Email Address</span>
                  <a
                    href={`mailto:${inspectBooking.attendeeDetails?.email || inspectBooking.student?.email || ''}`}
                    className="font-mono text-gold-700 hover:underline"
                  >
                    {inspectBooking.attendeeDetails?.email || inspectBooking.student?.email || 'N/A'}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Contact Phone</span>
                  <a
                    href={`tel:${inspectBooking.attendeeDetails?.phone || inspectBooking.student?.phone || ''}`}
                    className="font-mono text-gold-700 hover:underline"
                  >
                    {inspectBooking.attendeeDetails?.phone || inspectBooking.student?.phone || 'N/A'}
                  </a>
                </div>
                {inspectBooking.attendeeDetails?.city && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-faint block">City</span>
                    <span className="text-ink">{inspectBooking.attendeeDetails.city}</span>
                  </div>
                )}
                {inspectBooking.attendeeDetails?.age && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-faint block">Age</span>
                    <span className="text-ink">{inspectBooking.attendeeDetails.age} years</span>
                  </div>
                )}
              </div>
              {inspectBooking.attendeeDetails?.message && (
                <div className="pt-2 border-t border-border/60">
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Visitor Message</span>
                  <p className="text-ink italic mt-0.5">{inspectBooking.attendeeDetails.message}</p>
                </div>
              )}
            </div>

            {/* Program & Schedule Card */}
            <div className="bg-canvas border border-border p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-plum-900 font-semibold font-editorial text-sm">
                <BookOpen className="w-4 h-4 text-gold-600" />
                <span>Program &amp; Schedule Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Program Title</span>
                  <span className="font-semibold text-plum-900">{inspectBooking.program.title}</span>
                  <span className="text-[10px] font-mono uppercase text-gold-700 ml-1">
                    ({inspectBooking.program.programType})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Batch Timing</span>
                  <span className="font-medium text-ink">
                    {inspectBooking.schedule.batch} ({inspectBooking.schedule.time})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Venue / Campus</span>
                  <span className="text-ink">{inspectBooking.schedule.venue || 'Kalptaruu Tapovan Shala'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">Delivery Format</span>
                  <span className="text-ink capitalize">{inspectBooking.schedule.mode || 'In-Person'}</span>
                </div>
              </div>
            </div>

            {/* Financial & Status State */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-canvas-warm/70 border border-border p-3.5 rounded-xl">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint block">Tuition / Dakshina</span>
                <span className="font-editorial text-base font-semibold text-plum-900">
                  {inspectBooking.amount.displayAmount || `₹${inspectBooking.amount.total.toLocaleString()}`}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint block">Payment Mode</span>
                <span className="font-mono text-xs text-ink-muted">
                  Offline / Manual
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint block">Request Status</span>
                <span className="font-mono uppercase font-bold text-xs text-plum-900">
                  {inspectBooking.bookingStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint block">Request Date</span>
                <span className="text-xs text-ink font-medium">
                  {new Date(inspectBooking.bookingDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Notes / Cancellation Reason */}
            {inspectBooking.cancellationReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-900">
                <strong className="block font-semibold">Cancellation Notice:</strong>
                <p>{inspectBooking.cancellationReason}</p>
                {inspectBooking.cancelledAt && (
                  <span className="text-[10px] text-rose-700 block">
                    Cancelled on {new Date(inspectBooking.cancelledAt).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {inspectBooking.notes && (
              <div className="p-3 bg-canvas border border-border rounded-xl space-y-0.5 text-xs text-ink-muted">
                <strong className="block font-semibold text-plum-900">Administrative Notes:</strong>
                <p>{inspectBooking.notes}</p>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectBooking(null)}
                className="px-4 py-2 bg-canvas border border-border rounded-lg text-xs font-medium text-ink hover:text-plum-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = inspectBooking;
                  setInspectBooking(null);
                  openStatusEditor(b);
                }}
                className="px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Modify Status</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 2. CHANGE STATUS & PAYMENT MODAL                                         */}
      {/* ========================================================================= */}
      {statusModalBooking && (
        <Modal
          isOpen={!!statusModalBooking}
          onClose={() => setStatusModalBooking(null)}
          title={`Update Status — ${statusModalBooking.bookingReference}`}
          description={`Program: ${statusModalBooking.program.title} | Visitor: ${
            statusModalBooking.attendeeDetails?.fullName || statusModalBooking.student?.name || 'Visitor'
          }`}
          size="md"
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs text-ink">
            {/* Server-Side Capacity Notification */}
            <div className="bg-canvas border border-border p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] text-ink-muted">
              <ShieldAlert className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-plum-900">Batch Capacity:</strong> Changing status to{' '}
                <span className="font-mono text-rose-700">cancelled</span> releases the occupied seat. Re-confirming a
                request atomically checks availability before allocating the seat.
              </div>
            </div>

            {/* Booking Status Select */}
            <div>
              <label className="block text-ink font-medium mb-1">Booking Status *</label>
              <select
                value={newBookingStatus}
                onChange={(e) => setNewBookingStatus(e.target.value as BookingStatus)}
                className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm font-medium"
              >
                <option value="new">New Request (Awaiting Contact)</option>
                <option value="contacted">Contacted (In Communication)</option>
                <option value="confirmed">Confirmed (Seat Reserved)</option>
                <option value="completed">Completed (Attended &amp; Finished)</option>
                <option value="cancelled">Cancelled (Seat Released)</option>
                <option value="pending">Pending (Legacy)</option>
              </select>
            </div>

            {/* Payment Status Select */}
            <div>
              <label className="block text-ink font-medium mb-1">Offline Payment State</label>
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm font-medium"
              >
                <option value="pending">Pending Direct Settlement</option>
                <option value="paid">Settled &amp; Verified</option>
                <option value="waived">Waived / Complimentary</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Conditional Cancellation Reason */}
            {['cancelled', 'refunded'].includes(newBookingStatus) && (
              <div>
                <label className="block text-ink font-medium mb-1">Cancellation / Refund Reason</label>
                <input
                  type="text"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g. Sadhaka requested date change, medical reasons..."
                  className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                />
              </div>
            )}

            {/* Administrative Notes */}
            <div>
              <label className="block text-ink font-medium mb-1">Internal Administrative Notes</label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal audit notes, special arrangements, reception desk remarks..."
                className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-border flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                disabled={updating}
                className="px-4 py-2 text-xs text-ink-muted hover:text-ink font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-soft disabled:opacity-50"
              >
                {updating ? 'Updating Ledger...' : 'Save Status Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminBookingsPage;
