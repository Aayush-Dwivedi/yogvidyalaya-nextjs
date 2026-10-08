'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { LinkButton } from '../components/LinkButton';
import { LotusMotif, CornerFlourish } from '../components/Motifs';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import { CmsFounder } from '../types/cms';
import {
  Award,
  GraduationCap,
  Sparkles,
  Quote,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const FounderPage: React.FC = () => {
  const [founder, setFounder] = useState<CmsFounder | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFounder = async () => {
    try {
      const founders = await CmsService.getFounders('published');
      if (founders && founders.length > 0) {
        // First founder is the Institute Founder
        setFounder(founders[0]);
      }
    } catch (err) {
      console.warn('Could not load founder data from CMS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFounder();

    const handleUpdate = () => {
      loadFounder();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const name = founder?.name || 'Mrs. Shuchi Mohan';
  const title = founder?.designation || founder?.title || 'Physiotherapist & Therapeutic Yoga Consultant';
  const bio =
    founder?.biography ||
    founder?.bio ||
    'My professional journey began in Physiotherapy, where I developed clinical expertise in rehabilitation and patient care. Over time, my interest in holistic healing led me toward Yoga Therapy and its integrative applications.\n\nI further expanded my practice during my professional tenure at Morarji Desai National Institute of Yoga (MDNIY), where I gained institutional exposure through yoga therapy sessions and wellness programs conducted for uniformed personnel, along with engagements associated with various government ministries.\n\nMy work has also included invited wellness sessions and live programs in association with NCERT, as well as participation in national and international conferences and institutional events. I now carry this integrated approach of Physiotherapy and Yoga forward through my independent institute, Kalptaruu Yoga Vidhyalaya.';

  const quote =
    founder?.quote ||
    founder?.message ||
    'The photographs and lineage featured here reflect decades of professional physiotherapy and institutional yoga experience dedicated to holistic recovery.';

  const photoUrl =
    (typeof founder?.image === 'string' ? founder.image : founder?.image?.url) ||
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=85';

  const experienceYears = founder?.experienceYears || 15;

  const qualifications =
    founder?.qualifications && founder.qualifications.length > 0
      ? founder.qualifications
      : [
          'Physiotherapist (Clinical Rehabilitation Specialist)',
          'Therapeutic Yoga Consultant',
          'Former Practitioner at Morarji Desai National Institute of Yoga (MDNIY)',
          'NCERT Live Program Resource Expert',
        ];

  const achievements =
    founder?.achievements && founder.achievements.length > 0
      ? founder.achievements
      : [
          'Yoga therapy & wellness programs for uniformed personnel at MDNIY',
          'Invited wellness sessions & live programs in association with NCERT',
          'Participation in national and international conferences & institutional events',
          'Founder & Lead Instructor of Kalptaruu Yoga Vidhyalaya',
        ];

  const specializations =
    founder?.specializations && founder.specializations.length > 0
      ? founder.specializations
      : [
          'Therapeutic Yoga Therapy',
          'Physiotherapy & Musculoskeletal Rehabilitation',
          'Post-Cancer Recovery & Lymphatic Wellness',
          'Thyroid, Back Pain & Spinal Special Care',
        ];

  return (
    <div className="w-full flex flex-col bg-canvas-warm">
      {/* 1. Header Banner with Feelable Animated Auric Gradient */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-plum-950 text-white overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6 text-center lg:text-left">
              {/* Breadcrumb Navigation */}
              <nav
                aria-label="Breadcrumb"
                className="flex items-center justify-center lg:justify-start space-x-2 text-xs font-mono tracking-widest text-gold-400/80 uppercase"
              >
                <Link href="/" className="hover:text-gold-300 transition-colors">
                  Home
                </Link>
                <span className="text-gold-500/60">/</span>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  About
                </Link>
                <span className="text-gold-500/60">/</span>
                <span className="text-gold-200 font-semibold">Founder</span>
              </nav>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-mono tracking-widest uppercase self-center lg:self-start">
                <span>Founder Stewardship &amp; Lineage</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 tracking-tight leading-[1.1]">
                {name}
              </h1>

              <p className="text-base sm:text-xl text-gold-300 font-sans font-medium">
                {title}
              </p>

              <p className="text-sm sm:text-base text-ivory/85 font-sans leading-relaxed max-w-2xl font-light">
                Bridging traditional yogic sadhana with modern evidence-based clinical rehabilitation. Dedicated to authentic, sustainable physical and psychological wellness.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-plum-900/90 border border-gold-400/30 text-xs font-mono text-gold-300 shadow-xs">
                  <Award className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{experienceYears}+ Years Clinical &amp; Yogic Practice</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-plum-900/90 border border-gold-400/30 text-xs font-mono text-gold-300 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>MDNIY &amp; NCERT Experience</span>
                </div>
              </div>
            </div>

            {/* Right Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[390px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gold-400/60 shadow-[0_0_50px_rgba(218,165,59,0.25)] bg-plum-900 p-2">
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-xl filter brightness-95"
                />
                <div className="absolute top-4 left-4 pointer-events-none">
                  <CornerFlourish position="top-left" className="text-gold-400" />
                </div>
                <div className="absolute bottom-4 right-4 pointer-events-none">
                  <CornerFlourish position="bottom-right" className="text-gold-400" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Philosophy Quote Strip */}
      {quote && (
        <section className="py-10 bg-canvas border-b border-border">
          <Container size="narrow" className="text-center">
            <Quote className="w-8 h-8 text-gold-600 mx-auto mb-3 opacity-60" />
            <p className="text-sm sm:text-lg font-editorial italic text-plum-950 leading-relaxed">
              "{quote}"
            </p>
            <span className="block mt-2 text-xs font-mono uppercase tracking-wider text-gold-800 font-semibold">
              — {name}
            </span>
          </Container>
        </section>
      )}

      {/* 3. Biography & Core Journey */}
      <section className="py-16 sm:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Journey Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest-editorial text-gold-700 font-semibold">
                  Professional Journey &amp; Calling
                </span>
                <h2 className="text-2xl sm:text-4xl font-editorial font-bold text-plum-900">
                  Integrative Physiotherapy &amp; Yoga Therapy
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-ink-muted leading-relaxed font-sans font-light">
                {bio.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Specializations Pills */}
              <div className="pt-4 space-y-3">
                <h3 className="text-xs uppercase font-mono tracking-wider text-plum-950 font-bold">
                  Core Clinical Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg bg-surface border border-gold-300 text-xs text-plum-900 font-medium shadow-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Consultation CTA Buttons (Aligned & Proportioned) */}
              <div className="pt-6 flex flex-wrap items-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-plum-950 font-sans font-semibold text-xs sm:text-sm shadow-soft hover:from-gold-200 hover:to-gold-300 hover:scale-[1.02] transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Connect with Mrs. Shuchi Mohan</span>
                </a>

                <a
                  href="/trainers"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-plum-900/30 hover:border-gold-500 text-plum-900 bg-white hover:bg-gold-50/50 font-sans font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer whitespace-nowrap group"
                >
                  <span>View All Faculty Members</span>
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Right: Qualifications & Institutional Engagements (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Credentials Card */}
              <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-10 h-10 rounded-xl bg-plum-50 border border-plum-200 flex items-center justify-center text-plum-900">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-plum-900">
                      Credentials &amp; Training
                    </h3>
                    <p className="text-[11px] text-ink-muted font-sans">
                      Academic, clinical, and institutional qualifications
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {qualifications.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-ink font-sans">
                      <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Institutional Engagements Card */}
              <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-800">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-plum-900">
                      Institutional Experience
                    </h3>
                    <p className="text-[11px] text-ink-muted font-sans">
                      Recognitions and key national programs
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-ink font-sans">
                      <Sparkles className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FounderPage;
