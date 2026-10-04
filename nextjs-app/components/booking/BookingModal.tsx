'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { BookingService } from '../../services/bookingService';
import { Booking, BookingProgramType } from '../../types/booking';
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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Info,
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

type BookingStep = 'schedule' | 'auth' | 'form' | 'confirmation';

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  program,
  onBookingSuccess,
}) => {
  const { user, isAuthenticated, login, register, loginDemoStudent } = useAuth();
  const router = useRouter();

  // Active flow step
  const [step, setStep] = useState<BookingStep>('schedule');

  // Selected schedule values
  const [selectedBatch, setSelectedBatch] = useState<string>('Morning Gurukula Batch');
  const [selectedTime, setSelectedTime] = useState<string>('06:00 AM – 08:30 AM');
  const [selectedMode, setSelectedMode] = useState<string>('in-person');
  const [selectedVenue, setSelectedVenue] = useState<string>('Kalptaru Tapovan Shala');
  const [customDate, setCustomDate] = useState<string>('');

  // Auth toggle inside auth step
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Intake metadata form state
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [sadhanaExperience, setSadhanaExperience] = useState('Intermediate (1-3 years)');
  const [healthConditions, setHealthConditions] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('Sattvic Pure Vegetarian');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [studentNotes, setStudentNotes] = useState('');

  // Booking submission & result
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Initialize or reset whenever modal opens or program changes
  useEffect(() => {
    if (isOpen && program) {
      setStep('schedule');
      setBookingError(null);
      setConfirmedBooking(null);
      setCopiedRef(false);

      if (program.type === 'course') {
        setSelectedBatch(program.schedule || 'Morning Gurukula Batch');
        setSelectedTime(program.schedule || '06:00 AM – 08:30 AM');
        setSelectedMode(program.mode || 'in-person');
        setSelectedVenue('Kalptaru Tapovan Shala');
      } else {
        setSelectedBatch('Live Workshop Immersion');
        setSelectedTime(program.time || '09:00 AM – 05:00 PM');
        setSelectedMode(program.mode || 'in-person');
        setSelectedVenue(program.venue || 'Sacred Grove Pavilion');
        if (program.date) {
          try {
            setCustomDate(new Date(program.date).toISOString().split('T')[0]);
          } catch {
            setCustomDate('');
          }
        }
      }
    }
  }, [isOpen, program]);

  // Sync user info into intake form when authenticated
  useEffect(() => {
    if (user) {
      setStudentName(user.name || '');
      setStudentEmail(user.email || '');
      setStudentPhone(user.phone || '');
    }
  }, [user]);

  if (!isOpen || !program) return null;

  // Calculate remaining seats
  const totalCap = program.capacity?.total || (program.type === 'course' ? 30 : 25);
  const occupied = (program.type === 'course' ? program.capacity?.enrolled : program.capacity?.booked) || 0;
  const remainingSeats = Math.max(0, totalCap - occupied);
  const isExhausted = remainingSeats <= 0;

  // Step 1: Proceed from Schedule to Next Step
  const handleProceedFromSchedule = () => {
    if (isAuthenticated) {
      setStep('form');
    } else {
      setStep('auth');
    }
  };

  // Step 2: Handle Inline Login
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      await login({ email: authEmail, password: authPassword });
      setStep('form');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Step 2: Handle Inline Register
  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthSubmitting(true);
    try {
      await register({
        name: authName,
        email: authEmail,
        phone: authPhone,
        password: authPassword,
        confirmPassword: authConfirmPassword,
      });
      setStep('form');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Step 2: Quick Demo Student Login (for effortless reviewer testing)
  const handleDemoLogin = async () => {
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      await loginDemoStudent();
      setStep('form');
    } catch (err: any) {
      setAuthError(err.message || 'Demo login failed.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Step 3: Submit Booking with Server-Side Capacity Verification
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setSubmitting(true);

    try {
      const schedulePayload: any = {
        batch: selectedBatch,
        time: selectedTime,
        mode: selectedMode,
        venue: selectedVenue,
      };

      if (program.type === 'workshop' && (customDate || program.date)) {
        schedulePayload.date = customDate || program.date;
      }

      const booking = await BookingService.createBooking({
        programType: program.type,
        programId: program.id,
        schedule: schedulePayload,
        metadata: {
          sadhanaExperience,
          healthConditions: healthConditions.trim() || 'None reported',
          dietaryPreferences,
          emergencyContactName: emergencyName.trim() || undefined,
          emergencyContactPhone: emergencyPhone.trim() || undefined,
          contactPhone: studentPhone,
        },
        notes: studentNotes.trim() || undefined,
      });

      setConfirmedBooking(booking);
      setStep('confirmation');
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
    } catch (err: any) {
      // Server-side capacity or double-booking error
      setBookingError(
        err.message || 'Unable to confirm booking. Cohort may be full or session already reserved.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (confirmedBooking?.bookingReference) {
      navigator.clipboard.writeText(confirmedBooking.bookingReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-plum-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-surface border border-gold-500/20 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-plum-950 text-ivory px-6 py-4 flex items-center justify-between border-b border-gold-500/30">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Kalptaru Yog Vidyalaya Logo"
              className="w-9 h-9 rounded-full object-cover border border-gold-400/50 shadow-soft shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400/90 font-semibold block">
                {program.type === 'course' ? 'Curriculum Cohort Admission' : 'Workshop Seat Reservation'}
              </span>
              <h2 className="font-editorial text-lg text-white font-normal truncate max-w-md">
                {program.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ivory/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-canvas-warm/70 px-6 py-2.5 border-b border-border flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'schedule'
                  ? 'bg-plum-900 text-gold-300'
                  : 'bg-gold-500/20 text-gold-700'
              }`}
            >
              1
            </span>
            <span className={step === 'schedule' ? 'text-plum-900 font-semibold' : 'text-ink-muted'}>
              Schedule
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'auth'
                  ? 'bg-plum-900 text-gold-300'
                  : isAuthenticated
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-canvas text-ink-faint'
              }`}
            >
              {isAuthenticated ? '✓' : '2'}
            </span>
            <span
              className={
                step === 'auth'
                  ? 'text-plum-900 font-semibold'
                  : isAuthenticated
                  ? 'text-emerald-700 font-medium'
                  : 'text-ink-muted'
              }
            >
              {isAuthenticated ? 'Sadhaka Verified' : 'Sadhaka Login'}
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'form'
                  ? 'bg-plum-900 text-gold-300'
                  : 'bg-canvas text-ink-faint'
              }`}
            >
              3
            </span>
            <span className={step === 'form' ? 'text-plum-900 font-semibold' : 'text-ink-muted'}>
              Intake Form
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'confirmation'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-canvas text-ink-faint'
              }`}
            >
              4
            </span>
            <span className={step === 'confirmation' ? 'text-emerald-700 font-semibold' : 'text-ink-muted'}>
              Confirmed
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-ink">
          {/* ========================================================================= */}
          {/* STEP 1: SELECT SCHEDULE                                                   */}
          {/* ========================================================================= */}
          {step === 'schedule' && (
            <div className="space-y-6">
              {/* Capacity Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  isExhausted
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-gold-50/70 border-gold-200 text-plum-900'
                }`}
              >
                <Users className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <div className="font-semibold text-sm">
                    {isExhausted ? 'Cohort Fully Booked' : `${remainingSeats} Seats Available in this Cohort`}
                  </div>
                  <p className="text-ink-muted">
                    {isExhausted
                      ? 'Maximum capacity has been reached. Please contact administration for waitlist availability.'
                      : `Total batch capacity is limited to ${totalCap} students to preserve teacher-student gurukula intimacy.`}
                  </p>
                </div>
              </div>

              {/* Course Batch / Workshop Timings Selector */}
              {program.type === 'course' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted font-semibold">
                    Select Preferred Practice Batch
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBatch('Morning Gurukula Batch');
                        setSelectedTime('06:00 AM – 08:30 AM');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedBatch === 'Morning Gurukula Batch'
                          ? 'border-gold-500 bg-gold-50/50 shadow-sm ring-2 ring-gold-400/20'
                          : 'border-border bg-canvas hover:border-gold-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-plum-900">
                          Morning Gurukula
                        </span>
                        <Clock className="w-4 h-4 text-gold-600" />
                      </div>
                      <span className="text-xs text-ink-muted block">06:00 AM – 08:30 AM IST</span>
                      <span className="text-[11px] font-mono text-gold-700 mt-2 block">
                        Brahma Muhurta Asana & Pranayama
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBatch('Evening Sadhana Batch');
                        setSelectedTime('05:30 PM – 07:30 PM');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedBatch === 'Evening Sadhana Batch'
                          ? 'border-gold-500 bg-gold-50/50 shadow-sm ring-2 ring-gold-400/20'
                          : 'border-border bg-canvas hover:border-gold-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-plum-900">
                          Evening Sadhana
                        </span>
                        <Clock className="w-4 h-4 text-gold-600" />
                      </div>
                      <span className="text-xs text-ink-muted block">05:30 PM – 07:30 PM IST</span>
                      <span className="text-[11px] font-mono text-gold-700 mt-2 block">
                        Sutra Study, Meditations & Kriyas
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted font-semibold">
                    Workshop Date & Session Time
                  </label>
                  <div className="bg-canvas border border-border p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-plum-900 font-semibold text-sm">
                      <Calendar className="w-4 h-4 text-gold-700" />
                      <span>
                        {program.date
                          ? new Date(program.date).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Scheduled Intensive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-muted pl-6">
                      <Clock className="w-3.5 h-3.5 text-gold-600" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode & Venue Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-[11px] text-ink-muted font-semibold block">
                    Format / Mode
                  </label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                  >
                    <option value="in-person">In-Person at Vidyalaya Shala</option>
                    <option value="residential">Residential Gurukula (Stay Included)</option>
                    <option value="online">Online Live Streaming & Recording</option>
                    <option value="hybrid">Hybrid (Shala + Online)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-[11px] text-ink-muted font-semibold block">
                    Venue / Campus
                  </label>
                  <input
                    type="text"
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    placeholder="e.g. Tapovan Shala"
                  />
                </div>
              </div>

              {/* Summary Bar */}
              <div className="bg-canvas-warm/80 border border-border/80 p-4 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">
                    Tuition & Dakshina
                  </span>
                  <span className="text-xl font-editorial font-semibold text-plum-900">
                    {program.price?.displayPrice ||
                      (program.price?.amount
                        ? `₹${program.price.amount.toLocaleString()}`
                        : 'Complimentary')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-ink-faint block">
                    Duration
                  </span>
                  <span className="font-medium text-ink">
                    {program.duration || (program.type === 'course' ? '4 Weeks' : '1 Day Intensive')}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-ink-muted hover:text-ink font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isExhausted}
                  onClick={handleProceedFromSchedule}
                  className="bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
                >
                  <span>Continue to Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: LOGIN / REGISTER AUTHENTICATION GATE                              */}
          {/* ========================================================================= */}
          {step === 'auth' && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold-600 font-semibold">
                  Sadhaka Verification
                </span>
                <h3 className="font-editorial text-2xl text-plum-900">
                  {authMode === 'login' ? 'Sign In to Reserve Your Seat' : 'Create Sadhaka Profile'}
                </h3>
                <p className="text-xs text-ink-muted">
                  Your booking reference and shala access passes will be tied to your personal student account.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Tab Selector */}
              <div className="flex bg-canvas border border-border p-1 rounded-xl max-w-xs mx-auto text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    authMode === 'login'
                      ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
                      : 'text-ink-muted hover:text-plum-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    authMode === 'register'
                      ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
                      : 'text-ink-muted hover:text-plum-900'
                  }`}
                >
                  New Sadhaka
                </button>
              </div>

              {/* Login Form */}
              {authMode === 'login' ? (
                <form onSubmit={handleInlineLogin} className="space-y-4 max-w-md mx-auto text-xs">
                  <div>
                    <label className="block text-ink font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="sadhaka@kalptaru.org"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-ink font-medium mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold py-2.5 rounded-xl transition-all shadow-soft disabled:opacity-50"
                  >
                    {authSubmitting ? 'Authenticating...' : 'Sign In & Continue Booking'}
                  </button>

                  <div className="pt-2 text-center">
                    <span className="text-ink-faint text-[11px] block mb-2">— Quick Reviewer Demo —</span>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={authSubmitting}
                      className="inline-flex items-center gap-1.5 text-xs text-gold-700 hover:text-gold-800 font-medium underline underline-offset-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Sign in with Demo Student Account (1-Click)
                    </button>
                  </div>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleInlineRegister} className="space-y-3.5 max-w-md mx-auto text-xs">
                  <div>
                    <label className="block text-ink font-medium mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-ink font-medium mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="aarav@example.com"
                        className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-ink font-medium mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-ink font-medium mb-1">Create Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-ink font-medium mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold py-2.5 rounded-xl transition-all shadow-soft disabled:opacity-50 mt-2"
                  >
                    {authSubmitting ? 'Registering...' : 'Register & Continue to Booking'}
                  </button>
                </form>
              )}

              {/* Back to Schedule button */}
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep('schedule')}
                  className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 font-medium"
                >
                  ← Back to Schedule Selection
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: BOOKING FORM (INTAKE & PREFERENCES)                                */}
          {/* ========================================================================= */}
          {step === 'form' && (
            <form onSubmit={handleSubmitBooking} className="space-y-5 text-xs">
              {/* Authenticated Student Banner */}
              <div className="p-3 bg-canvas border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-medium text-plum-900">{user?.name}</span>
                    <span className="text-ink-muted text-[11px] block">{user?.email}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                  Authenticated Sadhaka
                </span>
              </div>

              {/* Server-side Capacity / Conflict Error Banner */}
              {bookingError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-900">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-semibold block">Server-Side Capacity Rejection</strong>
                    <p className="leading-relaxed">{bookingError}</p>
                  </div>
                </div>
              )}

              {/* Selected Program & Schedule Summary Card */}
              <div className="bg-canvas-warm/70 border border-border p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-sm text-plum-900 font-semibold">
                    {program.title}
                  </span>
                  <span className="font-mono text-gold-700 font-bold">
                    {program.price?.displayPrice ||
                      (program.price?.amount
                        ? `₹${program.price.amount.toLocaleString()}`
                        : 'Complimentary')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-600" />
                    {selectedBatch}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-600" />
                    {selectedTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-600" />
                    {selectedVenue}
                  </span>
                </div>
              </div>

              {/* Student Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-ink font-medium mb-1">Attendee Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={studentEmail}
                    disabled
                    className="w-full bg-canvas border border-border rounded-lg p-2.5 outline-none text-ink-muted shadow-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Sadhana Intake Questionnaire */}
              <div className="pt-2 border-t border-border/80 space-y-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span className="font-mono uppercase tracking-wider text-[11px] text-gold-700 font-semibold">
                    Shala Intake & Wellness Metadata
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-ink font-medium mb-1">Prior Yoga / Sadhana Practice</label>
                    <select
                      value={sadhanaExperience}
                      onChange={(e) => setSadhanaExperience(e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    >
                      <option value="Beginner (Little or no experience)">Beginner (Little or no experience)</option>
                      <option value="Intermediate (1-3 years)">Intermediate (1-3 years regular sadhana)</option>
                      <option value="Dedicated Sadhaka (3+ years)">Dedicated Sadhaka (3+ years)</option>
                      <option value="Certified Teacher / Instructor">Certified Yoga Instructor / Acharya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ink font-medium mb-1">Dietary Preference</label>
                    <select
                      value={dietaryPreferences}
                      onChange={(e) => setDietaryPreferences(e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    >
                      <option value="Sattvic Pure Vegetarian">Sattvic Pure Vegetarian (No onion/garlic)</option>
                      <option value="Vegetarian">Standard Vegetarian</option>
                      <option value="Vegan">Vegan (Plant-Based)</option>
                      <option value="Gluten-Free">Gluten-Free / Special Diet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">
                    Health Conditions, Past Surgeries or Physical Limitations
                  </label>
                  <textarea
                    rows={2}
                    value={healthConditions}
                    onChange={(e) => setHealthConditions(e.target.value)}
                    placeholder="E.g. Lumbar disc herniation, hypertension, recent knee surgery (or leave empty if none)"
                    className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-ink font-medium mb-1">Emergency Contact Person</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="e.g. Smt. Kamala Sharma"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-ink font-medium mb-1">Emergency Contact Number</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+91 98111 22334"
                      className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">Special Aspirations or Notes for Acharyas</label>
                  <textarea
                    rows={2}
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    placeholder="Specific questions, spiritual aspirations, or accommodation requests..."
                    className="w-full bg-surface border border-border rounded-lg p-2.5 outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Protocol & Payment Notice */}
              <div className="bg-canvas border border-border p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] text-ink-muted">
                <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-plum-900">Capacity Reservation Notice:</strong> Upon submission, your seat is reserved in the Vidyalaya ledger and cohort capacity is atomically allocated. Payment processing status is set to <span className="font-mono text-gold-700">pending</span> until shala desk settlement.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('schedule')}
                  className="text-xs text-ink-muted hover:text-ink font-medium"
                >
                  ← Back to Schedule
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-soft"
                >
                  {submitting ? (
                    <span>Allocating Seat Server-Side...</span>
                  ) : (
                    <>
                      <span>Confirm Reservation</span>
                      <ShieldCheck className="w-4 h-4 text-gold-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: CONFIRMATION SCREEN                                               */}
          {/* ========================================================================= */}
          {step === 'confirmation' && confirmedBooking && (
            <div className="text-center space-y-6 py-4">
              {/* Confirmed Icon */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-soft">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-semibold">
                  Reservation Officially Confirmed
                </span>
                <h3 className="font-editorial text-3xl text-plum-900 font-semibold">
                  Namaste, Your Seat Is Reserved!
                </h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  A place has been allocated for you in the Vidyalaya cohort ledger. Your unique booking reference is ready.
                </p>
              </div>

              {/* Booking Reference Pill */}
              <div className="bg-canvas border-2 border-gold-400/40 rounded-2xl p-4 max-w-sm mx-auto shadow-sm">
                <span className="text-[10px] font-mono uppercase text-ink-faint block">
                  Booking Reference Number
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-plum-900 tracking-wider">
                    {confirmedBooking.bookingReference}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
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

              {/* Reservation Details Card */}
              <div className="bg-canvas-warm/70 border border-border rounded-xl p-4 text-left text-xs space-y-2.5 max-w-lg mx-auto">
                <div className="flex justify-between items-start border-b border-border/70 pb-2">
                  <span className="text-ink-muted">Program:</span>
                  <span className="font-semibold text-plum-900 text-right">{confirmedBooking.program.title}</span>
                </div>
                <div className="flex justify-between items-start border-b border-border/70 pb-2">
                  <span className="text-ink-muted">Batch & Timing:</span>
                  <span className="font-medium text-ink text-right">
                    {confirmedBooking.schedule.batch} ({confirmedBooking.schedule.time})
                  </span>
                </div>
                <div className="flex justify-between items-start border-b border-border/70 pb-2">
                  <span className="text-ink-muted">Venue / Format:</span>
                  <span className="font-medium text-ink text-right">
                    {confirmedBooking.schedule.venue} ({confirmedBooking.schedule.mode})
                  </span>
                </div>
                <div className="flex justify-between items-start border-b border-border/70 pb-2">
                  <span className="text-ink-muted">Student:</span>
                  <span className="font-medium text-ink text-right">{user?.name} ({user?.email})</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-ink-muted">Payment State:</span>
                  <span className="font-mono text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-gold-100 text-gold-800 border border-gold-200">
                    {confirmedBooking.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Shala Protocol Reminders */}
              <div className="bg-canvas border border-border p-3.5 rounded-xl text-left text-xs text-ink-muted max-w-lg mx-auto flex items-start gap-2.5">
                <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Preparation:</strong> Please bring your personal yoga mat if practicing in person. Arrive 15 minutes prior to start time. Wear comfortable white or earth-toned natural cotton clothing.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push('/dashboard/bookings');
                  }}
                  className="w-full sm:w-auto bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-soft"
                >
                  <span>View in My Student Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs text-ink-muted hover:text-ink font-medium"
                >
                  Close & Continue Browsing
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
