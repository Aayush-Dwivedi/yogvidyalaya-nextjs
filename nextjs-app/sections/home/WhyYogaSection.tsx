import React from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { WHY_YOGA_BENEFITS } from '../../services/homeData';
import { OrnamentalDivider } from '../../components/Motifs';

export const WhyYogaSection: React.FC = () => {
  // Bespoke subtle yogic line-art iconography corresponding to each benefit
  const getBenefitIcon = (index: number) => {
    switch (index) {
      case 0: // Physical Wellness / Prana Flow
        return (
          <svg className="w-6 h-6 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="1" />
            <path d="M12 7v10M8 12h8" strokeWidth="1" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          </svg>
        );
      case 1: // Mental Clarity / Third Eye
        return (
          <svg className="w-6 h-6 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeWidth="1" />
            <circle cx="12" cy="12" r="3" strokeWidth="1" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        );
      case 2: // Better Flexibility / Fluid Spine Arc
        return (
          <svg className="w-6 h-6 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 18c4-4 8-12 12-12" strokeWidth="1" strokeLinecap="round" />
            <path d="M6 12c3-2 6-6 12-6" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="18" cy="6" r="2" strokeWidth="1" />
            <circle cx="6" cy="18" r="2" strokeWidth="1" />
          </svg>
        );
      case 3: // Stress Management / Calming Wave
        return (
          <svg className="w-6 h-6 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 14c3-3 6 3 9 0s6-3 9 0" strokeWidth="1" strokeLinecap="round" />
            <path d="M3 10c3-3 6 3 9 0s6-3 9 0" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          </svg>
        );
      case 4: // Mindful Living / Sacred Lotus Petal
        return (
          <svg className="w-6 h-6 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 3c-3 5-4 9-4 13 0 3 2 5 4 5s4-2 4-5c0-4-1-8-4-13z" strokeWidth="1" />
            <circle cx="12" cy="10" r="1" fill="currentColor" />
          </svg>
        );
      case 5: // Improved Strength / Merudanda (Spine) Column
        return (
          <svg className="w-6 h-6 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="10" y="4" width="4" height="16" rx="1" strokeWidth="1" />
            <line x1="7" y1="8" x2="17" y2="8" strokeWidth="1" strokeLinecap="round" />
            <line x1="6" y1="12" x2="18" y2="12" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="7" y1="16" x2="17" y2="16" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
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

        {/* 6 Benefits Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {WHY_YOGA_BENEFITS.map((benefit, idx) => (
            <div
              key={benefit.id}
              className="bg-surface border border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-soft hover:border-gold-500/60 transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                {/* Header Icon + Number */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-[2px] bg-canvas-warm border border-gold-400/40 flex items-center justify-center group-hover:border-gold-500 transition-colors">
                    {getBenefitIcon(idx)}
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
                  <span className="text-xs font-editorial italic text-gold-700 block mt-0.5">
                    {benefit.sanskritTerm}
                  </span>
                </div>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans font-light">
                  {benefit.description}
                </p>
              </div>

              {/* Dimension Reference */}
              <div className="pt-4 mt-6 border-t border-border/60">
                <span className="text-[10px] uppercase font-mono text-ink-faint">
                  {benefit.scriptureRef}
                </span>
              </div>
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
