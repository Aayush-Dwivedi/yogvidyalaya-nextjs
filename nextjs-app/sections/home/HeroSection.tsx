'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { HERO_SLIDES, HERO_METRICS } from '../../services/homeData';
import { CmsService } from '../../services/cmsService';
import { CmsHeroSlide } from '../../types/cms';
import { HeroSlide } from '../../types/home';
import { cn } from '../../utils/cn';

export interface NormalizedHeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  quote?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export interface HeroSectionProps {
  slides?: (HeroSlide | CmsHeroSlide)[];
}

const normalizeSlides = (rawSlides: (HeroSlide | CmsHeroSlide)[]): NormalizedHeroSlide[] => {
  return rawSlides.map((s: any, idx: number) => {
    const rawImage = s.image;
    const imageUrl =
      (typeof rawImage === 'string' ? rawImage : rawImage?.url) ||
      s.imageUrl ||
      HERO_SLIDES[idx % HERO_SLIDES.length]?.image ||
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85';

    return {
      id: s._id || s.id || `slide-${idx}`,
      image: imageUrl,
      title: s.heading || s.title || 'Kalptaruu Yoga Vidhyalaya',
      subtitle: s.subheading || s.subtitle || 'Traditional Yoga & Wellness',
      description:
        s.description ||
        'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
      quote: s.quote || 'Affiliated by Indian Yoga Association',
      ctaText: s.ctaText || 'Explore Courses',
      ctaUrl: s.ctaUrl || '/programs/courses',
      secondaryCtaText: s.secondaryCtaText || 'Contact Us',
      secondaryCtaUrl: s.secondaryCtaUrl || '/contact',
    };
  });
};

export const HeroSection: React.FC<HeroSectionProps> = ({ slides: propSlides }) => {
  const [slides, setSlides] = useState<NormalizedHeroSlide[]>(() => {
    if (propSlides && propSlides.length > 0) {
      return normalizeSlides(propSlides);
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('kalptaru_cached_hero_slides');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return normalizeSlides(parsed);
          }
        }
      } catch {}
    }
    return normalizeSlides(HERO_SLIDES);
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync when propSlides changes
  useEffect(() => {
    if (propSlides && propSlides.length > 0) {
      setSlides(normalizeSlides(propSlides));
      if (typeof window !== 'undefined') {
        localStorage.setItem('kalptaru_cached_hero_slides', JSON.stringify(propSlides));
      }
    }
  }, [propSlides]);

  // Load from CMS if not provided, and listen for live updates
  useEffect(() => {
    const fetchLiveSlides = async () => {
      try {
        const live = await CmsService.getHeroSlides(true);
        if (live && live.length > 0) {
          setSlides(normalizeSlides(live));
          if (typeof window !== 'undefined') {
            localStorage.setItem('kalptaru_cached_hero_slides', JSON.stringify(live));
          }
        }
      } catch (err) {
        console.warn('Using existing hero slides:', err);
      }
    };

    if (!propSlides || propSlides.length === 0) {
      fetchLiveSlides();
    }

    const handleUpdate = () => {
      fetchLiveSlides();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [propSlides]);

  // Slideshow auto-advance (5.5s timer)
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);


  const currentSlide = slides[currentIndex] || slides[0] || normalizeSlides(HERO_SLIDES)[0];

  return (
    <section
      className="relative pt-[84px] sm:pt-[92px] lg:pt-[100px] pb-8 sm:pb-12 min-h-screen min-h-[100dvh] flex items-center overflow-hidden animate-auric-canvas text-ivory select-none"
      aria-label="Kalptaruu Yoga Vidhyalaya Hero"
    >
      {/* ─── LIVING ANIMATED BASE CANVAS OVERLAY ─── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-plum-950/60 via-transparent to-plum-950/80 pointer-events-none" />

      {/* ─── VIBRANT ANIMATED GRADIENT AURAS (LOGO GOLDEN #DAA53B & LOGO PURPLE #2A0725 ONLY) ─── */}
      <div className="absolute -top-[15%] left-[8%] sm:left-[15%] w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full bg-[radial-gradient(circle,rgba(218,165,59,0.36)_0%,rgba(218,165,59,0.18)_40%,rgba(218,165,59,0.04)_65%,transparent_80%)] blur-3xl animate-aura-1 pointer-events-none" />
      <div className="absolute -bottom-[15%] right-[0%] sm:right-[10%] w-[650px] h-[650px] sm:w-[950px] sm:h-[950px] rounded-full bg-[radial-gradient(circle,rgba(42,7,37,0.85)_0%,rgba(26,7,25,0.60)_45%,transparent_80%)] blur-3xl animate-aura-2 pointer-events-none" />
      <div className="absolute top-[25%] right-[18%] w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full bg-[radial-gradient(circle,rgba(225,180,85,0.30)_0%,rgba(218,165,59,0.12)_45%,transparent_75%)] blur-3xl animate-aura-3 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-80 sm:h-96 bg-[radial-gradient(ellipse_at_bottom,rgba(218,165,59,0.22)_0%,rgba(42,7,37,0.40)_50%,transparent_75%)] blur-2xl animate-auric-flow pointer-events-none" />

      {/* Subtle Depth Veil to ensure crystal clarity of hero typography */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1A0719]/80 via-[#1A0719]/35 to-transparent pointer-events-none" />

      {/* ─── HERO CONTENT GRID (FULL-SCREEN UTILIZATION ALIGNED WITH NAVBAR) ─── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-14 items-center">
          
          {/* ── LEFT COLUMN: Narrative & Metrics ── */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-5 lg:space-y-6">
            
            {/* Eyebrow */}
            <div className="flex items-center">
              <span className="text-xs sm:text-sm uppercase tracking-widest-editorial text-gold-400 font-semibold">
                {currentSlide.subtitle}
              </span>
            </div>

            {/* Institution Title & Headline in Radiant Golden Gradient */}
            <div className="space-y-2.5">
              {currentSlide.quote && (
                <span className="text-xs sm:text-sm uppercase tracking-wide-editorial text-gold-300/80 block">
                  {currentSlide.quote}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-5.5xl xl:text-6xl 2xl:text-7xl font-editorial font-normal leading-[1.08] tracking-tight drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300">
                {currentSlide.title}
              </h1>
            </div>

            {/* Description in Warm Golden Ivory */}
            <p className="text-base sm:text-lg text-gold-100/90 leading-relaxed font-sans font-light max-w-xl">
              {currentSlide.description}
            </p>

            {/* Golden Pill Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2">
              <Link
                href={currentSlide.ctaUrl || '/programs/courses'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-plum-950 hover:from-gold-200 hover:to-gold-300 font-sans font-semibold text-sm transition-all shadow-modal hover:shadow-[0_0_25px_rgba(216,178,110,0.45)] group cursor-pointer"
              >
                <span>{currentSlide.ctaText || 'Explore Courses'}</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>

              <Link
                href={currentSlide.secondaryCtaUrl || '/contact'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-gold-400/50 text-gold-200 hover:border-gold-300 hover:text-gold-100 hover:bg-gold-500/10 font-sans font-medium text-sm transition-all cursor-pointer"
              >
                <span>{currentSlide.secondaryCtaText || 'Contact Us'}</span>
              </Link>
            </div>

            {/* Bottom Metrics Bar with Golden Highlights and Dividers */}
            <div className="pt-4 sm:pt-6 lg:pt-8 flex flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
              {HERO_METRICS.map((metric, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div className="hidden sm:block h-9 sm:h-11 w-[1px] bg-gold-400/30 shrink-0" />
                  )}
                  <div className="space-y-0.5 shrink-0">
                    <div className="text-3xl sm:text-3.5xl lg:text-4xl xl:text-4.5xl font-editorial font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-300">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm font-sans text-gold-200/90 font-medium whitespace-nowrap">
                      {metric.label}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

          </div>

          {/* ── RIGHT COLUMN: Circular Sacred Frame Slideshow ── */}
          <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center lg:justify-end relative">
            <div className="relative w-[290px] h-[290px] sm:w-[370px] sm:h-[370px] lg:w-[420px] lg:h-[420px] xl:w-[470px] xl:h-[470px] 2xl:w-[500px] 2xl:h-[500px]">
              
              {/* ── CELESTIAL ORBIT RINGS & ROTATING SATELLITES (MAIN CIRCLE ROTATION - NO PETALS) ── */}
              <svg
                className="absolute -inset-[12%] sm:-inset-[14%] w-[124%] sm:w-[128%] h-[124%] sm:h-[128%] pointer-events-none z-10 animate-orbit-rotate"
                viewBox="0 0 600 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer solid celestial orbit */}
                <circle
                  cx="300"
                  cy="300"
                  r="275"
                  stroke="#DAA53B"
                  strokeWidth="1.2"
                  strokeOpacity="0.45"
                />

                {/* Inner celestial stippled / dotted orbit */}
                <circle
                  cx="300"
                  cy="300"
                  r="250"
                  stroke="#DAA53B"
                  strokeWidth="1.6"
                  strokeDasharray="2 7"
                  strokeOpacity="0.65"
                />

                {/* Top Celestial Satellite Node (orbits with frame) */}
                <circle
                  cx="300"
                  cy="25"
                  r="9"
                  stroke="#DAA53B"
                  strokeWidth="1.5"
                  fill="#2A0725"
                />
                <circle
                  cx="300"
                  cy="25"
                  r="2.5"
                  fill="#DAA53B"
                />

                {/* Bottom-Right Celestial Satellite Node (orbits with frame) */}
                <circle
                  cx="494"
                  cy="494"
                  r="9"
                  stroke="#DAA53B"
                  strokeWidth="1.5"
                  fill="#2A0725"
                />
                <circle
                  cx="494"
                  cy="494"
                  r="2.5"
                  fill="#DAA53B"
                />
              </svg>

              {/* ── CIRCULAR IMAGE WINDOW (Remains still and clearly oriented) ── */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gold-400/60 shadow-[0_0_60px_rgba(218,165,59,0.30)] bg-[#1A0719] z-10">
                {slides.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                      idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    )}
                  >
                    <img
                      src={s.image}
                      alt={s.title || 'Kalptaruu Yoga Vidhyalaya'}
                      className="w-full h-full object-cover object-center transform scale-100"
                    />
                  </div>
                ))}

                {/* Soft Radial Vignette Overlay inside the circle */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_60%,rgba(26,7,25,0.45)_95%)] pointer-events-none z-15" />

                {/* ── PAGINATION DOTS (Inside circle bottom) ── */}
                <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={cn(
                        'transition-all duration-300 rounded-full cursor-pointer',
                        idx === currentIndex
                          ? 'w-3 h-3 bg-gold-400 ring-2 ring-gold-400/50 shadow-[0_0_8px_rgba(218,165,59,0.8)]'
                          : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                      )}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
