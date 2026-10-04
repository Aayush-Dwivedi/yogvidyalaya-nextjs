'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { FEATURED_COURSES } from '../../services/homeData';
import { FeaturedCourse } from '../../types/home';
import { KalptaruTree } from '../../components/Motifs';
import { CmsService } from '../../services/cmsService';
import { CmsCourse } from '../../types/cms';

export interface FeaturedCoursesSectionProps {
  courses?: (FeaturedCourse | CmsCourse)[];
}

export const FeaturedCoursesSection: React.FC<FeaturedCoursesSectionProps> = ({
  courses: propCourses,
}) => {
  const [courses, setCourses] = useState<(FeaturedCourse | CmsCourse)[]>(propCourses || []);

  useEffect(() => {
    if (propCourses && propCourses.length > 0) {
      setCourses(propCourses);
      return;
    }

    const loadFeatured = async () => {
      try {
        const homeData = await CmsService.getHomeContent();
        if (homeData?.featuredCourses && homeData.featuredCourses.length > 0) {
          setCourses(homeData.featuredCourses);
        } else {
          const liveCourses = await CmsService.getCourses('published');
          const featured = liveCourses.filter((c) => c.featured);
          setCourses(featured.length > 0 ? featured : liveCourses.slice(0, 3));
        }
      } catch (err) {
        console.warn('Falling back to static featured courses:', err);
        setCourses(FEATURED_COURSES);
      }
    };

    loadFeatured();
  }, [propCourses]);

  const displayCourses = courses && courses.length > 0 ? courses : FEATURED_COURSES;

  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Programs"
          title="Featured Courses"
          description="A carefully designed curriculum providing a strong foundation in traditional yogasanas with correct alignment."
          align="asymmetric"
          motif={<KalptaruTree size={32} />}
          action={
            <LinkButton to="/programs/courses" variant="text" size="md" withArrow>
              Browse Complete Course Catalog
            </LinkButton>
          }
        />

        {/* Dynamic Courses Editorial Layout */}
        <div className="space-y-8">
          {displayCourses.map((c: any, index) => {
            const courseId = c._id || c.id || `course-${index}`;
            const coverUrl =
              c.coverImage?.url ||
              c.image?.url ||
              (typeof c.image === 'string' ? c.image : null) ||
              'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80';

            const highlights =
              c.curriculumHighlights ||
              (c.curriculum && c.curriculum[0]?.topics?.slice(0, 3)) ||
              c.features?.slice(0, 3) ||
              c.benefits?.slice(0, 3) ||
              ['Authentic Yogic Practices', 'Physiotherapy & Alignment', 'Safe Methodology'];

            const priceDisplay =
              c.price?.displayPrice ||
              (typeof c.price === 'string' ? c.price : c.price?.amount ? `₹${c.price.amount.toLocaleString()}` : '');

            const certDisplay = c.certification || 'Kalptaru Yog Vidyalaya Certification';

            return (
              <div
                key={courseId}
                className="bg-surface border border-border rounded-[2px] overflow-hidden shadow-card hover:border-gold-500/70 transition-all duration-300 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  {/* Image Column (4 cols) */}
                  <div className="lg:col-span-4 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-surface-subtle">
                    <img
                      src={coverUrl}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/60 via-transparent to-transparent lg:hidden" />

                    {index === 0 && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="gold" size="sm" dot>
                          Flagship Certification
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Details Column (8 cols) */}
                  <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                        <span className="font-semibold text-plum-900">{c.duration}</span>
                        <span>&bull;</span>
                        <span className="capitalize">{c.mode}</span>
                        <span>&bull;</span>
                        <span className="capitalize">{c.level}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-snug">
                        {c.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans max-w-3xl">
                        {c.shortDescription || c.description}
                      </p>

                      {/* Curriculum Highlights */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {highlights.map((highlight: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-canvas-warm border border-border/80 text-ink-muted px-2.5 py-1 rounded-[2px]"
                          >
                            &bull; {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Course Footer Info & Action */}
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
                        <LinkButton
                          to="/programs/courses"
                          variant="secondary"
                          size="sm"
                          className="w-full sm:w-auto text-center"
                        >
                          Syllabus Details
                        </LinkButton>
                        <LinkButton
                          to={`/contact/enquiry?program=${encodeURIComponent(c.title)}`}
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
