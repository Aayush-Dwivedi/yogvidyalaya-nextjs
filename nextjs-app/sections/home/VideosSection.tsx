'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { Modal } from '../../components/Modal';
import { VideoItem } from '../../types/home';
import { CmsVideo } from '../../types/cms';
import { CmsService } from '../../services/cmsService';

export interface VideosSectionProps {
  videos?: (VideoItem | CmsVideo)[];
}

const extractVideoId = (v: any): string => {
  if (v.youtubeVideoId && v.youtubeVideoId.length === 11) return v.youtubeVideoId;
  if (v.youtubeId && v.youtubeId.length === 11) return v.youtubeId;
  const rawUrl = v.youtubeUrl || v.url || '';
  const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
};

const normalizeVideos = (items: any[]): VideoItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .filter((v) => v && (v.status === undefined || v.status === 'published'))
    .map((v, idx) => {
      const yId = extractVideoId(v);
      return {
        id: v._id || v.id || `video-${idx}`,
        title: v.title || 'Live Yoga Interactive Session',
        youtubeId: yId,
        thumbnail:
          v.thumbnail?.url ||
          v.thumbnail ||
          (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : ''),
        category: v.category || 'Discourse',
        duration: v.duration || 'Session',
        speaker: v.speaker || v.instructor || 'Mrs. Shuchi Mohan',
        description: v.description || '',
        views: v.views || '',
      };
    })
    .filter((v) => v.title && (v.youtubeId || v.thumbnail));
};

export const VideosSection: React.FC<VideosSectionProps> = ({ videos: propVideos }) => {
  const [videos, setVideos] = useState<VideoItem[]>(() =>
    propVideos && propVideos.length > 0 ? normalizeVideos(propVideos) : []
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    if (propVideos && propVideos.length > 0) {
      setVideos(normalizeVideos(propVideos));
    }
  }, [propVideos]);

  useEffect(() => {
    const fetchLiveVideos = async () => {
      try {
        const live = await CmsService.getVideos('published');
        if (live && live.length > 0) {
          const featured = live.filter((v) => v.featured);
          const toUse = featured.length > 0 ? featured : live;
          setVideos(normalizeVideos(toUse));
        } else {
          setVideos([]);
        }
      } catch (err) {
        setVideos([]);
      }
    };

    if (!propVideos || propVideos.length === 0) {
      fetchLiveVideos();
    }

    const handleUpdate = () => {
      fetchLiveVideos();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [propVideos]);

  if (!videos || videos.length === 0) {
    return null;
  }

  const [mainVideo, ...supportingVideos] = videos;

  return (
    <section className="py-20 sm:py-28 bg-canvas-warm relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Expert Sessions"
          title="Expert Yoga Session for NCERT Platform"
          description="Live Yoga & Interactive Session with Experts"
          align="asymmetric"
          action={
            <LinkButton to="/videos" variant="text" size="md" withArrow>
              View All Videos
            </LinkButton>
          }
        />

        {/* Editorial Video Composition: 1 Large + 2 Supporting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Featured Large Video (7 cols) */}
          <div className="lg:col-span-7 bg-surface border border-border rounded-[2px] p-3 shadow-card flex flex-col justify-between group">
            <div
              onClick={() => setSelectedVideo(mainVideo)}
              className="relative aspect-video overflow-hidden rounded-[1px] bg-plum-950 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Play video: ${mainVideo?.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedVideo(mainVideo);
              }}
            >
              <img
                src={mainVideo?.thumbnail}
                alt={mainVideo?.title}
                className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-plum-950/40 group-hover:bg-plum-950/20 transition-colors" />

              {/* Central Play Indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-plum-900/90 border border-gold-400/80 text-gold-300 flex items-center justify-center shadow-modal group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-plum-950 transition-all duration-300">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" viewBox="0 0 24 24">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3">
                <Badge variant="dark" size="sm">
                  {mainVideo?.category}
                </Badge>
              </div>

              <div className="absolute bottom-3 right-3">
                <span className="text-[11px] font-mono text-ivory bg-plum-950/80 px-2.5 py-1 rounded-[2px] border border-border/40">
                  {mainVideo?.duration}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-xs uppercase font-mono tracking-wide text-gold-700 block mb-1">
                Speaker: {mainVideo?.speaker}
              </span>
              <h3 className="text-xl sm:text-2xl font-editorial font-normal text-plum-900 leading-snug">
                {mainVideo?.title}
              </h3>
            </div>
          </div>

          {/* Supporting Stacked Videos (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {supportingVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="bg-surface border border-border p-4 rounded-[2px] shadow-card hover:border-gold-500/70 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                role="button"
                tabIndex={0}
                aria-label={`Play video: ${video.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedVideo(video);
                }}
              >
                {/* Video Thumbnail */}
                <div className="relative w-full sm:w-44 aspect-video shrink-0 overflow-hidden rounded-[1px] bg-plum-950">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Small Play Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-plum-900/90 border border-gold-400/70 text-gold-300 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-plum-950 transition-colors shadow-soft">
                      <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5">
                    <span className="text-[10px] font-mono text-ivory bg-plum-950/90 px-1.5 py-0.5 rounded-[1px]">
                      {video.duration}
                    </span>
                  </div>
                </div>

                {/* Video Content */}
                <div className="space-y-1">
                  <Badge variant="plum" size="sm">
                    {video.category}
                  </Badge>
                  <h4 className="text-base font-editorial font-normal text-plum-900 leading-snug group-hover:text-plum-800 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-ink-faint font-sans">
                    {video.speaker}
                  </p>
                </div>
              </div>
            ))}

            {/* Video Library Summary Card */}
            <div className="bg-canvas border border-dashed border-gold-400/60 p-5 rounded-[2px] text-center space-y-2">
              <span className="text-xs font-semibold text-plum-900 font-sans block">
                NCERT Platform Sessions
              </span>
              <p className="text-xs text-ink-muted font-sans font-light">
                Live Yoga &amp; Interactive Sessions with Experts
              </p>
              <div className="pt-2">
                <LinkButton to="/videos" variant="secondary" size="sm" withArrow>
                  Browse Videos
                </LinkButton>
              </div>
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <Modal
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
            title={selectedVideo.title}
            description={`Presented by ${selectedVideo.speaker} • ${selectedVideo.duration}`}
            size="xl"
          >
            <div className="aspect-video w-full rounded-[2px] overflow-hidden bg-plum-950 border border-border">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Modal>
        )}
      </Container>
    </section>
  );
};

export default VideosSection;
