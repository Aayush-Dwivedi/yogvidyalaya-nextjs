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
    <section className="py-24 sm:py-32 bg-plum-900 text-ivory relative overflow-hidden border-t border-gold-500/40">
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
