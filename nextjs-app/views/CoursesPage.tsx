'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { LinkButton } from '../components/LinkButton';
import { KalptaruTree } from '../components/Motifs';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import { CmsCourse } from '../types/cms';
import { LoadingState } from '../components/LoadingState';
import { isOptimizedUrl } from '../utils/imageUtils';
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
} from 'lucide-react';

export interface CoursesPageProps {
  initialCourses?: CmsCourse[];
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ initialCourses }) => {
  const [courses, setCourses] = useState<CmsCourse[]>(() => initialCourses || []);
  const [loading, setLoading] = useState<boolean>(() => initialCourses === undefined);

  // Filters & Search
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  const toggleExpand = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };


  useEffect(() => {
    const fetchCourses = async (showLoading = false) => {
      try {
        if (showLoading) setLoading(true);
        const data = await CmsService.getCourses('published');
        if (data) setCourses(data);
      } catch (err: any) {
        console.error('Failed to load courses from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!initialCourses || initialCourses.length === 0) {
      fetchCourses(true);
    }

    const handleUpdate = () => fetchCourses(false);
    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialCourses]);



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
                const courseId =
                  (typeof course._id === 'string' && course._id.trim() ? course._id : null) ||
                  (typeof course.id === 'string' && course.id.trim() ? course.id : null) ||
                  (typeof course.slug === 'string' && course.slug.trim() ? course.slug : null) ||
                  (course._id && typeof course._id.toString === 'function' && course._id.toString() !== '[object Object]' ? course._id.toString() : null) ||
                  `course-${index}`;
                const isExpanded = Boolean(expandedCourses[courseId]);
                const coverUrl = course.coverImage?.url || course.image?.url;
                const remainingSeats =
                  course.capacity && course.capacity.total
                    ? Math.max(0, course.capacity.total - (course.capacity.enrolled || 0))
                    : null;

                return (
                  <article
                    key={courseId || index}
                    className={`bg-surface border rounded-[2px] overflow-hidden shadow-card transition-all duration-300 group ${
                      isExpanded ? 'border-gold-500 ring-1 ring-gold-500/30' : 'border-border hover:border-gold-500/60'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                      {/* Left: Media Banner (4 cols) */}
                      <div className="lg:col-span-4 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-surface-subtle flex flex-col justify-between">
                        {coverUrl ? (
                          <Image
                            src={coverUrl}
                            alt={course.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 420px"
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                            loading="lazy"
                            unoptimized={!isOptimizedUrl(coverUrl)}
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

                          {/* Title */}
                          <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-snug">
                            {course.title}
                          </h2>

                          {/* Default Short Description / Lead */}
                          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans max-w-3xl">
                            {course.shortDescription || course.description}
                          </p>

                          {/* Highlights Pills when collapsed */}
                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              !isExpanded
                                ? 'grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="pt-1 flex flex-wrap items-center gap-2">
                                {(course.benefits && course.benefits.length > 0
                                  ? course.benefits
                                  : ['Authentic Yogic Practices', 'Physiotherapy & Alignment', 'Safe Methodology']
                                ).slice(0, 3).map((highlight: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-[11px] bg-canvas-warm border border-border/80 text-ink-muted px-2.5 py-1 rounded-[2px]"
                                  >
                                    &bull; {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Expand / Collapse Button */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => toggleExpand(courseId)}
                              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-700 hover:text-gold-600 transition-colors py-1.5 px-3 rounded bg-canvas-warm/80 border border-border/80 hover:border-gold-500/60 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-gold-700" />
                              <span>
                                {isExpanded
                                  ? 'Collapse Course Details'
                                  : 'Expand Full Description & Details'}
                              </span>
                              <span
                                className={`transform transition-transform duration-300 ${
                                  isExpanded ? 'rotate-180' : 'rotate-0'
                                }`}
                              >
                                <ChevronDown className="w-4 h-4 text-gold-700" />
                              </span>
                            </button>
                          </div>

                          {/* EXPANDED CONTENT SECTION (Smooth Animated Accordion) */}
                          <div
                            className={`grid transition-all duration-500 ease-in-out ${
                              isExpanded
                                ? 'grid-rows-[1fr] opacity-100 pt-4 border-t border-border/70'
                                : 'grid-rows-[0fr] opacity-0 pt-0 border-t-0 pointer-events-none'
                            }`}
                          >
                            <div className="overflow-hidden space-y-5">
                              {/* Full Description */}
                              {course.description && course.description !== course.shortDescription && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-mono text-gold-800 font-semibold tracking-wider block">
                                    Full Course Description
                                  </span>
                                  <div className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans whitespace-pre-line space-y-2 max-w-3xl">
                                    {course.description}
                                  </div>
                                </div>
                              )}

                              {/* Batch Schedule & Lead Instructor Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-border/60 text-xs">
                                {course.schedule && (
                                  <div className="flex items-start gap-2.5 text-xs bg-canvas-warm/80 border border-border/80 rounded p-3">
                                    <Clock className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-semibold text-plum-900 block text-[10px] uppercase tracking-wider font-mono">
                                        Batch Schedule
                                      </span>
                                      <span className="text-ink font-medium">{course.schedule}</span>
                                    </div>
                                  </div>
                                )}

                                {course.instructor?.name && (
                                  <div className="flex items-start gap-2.5 text-xs bg-canvas-warm/80 border border-border/80 rounded p-3">
                                    <Award className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-semibold text-plum-900 block text-[10px] uppercase tracking-wider font-mono">
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
                                  </div>
                                )}
                              </div>

                              {/* Key Program Highlights */}
                              {course.benefits && course.benefits.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-xs uppercase tracking-wider text-gold-800 font-semibold flex items-center gap-1.5 font-mono">
                                    <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                                    Key Program Highlights & Focus Areas
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {course.benefits.map((b, idx) => (
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

                              {/* Complete Syllabus Breakdown */}
                              {course.curriculum && course.curriculum.length > 0 && (
                                <div className="space-y-3 pt-2">
                                  <h4 className="text-xs uppercase tracking-wider text-gold-800 font-semibold flex items-center gap-1.5 font-mono">
                                    <BookOpen className="w-3.5 h-3.5 text-gold-700" />
                                    Complete Syllabus ({course.curriculum.length} Modules)
                                  </h4>
                                  <div className="space-y-3 bg-canvas-warm/50 border border-border/70 rounded-lg p-4">
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
                                </div>
                              )}
                            </div>
                          </div>
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
                            <button
                              type="button"
                              onClick={() => toggleExpand(courseId)}
                              className="px-4 py-2 border border-border hover:border-gold-500 rounded text-xs font-medium text-plum-900 transition-colors cursor-pointer bg-canvas-warm/50 whitespace-nowrap"
                            >
                              {isExpanded ? 'Less Info' : 'Details & Syllabus'}
                            </button>
                            <LinkButton
                              to={`/contact?program=${encodeURIComponent(course.title)}`}
                              variant="primary"
                              size="md"
                              className="w-full sm:w-auto text-center rounded-lg px-6 py-2.5 font-medium whitespace-nowrap"
                              withArrow
                            >
                              Book Now
                            </LinkButton>
                            <LinkButton
                              to={`/contact?program=${encodeURIComponent(course.title)}&type=course`}
                              variant="outline"
                              size="md"
                              className="w-full sm:w-auto text-center rounded-lg px-5 py-2.5 font-medium whitespace-nowrap"
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
          <Image
            src="/logo.webp"
            alt="Kalptaruu Logo"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover shadow-soft mx-auto"
            loading="lazy"
          />
          <h2 className="text-2xl sm:text-3xl font-editorial text-plum-900">
            Need Guidance Choosing Your Program?
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto font-sans leading-relaxed">
            Our experienced team offers guidance to help you select the course or program best suited for your health, fitness, and wellness goals.
          </p>
          <div className="pt-2">
            <LinkButton to="/contact" variant="outline" size="md">
              Get in Touch
            </LinkButton>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CoursesPage;
