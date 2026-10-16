'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { OrnamentalDivider } from '../../components/Motifs';
import { BenefitItem } from '../../types/home';
import { CmsBenefit } from '../../types/cms';
import { CmsService } from '../../services/cmsService';
import {
  Heart,
  Brain,
  Activity,
  ShieldCheck,
  Sparkles,
  Zap,
  Sun,
  Eye,
  Flame,
  Moon,
  Flower2,
  Feather,
  Compass,
  Wind,
} from 'lucide-react';

export interface WhyYogaSectionProps {
  benefits?: (BenefitItem | CmsBenefit)[];
}

const normalizeBenefits = (items: any[]): BenefitItem[] => {
  if (!items || items.length === 0) return [];
  return items.map((b, idx) => ({
    id: b._id || b.id || `benefit-${idx}`,
    title: b.title || 'Holistic Wellness',
    sanskritTerm: b.sanskritTerm || '',
    description: b.description || '',
    scriptureRef: b.scriptureRef || '',
    icon: b.icon || 'Sparkles',
  }));
};

export const WhyYogaSection: React.FC<WhyYogaSectionProps> = ({ benefits: propBenefits }) => {
  const [benefits, setBenefits] = useState<BenefitItem[]>(() =>
    propBenefits && propBenefits.length > 0 ? normalizeBenefits(propBenefits) : []
  );

  useEffect(() => {
    if (propBenefits && propBenefits.length > 0) {
      setBenefits(normalizeBenefits(propBenefits));
    }
  }, [propBenefits]);

  useEffect(() => {
    const fetchLiveBenefits = async () => {
      try {
        const homeData = await CmsService.getHomeContent();
        if (homeData?.benefits && homeData.benefits.length > 0) {
          setBenefits(normalizeBenefits(homeData.benefits));
        } else {
          setBenefits([]);
        }
      } catch (err) {
        setBenefits([]);
      }
    };

    if (propBenefits === undefined) {
      fetchLiveBenefits();
    }

    const handleUpdate = () => {
      fetchLiveBenefits();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [propBenefits]);

  if (!benefits || benefits.length === 0) {
    return null;
  }

  // Matches the exact icon selected in the Admin Benefits CMS
  const renderBenefitIcon = (iconName?: string) => {
    const key = (iconName || '').toLowerCase().trim();
    const iconClass = 'w-6 h-6 text-gold-600 group-hover:scale-110 transition-transform duration-300';

    switch (key) {
      case 'heart':
        return <Heart className={iconClass} />;
      case 'brain':
        return <Brain className={iconClass} />;
      case 'activity':
        return <Activity className={iconClass} />;
      case 'shieldcheck':
      case 'shield':
        return <ShieldCheck className={iconClass} />;
      case 'zap':
        return <Zap className={iconClass} />;
      case 'sun':
        return <Sun className={iconClass} />;
      case 'eye':
        return <Eye className={iconClass} />;
      case 'flame':
        return <Flame className={iconClass} />;
      case 'moon':
        return <Moon className={iconClass} />;
      case 'flower2':
      case 'flower':
      case 'lotus':
        return <Flower2 className={iconClass} />;
      case 'feather':
        return <Feather className={iconClass} />;
      case 'compass':
        return <Compass className={iconClass} />;
      case 'wind':
        return <Wind className={iconClass} />;
      case 'sparkles':
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-canvas-warm relative overflow-hidden border-b border-border/70">
      <Container size="wide" className="relative z-10">
        <SectionHeader
          eyebrow="Why Choose Yoga"
          title="Benefits of Yoga"
          description="What a regular yoga practice truly offers: A consistent yoga practice is not just exercise — it is a sadhana (a conscious life practice). Rooted in ancient Indian wisdom and supported by modern science, yoga weaves together body (sharir), breath (prana), mind, and consciousness. It is about stability in movement, stillness in chaos, and balance in life."
          align="center"
        />

        {/* Benefits Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {benefits.map((benefit, idx) => (
            <div
              key={benefit.id}
              className="bg-surface border border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-soft hover:border-gold-500/60 transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                {/* Header Icon + Number */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-[2px] bg-canvas-warm border border-gold-400/40 flex items-center justify-center group-hover:border-gold-500 transition-colors">
                    {renderBenefitIcon(benefit.icon)}
                  </div>
                  <span className="text-[10px] font-mono text-gold-700 tracking-wider font-semibold">
                    0{idx + 1}
                  </span>
                </div>

                {/* Title & Sanskrit Classical Term */}
                <div>
                  <h3 className="text-xl font-editorial font-normal text-plum-900 group-hover:text-plum-800 transition-colors">
                    {benefit.title}
                  </h3>
                  {benefit.sanskritTerm && (
                    <span className="text-xs font-editorial italic text-gold-700 block mt-0.5">
                      {benefit.sanskritTerm}
                    </span>
                  )}
                </div>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans font-light">
                  {benefit.description}
                </p>
              </div>

              {/* Dimension Reference */}
              {benefit.scriptureRef && (
                <div className="pt-4 mt-6 border-t border-border/60">
                  <span className="text-[10px] uppercase font-mono text-ink-faint">
                    {benefit.scriptureRef}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Closing In Essence */}
        <div className="mt-12 text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-gold-700 font-semibold block">
            In Essence
          </span>
          <p className="font-editorial text-xl sm:text-2xl text-plum-900 font-normal">
            Yoga is not a workout. Not a trend. Not a hobby. Yoga is a way of life.
          </p>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
            A path that builds: Strength in the body &ndash; Stillness in the mind &ndash; Balance in emotions &ndash; Clarity in decisions &ndash; Peace in the soul
          </p>
        </div>

        <OrnamentalDivider className="mt-10 max-w-sm mx-auto opacity-60" />
      </Container>
    </section>
  );
};

export default WhyYogaSection;
