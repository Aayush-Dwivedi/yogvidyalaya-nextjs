'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { LinkButton } from '../components/LinkButton';
import { LotusMotif } from '../components/Motifs';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import { CmsWorkshop } from '../types/cms';
import { LoadingState } from '../components/LoadingState';
import { isOptimizedUrl } from '../utils/imageUtils';
import {
  Clock,
  MapPin,
  Users,
  Flame,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

export interface WorkshopsPageProps {
  initialWorkshops?: CmsWorkshop[];
}

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({ initialWorkshops }) => {
  const [workshops, setWorkshops] = useState<CmsWorkshop[]>(() => initialWorkshops || []);
  const [loading, setLoading] = useState<boolean>(() => initialWorkshops === undefined);

  // Filters & Search
  const [selectedMode, setSelectedMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [expandedWorkshops, setExpandedWorkshops] = useState<Record<string, boolean>>({});

  const toggleExpand = (wsId: string) => {
    setExpandedWorkshops((prev) => ({
      ...prev,
      [wsId]: !prev[wsId],
    }));
  };


  useEffect(() => {
    const fetchWorkshops = async (showLoading = false) => {
      try {
        if (showLoading) setLoading(true);
        const data = await CmsService.getWorkshops('published');
        if (data) setWorkshops(data);
      } catch (err: any) {
        console.error('Failed to load workshops from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!initialWorkshops || initialWorkshops.length === 0) {
      fetchWorkshops(true);
    }

    const handleUpdate = () => fetchWorkshops(false);
    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialWorkshops]);


  const now = new Date();

  const filteredWorkshops = workshops.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location?.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'all' || w.mode === selectedMode;
    const matchesUpcoming = !upcomingOnly || (w.date ? new Date(w.date) >= now : true);
    return matchesSearch && matchesMode && matchesUpcoming;
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
              <span className="text-gold-200 font-semibold">Workshops</span>
            </nav>

            <div className="flex items-center justify-center">
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                Specialized Workshops
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 leading-tight">
              Workshops &amp; Special Sessions
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed max-w-2xl mx-auto font-light">
              Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active through focused workshops.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-gold-300/80">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-gold-400" />
                Therapeutic Care
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold-400" />
                Qualified Guidance
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" />
                Safe &amp; Effective Practice
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Filter & Search Toolbar */}
      <section className="bg-canvas-warm border-b border-border/80 sticky top-16 z-20 py-4 shadow-sm backdrop-blur-md bg-canvas-warm/95">
        <Container size="wide">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-sans text-xs">
            {/* Search Input */}
            <div className="flex items-center gap-2 flex-1 max-w-md bg-surface border border-border rounded-lg px-3.5 py-2 shadow-sm focus-within:border-gold-500">
              <Search className="w-4 h-4 text-ink-faint shrink-0" />
              <input
                type="text"
                placeholder="Search workshops by topic, venue, teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-ink placeholder-ink-faint outline-none w-full text-xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Filter className="w-3.5 h-3.5 text-gold-700" />
                <span className="font-medium">Filter:</span>
              </div>

              {/* Mode Filter */}
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="bg-surface border border-border text-ink rounded-lg px-3 py-1.5 text-xs outline-none focus:border-gold-500 shadow-sm"
              >
                <option value="all">All Delivery Modes</option>
                <option value="in-person">In-Person Shala</option>
                <option value="residential">Residential Retreat</option>
                <option value="online">Online Live Streaming</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <label className="flex items-center gap-1.5 cursor-pointer bg-surface border border-border px-3 py-1.5 rounded-lg text-ink">
                <input
                  type="checkbox"
                  checked={upcomingOnly}
                  onChange={(e) => setUpcomingOnly(e.target.checked)}
                  className="rounded text-gold-600 focus:ring-gold-500"
                />
                <span>Upcoming Only</span>
              </label>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Workshops Grid */}
      <section className="py-14 sm:py-20">
        <Container size="wide">
          {loading ? (
            <div className="py-24">
              <LoadingState message="Loading upcoming sadhana masterclasses..." />
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-xl p-8 max-w-lg mx-auto shadow-card">
              <LotusMotif size={48} className="text-gold-500/60 mx-auto mb-3" />
              <h3 className="text-xl font-editorial font-normal text-plum-900 mb-1">
                No Workshops Found
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed font-sans mb-4">
                No scheduled masterclasses currently match your selected filters. Reset filters to see all intensives.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMode('all');
                  setUpcomingOnly(false);
                }}
                className="px-4 py-2 bg-gold-500 text-plum-950 font-medium rounded-lg text-xs hover:bg-gold-400 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {filteredWorkshops.map((ws, idx) => {
                const wsId =
                  (typeof ws._id === 'string' && ws._id.trim() ? ws._id : null) ||
                  (typeof ws.id === 'string' && ws.id.trim() ? ws.id : null) ||
                  (typeof ws.slug === 'string' && ws.slug.trim() ? ws.slug : null) ||
                  (ws._id && typeof ws._id.toString === 'function' && ws._id.toString() !== '[object Object]' ? ws._id.toString() : null) ||
                  `workshop-${idx}`;
                const coverUrl = ws.coverImage?.url || ws.image?.url;
                const remainingSeats =
                  ws.capacity && ws.capacity.total
                    ? Math.max(0, ws.capacity.total - (ws.capacity.booked || 0))
                    : null;

                const formattedDate = ws.date
                  ? new Date(ws.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'TBA';

                const formattedDeadline = ws.registrationDeadline
                  ? new Date(ws.registrationDeadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : null;

                const isExpanded = Boolean(expandedWorkshops[wsId]);

                return (
                  <article
                    key={wsId || idx}
                    className={`bg-surface border rounded-[2px] overflow-hidden flex flex-col justify-between shadow-card transition-all duration-300 group hover:-translate-y-1 ${
                      isExpanded ? 'border-gold-500 ring-1 ring-gold-500/30' : 'border-border hover:border-gold-500/70'
                    }`}
                  >
                    {/* Card Top: Image Banner */}
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface-subtle">
                        {coverUrl ? (
                          <Image
                            src={coverUrl}
                            alt={ws.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                            loading="lazy"
                            unoptimized={!isOptimizedUrl(coverUrl)}
                          />
                        ) : (
                          <div className="w-full h-full bg-plum-950 flex items-center justify-center p-6 text-gold-400">
                            <LotusMotif size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent pointer-events-none" />

                        {/* Floating Date Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge variant="dark" size="sm">
                            {formattedDate}
                          </Badge>
                        </div>

                        {/* Mode Tag */}
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[11px] font-sans text-ivory/95 bg-plum-900/80 backdrop-blur-sm px-2.5 py-1 rounded-[2px] border border-gold-400/30 capitalize">
                            {ws.mode}
                          </span>
                        </div>

                        {/* Featured Tag */}
                        {ws.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="gold" size="sm" dot>
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 sm:p-7 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-ink-faint">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gold-700" />
                              {ws.duration}
                            </span>
                            <span>{ws.startTime} - {ws.endTime}</span>
                          </div>

                          <h3 className="text-xl font-editorial font-normal text-plum-900 leading-snug group-hover:text-plum-800 transition-colors">
                            {ws.title}
                          </h3>

                          {/* Short Description */}
                          <p
                            className={`text-xs text-ink-muted leading-relaxed font-sans font-light ${
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

                              {/* Timing, Venue & Capacity Details */}
                              <div className="space-y-2 bg-canvas-warm/70 border border-border/80 rounded p-3 text-xs">
                                {(ws.time || (ws.startTime && ws.endTime)) && (
                                  <div className="flex items-center gap-2 text-ink-muted">
                                    <Clock className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                                    <span>{ws.time || `${ws.startTime} - ${ws.endTime}`}</span>
                                  </div>
                                )}

                                <div className="flex items-start gap-2 text-ink-muted">
                                  <MapPin className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                                  <span>
                                    {ws.location?.venue || 'Tapovan Shala'}
                                    {ws.location?.city ? `, ${ws.location.city}` : ''}
                                  </span>
                                </div>

                                {remainingSeats !== null && (
                                  <div className="flex items-center gap-2 text-ink-muted">
                                    <Users className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                                    <span>
                                      Seats: {remainingSeats} {ws.capacity?.total ? `/ ${ws.capacity.total}` : ''} remaining
                                    </span>
                                  </div>
                                )}

                                {formattedDeadline && (
                                  <div className="text-[10px] text-ink-faint pt-1 border-t border-border/50">
                                    Registration Closes: {formattedDeadline}
                                  </div>
                                )}
                              </div>

                              {/* Instructor */}
                              {ws.instructor?.name && (
                                <div className="text-xs text-ink-muted pt-1">
                                  <span className="font-semibold text-plum-900">Conducted by: </span>
                                  <span>{ws.instructor.name}</span>
                                  {ws.instructor.title && (
                                    <span className="text-ink-faint text-[11px] block">
                                      {ws.instructor.title}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Prerequisites if present */}
                              {ws.prerequisites && ws.prerequisites.length > 0 && (
                                <div className="space-y-1.5 pt-1">
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
                      </div>
                    </div>

                    {/* Card Footer: Price & CTA */}
                    <div className="px-6 py-4 bg-canvas-warm/70 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-ink-faint block">
                          Investment
                        </span>
                        <span className="text-base font-editorial font-semibold text-plum-900">
                          {ws.price?.displayPrice ||
                            (ws.price?.amount
                              ? `₹${ws.price.amount.toLocaleString()}`
                              : 'Complimentary')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpand(wsId)}
                          className="px-3 py-1.5 border border-border hover:border-gold-500 rounded text-xs font-medium text-plum-900 transition-colors cursor-pointer bg-surface"
                        >
                          {isExpanded ? 'Less' : 'Details'}
                        </button>
                        <LinkButton
                          to={`/contact?program=${encodeURIComponent(ws.title)}`}
                          variant="primary"
                          size="sm"
                          className="rounded-lg px-4 py-2 font-medium whitespace-nowrap"
                          withArrow
                        >
                          Book Now
                        </LinkButton>
                        <LinkButton
                          to={`/contact?program=${encodeURIComponent(ws.title)}&type=workshop`}
                          variant="outline"
                          size="sm"
                          className="rounded-lg px-3.5 py-2 font-medium whitespace-nowrap"
                        >
                          Enquire
                        </LinkButton>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* 4. Custom Intensives for Shalas & Groups Banner */}
      <section className="py-16 bg-canvas-warm border-t border-border">
        <Container size="default" className="text-center space-y-4">
          <LotusMotif size={36} className="text-gold-600 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-editorial text-plum-900">
            Host a Workshop with Kalptaruu Yoga Vidhyalaya
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto font-sans leading-relaxed">
            Mrs. Shuchi Mohan conducts specialized workshops on therapeutic yoga, postural alignment, and holistic wellness for institutions, organizations, and groups.
          </p>
          <div className="pt-2">
            <LinkButton to="/contact?type=workshop" variant="outline" size="md">
              Enquire About Workshops
            </LinkButton>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default WorkshopsPage;
