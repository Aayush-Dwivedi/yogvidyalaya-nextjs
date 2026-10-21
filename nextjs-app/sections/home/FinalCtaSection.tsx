'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Container } from '../../components/Container';
import { LinkButton } from '../../components/LinkButton';
import { OrnamentalDivider } from '../../components/Motifs';
import { Badge } from '../../components/Badge';
import { CmsHomepageCta } from '../../types/cms';
import { CmsService } from '../../services/cmsService';

export interface FinalCtaSectionProps {
  cta?: CmsHomepageCta;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ cta: propCta }) => {
  const [cta, setCta] = useState<CmsHomepageCta | null>(propCta || null);

  useEffect(() => {
    if (propCta) {
      setCta(propCta);
    }
  }, [propCta]);

  useEffect(() => {
    const fetchLiveCta = async () => {
      try {
        const live = await CmsService.getHomepageCta();
        if (live && Object.keys(live).length > 0) {
          setCta(live);
        }
      } catch (err) {
        console.warn('Using default CTA:', err);
      }
    };

    if (propCta === undefined) {
      fetchLiveCta();
    }

    const handleUpdate = () => {
      fetchLiveCta();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [propCta]);

  const badgeText = cta?.badge || 'Welcome to Kalptaru';
  const headline = cta?.title || 'Join Our Classes';
  const desc =
    cta?.description ||
    "Whether you're looking to get fit, manage a health condition, or become a yoga teacher, we have a program for you. Get in touch to learn more.";
  const primaryText = cta?.primaryCtaText || 'Browse Courses';
  const primaryUrl = cta?.primaryCtaUrl || '/courses';
  const secondaryText = cta?.secondaryCtaText || 'Get in Touch';
  const secondaryUrl = cta?.secondaryCtaUrl || '/contact';

  return (
    <section className="py-24 sm:py-32 text-ivory relative overflow-hidden border-t border-[#DAA53B]/30 border-b border-[#DAA53B]/20">
      {/* Pure Purple & Golden Living Gradient Background Canvas (Static - Zero Repaints) */}
      <div
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          background: 'linear-gradient(135deg, #1A0719 0%, #2A0725 25%, #3B0B34 50%, #2A0725 75%, #1A0719 100%)',
        }}
      />

      {/* Breathing Golden & Purple Radiant Center Auras (GPU Opacity Pulsing) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle 650px at 50% 50%, rgba(218, 165, 59, 0.16) 0%, rgba(42, 7, 37, 0.45) 50%, transparent 75%)',
          willChange: 'opacity',
          animation: 'auricGlowBreath 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(59, 11, 52, 0.5) 0%, rgba(26, 7, 25, 0.85) 65%, transparent 100%)',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#DAA53B]/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#DAA53B]/25 to-transparent pointer-events-none" />

      {/* Concentric Sacred Geometry Circles (Hidden on mobile, visible on md+) */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none overflow-hidden select-none z-0">
        <svg
          className="w-[1100px] h-[1100px] sm:w-[1450px] sm:h-[1450px] lg:w-[1750px] lg:h-[1750px] max-w-none text-[#DAA53B]"
          viewBox="0 0 1600 1600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <radialGradient id="sacredCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DAA53B" stopOpacity="0.14" />
              <stop offset="45%" stopColor="#2A0725" stopOpacity="0.08" />
              <stop offset="85%" stopColor="#1A0719" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#1A0719" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Auric Glow */}
          <circle cx="800" cy="800" r="500" fill="url(#sacredCenterGlow)" />

          {/* Concentric Base Rings (Soft Opacity increasing from inside out) */}
          <circle cx="800" cy="800" r="180" stroke="#DAA53B" strokeWidth="1.2" strokeOpacity="0.04" />
          <circle cx="800" cy="800" r="270" stroke="#DAA53B" strokeWidth="1.2" strokeOpacity="0.08" />
          <circle cx="800" cy="800" r="370" stroke="#DAA53B" strokeWidth="1.3" strokeOpacity="0.14" />
          <circle cx="800" cy="800" r="480" stroke="#DAA53B" strokeWidth="1.4" strokeOpacity="0.22" />
          <circle cx="800" cy="800" r="600" stroke="#DAA53B" strokeWidth="1.6" strokeOpacity="0.32" />
          <circle cx="800" cy="800" r="730" stroke="#DAA53B" strokeWidth="1.8" strokeOpacity="0.45" />
          <circle cx="800" cy="800" r="870" stroke="#DAA53B" strokeWidth="2" strokeOpacity="0.60" />
        </svg>

        {/* Counter-Rotating Dashed Rings (Disappeared on mobile, visible on desktop/tablet md+) */}
        <img
          src="/images/sacred-dashed-rings.svg"
          alt=""
          width={1600}
          height={1600}
          className="hidden md:block absolute w-[1100px] h-[1100px] sm:w-[1450px] sm:h-[1450px] lg:w-[1750px] lg:h-[1750px] max-w-none pointer-events-none select-none"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            animation: 'sacredSpinReverse 95s linear infinite',
          }}
        />

        {/* Clockwise-Rotating Sacred 8-Fold Axis Marks & Diamonds (Disappeared on mobile, visible on desktop/tablet md+) */}
        <img
          src="/images/sacred-sun-wheel.svg"
          alt=""
          width={1600}
          height={1600}
          className="hidden md:block absolute w-[1100px] h-[1100px] sm:w-[1450px] sm:h-[1450px] lg:w-[1750px] lg:h-[1750px] max-w-none pointer-events-none select-none"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            animation: 'sacredSpinSlow 80s linear infinite',
          }}
        />
      </div>

      <Container size="default" className="relative z-10 text-center space-y-6">
        {/* Emblem & Badge */}
        <div className="flex flex-col items-center space-y-3">
          <div className="mb-2">
            <Image
              src="/logo.webp"
              alt="Kalptaruu Yoga Vidhyalaya Logo"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover shadow-modal mx-auto"
              loading="lazy"
            />
          </div>
          <Badge variant="dark" size="sm" dot>
            {badgeText}
          </Badge>
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-normal text-ivory max-w-3xl mx-auto leading-[1.12]">
          {headline}
        </h2>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg text-ivory/80 max-w-2xl mx-auto font-sans font-light leading-relaxed">
          {desc}
        </p>

        <OrnamentalDivider className="max-w-xs mx-auto my-6 opacity-40" />

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <LinkButton
            to={primaryUrl}
            variant="primary"
            size="lg"
            className="bg-gold-500 text-plum-950 border-gold-400 hover:bg-gold-400 hover:text-plum-900 shadow-modal"
          >
            {primaryText}
          </LinkButton>

          <LinkButton
            to={secondaryUrl}
            variant="outline"
            size="lg"
            className="border-ivory/40 text-ivory hover:border-gold-400 hover:text-gold-200 bg-plum-950/40"
          >
            {secondaryText}
          </LinkButton>
        </div>

        {/* Reassurance Accents */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gold-300/80 font-sans">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>Traditional Yogic Practices</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>Physiotherapy Expertise</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span>Safe &amp; Effective Methodology</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FinalCtaSection;
