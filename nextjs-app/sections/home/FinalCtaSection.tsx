'use client';

import React, { useEffect, useState } from 'react';
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

    if (!propCta) {
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
  const primaryUrl = cta?.primaryCtaUrl || '/programs/courses';
  const secondaryText = cta?.secondaryCtaText || 'Get in Touch';
  const secondaryUrl = cta?.secondaryCtaUrl || '/contact';

  return (
    <section className="py-24 sm:py-32 text-ivory relative overflow-hidden border-t border-[#DAA53B]/30 border-b border-[#DAA53B]/20">
      {/* Pure Purple & Golden Living Gradient Background Canvas (Animated) */}
      <div
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          background: 'linear-gradient(135deg, #1A0719 0%, #2A0725 25%, #3B0B34 50%, #2A0725 75%, #1A0719 100%)',
          backgroundSize: '250% 250%',
          animation: 'auricGradientFlow 12s ease-in-out infinite',
        }}
      />

      {/* Breathing Golden & Purple Radiant Center Auras (No Light/White Colors) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle 650px at 50% 50%, rgba(218, 165, 59, 0.16) 0%, rgba(42, 7, 37, 0.45) 50%, transparent 75%)',
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

      {/* Concentric Sacred Geometry Circles (Animated Breathing & Slow Spin) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
        style={{ animation: 'sacredBreathing 9s ease-in-out infinite' }}
      >
        <svg
          className="w-[1100px] h-[1100px] sm:w-[1450px] sm:h-[1450px] lg:w-[1750px] lg:h-[1750px] max-w-none text-[#DAA53B]"
          viewBox="0 0 1600 1600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
          {/* Circle 1: Innermost circle framing text closely, very low opacity (0.04) */}
          <circle cx="800" cy="800" r="180" stroke="#DAA53B" strokeWidth="1.2" strokeOpacity="0.04" />

          {/* Circle 2: Low opacity (0.08) */}
          <circle cx="800" cy="800" r="270" stroke="#DAA53B" strokeWidth="1.2" strokeOpacity="0.08" />

          {/* Circle 3: Low-mid opacity (0.14) */}
          <circle cx="800" cy="800" r="370" stroke="#DAA53B" strokeWidth="1.3" strokeOpacity="0.14" />

          {/* Circle 4: Mid opacity (0.22) */}
          <circle cx="800" cy="800" r="480" stroke="#DAA53B" strokeWidth="1.4" strokeOpacity="0.22" />

          {/* Circle 5: Upper-mid opacity (0.32) */}
          <circle cx="800" cy="800" r="600" stroke="#DAA53B" strokeWidth="1.6" strokeOpacity="0.32" />

          {/* Circle 6: Elevated opacity (0.45) */}
          <circle cx="800" cy="800" r="730" stroke="#DAA53B" strokeWidth="1.8" strokeOpacity="0.45" />

          {/* Circle 7: Outermost bounding ring (0.60) */}
          <circle cx="800" cy="800" r="870" stroke="#DAA53B" strokeWidth="2" strokeOpacity="0.60" />

          {/* Animated Counter-Rotating Sacred Dashed & Dotted Rings */}
          <g style={{ transformOrigin: '800px 800px', animation: 'sacredSpinReverse 95s linear infinite' }}>
            {/* Circle 3 dashed companion */}
            <circle cx="800" cy="800" r="385" stroke="#DAA53B" strokeWidth="0.9" strokeOpacity="0.15" strokeDasharray="4 6" />
            {/* Circle 5 dotted companion */}
            <circle cx="800" cy="800" r="618" stroke="#DAA53B" strokeWidth="1.2" strokeOpacity="0.33" strokeDasharray="3 8" />
            {/* Circle 7 outer dashed companion */}
            <circle cx="800" cy="800" r="888" stroke="#DAA53B" strokeWidth="1.2" strokeOpacity="0.60" strokeDasharray="5 7" />
          </g>

          {/* Animated Clockwise-Rotating Sacred 8-Fold Axis Marks & Sacred Diamonds */}
          <g style={{ transformOrigin: '800px 800px', animation: 'sacredSpinSlow 80s linear infinite' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 800 800)`}>
                {/* Subtle Tick on Circle 3 (opacity 0.14) */}
                <line x1="800" y1="422" x2="800" y2="438" stroke="#DAA53B" strokeWidth="1" strokeOpacity="0.14" />

                {/* Sacred Diamond on Circle 4 (opacity 0.22) */}
                <line x1="800" y1="310" x2="800" y2="330" stroke="#DAA53B" strokeWidth="1.2" strokeOpacity="0.22" />
                <polygon points="800,314 804,320 800,326 796,320" fill="#DAA53B" fillOpacity="0.22" />

                {/* Sacred Diamond & Axis Marker on Circle 5 (opacity 0.32) */}
                <line x1="800" y1="190" x2="800" y2="210" stroke="#DAA53B" strokeWidth="1.4" strokeOpacity="0.32" />
                <polygon points="800,193 805,200 800,207 795,200" fill="#DAA53B" fillOpacity="0.32" />

                {/* Sacred Ray & Marker on Circle 6 (opacity 0.45) */}
                <line x1="800" y1="60" x2="800" y2="80" stroke="#DAA53B" strokeWidth="1.6" strokeOpacity="0.45" />
                <polygon points="800,62 806,70 800,78 794,70" fill="#DAA53B" fillOpacity="0.45" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <Container size="default" className="relative z-10 text-center space-y-6">
        {/* Emblem & Badge */}
        <div className="flex flex-col items-center space-y-3">
          <div className="mb-2">
            <img
              src="/logo.png"
              alt="Kalptaruu Yoga Vidhyalaya Logo"
              className="w-16 h-16 rounded-full object-cover shadow-modal mx-auto"
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
