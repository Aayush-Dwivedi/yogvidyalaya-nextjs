'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { CmsTestimonial } from '../../types/cms';
import { CmsService } from '../../services/cmsService';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export interface TestimonialsSectionProps {
  testimonials?: CmsTestimonial[];
}

const DEFAULT_TESTIMONIALS: CmsTestimonial[] = [
  {
    _id: 'default-1',
    name: 'Dr. Radhika Sen',
    roleOrTitle: 'Cardiologist & Sadhak',
    programOrCourse: 'Therapeutic Pranayama & Asana',
    quote:
      'Kalptaru Yog Vidyalaya combines the timeless purity of authentic shastric yoga with profound anatomical and physiotherapy understanding. My chronic spinal fatigue completely dissolved within 3 months of guided practice.',
    rating: 5,
    location: 'Mumbai, Maharashtra',
    featured: true,
    order: 1,
    status: 'published',
  },
  {
    _id: 'default-2',
    name: 'Vikramaditya Roy',
    roleOrTitle: 'Vice President of Technology',
    programOrCourse: 'Corporate Executive Sadhana',
    quote:
      'Our leadership team attended a tailored corporate retreat by Kalptaru. The clarity, breath awareness, and stress mitigation tools introduced here have fundamentally shifted our day-to-day work culture.',
    rating: 5,
    location: 'Bengaluru, Karnataka',
    featured: true,
    order: 2,
    status: 'published',
  },
  {
    _id: 'default-3',
    name: 'Ananya Deshmukh',
    roleOrTitle: 'Certified Yoga Instructor',
    programOrCourse: '200-Hour Teacher Training (TTC)',
    quote:
      'The TTC at Kalptaru is not just an instructional certification; it is an inward initiation. The precision in alignment, philosophy lectures, and personal mentoring from the founders prepared me to teach globally with confidence.',
    rating: 5,
    location: 'Pune, Maharashtra',
    featured: true,
    order: 3,
    status: 'published',
  },
  {
    _id: 'default-4',
    name: 'Sameer Kulkarni',
    roleOrTitle: 'Senior Architect',
    programOrCourse: 'Daily Shala Sadhana',
    quote:
      'The sacred stillness in the shala is palpable. Unlike commercial gym yoga, Kalptaru approaches each sadhak as an individual. It has been the most centering anchor in my busy metropolitan life.',
    rating: 5,
    location: 'Thane, Maharashtra',
    featured: true,
    order: 4,
    status: 'published',
  },
];

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials: propTestimonials,
}) => {
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>(
    propTestimonials && propTestimonials.length > 0 ? propTestimonials : DEFAULT_TESTIMONIALS
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    if (propTestimonials && propTestimonials.length > 0) {
      setTestimonials(propTestimonials);
    }
  }, [propTestimonials]);

  useEffect(() => {
    const fetchLiveTestimonials = async () => {
      try {
        const live = await CmsService.getTestimonials('published');
        if (live && live.length > 0) {
          setTestimonials(live);
        }
      } catch (err) {
        console.warn('Using default testimonials:', err);
      }
    };

    if (!propTestimonials || propTestimonials.length === 0) {
      fetchLiveTestimonials();
    }

    const handleUpdate = () => {
      fetchLiveTestimonials();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [propTestimonials]);

  const filtered = testimonials.filter((t) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'ttc') {
      return (
        t.programOrCourse?.toLowerCase().includes('ttc') ||
        t.programOrCourse?.toLowerCase().includes('teacher') ||
        t.roleOrTitle?.toLowerCase().includes('teacher')
      );
    }
    if (filterCategory === 'therapy') {
      return (
        t.programOrCourse?.toLowerCase().includes('therap') ||
        t.programOrCourse?.toLowerCase().includes('pranayama') ||
        t.roleOrTitle?.toLowerCase().includes('doctor')
      );
    }
    if (filterCategory === 'corporate') {
      return (
        t.programOrCourse?.toLowerCase().includes('corporate') ||
        t.roleOrTitle?.toLowerCase().includes('president') ||
        t.roleOrTitle?.toLowerCase().includes('executive')
      );
    }
    return true;
  });

  const displayItems = filtered.length > 0 ? filtered : testimonials;
  const itemsPerPage = 3;
  const totalPages = Math.ceil(displayItems.length / itemsPerPage) || 1;
  const currentBatch = displayItems.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        {/* Asymmetric Section Header identical to Videos & Gallery */}
        <SectionHeader
          eyebrow="Voices of Sadhana"
          title="Words from Our Practitioners"
          description="Authentic reflections, physical rehabilitation journeys, and certified mastery shared by our students and corporate partners."
          align="asymmetric"
          action={
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 'ttc', label: 'Teacher Training' },
                { id: 'therapy', label: 'Therapeutic Yoga' },
                { id: 'corporate', label: 'Corporate Wellness' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFilterCategory(tab.id);
                    setCurrentPage(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-300 cursor-pointer ${
                    filterCategory === tab.id
                      ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
                      : 'bg-surface border border-border text-ink-muted hover:border-gold-400 hover:text-plum-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          }
        />

        {/* Testimonials Grid matching Gallery and Video cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentBatch.map((item, idx) => (
            <div
              key={item._id || item.id || idx}
              className="bg-surface border border-border rounded-[4px] p-6 sm:p-8 shadow-card hover:shadow-card-hover hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Top Accent: Stars & Quote Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className={`w-4 h-4 ${
                        sIdx < (item.rating || 5)
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-earth-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-gold-50 border border-gold-200/80 flex items-center justify-center text-gold-700 group-hover:scale-105 transition-transform">
                  <Quote className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Quote & Program Badge */}
              <div className="flex-1 space-y-3 mb-6">
                {item.programOrCourse && (
                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider text-gold-900 bg-gold-50 border border-gold-200 uppercase font-semibold">
                    {item.programOrCourse}
                  </span>
                )}
                <p className="text-sm sm:text-base text-ink font-editorial italic font-normal leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-border/80 flex items-center space-x-3.5">
                {item.avatar?.url ? (
                  <img
                    src={item.avatar.url}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-gold-200"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gold-50 border border-gold-200 text-gold-800 font-editorial font-bold text-base flex items-center justify-center">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-sans font-bold text-plum-950 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-ink-muted truncate">
                    {item.roleOrTitle}
                  </p>
                  {item.location && (
                    <p className="text-[11px] text-ink-muted/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gold-600" />
                      {item.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={prevPage}
              className="p-2.5 rounded-full bg-surface border border-border text-ink hover:text-plum-900 hover:bg-canvas transition-all shadow-xs cursor-pointer"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1.5">
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setCurrentPage(pIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentPage === pIdx ? 'w-6 bg-gold-600' : 'w-2 bg-earth-300 hover:bg-gold-500'
                  }`}
                  aria-label={`Go to page ${pIdx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextPage}
              className="p-2.5 rounded-full bg-surface border border-border text-ink hover:text-plum-900 hover:bg-canvas transition-all shadow-xs cursor-pointer"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default TestimonialsSection;
