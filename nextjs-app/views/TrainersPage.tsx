'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { LinkButton } from '../components/LinkButton';
import { LotusMotif, CornerFlourish } from '../components/Motifs';
import { CmsService } from '../services/cmsService';
import { CmsFounder } from '../types/cms';
import { LoadingState } from '../components/LoadingState';
import {
  Users,
  Award,
  GraduationCap,
  Sparkles,
  Search,
  MessageCircle,
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';

export const TrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<CmsFounder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const data = await CmsService.getFounders('published');
      setTrainers(data || []);
    } catch (err: any) {
      console.error('Failed to load faculty directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const filteredTrainers = trainers.filter((t) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = t.name.toLowerCase().includes(q);
    const titleMatch = (t.title || t.designation || '').toLowerCase().includes(q);
    const specMatch = (t.specializations || []).some((s) => s.toLowerCase().includes(q));
    const qualMatch = (t.qualifications || []).some((ql) => ql.toLowerCase().includes(q));
    return nameMatch || titleMatch || specMatch || qualMatch;
  });

  return (
    <div className="w-full flex flex-col bg-canvas-warm min-h-screen">
      {/* 1. Header Banner */}
      <section className="relative py-16 sm:py-24 bg-plum-950 text-white border-b border-gold-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-plum-900 via-plum-950 to-plum-950 opacity-90" />
        
        <Container size="wide" className="relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-mono tracking-widest uppercase mb-2">
            <LotusMotif size={16} className="text-gold-400" />
            <span>Faculty &amp; Master Acharyas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-white tracking-wide">
            Our Experienced Trainers &amp; Guides
          </h1>

          <p className="text-sm sm:text-base text-ivory/80 font-sans leading-relaxed font-light">
            Combining authentic yogic lineages, clinical physiotherapy rehabilitation, and traditional contemplative wisdom for safe, personalized, and transformative practice.
          </p>

          {/* Quick Search */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by instructor name, therapy focus, or credential..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-plum-900/80 border border-gold-400/40 text-xs sm:text-sm text-white placeholder-ivory/50 focus:outline-none focus:border-gold-400 font-sans shadow-soft"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Main Directory Content */}
      <section className="py-16 sm:py-20 flex-1">
        <Container size="wide">
          {loading ? (
            <LoadingState message="Loading our faculty and trainer directory..." />
          ) : filteredTrainers.length === 0 ? (
            <div className="text-center py-16 bg-white border border-border rounded-2xl p-8 max-w-lg mx-auto shadow-card">
              <Users className="w-12 h-12 text-gold-600 mx-auto mb-3" />
              <h3 className="font-editorial text-xl font-bold text-plum-900">No Trainers Found</h3>
              <p className="text-xs text-ink-muted mt-1 mb-5">
                No faculty members match your search criteria. Try a different term or clear filters.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-lg bg-plum-900 text-gold-300 text-xs font-medium hover:bg-plum-800 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrainers.map((trainer) => {
                const photoUrl =
                  (typeof trainer.image === 'string' ? trainer.image : trainer.image?.url) ||
                  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80';
                const id = trainer._id || trainer.id || trainer.slug;

                return (
                  <div
                    key={id}
                    className="bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-modal hover:border-gold-400 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Media Header */}
                      <div className="relative aspect-[4/3] bg-plum-950 overflow-hidden">
                        <img
                          src={photoUrl}
                          alt={trainer.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/90 via-plum-950/20 to-transparent pointer-events-none" />

                        {trainer.featured && (
                          <div className="absolute top-3.5 right-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold bg-gold-500 text-plum-950 shadow-sm border border-gold-400">
                              <Star className="w-3 h-3 fill-plum-950" />
                              <span>Featured Lead</span>
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <h3 className="font-editorial text-2xl font-bold leading-snug drop-shadow-sm">
                            {trainer.name}
                          </h3>
                          <p className="text-xs text-gold-300 font-sans font-medium mt-0.5">
                            {trainer.designation || trainer.title}
                          </p>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-4">
                        {/* Experience Banner */}
                        <div className="flex items-center justify-between pb-3 border-b border-border text-xs font-mono text-ink-muted">
                          <span className="flex items-center gap-1.5 text-gold-800 font-medium">
                            <Award className="w-4 h-4 text-gold-600" />
                            <span>{trainer.experienceYears ? `${trainer.experienceYears}+ Years Experience` : 'Senior Acharya'}</span>
                          </span>
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Faculty
                          </span>
                        </div>

                        {/* Bio / Description */}
                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans line-clamp-3">
                          {trainer.shortBio || trainer.bio}
                        </p>

                        {/* Qualifications */}
                        {trainer.qualifications && trainer.qualifications.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-ink-faint font-semibold flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-plum-900" />
                              <span>Credentials &amp; Certifications</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {trainer.qualifications.map((q, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-plum-50 text-[11px] text-plum-900 border border-plum-200"
                                >
                                  {q}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Specializations */}
                        {trainer.specializations && trainer.specializations.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-ink-faint font-semibold block">
                              Specialization Areas
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {trainer.specializations.map((spec, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded bg-canvas-warm text-[11px] text-gold-900 border border-gold-300"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-canvas border-t border-border flex items-center justify-between gap-3">
                      <LinkButton
                        to="/contact"
                        variant="primary"
                        size="sm"
                        className="flex-1 justify-center text-xs py-2"
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-gold-300" />
                        <span>Consult via WhatsApp</span>
                      </LinkButton>

                      <LinkButton
                        to="/courses"
                        variant="secondary"
                        size="sm"
                        className="text-xs py-2 px-3"
                        title="Explore courses taught by our faculty"
                      >
                        <span>Courses</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </LinkButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* 3. Bottom Philosophy & Contact Strip */}
      <section className="py-14 bg-white border-t border-border">
        <Container size="wide" className="text-center space-y-4 max-w-2xl mx-auto">
          <LotusMotif size={24} className="text-gold-600 mx-auto" />
          <h2 className="text-2xl font-editorial font-bold text-plum-900">
            Learn Under Direct Personal Mentorship
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
            Every course and session at Kalptaru Yog Vidyalaya is guided with personal posture corrections, anatomical awareness, and individualized modifications for safe progress.
          </p>
          <div className="pt-2">
            <LinkButton to="/contact" variant="primary" size="md">
              Speak with Our Senior Faculty
            </LinkButton>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TrainersPage;
