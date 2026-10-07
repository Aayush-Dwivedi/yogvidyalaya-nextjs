'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { LinkButton } from '../components/LinkButton';
import { Modal } from '../components/Modal';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import { CmsVideo } from '../types/cms';
import { useAuth } from '../context/AuthContext';
import {
  Play,
  Search,
  Clock,
  User,
  Film,
  ExternalLink,
  Sparkles,
  Filter,
  ArrowRight,
  BookOpen,
  Share2,
  Check,
} from 'lucide-react';

interface NormalizedVideo {
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl?: string;
  thumbnail: string;
  category: string;
  duration: string;
  speaker: string;
  description: string;
  featured: boolean;
  order: number;
  createdAt?: string;
}

const extractVideoId = (v: CmsVideo): string => {
  if (v.youtubeVideoId && v.youtubeVideoId.length === 11) return v.youtubeVideoId;
  const rawUrl = v.youtubeUrl || '';
  const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
};

export const VideosPage: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<NormalizedVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<NormalizedVideo | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const live = await CmsService.getVideos('published');
      if (Array.isArray(live)) {
        const mapped: NormalizedVideo[] = live
          .filter((v) => v && (v.status === undefined || v.status === 'published'))
          .map((v, idx) => {
            const yId = extractVideoId(v);
            return {
              id: v._id || v.id || `video-${idx}`,
              title: v.title || 'Classical Yoga Session',
              youtubeId: yId,
              youtubeUrl: v.youtubeUrl,
              thumbnail:
                v.thumbnail?.url ||
                (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : ''),
              category: v.category || 'Discourse',
              duration: v.duration || 'Session',
              speaker: v.speaker || 'Mrs. Shuchi Mohan',
              description: v.description || '',
              featured: Boolean(v.featured),
              order: v.order || 0,
              createdAt: v.createdAt,
            };
          })
          .filter((v) => v.title && (v.youtubeId || v.thumbnail))
          .sort((a, b) => a.order - b.order);
        setVideos(mapped);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Error fetching video archives:', err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();

    const handleUpdate = () => {
      fetchVideos();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute unique dynamic categories from live database
  const categories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => {
      if (v.category && v.category.trim()) {
        set.add(v.category.trim());
      }
    });
    return Array.from(set);
  }, [videos]);

  // Filtered list
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.speaker.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'all' ||
        v.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [videos, searchQuery, selectedCategory]);

  // Featured spotlight video (first featured or first item)
  const spotlightVideo = useMemo(() => {
    if (searchQuery || selectedCategory !== 'all') return null;
    return videos.find((v) => v.featured) || (videos.length > 0 ? videos[0] : null);
  }, [videos, searchQuery, selectedCategory]);

  const handleCopyLink = (video: NormalizedVideo) => {
    const url = video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(video.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* 1. HERO HEADER with Feelable Animated Auric Gradient */}
      <section className="relative py-20 sm:py-28 bg-plum-950 text-ivory overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center space-x-3">
              <Film className="w-5 h-5 text-gold-400 shrink-0" />
              <span className="w-8 h-px bg-gold-400" />
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                Wisdom &amp; Visual Archives
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 leading-tight">
              Video Library &amp; Masterclasses
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl font-sans font-light leading-relaxed">
              Curated recordings of scriptural explanations, guided sadhana demonstrations, and interactive NCERT sessions conducted by our faculty.
            </p>

            {/* Quick Filter / Quality Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-plum-900/90 text-gold-300 border border-gold-500/30">
                • NCERT Platform
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-plum-900/90 text-gold-300 border border-gold-500/30">
                • Classical Alignment
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-plum-900/90 text-gold-300 border border-gold-500/30">
                • Yogic Discourses
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-plum-900/90 text-gold-300 border border-gold-500/30">
                • Therapeutic Health
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. FILTER & SEARCH CONTROLS BAR */}
      <section className="bg-surface border-b border-border sticky top-16 z-30 shadow-xs backdrop-blur-md bg-surface/95">
        <Container size="wide" className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-plum-900 text-gold-300 shadow-soft'
                    : 'bg-canvas-warm text-ink-muted hover:text-plum-900 hover:bg-gold-500/10'
                }`}
              >
                All Videos ({videos.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-plum-900 text-gold-300 shadow-soft'
                      : 'bg-canvas-warm text-ink-muted hover:text-plum-900 hover:bg-gold-500/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic, speaker, asana..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-canvas-warm border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-ink placeholder:text-ink-faint"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint hover:text-ink"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. MAIN VIDEO LIBRARY CONTENT */}
      <section className="py-12 sm:py-16">
        <Container size="wide">
          {loading ? (
            <div className="py-16">
              <LoadingState message="Loading authentic video sessions..." />
            </div>
          ) : videos.length === 0 ? (
            /* EMPTY STATE: ZERO VIDEOS IN DATABASE (NO DUMMY VIDEOS) */
            <div className="py-12 sm:py-20 text-center">
              <div className="max-w-xl mx-auto bg-surface border border-gold-500/30 rounded-2xl p-8 sm:p-12 shadow-card space-y-5">
                <div className="w-16 h-16 rounded-full bg-plum-900/10 border border-gold-500/40 text-gold-600 flex items-center justify-center mx-auto shadow-soft">
                  <Film className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 font-semibold block">
                    Curated Archive
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900">
                    Video Library Being Curated
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                    Our Acharyas and faculty regularly record guided sadhana sessions, interactive NCERT lectures, and postural demonstrations. New video sessions will be published here shortly.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <LinkButton to="/programs/courses" variant="primary" size="md">
                    Explore Courses
                  </LinkButton>
                  <LinkButton to="/contact" variant="outline" size="md">
                    Contact Reception
                  </LinkButton>
                  {user?.role === 'admin' && (
                    <LinkButton to="/admin/media/videos" variant="secondary" size="md">
                      Admin: Add Videos
                    </LinkButton>
                  )}
                </div>
              </div>
            </div>
          ) : filteredVideos.length === 0 ? (
            /* EMPTY STATE: SEARCH / FILTER RETURNED ZERO */
            <div className="py-16 text-center space-y-4">
              <Filter className="w-10 h-10 text-gold-600 mx-auto opacity-70" />
              <h3 className="text-xl font-editorial text-plum-900">
                No Video Sessions Found
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
                No video sessions matched &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 text-xs font-medium rounded-full bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors cursor-pointer"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* SPOTLIGHT HERO CARD (when present and viewing 'all' without query) */}
              {spotlightVideo && (
                <div className="bg-surface border border-gold-500/30 rounded-2xl overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-12 gap-0 group">
                  {/* Spotlight Thumbnail & Play Trigger */}
                  <div
                    onClick={() => setSelectedVideo(spotlightVideo)}
                    className="lg:col-span-7 relative aspect-video bg-plum-950 cursor-pointer overflow-hidden"
                    role="button"
                    tabIndex={0}
                    aria-label={`Play spotlight session: ${spotlightVideo.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedVideo(spotlightVideo);
                    }}
                  >
                    <img
                      src={spotlightVideo.thumbnail}
                      alt={spotlightVideo.title}
                      className="w-full h-full object-cover filter brightness-[0.82] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-plum-950/40 group-hover:bg-plum-950/20 transition-colors" />

                    {/* Big Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-plum-900/90 border border-gold-400 text-gold-300 flex items-center justify-center shadow-modal group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-plum-950 transition-all duration-300">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                      </div>
                    </div>

                    {/* Spotlight Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Badge variant="plum" size="sm">
                        {spotlightVideo.category}
                      </Badge>
                      <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-gold-500 text-plum-950 font-bold shadow-xs">
                        Featured
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <span className="text-xs font-mono text-ivory bg-plum-950/90 px-3 py-1 rounded-[2px] border border-border/40 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold-400" />
                        {spotlightVideo.duration}
                      </span>
                    </div>
                  </div>

                  {/* Spotlight Metadata & Actions */}
                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gold-700">
                        <Sparkles className="w-4 h-4 text-gold-500" />
                        <span className="text-xs uppercase font-mono tracking-widest font-semibold">
                          Spotlight Session
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-plum-900 leading-tight">
                        {spotlightVideo.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-ink-muted font-sans font-light leading-relaxed line-clamp-3">
                        {spotlightVideo.description ||
                          'Live interactive discourse presenting authentic principles of yogic sadhana, postural breath mechanics, and mind equilibrium.'}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs text-ink-muted">
                        <User className="w-4 h-4 text-gold-600" />
                        <span className="font-medium text-plum-900">
                          {spotlightVideo.speaker}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedVideo(spotlightVideo)}
                        className="px-5 py-2.5 rounded-full bg-plum-900 text-gold-300 hover:bg-gold-500 hover:text-plum-950 transition-colors text-xs font-medium flex items-center gap-2 cursor-pointer shadow-soft"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Session</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(spotlightVideo)}
                        className="p-2.5 rounded-full bg-canvas-warm text-ink-muted hover:text-plum-900 border border-border transition-colors cursor-pointer"
                        title="Copy session link"
                        aria-label="Copy session link"
                      >
                        {copiedId === spotlightVideo.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIDEO ARCHIVE GRID */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-editorial font-normal text-plum-900">
                      {selectedCategory === 'all'
                        ? 'All Masterclass Sessions'
                        : `${selectedCategory} Sessions`}
                    </h3>
                    <p className="text-xs text-ink-muted font-sans">
                      Showing {filteredVideos.length} archived recording{filteredVideos.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredVideos.map((video) => (
                    <article
                      key={video.id}
                      className="bg-surface border border-border rounded-xl overflow-hidden shadow-card hover:border-gold-500/60 hover:shadow-modal transition-all duration-300 flex flex-col group cursor-pointer"
                      onClick={() => setSelectedVideo(video)}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video bg-plum-950 overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-plum-950/30 group-hover:bg-plum-950/10 transition-colors" />

                        {/* Centered Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-plum-900/90 border border-gold-400 text-gold-300 flex items-center justify-center shadow-soft group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-plum-950 transition-all">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge variant="plum" size="sm">
                            {video.category}
                          </Badge>
                        </div>

                        {/* Duration Pill */}
                        <div className="absolute bottom-3 right-3">
                          <span className="text-[11px] font-mono text-ivory bg-plum-950/85 px-2 py-0.5 rounded-[2px] border border-border/30 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gold-400" />
                            {video.duration}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-gold-700 font-mono">
                            <User className="w-3.5 h-3.5 text-gold-600" />
                            <span className="truncate">{video.speaker}</span>
                          </div>

                          <h4 className="font-editorial text-lg text-plum-900 group-hover:text-gold-700 transition-colors line-clamp-2 leading-snug">
                            {video.title}
                          </h4>

                          {video.description && (
                            <p className="text-xs text-ink-muted font-sans font-light line-clamp-2 leading-relaxed">
                              {video.description}
                            </p>
                          )}
                        </div>

                        {/* Action Row */}
                        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-plum-900 font-medium">
                          <span className="flex items-center gap-1 text-gold-700 group-hover:text-gold-600 transition-colors">
                            Watch Video <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(video);
                            }}
                            className="p-1.5 rounded-full hover:bg-canvas-warm text-ink-muted hover:text-plum-900 transition-colors"
                            title="Share video"
                            aria-label="Share video"
                          >
                            {copiedId === video.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 4. ASHRAM GUIDANCE & SESSIONS BANNER */}
      <section className="py-16 bg-canvas-warm border-t border-border">
        <Container size="default" className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-plum-900 text-gold-400 flex items-center justify-center mx-auto shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-editorial text-plum-900">
            Seeking Specialized Guided Sadhana?
          </h2>

          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto font-sans leading-relaxed">
            In addition to public NCERT discourses, Mrs. Shuchi Mohan conducts focused therapy intensives, teacher certification immersions, and daily morning and evening ashram sadhana batches.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <LinkButton to="/programs/courses" variant="primary" size="md">
              View Certified Courses
            </LinkButton>
            <LinkButton to="/contact" variant="outline" size="md">
              Request Topic Session
            </LinkButton>
          </div>
        </Container>
      </section>

      {/* 5. INTERACTIVE VIDEO MODAL */}
      {selectedVideo && (
        <Modal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          description={`Presented by ${selectedVideo.speaker} • ${selectedVideo.duration} • ${selectedVideo.category}`}
          size="xl"
        >
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-plum-950 border border-border shadow-modal">
              {selectedVideo.youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ivory/60 text-xs font-mono">
                  Video preview unavailable
                </div>
              )}
            </div>

            {/* Video Details in Modal */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="plum" size="sm">
                    {selectedVideo.category}
                  </Badge>
                  <span className="text-xs font-mono text-ink-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-600" />
                    {selectedVideo.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(selectedVideo)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-canvas-warm hover:bg-gold-500/10 text-ink border border-border transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === selectedVideo.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-ink-muted" />
                        <span>Share Link</span>
                      </>
                    )}
                  </button>

                  {(selectedVideo.youtubeUrl || selectedVideo.youtubeId) && (
                    <a
                      href={
                        selectedVideo.youtubeUrl ||
                        `https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors flex items-center gap-1.5"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {selectedVideo.description && (
                <div className="bg-canvas-warm p-4 rounded-lg border border-border text-xs sm:text-sm text-ink-muted leading-relaxed font-sans font-light">
                  <span className="font-medium text-plum-900 block mb-1">
                    About this Session:
                  </span>
                  {selectedVideo.description}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VideosPage;
