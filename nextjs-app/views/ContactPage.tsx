'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { LotusMotif, OrnamentalDivider } from '../components/Motifs';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [contactData, setContactData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('kalptaru_cached_institute');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.contact) return parsed.contact;
        }
      } catch {}
    }
    return {
      email: 'shuchimohan@kalptaruyogvidyalaya.com',
      phone: '09818047984',
      alternatePhone: '',
      whatsappLink: 'https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL',
      whatsappNumber: '09818047984',
      address: {
        street: 'N114 Piyush Heights, Sector 89',
        city: 'Faridabad',
        state: 'Haryana',
        postalCode: '121002',
        country: 'India',
        mapUrl: '',
      },
      hours: 'Mon – Sat: 06:00 AM – 08:00 PM',
    };
  });

  const loadContact = async () => {
    try {
      const data = await CmsService.getInstitute();
      if (data && data.contact) {
        setContactData(data.contact);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kalptaru_cached_institute', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('Could not load dynamic contact details:', err);
    }
  };

  useEffect(() => {
    loadContact();

    const handleUpdate = () => {
      loadContact();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const WHATSAPP_LINK =
    contactData.whatsappLink || 'https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL';
  const PHONE_NUMBER = contactData.phone || '09818047984';
  const ALTERNATE_PHONE = contactData.alternatePhone || '';
  const EMAIL_ADDRESS = contactData.email || 'shuchimohan@kalptaruyogvidyalaya.com';
  const PHYSICAL_ADDRESS = contactData.address?.street
    ? `${contactData.address.street}, ${contactData.address.city || 'Faridabad'}${
        contactData.address.postalCode ? ` – ${contactData.address.postalCode}` : ''
      }`
    : 'N114 Piyush Heights, Sector 89, Faridabad – 121002';
  const HOURS = contactData.hours || 'Mon – Sat: 06:00 AM – 08:00 PM';

  // Enquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    programInterest: 'general',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message or question.');
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
        throw new Error(data.message || 'Failed to submit enquiry.');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        programInterest: 'general',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please call or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* 1. Hero Header with Feelable Animated Auric Gradient */}
      <section className="relative py-20 sm:py-24 bg-plum-950 text-ivory overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center space-x-2 text-xs font-mono tracking-widest text-gold-400/80 uppercase"
            >
              <Link href="/" className="hover:text-gold-300 transition-colors">
                Home
              </Link>
              <span className="text-gold-500/60">/</span>
              <span className="text-gold-200 font-semibold">Contact</span>
            </nav>

            <div className="flex items-center">
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                Get in Touch
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 leading-tight">
              Connect with Kalptaruu Yoga Vidhyalaya
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed max-w-2xl font-light">
              Have questions about our courses, workshops or yoga programs? We&apos;re happy to help. Reach out directly for personalized guidance, enrollment assistance, and visit schedules.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Special Course & Workshop Booking Assistance Banner */}
      <section className="py-8 bg-gold-50/70 border-b border-gold-300/40">
        <Container size="wide">
          <div className="bg-gradient-to-r from-plum-950 via-plum-900 to-plum-950 rounded-2xl p-6 sm:p-10 text-ivory border border-gold-500/30 shadow-medium relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-editorial text-white font-normal">
                  Interested in a Course or Workshop?
                </h2>
                <p className="text-xs sm:text-sm text-ivory/80 font-sans leading-relaxed">
                  Contact us directly and our team will help you with availability, batch timings, personalized assessment, and fee details. We handle all admissions personally to ensure each student receives the right path.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-plum-950 font-semibold text-sm transition-all shadow-md hover:scale-[1.02]"
                >
                  <img
                    src="/whatsapp-icon.png"
                    alt="WhatsApp"
                    className="w-5 h-5 object-contain"
                  />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-4 h-4 opacity-75" />
                </a>

                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/20"
                >
                  <Phone className="w-4 h-4 text-gold-300" />
                  <span>Call Us ({PHONE_NUMBER})</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Direct Contact Details & Form Grid */}
      <section className="py-16 sm:py-20 bg-canvas">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Direct Contact Information (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest-editorial text-gold-600 font-semibold block mb-1">
                  Immediate Reach
                </span>
                <h3 className="text-2xl sm:text-3xl font-editorial text-plum-900">
                  Direct Contact Information
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                  We welcome your enquiries and are always pleased to share details regarding classical yogic practices and therapeutic programs.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* WhatsApp Community / Direct */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-xl bg-canvas-warm border border-gold-300/60 hover:border-gold-500 transition-all group shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 group-hover:scale-105 transition-transform p-2.5">
                      <img
                        src="/whatsapp-icon.png"
                        alt="WhatsApp"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-mono tracking-wider text-emerald-800 font-semibold">
                          WhatsApp Community &amp; Help
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-sm font-semibold text-plum-950 mt-1">
                        Official Kalptaruu WhatsApp Group
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        Click to join our active group for direct support, updates, and admission chats.
                      </p>
                    </div>
                  </div>
                </a>

                {/* Telephone */}
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="block p-5 rounded-xl bg-canvas-warm border border-gold-300/60 hover:border-gold-500 transition-all group shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-mono tracking-wider text-gold-700 font-semibold">
                        Direct Phone Line
                      </span>
                      <p className="text-base font-semibold text-plum-950 mt-1 font-mono">
                        {PHONE_NUMBER}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {HOURS}
                        {ALTERNATE_PHONE && (
                          <span className="block mt-0.5 text-ink-muted">
                            Alt: <span className="font-mono text-plum-900 font-medium">{ALTERNATE_PHONE}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </a>

                {/* Email Address */}
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="block p-5 rounded-xl bg-canvas-warm border border-gold-300/60 hover:border-gold-500 transition-all group shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5 text-gold-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs uppercase font-mono tracking-wider text-gold-700 font-semibold">
                        Electronic Mail
                      </span>
                      <p className="text-sm font-semibold text-plum-950 mt-1 truncate">
                        {EMAIL_ADDRESS}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        For formal correspondence, institutional invitations, and enquiries.
                      </p>
                    </div>
                  </div>
                </a>

                {/* Physical Shala Address */}
                <div className="p-5 rounded-xl bg-canvas-warm border border-gold-300/60 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200">
                      <MapPin className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-mono tracking-wider text-gold-700 font-semibold">
                        Institute Address
                      </span>
                      <p className="text-sm font-semibold text-plum-950 mt-1">
                        Kalptaruu Yoga Vidhyalaya
                      </p>
                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                        {PHYSICAL_ADDRESS}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-gold-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Hours: {HOURS}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: General Message & Enquiry Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest-editorial text-gold-600 font-semibold block mb-1">
                  Send a Message
                </span>
                <h3 className="text-2xl sm:text-3xl font-editorial text-plum-900">
                  General Enquiry Form
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                  Leave your enquiry below. Our team reviews every message and will respond promptly via phone, WhatsApp, or email.
                </p>
              </div>

              <div className="bg-canvas-warm/90 rounded-2xl p-6 sm:p-8 border border-gold-300/60 shadow-medium relative">

                {submitted ? (
                  <div className="text-center py-12 px-4 space-y-5 bg-white/70 rounded-xl border border-emerald-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-editorial text-plum-900">
                        Enquiry Received with Gratitude
                      </h4>
                      <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out. We will get back to you shortly to assist you with curriculum, batch availability, and admission questions.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-plum-950 font-semibold text-xs transition-colors"
                      >
                        <img
                          src="/whatsapp-icon.png"
                          alt="WhatsApp"
                          className="w-4 h-4 object-contain"
                        />
                        <span>Chat on WhatsApp Directly</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="px-5 py-2.5 rounded-lg bg-plum-100 hover:bg-plum-200 text-plum-950 font-medium text-xs transition-colors"
                      >
                        Send Another Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMessage && (
                      <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-plum-950 mb-1.5 uppercase font-mono tracking-wider">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full bg-white border border-gold-300/80 rounded-lg px-4 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-plum-950 mb-1.5 uppercase font-mono tracking-wider">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. ananya@example.com"
                          className="w-full bg-white border border-gold-300/80 rounded-lg px-4 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-plum-950 mb-1.5 uppercase font-mono tracking-wider">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-white border border-gold-300/80 rounded-lg px-4 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-plum-950 mb-1.5 uppercase font-mono tracking-wider">
                          Area of Interest
                        </label>
                        <select
                          value={formData.programInterest}
                          onChange={(e) => setFormData({ ...formData, programInterest: e.target.value })}
                          className="w-full bg-white border border-gold-300/80 rounded-lg px-4 py-2.5 text-xs text-ink focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        >
                          <option value="general">General Enquiry</option>
                          <option value="course">Yoga Courses / Certification</option>
                          <option value="workshop">Workshops &amp; Special Sessions</option>
                          <option value="corporate">Corporate / Institutional Program</option>
                          <option value="membership">Daily Practice / Shala Membership</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-plum-950 mb-1.5 uppercase font-mono tracking-wider">
                        Message / Query <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you would like to know about our courses, schedule, or prerequisites..."
                        className="w-full bg-white border border-gold-300/80 rounded-lg px-4 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <p className="text-[11px] text-ink-muted leading-tight">
                        We value your privacy. Your details are used strictly to reply to your enquiry.
                      </p>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-plum-900 hover:bg-plum-800 disabled:opacity-60 text-gold-300 font-semibold text-xs transition-colors shadow-soft shrink-0"
                      >
                        {submitting ? (
                          <span>Sending Enquiry...</span>
                        ) : (
                          <>
                            <span>Send Enquiry</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Guarantees / Quality Notice: Placed right under the form */}
              <div className="p-5 sm:p-6 rounded-2xl bg-plum-950 text-ivory/90 border border-gold-500/30 shadow-soft space-y-2.5">
                <div className="flex items-center gap-2.5 text-gold-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wider font-mono">
                    Our Teaching Commitment
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-ivory/85 leading-relaxed">
                  Every participant is guided with individualized attention. We do not use automated enrollment bots or online payment gateways—our teachers verify your physical needs before enrolling you.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Bottom Decorative Flourish */}
      <div className="py-6 bg-canvas border-t border-border/60">
        <OrnamentalDivider className="opacity-40" />
      </div>
    </div>
  );
};

export default ContactPage;
