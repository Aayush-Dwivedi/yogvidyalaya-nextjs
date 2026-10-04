'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { BookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import {
  Calendar,
  MapPin,
  Info,
  Clock,
  Ban,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await BookingService.getMyBookings();
      setBookings(res.items || []);
    } catch (err: any) {
      console.warn('Could not fetch real bookings, showing empty state or errors:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    setActionError(null);
    setCancelLoading(true);

    try {
      const updated = await BookingService.cancelBooking(
        cancellingBooking._id,
        cancelReason.trim() || 'Cancelled by student request'
      );
      setActionSuccess(`Reservation ${updated.bookingReference} has been cancelled successfully.`);
      setCancellingBooking(null);
      setCancelReason('');
      fetchBookings();
    } catch (err: any) {
      setActionError(err.message || 'Failed to cancel booking reservation.');
    } finally {
      setCancelLoading(false);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.bookingStatus === filter;
  });

  if (loading) {
    return <LoadingState message="Loading your shala and workshop bookings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
            Practice Schedule & Enrolment
          </span>
          <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
            My Bookings
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Manage your booked shala slots, certified course cohorts, and weekend workshop entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchBookings}
            className="p-2 bg-surface border border-border rounded-lg text-ink-muted hover:text-plum-900 transition-colors shadow-xs"
            title="Refresh bookings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
                filter === 'all'
                  ? 'bg-plum-900 text-gold-400 font-semibold'
                  : 'text-ink-muted hover:text-plum-900'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
                filter === 'confirmed'
                  ? 'bg-plum-900 text-gold-400 font-semibold'
                  : 'text-ink-muted hover:text-plum-900'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
                filter === 'pending'
                  ? 'bg-plum-900 text-gold-400 font-semibold'
                  : 'text-ink-muted hover:text-plum-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
                filter === 'cancelled'
                  ? 'bg-plum-900 text-gold-400 font-semibold'
                  : 'text-ink-muted hover:text-plum-900'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-rose-700 hover:text-rose-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Shala Protocol Note */}
      <div className="bg-canvas border border-border p-4 rounded-xl flex items-start gap-3 text-xs text-ink">
        <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-plum-900">Shala Protocol & Check-in:</strong> Please arrive 15 minutes before your session. Present your Booking Reference code at the reception desk. Empty stomach recommended (at least 2.5 hours after meals).
        </div>
      </div>

      {/* Bookings Table */}
      {filtered.length > 0 ? (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs" aria-label="My Bookings Table">
              <thead>
                <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3.5 px-4 font-semibold">Reference</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Program</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Batch & Schedule</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Venue / Mode</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Amount & Payment</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filtered.map((bkg) => (
                  <tr key={bkg._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-plum-900 text-xs">
                        {bkg.bookingReference}
                      </span>
                      <div className="text-[10px] text-ink-faint">
                        {new Date(bkg.bookingDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-plum-900 max-w-[200px] truncate">
                        {bkg.program.title}
                      </div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-gold-50 border border-gold-200 text-gold-800">
                        {bkg.program.programType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-ink">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gold-600" />
                        <span>{bkg.schedule.batch || 'Main Batch'}</span>
                      </div>
                      <div className="text-[11px] text-ink-faint mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-ink-faint" />
                        <span>{bkg.schedule.time || 'Scheduled Time'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span className="truncate max-w-[150px]">
                          {bkg.schedule.venue || 'Kalptaru Shala'}
                        </span>
                      </div>
                      <div className="text-[10px] text-ink-faint capitalize pl-4">
                        {bkg.schedule.mode || 'In-person'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          bkg.bookingStatus === 'confirmed'
                            ? 'success'
                            : bkg.bookingStatus === 'cancelled'
                            ? 'warning'
                            : bkg.bookingStatus === 'completed'
                            ? 'plum'
                            : 'neutral'
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {bkg.bookingStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-plum-900">
                        {bkg.amount.displayAmount || `₹${bkg.amount.total.toLocaleString()}`}
                      </div>
                      <div className="text-[10px] font-mono text-ink-faint uppercase">
                        Pay: {bkg.paymentStatus}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(bkg)}
                        className="text-[11px] font-mono text-gold-700 hover:text-gold-900 underline underline-offset-2"
                      >
                        Details
                      </button>

                      {['confirmed', 'pending'].includes(bkg.bookingStatus) && (
                        <button
                          type="button"
                          onClick={() => {
                            setCancellingBooking(bkg);
                            setActionError(null);
                          }}
                          className="text-[11px] font-mono text-rose-600 hover:text-rose-800 underline underline-offset-2"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Bookings Found"
          description="You do not have any active or past reservations matching this filter. Explore our courses or workshops to reserve your seat."
          action={
            <a
              href="/programs/courses"
              className="inline-flex items-center px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 transition-colors shadow-soft"
            >
              Browse Courses
            </a>
          }
        />
      )}

      {/* ========================================================================= */}
      {/* BOOKING DETAILS MODAL                                                     */}
      {/* ========================================================================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-plum-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface border border-gold-500/20 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-ink">
            <div className="bg-plum-950 text-ivory px-6 py-4 flex items-center justify-between border-b border-gold-500/30">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                  Booking Summary
                </span>
                <h3 className="font-editorial text-lg text-white font-normal">
                  {selectedBooking.bookingReference}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-ivory/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="bg-canvas-warm/70 border border-border rounded-xl p-3.5 space-y-1.5">
                <div className="font-editorial text-base font-semibold text-plum-900">
                  {selectedBooking.program.title}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-ink-muted">
                  <span>Batch: {selectedBooking.schedule.batch}</span>
                  <span>•</span>
                  <span>Time: {selectedBooking.schedule.time}</span>
                  <span>•</span>
                  <span>Venue: {selectedBooking.schedule.venue}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-canvas border border-border rounded-xl p-3.5 text-xs">
                <div>
                  <span className="text-ink-faint block uppercase text-[10px] font-mono">Booking Status</span>
                  <span className="font-semibold capitalize text-plum-900">{selectedBooking.bookingStatus}</span>
                </div>
                <div>
                  <span className="text-ink-faint block uppercase text-[10px] font-mono">Payment State</span>
                  <span className="font-semibold capitalize text-plum-900">{selectedBooking.paymentStatus}</span>
                </div>
                <div>
                  <span className="text-ink-faint block uppercase text-[10px] font-mono">Total Investment</span>
                  <span className="font-semibold text-plum-900">
                    {selectedBooking.amount.displayAmount || `₹${selectedBooking.amount.total.toLocaleString()}`}
                  </span>
                </div>
                <div>
                  <span className="text-ink-faint block uppercase text-[10px] font-mono">Registered On</span>
                  <span className="font-semibold text-plum-900">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Intake & Questionnaire Metadata */}
              {selectedBooking.metadata && Object.keys(selectedBooking.metadata).length > 0 && (
                <div className="border border-border rounded-xl p-3.5 space-y-2 bg-surface">
                  <div className="font-mono uppercase text-[10px] text-gold-700 font-semibold tracking-wider">
                    Intake & Health Notes
                  </div>
                  {selectedBooking.metadata.sadhanaExperience && (
                    <div>
                      <span className="text-ink-muted">Prior Experience:</span>{' '}
                      <span className="font-medium text-plum-900">{selectedBooking.metadata.sadhanaExperience}</span>
                    </div>
                  )}
                  {selectedBooking.metadata.dietaryPreferences && (
                    <div>
                      <span className="text-ink-muted">Dietary Preference:</span>{' '}
                      <span className="font-medium text-plum-900">{selectedBooking.metadata.dietaryPreferences}</span>
                    </div>
                  )}
                  {selectedBooking.metadata.healthConditions && (
                    <div>
                      <span className="text-ink-muted">Health Limitations:</span>{' '}
                      <span className="font-medium text-plum-900">{selectedBooking.metadata.healthConditions}</span>
                    </div>
                  )}
                  {selectedBooking.metadata.emergencyContactName && (
                    <div>
                      <span className="text-ink-muted">Emergency Contact:</span>{' '}
                      <span className="font-medium text-plum-900">
                        {selectedBooking.metadata.emergencyContactName} ({selectedBooking.metadata.emergencyContactPhone})
                      </span>
                    </div>
                  )}
                </div>
              )}

              {selectedBooking.cancellationReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-0.5">
                  <strong className="block font-semibold">Cancellation Note:</strong>
                  <p>{selectedBooking.cancellationReason}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-canvas border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCELLATION CONFIRMATION MODAL                                           */}
      {/* ========================================================================= */}
      {cancellingBooking && (
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
                  Are you sure you wish to cancel reservation <strong>{cancellingBooking.bookingReference}</strong> for{' '}
                  <em>"{cancellingBooking.program.title}"</em>? Your allocated cohort seat will be released immediately.
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
                  onClick={() => setCancellingBooking(null)}
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
};

export default BookingsView;
