'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { FEATURED_WORKSHOPS } from '../../services/homeData';
import { FeaturedWorkshop } from '../../types/home';
import { CmsService } from '../../services/cmsService';
import { CmsWorkshop } from '../../types/cms';

export interface FeaturedWorkshopsSectionProps {
  workshops?: (FeaturedWorkshop | CmsWorkshop)[];
}

export const FeaturedWorkshopsSection: React.FC<FeaturedWorkshopsSectionProps> = ({
  workshops: propWorkshops,
}) => {
  const [workshops, setWorkshops] = useState<(FeaturedWorkshop | CmsWorkshop)[]>(propWorkshops || []);

  useEffect(() => {
    if (propWorkshops && propWorkshops.length > 0) {
      setWorkshops(propWorkshops);
      return;
    }

    const loadFeatured = async () => {
      try {
        const homeData = await CmsService.getHomeContent();
        if (homeData?.featuredWorkshops && homeData.featuredWorkshops.length > 0) {
          setWorkshops(homeData.featuredWorkshops);
        } else {
          const liveWorkshops = await CmsService.getWorkshops('published');
          const featured = liveWorkshops.filter((w) => w.featured);
          setWorkshops(featured.length > 0 ? featured : liveWorkshops.slice(0, 3));
        }
      } catch (err) {
        console.warn('Falling back to static featured workshops:', err);
        setWorkshops(FEATURED_WORKSHOPS);
      }
    };

    loadFeatured();
  }, [propWorkshops]);

  const displayWorkshops = workshops && workshops.length > 0 ? workshops : FEATURED_WORKSHOPS;

  return (
    <section className="py-20 sm:py-28 bg-canvas-warm relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Special Programs"
          title="Featured Workshops"
          description="Specialized yoga therapy and wellness workshops designed for specific health conditions and holistic self-care."
          align="asymmetric"
          action={
            <LinkButton to="/programs/workshops" variant="text" size="md" withArrow>
              View All Workshops
            </LinkButton>
          }
        />

        {/* Dynamic Workshop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {displayWorkshops.map((ws: any, index) => {
            const wsId = ws._id || ws.id || `ws-${index}`;
            const coverUrl =
              ws.coverImage?.url ||
              ws.image?.url ||
              (typeof ws.image === 'string' ? ws.image : null) ||
              'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80';

            const formattedDate = ws.date
              ? typeof ws.date === 'string' && ws.date.length <= 15 && !ws.date.includes('-')
                ? ws.date
                : new Date(ws.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
              : 'Upcoming';

            const priceDisplay =
              ws.price?.displayPrice ||
              (typeof ws.price === 'string' ? ws.price : ws.price?.amount ? `₹${ws.price.amount.toLocaleString()}` : '');

            const instructorName =
              typeof ws.instructor === 'string'
                ? ws.instructor
                : ws.instructor?.name || 'Mrs. Shuchi Mohan';

            return (
              <article
                key={wsId}
                className="bg-surface border border-border rounded-[2px] overflow-hidden flex flex-col justify-between shadow-card hover:border-gold-500/70 transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Workshop Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-subtle">
                  <img
                    src={coverUrl}
                    alt={ws.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Date Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="dark" size="sm">
                      {formattedDate}
                    </Badge>
                  </div>

                  {/* Mode Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] font-sans text-ivory/95 bg-plum-900/80 backdrop-blur-sm px-2.5 py-1 rounded-[2px] border border-gold-400/30 capitalize">
                      {ws.mode || 'In-Person'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-ink-faint">
                      <span>Duration: {ws.duration}</span>
                      <span>Level: {ws.level || 'All Levels'}</span>
                    </div>

                    <h3 className="text-xl font-editorial font-normal text-plum-900 leading-snug group-hover:text-plum-800 transition-colors">
                      {ws.title}
                    </h3>

                    <p className="text-xs text-ink-muted leading-relaxed font-sans line-clamp-3">
                      {ws.shortDescription || ws.description}
                    </p>
                  </div>

                  {/* Instructor */}
                  <div className="pt-2 text-[11px] text-ink-muted border-t border-border/60">
                    <span className="font-semibold text-plum-900">Guided by: </span>
                    <span>{instructorName}</span>
                  </div>
                </div>

                {/* Card Footer: Price & Details Action */}
                <div className="px-6 py-4 bg-canvas-warm/70 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-ink-faint block">Investment</span>
                    <span className="text-base font-editorial font-semibold text-plum-900">{priceDisplay || '—'}</span>
                  </div>

                  <LinkButton to="/programs/workshops" variant="secondary" size="sm" withArrow>
                    View Details
                  </LinkButton>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
