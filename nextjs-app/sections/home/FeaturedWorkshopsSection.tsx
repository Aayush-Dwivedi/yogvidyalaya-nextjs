'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Clock,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { FeaturedWorkshop } from '../../types/home';
import { CmsWorkshop } from '../../types/cms';
import { CmsService } from '../../services/cmsService';
import { isOptimizedUrl } from '../../utils/imageUtils';
import { LotusMotif } from '../../components/Motifs';

export interface FeaturedWorkshopsSectionProps {
  workshops?: (FeaturedWorkshop | CmsWorkshop)[];
}

export const FeaturedWorkshopsSection: React.FC<FeaturedWorkshopsSectionProps> = ({
  workshops: propWorkshops,
}) => {
  const [workshops, setWorkshops] = useState<(FeaturedWorkshop | CmsWorkshop)[]>(() =>
    propWorkshops ? propWorkshops.slice(0, 3) : []
  );
  // Expand on click state - default is collapsed (empty object)
  const [expandedWorkshops, setExpandedWorkshops] = useState<Record<string, boolean>>({});

  const toggleExpand = (wsId: string) => {
    setExpandedWorkshops((prev) => ({
      ...prev,
      [wsId]: !prev[wsId],
    }));
  };

  useEffect(() => {
    if (propWorkshops !== undefined) {
      setWorkshops(propWorkshops.slice(0, 3));
      return;
    }

    const loadFeatured = async () => {
      try {
        const homeData = await CmsService.getHomeContent();
        if (homeData?.featuredWorkshops && homeData.featuredWorkshops.length > 0) {
          setWorkshops(homeData.featuredWorkshops.slice(0, 3));
        } else {
          const liveWorkshops = await CmsService.getWorkshops('published');
          const featured = liveWorkshops.filter((w) => w.featured);
          setWorkshops(featured.length > 0 ? featured.slice(0, 3) : liveWorkshops.slice(0, 3));
        }
      } catch (err) {
        setWorkshops([]);
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
  }, [propWorkshops]);

  if (!workshops || workshops.length === 0) {
    return null;
  }

  // Strictly display only 3 featured workshops on the homepage
  const displayedWorkshops = workshops.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 bg-canvas-warm relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Special Programs"
          title="Featured Workshops"
          description="Specialized yoga therapy and wellness workshops designed for specific health conditions and holistic self-care."
          align="asymmetric"
          action={
            <LinkButton to="/workshops" variant="text" size="md" withArrow>
              View All Workshops
            </LinkButton>
          }
        />

        {/* Dynamic Workshop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {displayedWorkshops.map((ws: any, index) => {
            const wsId =
              (typeof ws._id === 'string' && ws._id.trim() ? ws._id : null) ||
              (typeof ws.id === 'string' && ws.id.trim() ? ws.id : null) ||
              (typeof ws.slug === 'string' && ws.slug.trim() ? ws.slug : null) ||
              (ws._id && typeof ws._id.toString === 'function' && ws._id.toString() !== '[object Object]' ? ws._id.toString() : null) ||
              `ws-${index}`;
            const isExpanded = Boolean(expandedWorkshops[wsId]);

            const coverUrl =
              ws.coverImage?.url ||
              ws.image?.url ||
              (typeof ws.image === 'string' ? ws.image : null) ||
              '';

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
              (typeof ws.price === 'string'
                ? ws.price
                : ws.price?.amount
                ? `₹${ws.price.amount.toLocaleString()}`
                : '');

            const instructorName =
              typeof ws.instructor === 'string'
                ? ws.instructor
                : ws.instructor?.name || 'Mrs. Shuchi Mohan';

            const instructorTitle =
              typeof ws.instructor === 'object' ? ws.instructor?.title : null;

            const timeDisplay =
              ws.time ||
              (ws.startTime ? `${ws.startTime}${ws.endTime ? ` – ${ws.endTime}` : ''}` : null);

            const venueDisplay =
              ws.location?.venue ||
              (ws.mode === 'online' ? 'Live Online Session' : null);

            const remainingSeats =
              ws.capacity?.total !== undefined && ws.capacity?.total !== null
                ? Math.max(0, ws.capacity.total - (ws.capacity?.booked || 0))
                : null;

            return (
              <article
                key={wsId}
                className={`bg-surface border rounded-[2px] overflow-hidden flex flex-col justify-between shadow-card transition-all duration-300 group ${
                  isExpanded ? 'border-gold-500 ring-1 ring-gold-500/30' : 'border-border hover:border-gold-500/70'
                }`}
              >
                {/* Workshop Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-plum-950 flex items-center justify-center">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={ws.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      unoptimized={!isOptimizedUrl(coverUrl)}
                    />
                  ) : (
                    <div className="w-full h-full min-h-[200px] flex items-center justify-center p-8 text-gold-400">
                      <LotusMotif size={48} />
                    </div>
                  )}
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-ink-faint">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold-700" />
                        {ws.duration}
                      </span>
                      <span>Level: {ws.level || 'All Levels'}</span>
                    </div>

                    <h3 className="text-xl font-editorial font-normal text-plum-900 leading-snug group-hover:text-plum-800 transition-colors">
                      {ws.title}
                    </h3>

                    {/* Short Description */}
                    <p
                      className={`text-xs text-ink-muted leading-relaxed font-sans ${
                        !isExpanded ? 'line-clamp-3' : ''
                      }`}
                    >
                      {ws.shortDescription || ws.description}
                    </p>

                    {/* Expand / Collapse Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(wsId)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 hover:text-gold-600 transition-colors py-1 cursor-pointer"
                      >
                        <span>
                          {isExpanded ? 'Collapse Workshop Details' : 'Expand Full Details'}
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

                    {/* EXPANDED CONTENT ON CLICK (Smooth Animated Accordion) */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isExpanded
                          ? 'grid-rows-[1fr] opacity-100 pt-3 border-t border-border/70'
                          : 'grid-rows-[0fr] opacity-0 pt-0 border-t-0 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden space-y-3.5">
                        {/* Full Description if different */}
                        {ws.description && ws.description !== ws.shortDescription && (
                          <div className="text-xs text-ink-muted leading-relaxed font-sans whitespace-pre-line">
                            {ws.description}
                          </div>
                        )}

                        {/* Timing & Venue Grid */}
                        <div className="space-y-2 bg-canvas-warm/70 border border-border/80 rounded p-3 text-xs">
                          {timeDisplay && (
                            <div className="flex items-center gap-2 text-ink-muted">
                              <Clock className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                              <span>{timeDisplay}</span>
                            </div>
                          )}

                          {venueDisplay && (
                            <div className="flex items-start gap-2 text-ink-muted">
                              <MapPin className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                              <span>
                                {venueDisplay}
                                {ws.location?.city ? `, ${ws.location.city}` : ''}
                              </span>
                            </div>
                          )}

                          {remainingSeats !== null && (
                            <div className="flex items-center gap-2 text-ink-muted">
                              <Users className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                              <span>
                                Seats: {remainingSeats} / {ws.capacity.total} available
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Prerequisites if present */}
                        {ws.prerequisites && ws.prerequisites.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-mono text-gold-800 font-semibold tracking-wider block">
                              Prerequisites & Preparation
                            </span>
                            <div className="space-y-1">
                              {ws.prerequisites.map((req: string, rIdx: number) => (
                                <div
                                  key={rIdx}
                                  className="flex items-start gap-1.5 text-xs text-ink-muted"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-gold-600 shrink-0 mt-0.5" />
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="pt-2 text-[11px] text-ink-muted border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-plum-900">Guided by: </span>
                      <span>{instructorName}</span>
                      {instructorTitle && (
                        <span className="text-ink-faint text-[10px] block">{instructorTitle}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Details Action */}
                <div className="px-6 py-4 bg-canvas-warm/70 border-t border-border flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-ink-faint block">Investment</span>
                    <span className="text-base font-editorial font-semibold text-plum-900">{priceDisplay || '—'}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(wsId)}
                      className="px-3 py-1.5 border border-border hover:border-gold-500 rounded text-xs font-medium text-plum-900 transition-colors cursor-pointer bg-surface"
                    >
                      {isExpanded ? 'Less' : 'Details'}
                    </button>
                    <LinkButton
                      to={`/contact?program=${encodeURIComponent(ws.title)}&type=workshop`}
                      variant="primary"
                      size="sm"
                    >
                      Enroll
                    </LinkButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedWorkshopsSection;
