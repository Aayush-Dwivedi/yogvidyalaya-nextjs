import React from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { CornerFlourish, LotusMotif } from '../../components/Motifs';

export const ProgramsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Disciplines & Pathways"
          title="Explore Our Programs"
          description="Whether pursuing professional teacher certification, an intensive weekend immersion, corporate balance, or daily sadhana, each pathway is rooted in traditional integrity."
          align="asymmetric"
          motif={<LotusMotif size={28} />}
          action={
            <LinkButton to="/programs" variant="text" size="md" withArrow>
              View Full Curriculum Catalog
            </LinkButton>
          }
        />

        {/* Asymmetric 4-Quadrant Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. COURSES: Large Featured Editorial Card (7 cols) */}
          <div className="lg:col-span-7 bg-surface border-t-2 border-t-gold-500 border-x border-b border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-card relative group hover:border-gold-500/70 transition-colors">
            <div className="absolute top-2 right-2">
              <CornerFlourish position="top-right" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gold" size="sm" dot>
                  Certification
                </Badge>
                <span className="text-[11px] font-mono text-ink-muted">01 / Curriculums</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-snug">
                  Teacher Training & Comprehensive Courses
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mt-2">
                  Internationally recognized 200-Hour and 500-Hour Yoga Teacher Training Certifications, Classical Hatha Immersion, and Patanjali Yoga Sutra philosophy.
                </p>
              </div>

              <div className="aspect-[16/8] rounded-[1px] overflow-hidden border border-border/60 bg-surface-subtle">
                <img
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80"
                  alt="Students in teacher training asana lab"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] bg-canvas-warm border border-border px-2.5 py-1 text-ink-muted rounded-[2px]">
                  200-Hour TTC
                </span>
                <span className="text-[11px] bg-canvas-warm border border-border px-2.5 py-1 text-ink-muted rounded-[2px]">
                  500-Hour Mastery
                </span>
                <span className="text-[11px] bg-canvas-warm border border-border px-2.5 py-1 text-ink-muted rounded-[2px]">
                  Ayush / Alliance Approved
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs text-ink-muted">Batches: Oct & Nov 2026</span>
              <LinkButton to="/programs/courses" variant="primary" size="sm" withArrow>
                Explore Courses
              </LinkButton>
            </div>
          </div>

          {/* 2. WORKSHOPS: Stacked Side Card (5 cols) */}
          <div className="lg:col-span-5 bg-surface border border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-card hover:border-gold-500/70 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="plum" size="sm">
                  Intensives
                </Badge>
                <span className="text-[11px] font-mono text-ink-muted">02 / Workshops</span>
              </div>

              <div>
                <h3 className="text-2xl font-editorial font-normal text-plum-900 leading-snug">
                  Workshops & Masterclasses
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mt-2">
                  Focused weekend deep-dives on Pranayama, Kundalini Kriyas, Shatkarma cleansing, and Bandha locks.
                </p>
              </div>

              <div className="aspect-[16/9] rounded-[1px] overflow-hidden border border-border/60 bg-surface-subtle">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
                  alt="Pranayama workshop meditation"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <ul className="text-xs space-y-1.5 text-ink-muted font-sans pt-1">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
                  <span>3-Day Intensive Weekend Modules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
                  <span>Personalized Acharya Guidance</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs text-ink-muted">Residential & Day</span>
              <LinkButton to="/programs/workshops" variant="secondary" size="sm" withArrow>
                View Workshops
              </LinkButton>
            </div>
          </div>

          {/* 3. CORPORATE: Lower Left Card (5 cols) */}
          <div className="lg:col-span-5 bg-surface border border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-card hover:border-gold-500/70 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="earth" size="sm">
                  Executive
                </Badge>
                <span className="text-[11px] font-mono text-ink-muted">03 / Corporate</span>
              </div>

              <div>
                <h3 className="text-2xl font-editorial font-normal text-plum-900 leading-snug">
                  Corporate Yogic Wellness
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mt-2">
                  Evidence-based ergonomics, breathwork, and cognitive calm modules designed for high-stress executive teams.
                </p>
              </div>

              <div className="bg-canvas-warm p-4 border border-border/80 rounded-[2px] space-y-2">
                <span className="text-[10px] uppercase font-mono text-gold-700 font-semibold block">
                  Custom Enterprise Engagements
                </span>
                <p className="text-xs text-ink-muted font-sans">
                  On-site corporate retreats, desk-stretch protocols, and leadership mindfulness intensives.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs text-ink-muted">Customized Scheduling</span>
              <LinkButton to="/programs/corporate" variant="outline" size="sm" withArrow>
                Corporate Plans
              </LinkButton>
            </div>
          </div>

          {/* 4. MEMBERSHIP: Deep Plum Sanctuary Card (7 cols) */}
          <div className="lg:col-span-7 bg-plum-900 border border-plum-950 text-ivory rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-modal relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="dark" size="sm" dot>
                  Daily Sadhana
                </Badge>
                <span className="text-[11px] font-mono text-gold-300">04 / Memberships</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-gold-200 leading-snug">
                  Institute Practice Membership
                </h3>
                <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans mt-2">
                  Make the sacred practice hall an integral part of your daily life. Unlimited morning and evening batches, library access, and priority event passes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-plum-950/60 p-3.5 border border-gold-500/20 rounded-[2px]">
                  <span className="text-xs font-semibold text-gold-300 block">Morning Shala Batches</span>
                  <span className="text-[11px] text-ivory/70">06:00 AM – 07:30 AM &bull; Mon to Fri</span>
                </div>
                <div className="bg-plum-950/60 p-3.5 border border-gold-500/20 rounded-[2px]">
                  <span className="text-xs font-semibold text-gold-300 block">Evening Dhyana Batches</span>
                  <span className="text-[11px] text-ivory/70">06:30 PM – 08:00 PM &bull; Mon to Fri</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-plum-800 flex items-center justify-between">
              <span className="text-xs text-gold-300/80">Monthly & Annual Passes</span>
              <LinkButton
                to="/programs/membership"
                variant="secondary"
                size="sm"
                className="bg-transparent text-gold-200 border-gold-400 hover:bg-gold-500/20"
                withArrow
              >
                Join Membership
              </LinkButton>
            </div>
          </div>
        </div>

        {/* Section of Trainers (Foundation for future expansion) */}
        <div id="trainers" className="mt-16 pt-12 border-t border-border/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-gold-600 mb-1">
                <LotusMotif size={20} />
                <span className="text-xs uppercase tracking-widest-editorial font-semibold text-gold-700">
                  Faculty &amp; Instructors
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-editorial text-plum-900">
                Our Trainers
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-xl font-sans mt-1">
                Guided by experienced yoga practitioners and physiotherapy specialists combining authentic yogic practices with clinical anatomical safety.
              </p>
            </div>
            <span className="text-[11px] font-mono text-ink-faint">
              Faculty Roster
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trainer 1: Mrs. Shuchi Mohan (Lead) */}
            <div className="bg-surface border border-gold-400/50 rounded-[2px] p-5 shadow-card hover:border-gold-500 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-[1px] overflow-hidden bg-plum-950/10 border border-border/60">
                  <img
                    src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
                    alt="Mrs. Shuchi Mohan"
                    className="w-full h-full object-cover filter brightness-[0.98]"
                    loading="lazy"
                  />
                </div>
                <div>
                  <Badge variant="gold" size="sm">Founder &amp; Lead</Badge>
                  <h4 className="text-lg font-editorial text-plum-900 mt-2">Mrs. Shuchi Mohan</h4>
                  <p className="text-xs text-gold-700 font-sans font-medium">Physiotherapist &amp; Therapeutic Yoga Consultant</p>
                  <p className="text-xs text-ink-muted mt-2 font-sans line-clamp-3">
                    Former practitioner at MDNIY and resource expert for NCERT, leading the integration of physiotherapy with authentic yoga.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                <LinkButton to="/about/founder" variant="text" size="sm" withArrow>
                  Profile
                </LinkButton>
              </div>
            </div>

            {/* Trainer 2: Faculty Slot (To be worked on later) */}
            <div className="bg-surface border border-dashed border-border rounded-[2px] p-5 flex flex-col justify-between hover:border-gold-400/70 transition-colors">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-[1px] bg-canvas-warm flex items-center justify-center border border-border/40 text-gold-600/60">
                  <LotusMotif size={36} />
                </div>
                <div>
                  <Badge variant="plum" size="sm">Instructor</Badge>
                  <h4 className="text-lg font-editorial text-plum-900 mt-2">Senior Yoga Faculty</h4>
                  <p className="text-xs text-ink-faint font-sans">Traditional Yogasanas &amp; Pranayama</p>
                  <p className="text-xs text-ink-muted mt-2 font-sans">
                    Certified instructor dedicated to alignment, breath awareness, and classical yogic sadhana.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60">
                <span className="text-[11px] text-ink-faint italic font-sans">Trainer details to be announced</span>
              </div>
            </div>

            {/* Trainer 3: Faculty Slot (To be worked on later) */}
            <div className="bg-surface border border-dashed border-border rounded-[2px] p-5 flex flex-col justify-between hover:border-gold-400/70 transition-colors">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-[1px] bg-canvas-warm flex items-center justify-center border border-border/40 text-gold-600/60">
                  <LotusMotif size={36} />
                </div>
                <div>
                  <Badge variant="earth" size="sm">Therapy</Badge>
                  <h4 className="text-lg font-editorial text-plum-900 mt-2">Therapeutic Care Specialist</h4>
                  <p className="text-xs text-ink-faint font-sans">Rehabilitation &amp; Posture Care</p>
                  <p className="text-xs text-ink-muted mt-2 font-sans">
                    Specialized in therapeutic protocols for back care, joint stability, and condition-specific sessions.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60">
                <span className="text-[11px] text-ink-faint italic font-sans">Trainer details to be announced</span>
              </div>
            </div>

            {/* Trainer 4: Faculty Slot (To be worked on later) */}
            <div className="bg-surface border border-dashed border-border rounded-[2px] p-5 flex flex-col justify-between hover:border-gold-400/70 transition-colors">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-[1px] bg-canvas-warm flex items-center justify-center border border-border/40 text-gold-600/60">
                  <LotusMotif size={36} />
                </div>
                <div>
                  <Badge variant="dark" size="sm">Wellness</Badge>
                  <h4 className="text-lg font-editorial text-plum-900 mt-2">Wellness &amp; Prenatal Faculty</h4>
                  <p className="text-xs text-ink-faint font-sans">Pre &amp; Post Natal Yoga Support</p>
                  <p className="text-xs text-ink-muted mt-2 font-sans">
                    Guiding safe movement and mindful breathing for maternal health and general wellness.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60">
                <span className="text-[11px] text-ink-faint italic font-sans">Trainer details to be announced</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
