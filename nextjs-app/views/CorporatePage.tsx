'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import { CmsCorporateProgram } from '../types/cms';
import { LoadingState } from '../components/LoadingState';
import {
  Briefcase,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  Layers,
  HeartPulse,
  Brain,
  Award,
} from 'lucide-react';

const DEFAULT_CORPORATE_PROGRAMS: CmsCorporateProgram[] = [
  {
    _id: 'corp-1',
    title: 'Executive Postural Realignment & Ergonomics',
    slug: 'executive-postural-realignment',
    tagline: 'Combat Desk Fatigue & Decompress Spinal Tension',
    shortDescription:
      'A structured clinical and yogic intervention designed specifically for screen-intensive teams suffering from cervical stiffness, lower back compression, and postural fatigue.',
    description:
      'Combining physiotherapy biomechanics with traditional sukshma vyayama and asana alignment. Conducted on-site at your workplace or dedicated shala sessions.',
    format: 'on-site',
    duration: '6 Weeks (12 Masterclasses)',
    targetAudience: 'Software Engineers, Desk Workers, Senior Leadership',
    deliverables: [
      'Desk-side ergonomic posture audit & individual correction',
      'Daily 15-minute desk mobility sequences for teams',
      'Physiotherapist-designed lumbar & cervical release sessions',
      'Pre- & post-program employee musculoskeletal pain survey',
    ],
    modules: [
      {
        title: 'Cervical & Scapular Decompression',
        duration: '60 Mins',
        description: 'Targeted release of trapezius tightness and forward-head posture correction.',
      },
      {
        title: 'Lumbar Stabilization & Core Pelvic Alignment',
        duration: '60 Mins',
        description: 'Strengthening the posterior chain to prevent chronic lower-back degeneration.',
      },
    ],
    pricingModel: 'custom-quote',
    startingPrice: { amount: 35000, currency: 'INR' },
    status: 'published',
    featured: true,
    order: 1,
  },
  {
    _id: 'corp-2',
    title: 'Autonomic Nervous System Reset & Executive Breathwork',
    slug: 'executive-breathwork-stress-reset',
    tagline: 'Science-Backed Stress Reduction & High-Pressure Calm',
    shortDescription:
      'Targeted pranayama protocols that scientifically activate the parasympathetic nervous system, lowering cortisol, reducing burnout, and sharpening focus under deadlines.',
    description:
      'Designed for fast-paced corporate environments where cognitive fatigue and acute stress hinder decision making. Delivered through live interactive hybrid or virtual masterclasses.',
    format: 'hybrid',
    duration: '4 Weeks (8 Live Cohort Sessions)',
    targetAudience: 'High-Growth Tech Startups, C-Suite, Financial Traders',
    deliverables: [
      'Vagal nerve stimulation and deep diaphragm breath mechanics',
      'Instant 3-minute nervous system down-regulation tools for meetings',
      'Curated audio breath tracks for daily employee morning practice',
      'Sleep hygiene and circadian restoration guidelines',
    ],
    modules: [
      {
        title: 'Pranayama Biomechanics & Vagal Nerve Activation',
        duration: '50 Mins',
        description: 'Shifting from sympathetic fight-or-flight into parasympathetic calm.',
      },
      {
        title: 'Yoga Nidra for Deep Cognitive Recovery',
        duration: '45 Mins',
        description: 'Guided non-sleep deep rest (NSDR) for rapid mental reset during high workload.',
      },
    ],
    pricingModel: 'fixed-package',
    startingPrice: { amount: 28000, currency: 'INR' },
    status: 'published',
    featured: true,
    order: 2,
  },
  {
    _id: 'corp-3',
    title: 'Executive Leadership Silence & Sadhana Retreat',
    slug: 'executive-leadership-sadhana-retreat',
    tagline: 'Immersive Offsite for Mental Stillness & Strategic Vision',
    shortDescription:
      'A bespoke weekend residential immersion away from digital noise, combining sacred yogic kriyas, mindful silence (mouna), nature sadhana, and purposeful leadership alignment.',
    description:
      'Tailored for executive committees, founders, and managing directors seeking deep inner rejuvenation and clarity away from corporate distractions.',
    format: 'retreat',
    duration: '3 Days / 2 Nights Residential',
    targetAudience: 'Founders, Board Members, Senior Directors',
    deliverables: [
      'Private nature-immersed shala setting with organic sattvic cuisine',
      'Guided early-morning Surya sadhana and deep meditation kriyas',
      'Mindful digital detox and structured silent contemplative walks',
      'Confidential one-on-one postural and lifestyle consultations',
    ],
    modules: [
      {
        title: 'Mouna (Silent Awareness) & Mental De-cluttering',
        duration: 'Half Day',
        description: 'Cultivating strategic stillness through prolonged absence of digital chatter.',
      },
      {
        title: 'Sadhana for Visionary Leadership',
        duration: '90 Mins',
        description: 'Translating yogic clarity, equanimity, and dharma into organizational decision making.',
      },
    ],
    pricingModel: 'custom-quote',
    startingPrice: { amount: 95000, currency: 'INR' },
    status: 'published',
    featured: true,
    order: 3,
  },
];

export const CorporatePage: React.FC = () => {
  const [programs, setPrograms] = useState<CmsCorporateProgram[]>(DEFAULT_CORPORATE_PROGRAMS);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('all');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const data = await CmsService.getCorporatePrograms('published');
        if (data && data.length > 0) {
          setPrograms(data);
        }
      } catch (err) {
        console.warn('Using default corporate programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();

    window.addEventListener('kalptaru-cms-updated', fetchPrograms);
    window.addEventListener('storage', fetchPrograms);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', fetchPrograms);
      window.removeEventListener('storage', fetchPrograms);
    };
  }, []);

  const filteredPrograms = programs.filter((p) => {
    if (selectedFormat === 'all') return true;
    return p.format === selectedFormat;
  });

  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* 1. Hero Header */}
      <section className="relative py-20 sm:py-28 bg-plum-950 text-ivory overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            {/* Centered Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center space-x-2 text-xs font-mono tracking-widest text-gold-400/80 uppercase mb-2"
            >
              <Link href="/" className="hover:text-gold-300 transition-colors">
                Home
              </Link>
              <span className="text-gold-500/60">/</span>
              <Link href="/programs" className="hover:text-gold-300 transition-colors">
                Programs
              </Link>
              <span className="text-gold-500/60">/</span>
              <span className="text-gold-200 font-semibold">Corporate</span>
            </nav>

            <div className="flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                Executive & Workplace Well-Being
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 leading-tight">
              Corporate Yogic Wellness
            </h1>

            <p className="text-base sm:text-lg text-ivory/80 font-sans font-light max-w-2xl mx-auto leading-relaxed">
              Tailored workplace wellness programs, ergonomic posture alignment, and autonomic stress mitigation sessions designed for modern organizations.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-gold-500 text-plum-950 font-semibold text-sm hover:bg-gold-400 transition-all shadow-gold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Request Corporate Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#packages"
                className="px-6 py-3 rounded-full border border-ivory/30 text-ivory hover:border-gold-400 hover:text-gold-200 text-sm transition-all bg-plum-900/30"
              >
                Explore Packages
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Institutional Pillars for Corporate Teams */}
      <section className="py-20 bg-canvas-warm border-b border-earth-100">
        <Container size="wide" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-gold-600 font-semibold">
              The Kalptaru Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-editorial text-plum-950">
              Why Forward-Thinking Enterprises Choose Us
            </h2>
            <p className="text-sm sm:text-base text-ink-muted">
              We move beyond generic corporate fitness routines to deliver medically aligned, physiotherapist-grounded yogic sadhana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: HeartPulse,
                title: 'Ergonomic & Spinal Health',
                desc: 'Targeted correction for sedentary desk strain, cervical compression, and postural fatigue.',
              },
              {
                icon: Brain,
                title: 'Vagal Tone & Stress Reset',
                desc: 'Pranayama techniques that scientifically down-regulate cortisol and combat burnout.',
              },
              {
                icon: Sparkles,
                title: 'Peak Cognitive Clarity',
                desc: 'Yogic focus protocols that enhance strategic decision-making and sustained attention spans.',
              },
              {
                icon: Users,
                title: 'Team Cohesion & Morale',
                desc: 'Shared mindful experiences that dismantle workplace friction and nurture collaborative energy.',
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-surface border border-earth-200/80 shadow-sm hover:shadow-md hover:border-gold-400/40 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-editorial font-bold text-plum-950">
                  {pillar.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Live Corporate Programs Grid */}
      <section id="packages" className="py-24 bg-canvas">
        <Container size="wide" className="space-y-12">
          {/* Header & Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-earth-200">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-gold-600 font-semibold">
                Modular Offerings
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial text-plum-950 mt-1">
                Corporate Program Packages
              </h2>
            </div>

            {/* Format Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Formats' },
                { id: 'on-site', label: 'On-Site' },
                { id: 'hybrid', label: 'Hybrid' },
                { id: 'retreat', label: 'Executive Retreat' },
                { id: 'virtual', label: 'Virtual' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    selectedFormat === fmt.id
                      ? 'bg-plum-950 text-gold-300 font-semibold shadow-sm'
                      : 'bg-surface border border-earth-200 text-ink-muted hover:border-gold-400 hover:text-plum-950'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <LoadingState message="Loading corporate packages..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((pkg) => (
                <div
                  key={pkg._id || pkg.id}
                  className="rounded-2xl bg-surface border border-earth-200 shadow-sm hover:shadow-xl hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-7 sm:p-8 space-y-5">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-gold-50 border border-gold-200 text-gold-800">
                        {pkg.format}
                      </span>
                      {pkg.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-ink-muted font-mono">
                          <Clock className="w-3.5 h-3.5 text-gold-600" />
                          <span>{pkg.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-editorial font-bold text-plum-950 group-hover:text-gold-700 transition-colors">
                        {pkg.title}
                      </h3>
                      {pkg.tagline && (
                        <p className="text-xs text-gold-700 font-sans font-medium mt-1">
                          {pkg.tagline}
                        </p>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-sm text-ink-muted leading-relaxed">
                      {pkg.shortDescription}
                    </p>

                    {/* Target Audience */}
                    {pkg.targetAudience && (
                      <div className="flex items-center gap-2 text-xs text-plum-900 bg-plum-50/70 p-2.5 rounded-xl border border-plum-100">
                        <Users className="w-4 h-4 text-plum-700 shrink-0" />
                        <span>Audience: <strong>{pkg.targetAudience}</strong></span>
                      </div>
                    )}

                    {/* Key Deliverables Bullet Points */}
                    {pkg.deliverables && pkg.deliverables.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-earth-100">
                        <div className="text-xs font-mono font-semibold text-plum-950 uppercase tracking-wider">
                          Key Deliverables:
                        </div>
                        <ul className="space-y-1.5">
                          {pkg.deliverables.slice(0, 4).map((del, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-xs text-ink-muted">
                              <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Footer with Price & Action */}
                  <div className="p-7 sm:p-8 pt-4 bg-canvas-warm border-t border-earth-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-mono text-ink-muted uppercase">
                        Investment
                      </div>
                      <div className="text-sm font-semibold text-plum-950">
                        {pkg.startingPrice?.amount ? (
                          <>From ₹{pkg.startingPrice.amount.toLocaleString()}</>
                        ) : (
                          'Custom Proposal'
                        )}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="px-5 py-2.5 rounded-xl bg-plum-950 text-gold-300 font-semibold text-xs hover:bg-gold-500 hover:text-plum-950 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Enquire for Team</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 4. Enterprise Stats & Credibility */}
      <section className="py-20 bg-plum-950 text-ivory border-t border-gold-500/20">
        <Container size="wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gold-500/20">
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-editorial font-bold text-gold-300">
                10,000+
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ivory/70">
                Professionals Trained
              </div>
            </div>
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-editorial font-bold text-gold-300">
                98%
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ivory/70">
                Stress Mitigation Index
              </div>
            </div>
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-editorial font-bold text-gold-300">
                100%
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ivory/70">
                Physiotherapist Guided
              </div>
            </div>
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-editorial font-bold text-gold-300">
                50+
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ivory/70">
                Corporate Cohorts
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Consultation & Direct Contact Redirection */}
      <section className="py-20 bg-earth-50 border-t border-earth-200">
        <Container size="default" className="text-center space-y-6">
          <span className="text-xs uppercase font-mono tracking-widest text-gold-600 font-semibold">
            Institutional Inquiries & Proposals
          </span>
          <h2 className="text-2xl sm:text-4xl font-editorial text-plum-950 max-w-2xl mx-auto">
            Ready to Design a Custom Wellness Initiative for Your Organization?
          </h2>
          <p className="text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
            Reach out directly to our institutional coordinators for customized corporate proposals, shala workshops, and executive wellness consultations.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-plum-950 text-gold-300 hover:bg-gold-500 hover:text-plum-950 font-semibold text-sm transition-all shadow-gold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Go to Contact Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CorporatePage;
