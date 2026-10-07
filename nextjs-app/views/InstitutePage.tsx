'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { AuricBackground } from '../components/AuricBackground';
import { LotusMotif, CornerFlourish, KalptaruTree } from '../components/Motifs';
import { CmsService } from '../services/cmsService';
import {
  Award,
  Sparkles,
  BookOpen,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  GraduationCap,
  Activity,
  Layers,
  Compass,
} from 'lucide-react';

export interface InstitutePageProps {
  initialData?: any;
}

export const InstitutePage: React.FC<InstitutePageProps> = ({ initialData }) => {
  const [institute, setInstitute] = useState<any>(() => {
    if (initialData) return initialData;
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('kalptaru_cached_institute');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.name) return parsed;
        }
      } catch {}
    }
    return null;
  });

  const loadData = async () => {
    try {
      const data = await CmsService.getInstitute();
      if (data) {
        setInstitute(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kalptaru_cached_institute', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('Could not load dynamic institute data:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Dynamic field extractions with polished fallbacks
  const name = institute?.name || 'Kalptaruu Yoga Vidhyalaya';
  const tagline =
    institute?.tagline ||
    'Where Timeless Vedic Lineage Meets Modern Rehabilitative Science';
  const eyebrow =
    institute?.eyebrow || 'Sanctuary of Traditional Yoga & Clinical Physiotherapy';
  const affiliation =
    institute?.affiliationText || 'Affiliated with Indian Yoga Association (IYA)';
  const establishedYear = institute?.establishedYear || 2011;
  const legacyYears = `${new Date().getFullYear() - establishedYear}+ Years Legacy`;

  const description =
    institute?.description ||
    'Affiliated by the Indian Yoga Association (IYA), Kalptaruu Yoga Vidhyalaya was founded by Mrs. Shuchi Mohan (Senior Physiotherapist & Therapeutic Yoga Consultant, Former Resource Expert at MDNIY). We offer comprehensive certification courses, therapeutic rehabilitation programs, and lifestyle disease reversal rooted in classical Patanjali traditions and anatomy-conscious physiotherapy.';

  const stats = [
    {
      val: institute?.stats?.[0]?.value || '5000+',
      lbl: institute?.stats?.[0]?.label || 'Happy Students & Seekers',
    },
    {
      val: institute?.stats?.[1]?.value || '15+',
      lbl: institute?.stats?.[1]?.label || 'Years Institutional Legacy',
    },
    {
      val: institute?.stats?.[2]?.value || '100%',
      lbl: institute?.stats?.[2]?.label || 'Personalized Care & Guidance',
    },
    {
      val: institute?.stats?.[3]?.value || 'Multiple',
      lbl: institute?.stats?.[3]?.label || 'Accredited Programs Offered',
    },
  ];

  const storyHistory =
    institute?.history ||
    'Founded with a sacred mission to make yoga both accessible and medically safe, Kalptaruu Yoga Vidhyalaya was established to counteract the commercial dilution of classical yoga. Under the visionary stewardship of Mrs. Shuchi Mohan, the institute uniquely integrates authentic Hatha and Ashtanga yoga disciplines with rigorous clinical physiotherapy knowledge.';

  const storyPhilosophy =
    institute?.philosophy ||
    'Rooted in the Ashtanga and Hatha traditions of Patanjali and the ancient Natha lineage, we honor yoga not merely as physical postures, but as a comprehensive spiritual science of self-realization.';

  const mission =
    institute?.mission ||
    'To preserve, practice, and disseminate the authentic, sacred disciplines of classical yoga, bringing radiant health, inner equanimity, and spiritual elevation to sincere seekers worldwide.';

  const vision =
    institute?.vision ||
    'To stand as a globally revered sanctuary of traditional yogic learning and sadhana, bridging Vedic heritage with contemporary wellbeing.';

  const storyCover =
    institute?.branding?.coverImage?.url ||
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85';

  const pillars =
    institute?.pillars && institute.pillars.length > 0
      ? institute.pillars
      : [
          {
            title: 'Classical Parampara',
            subtitle: 'Authentic Lineage',
            description:
              'Preserving the sacred purity of Patanjali Ashtanga yoga and classical Hatha sadhana with authentic mantras and meditative stillness.',
          },
          {
            title: 'Clinical Chikitsa',
            subtitle: 'Musculoskeletal Science',
            description:
              'Therapeutic rehabilitation customized under clinical physiotherapy oversight to reverse chronic musculoskeletal conditions safely.',
          },
          {
            title: 'Spiritual Transformation',
            subtitle: 'Self-Realization',
            description:
              'Cultivating inner equanimity, energetic purification through pranayama, and holistic alignment of body, breath, and mind.',
          },
        ];

  const contact = {
    email: institute?.contact?.email || 'shuchimohan@kalptaruyogvidyalaya.com',
    phone: institute?.contact?.phone || '09818047984',
    hours: institute?.contact?.hours || 'Mon – Sat: 06:00 AM – 08:00 PM',
    address: institute?.contact?.address?.street
      ? `${institute.contact.address.street}, ${institute.contact.address.city || 'Faridabad'} – ${institute.contact.address.postalCode || '121002'}, ${institute.contact.address.state || 'Haryana'}, ${institute.contact.address.country || 'India'}`
      : 'N114 Piyush Heights, Sector 89, Faridabad – 121002, Haryana, India',
  };

  const campusPhotos =
    institute?.images && institute.images.length > 0 ? institute.images : null;

  return (
    <div className="w-full flex flex-col bg-canvas-warm text-ink selection:bg-plum-900 selection:text-gold-200">
      {/* ─── 1. HERO BANNER WITH LIVING AURIC GRADIENT ─── */}
      <section className="relative py-20 sm:py-28 bg-plum-950 text-white overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10">
          <div className="max-w-4xl space-y-5 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-mono tracking-widest uppercase">
              <LotusMotif size={16} className="text-gold-400" />
              <span>{eyebrow}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 tracking-tight leading-[1.08]">
              {name}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gold-200/90 font-editorial font-light leading-snug max-w-2xl">
              {tagline}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/85 font-sans font-light leading-relaxed max-w-3xl pt-1">
              {description}
            </p>

            {/* Credential Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-gold-300/90">
              <span className="flex items-center gap-1.5 bg-plum-900/60 border border-gold-400/25 px-3 py-1.5 rounded-full">
                <Award className="w-4 h-4 text-gold-400" />
                {affiliation}
              </span>
              <span className="flex items-center gap-1.5 bg-plum-900/60 border border-gold-400/25 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                Est. {establishedYear} • {legacyYears}
              </span>
              <span className="flex items-center gap-1.5 bg-plum-900/60 border border-gold-400/25 px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4 text-gold-400" />
                5000+ Happy Students &amp; Patients
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/programs/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-plum-950 font-sans font-semibold text-xs sm:text-sm shadow-modal hover:from-gold-200 hover:to-gold-300 transition-all cursor-pointer"
              >
                <span>Explore Accredited Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about/founder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gold-400/50 text-gold-200 hover:border-gold-300 hover:text-gold-100 hover:bg-gold-500/10 font-sans font-medium text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>Meet Our Founder</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 2. INSTITUTIONAL METRICS COUNTER ─── */}
      <section className="bg-plum-900 text-white border-b border-gold-500/20 py-8 relative">
        <Container size="wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-5xl font-editorial font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-400">
                  {stat.val}
                </div>
                <div className="text-xs sm:text-sm font-sans text-gold-200 font-medium">
                  {stat.lbl}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 3. OUR STORY & GENESIS ─── */}
      <section className="py-16 sm:py-24 bg-surface relative overflow-hidden border-b border-border">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Visual Collage */}
            <div className="lg:col-span-6 space-y-4 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400/40 shadow-modal">
                <img
                  src={storyCover}
                  alt={`${name} Learning Sanctuary`}
                  className="w-full h-[380px] sm:h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-300 bg-plum-950/80 px-2.5 py-1 rounded">
                    Institutional Lineage
                  </span>
                  <p className="font-editorial text-lg text-white font-normal pt-1">
                    Dedicated to preserving the sanctity of classical yoga sadhana.
                  </p>
                </div>
              </div>

              {/* Overlapping Accreditation Badge */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-plum-950 border border-gold-400/60 text-white p-4 rounded-xl shadow-modal max-w-[240px] hidden sm:block">
                <div className="flex items-center gap-2 text-gold-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                    Affiliation
                  </span>
                </div>
                <p className="text-xs font-sans text-white/90 leading-tight">
                  {affiliation}
                </p>
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gold-700">
                  <KalptaruTree size={20} />
                  <span className="text-xs uppercase tracking-widest font-mono font-semibold">
                    The Genesis &amp; Vision
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-plum-900 leading-tight">
                  Bridging Ancient Vedic Tradition with Modern Medical Science
                </h2>
              </div>

              <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
                {storyHistory}
              </p>

              <div className="p-4 rounded-xl bg-plum-950 text-white border border-gold-400/30 space-y-1.5">
                <span className="text-[10px] font-mono text-gold-300 uppercase tracking-widest font-semibold block">
                  Core Spiritual Philosophy
                </span>
                <p className="text-xs sm:text-sm font-editorial text-white/95 leading-relaxed italic">
                  &ldquo;{storyPhilosophy}&rdquo;
                </p>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-canvas border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-plum-900 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Our Sacred Mission</span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {mission}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-border space-y-1.5">
                  <div className="flex items-center gap-2 text-plum-900 font-semibold text-sm">
                    <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>Our Long-term Vision</span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {vision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 4. THREE PILLARS OF LEARNING ─── */}
      <section className="py-16 sm:py-24 bg-canvas-warm relative border-b border-border">
        <Container size="wide">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-semibold">
              Foundational Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-plum-900">
              The Three Pillars of Kalptaru
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-sans">
              Our educational syllabus synthesizes Vedic philosophy, precise anatomical physiotherapy, and deep spiritual sadhana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {pillars.map((pillar: any, idx: number) => {
              const icons = [BookOpen, Activity, Heart];
              const IconComp = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="bg-white border border-border hover:border-gold-400 p-6 sm:p-8 rounded-2xl shadow-soft hover:shadow-card transition-all space-y-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-plum-900 text-gold-300 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-gold-700 uppercase font-semibold">
                      {pillar.subtitle || `Pillar #${idx + 1}`}
                    </span>
                    <h3 className="text-xl font-editorial font-bold text-plum-900">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── 4B. CAMPUS PHOTOGRAPHY (IF PRESENT) ─── */}
      {campusPhotos && campusPhotos.length > 0 && (
        <section className="py-16 sm:py-20 bg-surface border-b border-border">
          <Container size="wide">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-semibold">
                Ashram &amp; Shala Atmosphere
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-plum-900">
                Inside Kalptaruu Sanctuary
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {campusPhotos.map((photo: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-border shadow-xs hover:border-gold-400 transition-all group"
                >
                  <img
                    src={photo.url}
                    alt={photo.alt || 'Campus'}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── 5. INSTITUTIONAL WINGS ─── */}
      <section className="py-16 sm:py-24 bg-white border-b border-border">
        <Container size="wide">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-semibold">
              Academic &amp; Clinical Spectrum
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-plum-900">
              Our Wings of Education &amp; Healing
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-sans">
              Discover accredited certifications, rehabilitative care, and wellness sessions offered across offline and hybrid mediums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Wing 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-canvas border border-border hover:border-gold-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-plum-900 text-gold-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase bg-gold-50 text-gold-800 border border-gold-300 px-2.5 py-0.5 rounded font-semibold">
                  Accredited Program
                </span>
              </div>
              <h3 className="text-xl font-editorial font-bold text-plum-900">
                Teacher Training Courses (TTC)
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                IYA and accredited certification syllabuses designed for aspiring yoga teachers, covering Patanjali sutras, 
                biomechanical alignment, anatomy, and authentic guru-shishya parampara teaching pedagogy.
              </p>
              <Link
                href="/programs/courses"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-plum-900 hover:text-gold-700 pt-1"
              >
                <span>Explore TTC Syllabuses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Wing 2 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-canvas border border-border hover:border-gold-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-plum-900 text-gold-300 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase bg-gold-50 text-gold-800 border border-gold-300 px-2.5 py-0.5 rounded font-semibold">
                  Clinical Care
                </span>
              </div>
              <h3 className="text-xl font-editorial font-bold text-plum-900">
                Therapeutic Rehabilitation Clinic
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                Specialized 1-on-1 and targeted cohorts addressing cervical spondylosis, lumbar spine disc bulges, 
                osteoarthritis, sciatica, PCOD/PCOS, and postural restoration led by senior physiotherapists.
              </p>
              <Link
                href="/contact/enquiry"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-plum-900 hover:text-gold-700 pt-1"
              >
                <span>Book Clinical Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Wing 3 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-canvas border border-border hover:border-gold-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-plum-900 text-gold-300 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase bg-gold-50 text-gold-800 border border-gold-300 px-2.5 py-0.5 rounded font-semibold">
                  Intensive Learning
                </span>
              </div>
              <h3 className="text-xl font-editorial font-bold text-plum-900">
                Specialized Masterclasses &amp; Workshops
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                Focused short-format intensives on Thyroid Care, Breathwork (Pranayama Masterclasses), 
                Spinal Mobility, and Women&apos;s Hormonal Health conducted in offline ashram and live online modes.
              </p>
              <Link
                href="/programs/workshops"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-plum-900 hover:text-gold-700 pt-1"
              >
                <span>View Upcoming Workshops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Wing 4 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-canvas border border-border hover:border-gold-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-plum-900 text-gold-300 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase bg-gold-50 text-gold-800 border border-gold-300 px-2.5 py-0.5 rounded font-semibold">
                  Workplace Health
                </span>
              </div>
              <h3 className="text-xl font-editorial font-bold text-plum-900">
                Corporate Wellness &amp; Executive Resilience
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                Customized ergonomic mindfulness, stress relief, and desk yoga sessions delivered for corporations, 
                educational institutes, and government ministries to restore workplace vitality.
              </p>
              <Link
                href="/programs/corporate"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-plum-900 hover:text-gold-700 pt-1"
              >
                <span>Corporate Partnerships</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 6. THE FOUNDER STEWARDSHIP CARD ─── */}
      <section className="py-16 sm:py-24 bg-plum-950 text-white relative overflow-hidden">
        <AuricBackground showOrbs={false} />

        <Container size="wide" className="relative z-10">
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#1A0719]/90 border border-gold-400/40 p-8 sm:p-12 shadow-modal flex flex-col md:flex-row items-center gap-8 sm:gap-10">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-gold-400/60 shrink-0 shadow-card">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
                alt="Mrs. Shuchi Mohan - Founder"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase">
                <span>Visionary Lineage</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-300">
                Mrs. Shuchi Mohan
              </h3>
              <p className="text-xs sm:text-sm text-gold-400 font-mono">
                Physiotherapist &amp; Therapeutic Yoga Consultant • Founder
              </p>
              <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
                With a legacy spanning MDNIY, NCERT educational broadcasts, and over 15 years of clinical practice, 
                Mrs. Shuchi Mohan oversees every academic syllabus and patient rehabilitation pathway at the institute.
              </p>
              <div className="pt-2">
                <Link
                  href="/about/founder"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gold-300 hover:text-gold-200 underline underline-offset-4"
                >
                  <span>Read Complete Founder Profile &amp; Lineage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 7. CAMPUS LOCATION & VISITATION DETAILS ─── */}
      <section className="py-16 sm:py-20 bg-surface relative border-b border-border">
        <Container size="wide">
          <div className="max-w-4xl mx-auto rounded-2xl bg-canvas border border-border p-8 sm:p-10 shadow-soft space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-semibold">
                Sanctuary Location
              </span>
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900">
                Visit Our Learning Ashram in Faridabad
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-plum-900 font-bold">
                    Address
                  </div>
                  <p className="text-xs sm:text-sm text-ink-muted leading-snug">
                    {contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-plum-900 font-bold">
                    Helpline
                  </div>
                  <p className="text-xs sm:text-sm text-ink-muted leading-snug">
                    {contact.phone}
                    <br />
                    {contact.hours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-plum-900 font-bold">
                    Admissions
                  </div>
                  <p className="text-xs sm:text-sm text-ink-muted leading-snug break-all">
                    {contact.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 8. CALL TO ACTION: BEGIN YOUR JOURNEY ─── */}
      <section className="py-16 sm:py-20 bg-plum-900 text-white relative text-center">
        <Container size="narrow" className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Begin Your Sadhana</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-300">
            Take Your First Step Towards Holistic Well-Being
          </h2>

          <p className="text-sm sm:text-base text-white/85 font-sans font-light max-w-xl mx-auto leading-relaxed">
            Whether you seek personal healing from chronic discomfort or wish to step onto the path of becoming a 
            certified yoga teacher, {name} welcomes you with open arms.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/programs/courses"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-plum-950 font-sans font-semibold text-sm shadow-modal hover:from-gold-200 hover:to-gold-300 transition-all cursor-pointer"
            >
              Browse Certified Courses
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 rounded-full border border-gold-400/50 text-gold-200 hover:border-gold-300 hover:text-gold-100 hover:bg-gold-500/10 font-sans font-medium text-sm transition-all cursor-pointer"
            >
              Contact Admissions
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default InstitutePage;
