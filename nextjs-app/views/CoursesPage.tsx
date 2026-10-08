'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { LinkButton } from '../components/LinkButton';
import { KalptaruTree } from '../components/Motifs';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import { CmsCourse } from '../types/cms';
import { LoadingState } from '../components/LoadingState';
import {
  GraduationCap,
  Clock,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CmsCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCurriculum, setExpandedCurriculum] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await CmsService.getCourses('published');
        setCourses(data || []);
      } catch (err: any) {
        console.error('Failed to load courses from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    window.addEventListener('kalptaru-cms-updated', fetchCourses);
    window.addEventListener('storage', fetchCourses);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', fetchCourses);
      window.removeEventListener('storage', fetchCourses);
    };
  }, []);

  const toggleCurriculum = (courseId: string) => {
    setExpandedCurriculum((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
    const matchesMode = selectedMode === 'all' || c.mode === selectedMode;
    return matchesSearch && matchesLevel && matchesMode;
  });

  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* 1. Hero Header with Feelable Animated Auric Gradient */}
      <section className="relative py-20 sm:py-28 bg-plum-950 text-ivory overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center space-x-2 text-xs font-mono tracking-widest text-gold-400/80 uppercase mb-2"
            >
              <Link href="/" className="hover:text-gold-300 transition-colors">
                Home
              </Link>
              <span className="text-gold-500/60">/</span>
              <Link href="/programs" className="hover:text-gold-300 transition-colors">
                Programs
              </Link>
              <span className="text-gold-500/60">/</span>
              <span className="text-gold-200 font-semibold">Courses</span>
            </nav>

            <div className="flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                Traditional Yoga Programs
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 leading-tight">
              Courses &amp; Teacher Training
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed max-w-2xl mx-auto font-light">
              Our programs include general fitness yoga, therapeutic yoga for specific health conditions, and professional teacher training courses combining traditional yoga practices with physiotherapy expertise.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-gold-300/80">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-400" />
                Affiliated by Indian Yoga Association
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold-400" />
                Qualified Instructors
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" />
                Safe &amp; Effective Approach
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Interactive Filter & Search Bar */}
      <section className="bg-canvas-warm border-b border-border/80 sticky top-16 z-20 py-4 shadow-sm backdrop-blur-md bg-canvas-warm/95">
        <Container size="wide">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-sans text-xs">
            {/* Search Input */}
            <div className="flex items-center gap-2 flex-1 max-w-md bg-surface border border-border rounded-lg px-3.5 py-2 shadow-sm focus-within:border-gold-500">
              <Search className="w-4 h-4 text-ink-faint shrink-0" />
              <input
                type="text"
                placeholder="Search courses, curriculum units, philosophy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-ink placeholder-ink-faint outline-none w-full text-xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Filter className="w-3.5 h-3.5 text-gold-700" />
                <span className="font-medium">Filter By:</span>
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-surface border border-border text-ink rounded-lg px-3 py-1.5 text-xs outline-none focus:border-gold-500 shadow-sm"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>

              {/* Mode Filter */}
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="bg-surface border border-border text-ink rounded-lg px-3 py-1.5 text-xs outline-none focus:border-gold-500 shadow-sm"
              >
                <option value="all">All Formats / Modes</option>
                <option value="residential">Residential Gurukula</option>
                <option value="in-person">In-Person Shala</option>
                <option value="online">Online Live Streaming</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Dynamic Course Listing */}
      <section className="py-14 sm:py-20">
        <Container size="wide">
          {loading ? (
            <div className="py-24">
              <LoadingState message="Loading certified yoga curriculums from Vidhyalaya..." />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-xl p-8 max-w-lg mx-auto shadow-card">
              <GraduationCap className="w-12 h-12 text-gold-500/60 mx-auto mb-3" />
              <h3 className="text-xl font-editorial font-normal text-plum-900 mb-1">
                No Courses Found
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed font-sans mb-4">
                No courses match your active search or filters. Please reset your filters to browse the entire curriculum directory.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLevel('all');
                  setSelectedMode('all');
                }}
                className="px-4 py-2 bg-gold-500 text-plum-950 font-medium rounded-lg text-xs hover:bg-gold-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCourses.map((course, index) => {
                const courseId = (course._id || course.id) as string;
                const isExpanded = !!expandedCurriculum[courseId];
                const coverUrl = course.coverImage?.url || course.image?.url;
                const remainingSeats =
                  course.capacity && course.capacity.total
                    ? Math.max(0, course.capacity.total - (course.capacity.enrolled || 0))
                    : null;

                return (
                  <article
                    key={courseId || index}
                    className="bg-surface border border-border rounded-[2px] overflow-hidden shadow-card hover:border-gold-500/60 transition-all duration-300 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                      {/* Left: Media Banner (4 cols) */}
                      <div className="lg:col-span-4 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-surface-subtle flex flex-col justify-between">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-plum-950 flex items-center justify-center p-8 text-gold-400">
                            <KalptaruTree size={64} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent lg:hidden pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                          {course.featured && (
                            <Badge variant="gold" size="sm" dot>
                              Featured Program
                            </Badge>
                          )}
                          <span className="text-[11px] font-sans font-medium text-ivory bg-plum-950/80 backdrop-blur-sm px-2.5 py-1 rounded-[2px] border border-gold-400/30">
                            {course.mode}
                          </span>
                        </div>

                        {/* Remaining seats notice */}
                        {remainingSeats !== null && (
                          <div className="absolute bottom-4 left-4 right-4 hidden sm:block">
                            <div className="bg-plum-950/85 backdrop-blur-md border border-gold-500/30 rounded p-2.5 text-ivory flex items-center justify-between text-xs">
                              <span className="text-white/80">Available Cohort Seats:</span>
                              <span className="font-mono text-gold-300 font-semibold">
                                {remainingSeats} / {course.capacity?.total}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Content Details (8 cols) */}
                      <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                            <span className="font-semibold text-plum-900 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gold-700" />
                              {course.duration}
                            </span>
                            <span>&bull;</span>
                            <span className="capitalize">{course.level} Level</span>
                            {course.certification && (
                              <>
                                <span>&bull;</span>
                                <span className="font-mono text-[11px] text-gold-700 font-semibold">
                                  {course.certification}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Title & Descriptions */}
                          <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-snug">
                            {course.title}
                          </h2>

                          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans font-light">
                            {course.shortDescription || course.description}
                          </p>

                          {/* Key Benefits Grid */}
                          {course.benefits && course.benefits.length > 0 && (
                            <div className="pt-2">
                              <h4 className="text-xs uppercase tracking-wider text-gold-700 font-semibold mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Key Program Highlights & Learnings
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {course.benefits.slice(0, 4).map((b, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-ink-muted bg-canvas-warm/70 border border-border/80 rounded px-2.5 py-1.5"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Batch Schedule & Lead Instructor */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/60 text-xs">
                            {course.schedule && (
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-mono text-ink-faint block">
                                  Batch Timing
                                </span>
                                <span className="text-ink font-medium">{course.schedule}</span>
                              </div>
                            )}

                            {course.instructor?.name && (
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-mono text-ink-faint block">
                                  Lead Acharya / Mentor
                                </span>
                                <span className="text-ink font-medium">
                                  {course.instructor.name}{' '}
                                  {course.instructor.title && (
                                    <span className="text-ink-muted font-normal">
                                      ({course.instructor.title})
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Interactive Expandable Syllabus / Curriculum */}
                          {course.curriculum && course.curriculum.length > 0 && (
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={() => toggleCurriculum(courseId)}
                                className="inline-flex items-center gap-2 text-xs font-medium text-gold-700 hover:text-gold-600 transition-colors py-1"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>
                                  {isExpanded ? 'Hide Detailed Syllabus' : `View Full Syllabus (${course.curriculum.length} Modules)`}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="mt-3 space-y-3 bg-canvas-warm/50 border border-border/70 rounded-lg p-4 transition-all">
                                  {course.curriculum.map((mod, modIdx) => (
                                    <div
                                      key={modIdx}
                                      className="pb-3 last:pb-0 border-b last:border-b-0 border-border/60"
                                    >
                                      <div className="font-editorial text-sm font-medium text-plum-900">
                                        Module {mod.moduleNumber}: {mod.title}
                                      </div>
                                      {mod.description && (
                                        <p className="text-xs text-ink-muted mt-0.5">
                                          {mod.description}
                                        </p>
                                      )}
                                      {mod.topics && mod.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                          {mod.topics.map((t, tIdx) => (
                                            <span
                                              key={tIdx}
                                              className="text-[11px] bg-surface border border-border px-2 py-0.5 rounded text-ink-muted"
                                            >
                                              • {t}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Price & CTA */}
                        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-mono text-ink-faint block">
                              Investment & Tuition
                            </span>
                            <div className="flex items-baseline space-x-2">
                              <span className="text-2xl font-editorial font-semibold text-plum-900">
                                {course.price?.displayPrice ||
                                  (course.price?.amount
                                    ? `₹${course.price.amount.toLocaleString()}`
                                    : 'Tuition on Request')}
                              </span>
                              {course.price?.isFree && (
                                <span className="text-xs text-emerald-600 font-medium">Complimentary</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                            <LinkButton
                              to="/contact"
                              variant="primary"
                              size="md"
                              className="w-full sm:w-auto bg-plum-900 hover:bg-plum-800 text-gold-300 font-semibold px-6 py-2.5 rounded-lg text-xs transition-colors shadow-soft flex items-center justify-center gap-1.5"
                            >
                              <span>Book Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </LinkButton>
                            <LinkButton
                              to={`/contact/enquiry?program=${encodeURIComponent(course.title)}`}
                              variant="outline"
                              size="md"
                              className="w-full sm:w-auto text-center text-xs"
                            >
                              Enquire
                            </LinkButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* 4. Institutional Consultation Banner */}
      <section className="py-16 bg-canvas-warm border-t border-border">
        <Container size="default" className="text-center space-y-4">
          <img
            src="/logo.png"
            alt="Kalptaruu Logo"
            className="w-12 h-12 rounded-full object-cover shadow-soft mx-auto"
          />
          <h2 className="text-2xl sm:text-3xl font-editorial text-plum-900">
            Need Guidance Choosing Your Program?
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto font-sans leading-relaxed">
            Our experienced team offers guidance to help you select the course or program best suited for your health, fitness, and wellness goals.
          </p>
          <div className="pt-2">
            <LinkButton to="/contact/enquiry" variant="outline" size="md">
              Get in Touch
            </LinkButton>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CoursesPage;
