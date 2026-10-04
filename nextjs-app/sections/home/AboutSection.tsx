import React from 'react';
import { Container } from '../../components/Container';
import { LinkButton } from '../../components/LinkButton';
import { CornerFlourish, LotusMotif } from '../../components/Motifs';
import { Badge } from '../../components/Badge';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-canvas-warm relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Asymmetric Layered Photography Collage (6 cols) */}
          <div className="lg:col-span-6 relative">
            {/* Primary Large Image */}
            <div className="relative z-10 w-full sm:w-5/6 rounded-[2px] overflow-hidden border border-border shadow-card bg-surface p-1.5">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85"
                alt="Meditation and yoga practice at Kalptaru Yog Vidyalaya"
                className="w-full aspect-[4/5] object-cover rounded-[1px] filter brightness-[0.98]"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <CornerFlourish position="top-left" className="text-gold-400" />
              </div>
            </div>

            {/* Overlapping Secondary Image with Offset */}
            <div className="hidden sm:block absolute -bottom-8 -right-4 z-20 w-3/5 rounded-[2px] overflow-hidden border border-gold-400/60 shadow-modal bg-surface p-1.5">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=700&q=80"
                alt="Teacher guiding asana adjustment"
                className="w-full aspect-[4/3] object-cover rounded-[1px]"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <CornerFlourish position="top-right" className="text-gold-400" />
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute top-6 sm:-left-6 z-30 bg-plum-900 text-gold-200 p-4 rounded-[2px] shadow-modal border border-plum-950 max-w-[200px]">
              <div className="flex items-center space-x-2 text-gold-400 mb-1">
                <img
                  src="/logo.png"
                  alt="Kalptaru Logo"
                  className="w-5 h-5 rounded-full object-cover border border-gold-400/60 shadow-xs"
                />
                <span className="text-[10px] font-mono uppercase tracking-widest-editorial font-semibold">
                  Lineage
                </span>
              </div>
              <p className="text-xs font-editorial font-normal leading-snug text-ivory">
                Traditional Yoga &amp; Physiotherapy
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Philosophy Pillars (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <LotusMotif size={24} className="text-gold-600" />
                <span className="text-xs uppercase tracking-widest-editorial text-gold-700 font-semibold">
                  About Our Institute
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-plum-900 leading-[1.14]">
                Welcome to Kalptaru Yog Vidyalaya
              </h2>

              <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans font-light pt-2">
                Our programs include general fitness yoga, therapeutic yoga for specific health conditions, and professional teacher training courses.
              </p>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans font-light">
                We combine traditional yoga practices with physiotherapy expertise, making our approach both effective and safe for everyone.
              </p>
            </div>

            {/* Three Structured Pillars: Authentic, Expert, Holistic */}
            <div className="space-y-4 pt-2">
              {/* Authentic */}
              <div className="bg-surface border-l-2 border-l-gold-500 border-y border-r border-border p-4 rounded-[2px] transition-colors hover:border-gold-400/80">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold tracking-wide text-plum-900 font-sans">
                    Authentic
                  </h3>
                  <Badge variant="gold" size="sm">Authentic</Badge>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  Traditional yogic practices
                </p>
              </div>

              {/* Expert */}
              <div className="bg-surface border-l-2 border-l-plum-800 border-y border-r border-border p-4 rounded-[2px] transition-colors hover:border-plum-700">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold tracking-wide text-plum-900 font-sans">
                    Expert
                  </h3>
                  <Badge variant="plum" size="sm">Expert</Badge>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  Qualified instructors
                </p>
              </div>

              {/* Holistic */}
              <div className="bg-surface border-l-2 border-l-earth-600 border-y border-r border-border p-4 rounded-[2px] transition-colors hover:border-earth-500">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold tracking-wide text-plum-900 font-sans">
                    Holistic
                  </h3>
                  <Badge variant="earth" size="sm">Holistic</Badge>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  Mind, body &amp; spirit
                </p>
              </div>
            </div>

            {/* CTA Link */}
            <div className="pt-2">
              <LinkButton
                to="/about/institute"
                variant="primary"
                size="md"
                withArrow
              >
                Know More About Us
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
