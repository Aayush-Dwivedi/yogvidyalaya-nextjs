'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';
import { Badge } from '@/components/Badge';
import { LoadingState } from '@/components/LoadingState';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  User,
  ShieldCheck,
  CreditCard,
  Ban,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadBooking() {
      try {
        setLoading(true);
        setError(null);
        const data = await BookingService.getBookingById(id);
        setBooking(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load booking dossier.');
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    setCancelLoading(true);
    try {
      const updated = await BookingService.cancelBooking(
        booking._id,
        cancelReason.trim() || 'Cancelled by student'
      );
      setBooking(updated);
      setActionSuccess('Booking reservation cancelled successfully.');
      setCancelModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Could not cancel booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  const formatScheduleDate = (b: Booking) => {
    const rawDate = b.schedule?.date || b.bookingDate;
    if (!rawDate) return 'Date TBA';
    const d = new Date(rawDate);
    return isNaN(d.getTime())
      ? 'Date TBA'
      : d.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  };

  const formatScheduleTime = (b: Booking) => {
    if (b.schedule?.time) return b.schedule.time;
    if (b.schedule?.startTime && b.schedule?.endTime) {
      return `${b.schedule.startTime} - ${b.schedule.endTime}`;
    }
    if (b.schedule?.startTime) return b.schedule.startTime;
    return 'Schedule time confirmed upon enrolment';
  };

  if (loading) {
    return <LoadingState message="Loading your booking reservation dossier..." />;
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="font-editorial text-2xl text-plum-900 font-semibold">
          Unable to Access Booking
        </h2>
        <p className="text-xs text-ink-muted">
          {error || 'The requested booking reservation was not found or you are not authorized to view it.'}
        </p>
        <button
          type="button"
          onClick={() => router.push('/dashboard/bookings')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 transition-colors shadow-soft"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to My Bookings</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => router.push('/dashboard/bookings')}
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-plum-900 transition-colors font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Bookings</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Main Dossier Card */}
      <div className="bg-surface border border-border rounded-2xl shadow-soft overflow-hidden">
        {/* Card Header */}
        <div className="bg-plum-950 text-ivory p-6 border-b border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
              Booking Dossier
            </span>
            <h1 className="font-editorial text-2xl text-white font-normal mt-0.5">
              {booking.bookingReference}
            </h1>
            <p className="text-xs text-ivory/70 mt-1">
              {booking.program.programType === 'course' ? 'Certified Course Cohort' : 'Weekend Workshop Intensive'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                booking.bookingStatus === 'confirmed'
                  ? 'success'
                  : booking.bookingStatus === 'cancelled'
                  ? 'warning'
                  : booking.bookingStatus === 'completed'
                  ? 'plum'
                  : 'neutral'
              }
              size="md"
              className="capitalize"
            >
              {booking.bookingStatus}
            </Badge>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 text-xs text-ink">
          {/* Program Header */}
          <div className="bg-canvas-warm/70 border border-border rounded-xl p-4 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gold-700 font-semibold">
              Program Selection
            </div>
            <h2 className="font-editorial text-xl font-semibold text-plum-900">
              {booking.program.title}
            </h2>
            <div className="flex flex-wrap gap-3 text-ink-muted text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold-600" />
                {booking.schedule.batch || 'Main Cohort'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                {booking.schedule.venue || booking.schedule.location || 'Kalptaru Shala'}
              </span>
              <span>•</span>
              <span className="capitalize">{booking.schedule.mode || 'In-person'}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-canvas border border-border rounded-xl p-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint block">Schedule Date</span>
              <span className="font-semibold text-plum-900 text-sm mt-0.5 block">
                {formatScheduleDate(booking)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint block">Scheduled Time</span>
              <span className="font-semibold text-plum-900 text-sm mt-0.5 block">
                {formatScheduleTime(booking)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint block">Booking ID</span>
              <span className="font-mono font-bold text-plum-900 text-sm mt-0.5 block">
                {booking.bookingReference}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint block">Created Date</span>
              <span className="font-semibold text-plum-900 text-sm mt-0.5 block">
                {new Date(booking.createdAt || booking.bookingDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint block">Dakshina / Tuition</span>
              <span className="font-semibold text-plum-900 text-sm mt-0.5 block">
                {booking.amount.displayAmount || `₹${booking.amount.total.toLocaleString()}`}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint block">Payment Status</span>
              <div className="mt-1">
                {booking.paymentStatus === 'pending' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Payment Pending
                  </span>
                ) : booking.paymentStatus === 'paid' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-50 text-purple-800 border border-purple-200 capitalize">
                    {booking.paymentStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Attendee / Student Information */}
          <div className="border border-border rounded-xl p-4 space-y-3 bg-surface">
            <div className="font-mono uppercase text-[10px] text-gold-700 font-semibold tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Student & Attendee Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-ink-muted block text-[10px]">Attendee Name:</span>
                <span className="font-medium text-plum-900">
                  {booking.attendeeDetails?.fullName || booking.student?.name || 'Registered Student'}
                </span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Email Address:</span>
                <span className="font-medium text-plum-900">
                  {booking.attendeeDetails?.email || booking.student?.email || 'N/A'}
                </span>
              </div>
              {booking.attendeeDetails?.phone && (
                <div>
                  <span className="text-ink-muted block text-[10px]">Contact Phone:</span>
                  <span className="font-medium text-plum-900">{booking.attendeeDetails.phone}</span>
                </div>
              )}
              {booking.attendeeDetails?.city && (
                <div>
                  <span className="text-ink-muted block text-[10px]">Location / City:</span>
                  <span className="font-medium text-plum-900">{booking.attendeeDetails.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Notice */}
          {booking.paymentStatus === 'pending' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <CreditCard className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-semibold">Payment Status: Payment Pending</strong>
                <p>
                  Your booking reservation has been successfully confirmed in our admissions ledger.
                  Online payment checkout (Razorpay) will be enabled in Phase 13. No payment is required right now.
                </p>
              </div>
            </div>
          )}

          {/* Cancellation Reason if cancelled */}
          {booking.cancellationReason && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
              <strong className="block font-semibold">Cancellation Reason:</strong>
              <p>{booking.cancellationReason}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-border">
            {['confirmed', 'pending'].includes(booking.bookingStatus) ? (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="text-xs font-mono text-rose-600 hover:text-rose-800 underline underline-offset-2 font-medium"
              >
                Cancel Booking Reservation
              </button>
            ) : (
              <span className="text-[11px] text-ink-muted font-mono">
                Status: {booking.bookingStatus}
              </span>
            )}

            <button
              type="button"
              onClick={() => router.push('/dashboard/bookings')}
              className="px-5 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 transition-colors shadow-soft"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-ink">
            <div className="p-6 space-y-4 text-xs">
              <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto">
                <Ban className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-editorial text-xl text-plum-900 font-semibold">
                  Cancel Booking Reservation?
                </h3>
                <p className="text-ink-muted">
                  Are you sure you wish to cancel reservation <strong>{booking.bookingReference}</strong> for{' '}
                  <em>"{booking.program.title}"</em>? Your allocated cohort seat will be released immediately.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-ink font-medium">Reason for Cancellation (Optional)</label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule clash, travel adjustments..."
                  className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  disabled={cancelLoading}
                  className="px-4 py-2 text-xs text-ink-muted hover:text-ink font-medium"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={cancelLoading}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-soft disabled:opacity-50"
                >
                  {cancelLoading ? 'Releasing Seat...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
