'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { CornerFlourish, LotusMotif } from '../../components/Motifs';
import { CmsService } from '../../services/cmsService';
import { CmsFounder } from '../../types/cms';
import { ArrowRight, Award, GraduationCap, CheckCircle2 } from 'lucide-react';

interface ProgramsSectionProps {
  showTrainers?: boolean;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ showTrainers = true }) => {
  const [trainers, setTrainers] = useState<CmsFounder[]>([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await CmsService.getFounders('published');
        setTrainers(data || []);
      } catch (err) {
        console.warn('Could not load trainers for homepage:', err);
      }
    };

    fetchTrainers();

    const handleUpdate = () => {
      fetchTrainers();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Disciplines & Pathways"
          title="Explore Our Programs"
          description="Whether pursuing professional teacher certification, an intensive weekend immersion, corporate balance, or daily sadhana, each pathway is rooted in traditional integrity."
          align="asymmetric"
          action={
            <LinkButton to="/programs/courses" variant="text" size="md" withArrow>
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
                  200H / 500H TTC
                </span>
                <span className="text-[11px] bg-canvas-warm border border-border px-2.5 py-1 text-ink-muted rounded-[2px]">
                  Therapeutic Anatomy
                </span>
                <span className="text-[11px] bg-canvas-warm border border-border px-2.5 py-1 text-ink-muted rounded-[2px]">
                  Patanjali Sutras
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <LinkButton to="/programs/courses" variant="primary" size="md">
                Explore Courses
              </LinkButton>
              <span className="text-xs text-ink-muted font-mono">From ₹4,500</span>
            </div>
          </div>

          {/* 2. WORKSHOPS: Intensive Sadhana Immersion (5 cols) */}
          <div className="lg:col-span-5 bg-surface border-t-2 border-t-plum-900 border-x border-b border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-card relative group hover:border-plum-800 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="plum" size="sm">
                  Intensive
                </Badge>
                <span className="text-[11px] font-mono text-ink-muted">02 / Immersions</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-snug">
                  Workshops &amp; Masterclasses
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mt-2">
                  Weekend immersions, breathwork laboratories, yogic cleansing (Shatkriyas), and restorative alignment clinics.
                </p>
              </div>

              <div className="aspect-[16/9] rounded-[1px] overflow-hidden border border-border/60 bg-surface-subtle">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
                  alt="Yogic meditation and breathwork intensive"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-3 bg-canvas-warm rounded-[2px] border border-border/80">
                <p className="text-xs text-ink-muted italic font-sans">
                  "Pranayama is the sacred bridge between the physical temple and the luminous spirit within."
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <LinkButton to="/programs/workshops" variant="secondary" size="md">
                View Schedule
              </LinkButton>
              <span className="text-xs text-ink-muted font-mono">1 – 3 Days</span>
            </div>
          </div>

          {/* 3. CORPORATE WELLNESS (5 cols) */}
          <div className="lg:col-span-5 bg-surface border-t-2 border-t-gold-600 border-x border-b border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-card relative group hover:border-gold-600 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="earth" size="sm">
                  Executive
                </Badge>
                <span className="text-[11px] font-mono text-ink-muted">03 / Institutional</span>
              </div>

              <div>
                <h3 className="text-2xl font-editorial font-normal text-plum-900 leading-snug">
                  Corporate &amp; Institutional Wellness
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mt-2">
                  Bespoke desk-ergonomics, mindful stress mitigation, and executive meditation modules designed for organizations.
                </p>
              </div>

              <div className="space-y-2 py-2">
                <div className="flex items-center space-x-2 text-xs text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>
                  <span>Custom On-Site &amp; Hybrid Seminars</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>
                  <span>Chair Yoga &amp; Ergonomic Therapy</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>
                  <span>Breath Mastery for High-Pressure Roles</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <LinkButton to="/programs/corporate" variant="text" size="md" withArrow>
                Request Proposal
              </LinkButton>
            </div>
          </div>

          {/* 4. ASHRAM MEMBERSHIPS: Daily Practice (7 cols) */}
          <div className="lg:col-span-7 bg-surface border-t-2 border-t-plum-900 border-x border-b border-border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-card relative group hover:border-plum-900 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="dark" size="sm">
                  Daily Sadhana
                </Badge>
                <span className="text-[11px] font-mono text-ink-muted">04 / Memberships</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-snug">
                  Studio Membership &amp; Daily Practice
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mt-2">
                  Sustained daily sadhana with morning and evening batches. Includes progressive guidance in Classical Asanas, Shatkriya purification, and personalized posture alignment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
                <div className="p-3 bg-canvas-warm rounded-[1px] border border-border/60 text-center">
                  <p className="font-mono text-xs text-gold-700 font-semibold uppercase">Daily Batches</p>
                  <p className="font-editorial text-sm text-plum-900 mt-0.5">Morning &amp; Evening</p>
                </div>
                <div className="p-3 bg-canvas-warm rounded-[1px] border border-border/60 text-center">
                  <p className="font-mono text-xs text-gold-700 font-semibold uppercase">Consultation</p>
                  <p className="font-editorial text-sm text-plum-900 mt-0.5">Physiotherapy Review</p>
                </div>
                <div className="p-3 bg-canvas-warm rounded-[1px] border border-border/60 text-center">
                  <p className="font-mono text-xs text-gold-700 font-semibold uppercase">Sanctuary</p>
                  <p className="font-editorial text-sm text-plum-900 mt-0.5">Serene Environment</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <LinkButton to="/programs/membership" variant="primary" size="md">
                Join Membership
              </LinkButton>
            </div>
          </div>
        </div>

        {/* Section of Trainers (Dynamically Loaded from Admin — Zero Dummy Entries) */}
        {showTrainers ? (
          <div id="trainers" className="mt-20 pt-12 border-t border-border/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-gold-600 mb-1">
                <span className="text-xs uppercase tracking-widest-editorial font-semibold text-gold-700">
                  Faculty &amp; Instructors
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-editorial text-plum-900 font-bold">
                Our Trainers
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-xl font-sans mt-1">
                Guided by experienced yoga practitioners and physiotherapy specialists combining authentic yogic practices with clinical anatomical safety.
              </p>
            </div>
            <Link
              href="/trainers"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum-900 hover:text-gold-700 font-sans transition-colors"
            >
              <span>View All Faculty Members</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {trainers.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center max-w-md mx-auto shadow-card">
              <p className="text-sm font-editorial text-plum-900 font-bold">Faculty Roster</p>
              <p className="text-xs text-ink-muted mt-1 mb-4 font-sans">
                Our verified yoga faculty profiles are being updated.
              </p>
              <LinkButton to="/trainers" variant="secondary" size="sm">
                Explore Trainers Directory
              </LinkButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trainers.map((trainer) => {
                const photoUrl =
                  (typeof trainer.image === 'string' ? trainer.image : trainer.image?.url) ||
                  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80';
                const id = (trainer._id || trainer.id || trainer.slug) as string;
                const isFounder = trainer.name?.toLowerCase().includes('shuchi') || trainer.title?.toLowerCase().includes('founder');
                const targetUrl = isFounder ? '/about/founder' : `/trainers?trainer=${encodeURIComponent(id)}`;

                return (
                  <div
                    key={id}
                    className="bg-surface border border-border hover:border-gold-400 rounded-xl p-5 shadow-card hover:shadow-modal transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-plum-950/10 border border-border/60 relative">
                        <img
                          src={photoUrl}
                          alt={trainer.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.98]"
                          loading="lazy"
                        />
                        {trainer.featured && (
                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-gold-500 text-plum-950 border border-gold-400">
                              Lead
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Badge variant="gold" size="sm">
                            {trainer.experienceYears ? `${trainer.experienceYears}+ Yrs Exp` : 'Verified Faculty'}
                          </Badge>
                        </div>
                        <h4 className="text-lg font-editorial font-bold text-plum-900 group-hover:text-gold-800 transition-colors">
                          {trainer.name}
                        </h4>
                        <p className="text-xs text-gold-700 font-sans font-medium line-clamp-1 mt-0.5">
                          {trainer.designation || trainer.title}
                        </p>
                        <p className="text-xs text-ink-muted mt-2 font-sans line-clamp-3 leading-relaxed">
                          {trainer.shortBio || trainer.bio}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                      <Link
                        href={targetUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-plum-900 hover:text-gold-700 font-sans transition-colors"
                      >
                        <span>View Trainer Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gold-600" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
          <div className="mt-16 pt-10 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-border">
            <div>
              <div className="flex items-center text-gold-600 mb-1">
                <span className="text-[11px] uppercase tracking-widest-editorial font-semibold text-gold-700">
                  Institute Faculty
                </span>
              </div>
              <h3 className="text-xl font-editorial font-bold text-plum-900">
                Meet Our Faculty &amp; Certified Instructors
              </h3>
              <p className="text-xs text-ink-muted font-sans mt-0.5">
                Explore individual instructor bios, qualifications, and yogic lineage.
              </p>
            </div>
            <Link
              href="/trainers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft whitespace-nowrap"
            >
              <span>Explore Faculty Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
};
