'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  User,
  GraduationCap,
  Users,
} from 'lucide-react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { LinkButton } from '../../components/LinkButton';
import { CmsCourse } from '../../types/cms';
import { FeaturedCourse } from '../../types/home';
import { CmsService } from '../../services/cmsService';
import { isOptimizedUrl } from '../../utils/imageUtils';
import { KalptaruTree } from '../../components/Motifs';

export interface FeaturedCoursesSectionProps {
  courses?: (FeaturedCourse | CmsCourse)[];
}

export const FeaturedCoursesSection: React.FC<FeaturedCoursesSectionProps> = ({
  courses: propCourses,
}) => {
  const [courses, setCourses] = useState<(FeaturedCourse | CmsCourse)[]>(() =>
    propCourses ? propCourses.slice(0, 3) : []
  );
  // Expand on click state - default is collapsed (empty object)
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  const toggleExpand = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  useEffect(() => {
    if (propCourses !== undefined) {
      setCourses(propCourses.slice(0, 3));
      return;
    }

    const loadFeatured = async () => {
      try {
        const homeData = await CmsService.getHomeContent();
        if (homeData?.featuredCourses && homeData.featuredCourses.length > 0) {
          setCourses(homeData.featuredCourses.slice(0, 3));
        } else {
          const liveCourses = await CmsService.getCourses('published');
          const featured = liveCourses.filter((c) => c.featured);
          setCourses(featured.length > 0 ? featured.slice(0, 3) : liveCourses.slice(0, 3));
        }
      } catch (err) {
        setCourses([]);
      }
    };

    loadFeatured();

    const handleUpdate = () => {
      loadFeatured();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [propCourses]);

  if (!courses || courses.length === 0) {
    return null;
  }

  // Strictly display only 3 featured courses on the homepage
  const displayedCourses = courses.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Programs"
          title="Featured Courses"
          description="A carefully designed curriculum providing a strong foundation in traditional yogasanas with correct alignment."
          align="asymmetric"
          action={
            <LinkButton to="/courses" variant="text" size="md" withArrow>
              Browse Complete Course Catalog
            </LinkButton>
          }
        />

        {/* Dynamic Courses Editorial Layout */}
        <div className="space-y-8">
          {displayedCourses.map((c: any, index) => {
            const courseId =
              (typeof c._id === 'string' && c._id.trim() ? c._id : null) ||
              (typeof c.id === 'string' && c.id.trim() ? c.id : null) ||
              (typeof c.slug === 'string' && c.slug.trim() ? c.slug : null) ||
              (c._id && typeof c._id.toString === 'function' && c._id.toString() !== '[object Object]' ? c._id.toString() : null) ||
              `course-${index}`;
            const isExpanded = Boolean(expandedCourses[courseId]);

            const coverUrl =
              c.coverImage?.url ||
              c.image?.url ||
              (typeof c.image === 'string' ? c.image : null) ||
              '';

            const highlights =
              (c.benefits && c.benefits.length > 0 && c.benefits) ||
              (c.features && c.features.length > 0 && c.features) ||
              c.curriculumHighlights ||
              (c.curriculum && c.curriculum[0]?.topics?.slice(0, 4)) ||
              ['Authentic Yogic Practices', 'Physiotherapy & Alignment', 'Safe Methodology'];

            const priceDisplay =
              c.price?.displayPrice ||
              (typeof c.price === 'string'
                ? c.price
                : c.price?.amount
                ? `₹${c.price.amount.toLocaleString()}`
                : '');

            const certDisplay = c.certification || 'Kalptaruu Yoga Vidhyalaya Certification';

            const remainingSeats =
              c.capacity?.total !== undefined && c.capacity?.total !== null
                ? Math.max(0, c.capacity.total - (c.capacity?.enrolled || 0))
                : null;

            return (
              <div
                key={courseId}
                className={`bg-surface border rounded-[2px] overflow-hidden shadow-card transition-all duration-300 group ${
                  isExpanded ? 'border-gold-500 ring-1 ring-gold-500/30' : 'border-border hover:border-gold-500/70'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Image Column (4 cols) */}
                  <div className="lg:col-span-4 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-plum-950 flex flex-col justify-between min-h-[220px]">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={c.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 420px"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                        unoptimized={!isOptimizedUrl(coverUrl)}
                      />
                    ) : (
                      <div className="w-full h-full min-h-[220px] flex items-center justify-center p-8 text-gold-400">
                        <KalptaruTree size={56} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent lg:hidden pointer-events-none" />

                    {/* Floating Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                      <span className="text-[11px] font-sans font-medium text-ivory bg-plum-950/80 backdrop-blur-sm px-2.5 py-1 rounded-[2px] border border-gold-400/30 capitalize">
                        {c.mode || 'In-Person'}
                      </span>
                    </div>

                    {/* Remaining seats notice */}
                    {remainingSeats !== null && (
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 hidden sm:block">
                        <div className="bg-plum-950/85 backdrop-blur-md border border-gold-500/30 rounded p-2 text-ivory flex items-center justify-between text-xs">
                          <span className="text-white/80 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gold-400" />
                            Cohort Seats:
                          </span>
                          <span className="font-mono text-gold-300 font-semibold">
                            {remainingSeats} / {c.capacity.total}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details Column (8 cols) */}
                  <div className="lg:col-span-8 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-ink-muted">
                        <span className="font-semibold text-plum-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold-700" />
                          {c.duration}
                        </span>
                        <span>&bull;</span>
                        <span className="capitalize">{c.mode}</span>
                        <span>&bull;</span>
                        <span className="capitalize">{c.level} Level</span>
                        {certDisplay && (
                          <>
                            <span>&bull;</span>
                            <span className="font-mono text-[11px] text-gold-700 font-semibold">
                              {certDisplay}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-snug">
                        {c.title}
                      </h3>

                      {/* Default Short Description / Lead */}
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans max-w-3xl">
                        {c.shortDescription || c.description}
                      </p>

                      {/* Default Summary Highlights Pills when collapsed */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          !isExpanded
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pt-1 flex flex-wrap items-center gap-2">
                            {highlights.slice(0, 3).map((highlight: string, idx: number) => (
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

                      {/* Expand / Collapse Toggle Button */}
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
                          {c.description && c.description !== c.shortDescription && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-mono text-gold-800 font-semibold tracking-wider block">
                                Full Course Description
                              </span>
                              <div className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans whitespace-pre-line space-y-2 max-w-3xl">
                                {c.description}
                              </div>
                            </div>
                          )}

                          {/* Comprehensive Info Grid (Schedule, Mentor, Eligibility) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                            {c.schedule && (
                              <div className="flex items-start gap-2.5 text-xs bg-canvas-warm/80 border border-border/80 rounded p-3">
                                <Clock className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-plum-900 block text-[10px] uppercase tracking-wider font-mono">
                                    Batch Schedule
                                  </span>
                                  <span className="text-ink-muted text-xs leading-snug">{c.schedule}</span>
                                </div>
                              </div>
                            )}

                            {(c.instructor?.name || (typeof c.instructor === 'string' && c.instructor)) && (
                              <div className="flex items-start gap-2.5 text-xs bg-canvas-warm/80 border border-border/80 rounded p-3">
                                <User className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-plum-900 block text-[10px] uppercase tracking-wider font-mono">
                                    Lead Acharya / Mentor
                                  </span>
                                  <span className="text-ink-muted text-xs leading-snug">
                                    {typeof c.instructor === 'string' ? c.instructor : c.instructor.name}
                                    {c.instructor?.title && (
                                      <span className="text-ink-faint text-[11px] block sm:inline sm:ml-1">
                                        ({c.instructor.title})
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}

                            {c.eligibility && (
                              <div className="flex items-start gap-2.5 text-xs bg-canvas-warm/80 border border-border/80 rounded p-3">
                                <GraduationCap className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-plum-900 block text-[10px] uppercase tracking-wider font-mono">
                                    Eligibility
                                  </span>
                                  <span className="text-ink-muted text-xs leading-snug">{c.eligibility}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Key Program Highlights & Learnings */}
                          {highlights && highlights.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs uppercase tracking-wider text-gold-800 font-semibold flex items-center gap-1.5 font-mono">
                                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                                Key Program Highlights & Focus Areas
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {highlights.map((highlight: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-ink-muted bg-canvas-warm/60 border border-border/70 rounded px-3 py-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                                    <span>{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Complete Syllabus & Modules Breakdown */}
                          {c.curriculum && c.curriculum.length > 0 && (
                            <div className="space-y-3 pt-2">
                              <h4 className="text-xs uppercase tracking-wider text-gold-800 font-semibold flex items-center gap-1.5 font-mono">
                                <BookOpen className="w-3.5 h-3.5 text-gold-700" />
                                Complete Syllabus Modules ({c.curriculum.length} Modules)
                              </h4>
                              <div className="space-y-3 bg-canvas-warm/50 border border-border/80 rounded p-4">
                                {c.curriculum.map((mod: any, modIdx: number) => (
                                  <div
                                    key={modIdx}
                                    className="pb-3 last:pb-0 border-b last:border-b-0 border-border/60"
                                  >
                                    <div className="font-editorial text-sm font-medium text-plum-900">
                                      Module {mod.moduleNumber || modIdx + 1}: {mod.title}
                                    </div>
                                    {mod.description && (
                                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                        {mod.description}
                                      </p>
                                    )}
                                    {mod.topics && mod.topics.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {mod.topics.map((t: string, tIdx: number) => (
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

                    {/* Course Footer Info & Actions */}
                    <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-mono text-gold-700 font-semibold block">
                          {certDisplay}
                        </span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-xs text-ink-muted">Investment:</span>
                          <span className="text-xl font-editorial font-semibold text-plum-900">
                            {priceDisplay || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => toggleExpand(courseId)}
                          className="w-full sm:w-auto text-center px-4 py-2 border border-border hover:border-gold-500 rounded text-xs font-medium text-plum-900 transition-colors cursor-pointer bg-canvas-warm/50"
                        >
                          {isExpanded ? 'Less Info' : 'Details & Syllabus'}
                        </button>
                        <LinkButton
                          to={`/contact?program=${encodeURIComponent(c.title)}&type=course`}
                          variant="primary"
                          size="sm"
                          className="w-full sm:w-auto text-center"
                          withArrow
                        >
                          Enroll Now
                        </LinkButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedCoursesSection;
