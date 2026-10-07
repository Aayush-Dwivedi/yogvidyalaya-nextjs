'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingService } from '../../services/bookingService';
import { Booking, BookingProgramType, ProgramScheduleOption } from '../../types/booking';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  X,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Info,
  Loader2,
} from 'lucide-react';

export interface BookingProgramTarget {
  id: string;
  type: BookingProgramType;
  title: string;
  subtitle?: string;
  price?: {
    amount: number;
    currency?: string;
    displayPrice?: string;
    isFree?: boolean;
  };
  duration?: string;
  mode?: string;
  schedule?: string;
  date?: string;
  time?: string;
  venue?: string;
  capacity?: {
    total: number;
    enrolled?: number;
    booked?: number;
  };
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: BookingProgramTarget | null;
  onBookingSuccess?: (booking: Booking) => void;
}

type FlowStep = 'form' | 'review' | 'confirmation';

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  program,
  onBookingSuccess,
}) => {
  const router = useRouter();

  // Active step
  const [step, setStep] = useState<FlowStep>('form');

  // Dynamic schedules from server
  const [schedules, setSchedules] = useState<ProgramScheduleOption[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');

  // Selected schedule values
  const [selectedBatch, setSelectedBatch] = useState<string>('Morning Batch');
  const [selectedTime, setSelectedTime] = useState<string>('06:00 AM – 08:30 AM');
  const [selectedMode, setSelectedMode] = useState<string>('in-person');
  const [selectedVenue, setSelectedVenue] = useState<string>('Kalptaruu Shala');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Visitor Details (No login required)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Initialize or reset whenever modal opens or program changes
  useEffect(() => {
    if (isOpen && program) {
      setStep('form');
      setFormError(null);
      setSubmitError(null);
      setConfirmedBooking(null);
      setCopiedRef(false);

      if (program.type === 'course') {
        setSelectedBatch(program.schedule || 'Morning Gurukula Batch');
        setSelectedTime(program.time || '06:00 AM – 08:30 AM');
        setSelectedMode(program.mode || 'in-person');
        setSelectedVenue('Kalptaruu Shala');
        setSelectedDate('');
      } else {
        setSelectedBatch('Workshop Immersion');
        setSelectedTime(program.time || '09:00 AM – 05:00 PM');
        setSelectedMode(program.mode || 'in-person');
        setSelectedVenue(program.venue || 'Sacred Grove Pavilion');
        if (program.date) {
          try {
            setSelectedDate(new Date(program.date).toISOString().split('T')[0]);
          } catch {
            setSelectedDate('');
          }
        }
      }

      // Fetch dynamic schedules from database
      setLoadingSchedules(true);
      BookingService.getProgramSchedules(program.type, program.id)
        .then((res) => {
          if (res?.schedules && res.schedules.length > 0) {
            setSchedules(res.schedules);
            const available = res.schedules.find((s) => !s.isFull) || res.schedules[0];
            if (available) {
              setSelectedScheduleId(available.id);
              setSelectedBatch(available.batch);
              setSelectedTime(
                available.time ||
                  (available.startTime ? `${available.startTime} – ${available.endTime}` : '06:00 AM – 08:30 AM')
              );
              setSelectedMode(available.mode || 'in-person');
              setSelectedVenue(available.venue || available.location || 'Kalptaruu Shala');
              if (available.date) {
                try {
                  setSelectedDate(new Date(available.date).toISOString().split('T')[0]);
                } catch {
                  // ignore
                }
              }
            }
          }
        })
        .catch((err) => {
          console.warn('Could not load program schedules:', err);
        })
        .finally(() => {
          setLoadingSchedules(false);
        });
    }
  }, [isOpen, program]);

  if (!isOpen || !program) return null;

  // Real-time capacity checks
  const activeSchedule = schedules.find((s) => s.id === selectedScheduleId);
  const totalCapacity = activeSchedule
    ? activeSchedule.totalCapacity
    : program.capacity?.total || (program.type === 'course' ? 30 : 25);
  const remainingSeats = activeSchedule
    ? activeSchedule.availableSeats
    : Math.max(0, totalCapacity - ((program.type === 'course' ? program.capacity?.enrolled : program.capacity?.booked) || 0));
  const isFullyBooked = activeSchedule ? activeSchedule.isFull : remainingSeats <= 0;

  // Validate form before advancing to Review
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError('Please enter a valid phone number (at least 8 digits).');
      return;
    }

    setStep('review');
  };

  // Submit booking request
  const handleSubmitBooking = async () => {
    setSubmitError(null);
    setSubmitting(true);

    try {
      const schedulePayload: any = {
        scheduleId: selectedScheduleId || undefined,
        batch: selectedBatch,
        time: selectedTime,
        mode: selectedMode,
        venue: selectedVenue,
      };

      if (selectedDate || program.date) {
        schedulePayload.date = selectedDate || program.date;
      }

      const booking = await BookingService.createBooking({
        programType: program.type,
        programId: program.id,
        schedule: schedulePayload,
        attendeeDetails: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          age: age ? parseInt(age, 10) : undefined,
          city: city.trim() || undefined,
          message: message.trim() || undefined,
        },
        notes: message.trim() || undefined,
      });

      setConfirmedBooking(booking);
      setStep('confirmation');
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
    } catch (err: any) {
      setSubmitError(
        err.message || 'We could not submit your booking request. The session may be full or already requested.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (confirmedBooking?.bookingReference) {
      navigator.clipboard.writeText(confirmedBooking.bookingReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-plum-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-surface border border-gold-500/20 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-plum-950 text-ivory px-6 py-4 flex items-center justify-between border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Kalptaruu Yoga Vidhyalaya Logo"
              className="w-9 h-9 rounded-full object-cover shadow-soft shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400/90 font-semibold block">
                {program.type === 'course' ? 'Course Booking Request' : 'Workshop Booking Request'}
              </span>
              <h2 className="font-editorial text-lg text-white font-normal truncate max-w-md">
                {program.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ivory/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Simple Indicator */}
        <div className="bg-canvas-warm/70 px-6 py-3 border-b border-border flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'form'
                  ? 'bg-plum-900 text-gold-300'
                  : 'bg-gold-500/20 text-gold-800'
              }`}
            >
              1
            </span>
            <span className={step === 'form' ? 'text-plum-900 font-semibold' : 'text-ink-muted'}>
              Booking Details
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'review'
                  ? 'bg-plum-900 text-gold-300'
                  : step === 'confirmation'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-canvas text-ink-faint'
              }`}
            >
              2
            </span>
            <span className={step === 'review' ? 'text-plum-900 font-semibold' : 'text-ink-muted'}>
              Review
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'confirmation'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-canvas text-ink-faint'
              }`}
            >
              3
            </span>
            <span className={step === 'confirmation' ? 'text-emerald-700 font-semibold' : 'text-ink-muted'}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-ink">
          {/* ========================================================================= */}
          {/* STEP 1: BOOKING FORM                                                      */}
          {/* ========================================================================= */}
          {step === 'form' && (
            <form onSubmit={handleProceedToReview} className="space-y-5 text-xs">
              {/* Capacity Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isFullyBooked
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-gold-50/70 border-gold-200 text-plum-900'
                }`}
              >
                <Users className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs sm:text-sm">
                    {isFullyBooked ? 'Cohort Currently Full' : `${remainingSeats} Seats Available`}
                  </div>
                  <p className="text-[11px] text-ink-muted">
                    {isFullyBooked
                      ? 'Maximum capacity reached for this batch. You may still submit a request to be placed on the waitlist.'
                      : `Batch size is limited to ${totalCapacity} students for dedicated personalized guidance.`}
                  </p>
                </div>
              </div>

              {/* Schedule Selection if available */}
              {schedules.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Choose Preferred Schedule &amp; Timing
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {schedules.map((sched) => {
                      const isSelected = selectedScheduleId === sched.id;
                      return (
                        <button
                          key={sched.id}
                          type="button"
                          disabled={sched.isFull}
                          onClick={() => {
                            setSelectedScheduleId(sched.id);
                            setSelectedBatch(sched.batch);
                            setSelectedTime(sched.time || `${sched.startTime} – ${sched.endTime}`);
                            setSelectedMode(sched.mode);
                            setSelectedVenue(sched.venue || sched.location || 'Kalptaruu Shala');
                            if (sched.date) {
                              try {
                                setSelectedDate(new Date(sched.date).toISOString().split('T')[0]);
                              } catch {
                                // ignore
                              }
                            }
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            sched.isFull
                              ? 'border-border/60 bg-canvas/60 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'border-gold-500 bg-gold-50/50 shadow-sm ring-2 ring-gold-400/20'
                              : 'border-border bg-canvas hover:border-gold-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1 gap-1">
                            <span className="font-semibold text-xs text-plum-900 truncate">
                              {sched.batch}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                                sched.isFull
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {sched.isFull ? 'Full' : `${sched.availableSeats} left`}
                            </span>
                          </div>
                          <div className="text-[11px] text-ink-muted space-y-0.5">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gold-600 shrink-0" />
                              <span>{sched.time || (sched.startTime ? `${sched.startTime} – ${sched.endTime}` : 'Scheduled')}</span>
                            </div>
                            {sched.date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gold-600 shrink-0" />
                                <span>{new Date(sched.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Visitor Contact Fields */}
              <div className="space-y-3.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-ink font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-ink font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-ink font-medium mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-ink font-medium mb-1">Age (Optional)</label>
                    <input
                      type="number"
                      min={8}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-ink font-medium mb-1">City (Optional)</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Delhi NCR"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">
                    Message or Health Inquiries (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any specific questions, prior yoga experience, or health concerns..."
                    className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-canvas-warm/70 border border-border rounded-xl flex items-start gap-2.5 text-[11px] text-ink-muted">
                <Info className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                <p>
                  No payment or account creation is required to submit a booking request. Our admissions team will contact you directly to confirm your schedule and enrollment.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-ink-muted hover:text-ink font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-soft"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: REVIEW                                                            */}
          {/* ========================================================================= */}
          {step === 'review' && (
            <div className="space-y-5 text-xs">
              <div className="text-center space-y-1">
                <h3 className="font-editorial text-xl text-plum-900 font-medium">
                  Review Your Booking Request
                </h3>
                <p className="text-xs text-ink-muted">
                  Please verify your information before submitting.
                </p>
              </div>

              {submitError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Booking Notice</strong>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-canvas border border-border rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
                <div className="flex justify-between items-start border-b border-border/70 pb-2.5">
                  <span className="text-ink-muted">Selected Program</span>
                  <span className="font-semibold text-plum-900 text-right">{program.title}</span>
                </div>

                <div className="flex justify-between items-start border-b border-border/70 pb-2.5">
                  <span className="text-ink-muted">Batch / Schedule</span>
                  <span className="font-medium text-ink text-right">{selectedBatch}</span>
                </div>

                <div className="flex justify-between items-start border-b border-border/70 pb-2.5">
                  <span className="text-ink-muted">Timing &amp; Mode</span>
                  <span className="font-medium text-ink text-right">
                    {selectedTime} ({selectedMode})
                  </span>
                </div>

                {selectedDate && (
                  <div className="flex justify-between items-start border-b border-border/70 pb-2.5">
                    <span className="text-ink-muted">Date</span>
                    <span className="font-medium text-ink text-right">
                      {new Date(selectedDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start border-b border-border/70 pb-2.5">
                  <span className="text-ink-muted">Your Contact</span>
                  <div className="text-right">
                    <span className="font-semibold text-ink block">{fullName}</span>
                    <span className="text-ink-muted text-[11px] block">{email} • {phone}</span>
                    {(city || age) && (
                      <span className="text-ink-muted text-[11px] block">
                        {[city, age ? `Age ${age}` : null].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {message && (
                  <div className="flex justify-between items-start border-b border-border/70 pb-2.5">
                    <span className="text-ink-muted">Message</span>
                    <span className="text-ink italic text-right max-w-xs">{message}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-plum-900">Tuition / Dakshina</span>
                  <span className="font-editorial text-lg font-bold text-plum-900">
                    {program.price?.displayPrice ||
                      (program.price?.amount
                        ? `₹${program.price.amount.toLocaleString()}`
                        : 'Complimentary')}
                  </span>
                </div>
              </div>

              {/* Reassurance */}
              <div className="p-3 bg-canvas-warm/70 border border-border rounded-xl flex items-start gap-2.5 text-xs text-ink-muted">
                <Info className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                <p>
                  Upon submission, you will receive a unique booking reference number. Kalptaruu Yoga Vidhyalaya will contact you directly regarding your enrollment and payment.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs text-ink-muted hover:text-ink font-medium"
                >
                  ← Edit Details
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitBooking}
                  className="bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-soft"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-300" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Booking Request</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: CONFIRMATION SCREEN                                               */}
          {/* ========================================================================= */}
          {step === 'confirmation' && confirmedBooking && (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-soft">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-semibold">
                  Booking Request Received
                </span>
                <h3 className="font-editorial text-2xl text-plum-900 font-medium">
                  Thank you, {fullName}.
                </h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Your request has been received successfully. A confirmation email has been dispatched to <strong className="text-plum-900">{email}</strong>.
                </p>
              </div>

              {/* Reference Box */}
              <div className="bg-canvas border-2 border-gold-400/40 rounded-2xl p-4 max-w-sm mx-auto shadow-sm">
                <span className="text-[10px] font-mono uppercase text-ink-muted block">
                  Booking Reference Number
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-plum-900 tracking-wider">
                    {confirmedBooking.bookingReference}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="p-1.5 rounded-lg hover:bg-surface border border-border text-ink-muted hover:text-plum-900 transition-colors"
                    title="Copy reference code"
                  >
                    {copiedRef ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {copiedRef && (
                  <span className="text-[11px] text-emerald-700 font-mono mt-1 block">
                    Copied to clipboard!
                  </span>
                )}
              </div>

              {/* Summary Card */}
              <div className="bg-canvas-warm/70 border border-border rounded-xl p-4 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between items-start border-b border-border/70 pb-2">
                  <span className="text-ink-muted">Program:</span>
                  <span className="font-semibold text-plum-900 text-right">{confirmedBooking.program.title}</span>
                </div>
                <div className="flex justify-between items-start border-b border-border/70 pb-2">
                  <span className="text-ink-muted">Batch &amp; Timing:</span>
                  <span className="font-medium text-ink text-right">
                    {confirmedBooking.schedule.batch} ({confirmedBooking.schedule.time})
                  </span>
                </div>
                <div className="flex justify-between items-start border-b border-border/70 pb-2">
                  <span className="text-ink-muted">Attendee:</span>
                  <span className="font-medium text-ink text-right">{fullName} ({phone})</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-ink-muted">Status:</span>
                  <span className="font-mono text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">
                    Request Received
                  </span>
                </div>
              </div>

              {/* Next Steps Message */}
              <div className="p-3 bg-canvas border border-border rounded-xl text-left text-xs text-ink-muted max-w-lg mx-auto flex items-start gap-2.5">
                <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <p>
                  We will contact you shortly via phone or email regarding your enrollment, batch orientation, and payment details.
                </p>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-8 py-2.5 rounded-xl text-xs transition-all shadow-soft"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
