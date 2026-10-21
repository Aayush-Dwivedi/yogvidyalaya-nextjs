'use client';

import React, { useState } from 'react';
import { Container } from '../../components/Container';
import { useToast } from '../../components/Toast';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export interface EnquirySectionProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  defaultInterest?: 'course' | 'workshop' | 'corporate' | 'membership' | 'general';
}

export const EnquirySection: React.FC<EnquirySectionProps> = ({
  id = 'enquiry-section',
  className = '',
  title = 'Begin Your Yogic Journey with Us',
  subtitle = 'Submit your inquiry directly to our database. Our senior yoga acharyas and admissions team review every submission and connect with you personally.',
  defaultInterest = 'general',
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    programInterest: defaultInterest,
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [enquiryRefId, setEnquiryRefId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      const msg = 'Please provide your full name so our admissions team knows who to address.';
      setErrorMessage(msg);
      toast.error('Full Name Required', msg);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      const msg = 'Please enter a valid email address (e.g. name@example.com).';
      setErrorMessage(msg);
      toast.error('Valid Email Required', msg);
      return;
    }

    if (!formData.message.trim()) {
      const msg = 'Please describe your query or program of interest before submitting.';
      setErrorMessage(msg);
      toast.error('Inquiry Details Missing', msg);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit enquiry. Please try again.');
      }

      setSubmitted(true);
      toast.success('Inquiry Submitted!', 'Our admissions coordinators review the database continuously and will connect with you.');
      if (data.data?.id) {
        setEnquiryRefId(String(data.data.id).slice(-6).toUpperCase());
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        programInterest: defaultInterest,
        message: '',
      });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const msg = errObj?.message || 'Could not connect to the database. Please verify your connection.';
      setErrorMessage(msg);
      toast.error('Submission Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id={id}
      className={`py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-[#180617] via-[#240620] to-[#180617] text-ivory border-t border-gold-500/25 ${className}`}
    >
      {/* ─── Ambient Glow Layers ─── */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-plum-600/20 blur-3xl pointer-events-none" />

      {/* Subtle Sacred Motif Accent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
        <svg className="w-[700px] h-[700px] text-gold-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="46" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="36" strokeWidth="0.5" />
          <polygon points="50,14 79,66 21,66" strokeWidth="0.5" />
          <polygon points="50,86 79,34 21,34" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="16" strokeWidth="0.5" />
        </svg>
      </div>

      <Container className="relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-mono font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Direct Admissions &amp; Enquiries</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ivory font-normal tracking-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-ivory/75 font-sans font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Form and Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Institutional Assurances & Quick Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#2A0725]/70 backdrop-blur-md border border-gold-400/30 shadow-card space-y-5">
              <div className="flex items-center gap-2 text-gold-400">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                  Direct Database Submission
                </span>
              </div>

              <h3 className="font-editorial text-xl sm:text-2xl text-gold-100 font-normal">
                How Your Inquiry is Handled
              </h3>

              <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans">
                Your details are recorded directly in our institutional system. We never route submissions through public mail links or external email apps.
              </p>

              <div className="space-y-3 pt-2 border-t border-gold-500/20 text-xs text-ivory/85">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                    ✓
                  </div>
                  <span>Direct intake into our admissions ledger with guaranteed follow-up.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                    ✓
                  </div>
                  <span>Personalized guidance for TTC, holistic wellness, or daily sadhana.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                    ✓
                  </div>
                  <span>Zero spam, strict privacy, and immediate WhatsApp assistance.</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              <div className="p-4 rounded-xl bg-plum-950/60 border border-gold-500/20 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0 border border-gold-400/30">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gold-400 font-semibold">
                    Admissions Helpline
                  </div>
                  <a
                    href="tel:09818047984"
                    className="text-xs sm:text-sm font-semibold text-ivory hover:text-gold-300 transition-colors font-mono"
                  >
                    09818047984
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-plum-950/60 border border-gold-500/20 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0 border border-gold-400/30">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gold-400 font-semibold">
                    Consultation Hours
                  </div>
                  <div className="text-xs text-ivory/80 font-sans">
                    Mon – Sat: 06:00 AM – 08:00 PM
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-plum-950/60 border border-gold-500/20 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <img
                    src="/whatsapp-icon.png"
                    alt="WhatsApp"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                    Prefer WhatsApp?
                  </div>
                  <a
                    href="https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold-300 hover:text-gold-200 underline font-medium inline-flex items-center gap-1"
                  >
                    <span>Join Community Channel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Database Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-9 rounded-2xl bg-[#1F071D]/90 backdrop-blur-xl border border-gold-400/35 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_25px_rgba(218,165,59,0.12)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />

              {submitted ? (
                /* Success State Card */
                <div className="text-center py-10 px-4 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 mx-auto flex items-center justify-center shadow-soft">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
                      {enquiryRefId ? `Reference #${enquiryRefId} Logged` : 'Inquiry Logged'}
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl text-gold-100 font-normal">
                      Namaste! Inquiry Received
                    </h3>
                    <p className="text-xs sm:text-sm text-ivory/80 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been stored securely in our institutional database. Our team will review your details and reach out via phone or WhatsApp shortly.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-full bg-gold-400 text-plum-950 hover:bg-gold-300 font-semibold text-xs transition-colors shadow-soft cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                    <a
                      href="https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gold-400/40 text-gold-200 hover:bg-gold-500/10 text-xs font-semibold transition-colors"
                    >
                      <span>Connect on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Main Interactive Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-400/40 text-rose-200 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-gold-300 font-semibold">
                        Full Name <span className="text-gold-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full bg-[#2A0725]/70 border border-gold-400/30 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all font-sans"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-gold-300 font-semibold">
                        Email Address <span className="text-gold-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ananya@example.com"
                        className="w-full bg-[#2A0725]/70 border border-gold-400/30 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Phone / WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-gold-300 font-semibold">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98180 47984"
                        className="w-full bg-[#2A0725]/70 border border-gold-400/30 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all font-mono"
                      />
                    </div>

                    {/* Program of Interest */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-gold-300 font-semibold">
                        Area of Interest
                      </label>
                      <select
                        value={formData.programInterest}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            programInterest: e.target.value as any,
                          })
                        }
                        className="w-full bg-[#2A0725] border border-gold-400/30 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ivory focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all font-sans cursor-pointer"
                      >
                        <option value="general" className="bg-plum-950 text-ivory">General Yoga Inquiry</option>
                        <option value="course" className="bg-plum-950 text-ivory">Teacher Training Courses (TTC)</option>
                        <option value="workshop" className="bg-plum-950 text-ivory">Upcoming Workshops &amp; Retreats</option>
                        <option value="corporate" className="bg-plum-950 text-ivory">Corporate Wellness Programs</option>
                        <option value="membership" className="bg-plum-950 text-ivory">Shala Sadhana Membership</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gold-300 font-semibold">
                      Your Message or Questions <span className="text-gold-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please let us know your requirements, preferred batch timings, or specific health goals..."
                      className="w-full bg-[#2A0725]/70 border border-gold-400/30 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all font-sans resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-ivory/60">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                      <span>Direct database storage &bull; No email client required</span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-plum-950 font-semibold text-xs sm:text-sm hover:from-gold-200 hover:to-gold-300 transition-all shadow-modal hover:shadow-[0_0_22px_rgba(218,165,59,0.5)] cursor-pointer disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to Database...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EnquirySection;
