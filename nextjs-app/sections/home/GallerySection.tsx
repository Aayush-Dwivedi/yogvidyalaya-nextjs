'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { GALLERY_HIGHLIGHTS } from '../../services/homeData';
import { CornerFlourish, LotusMotif } from '../../components/Motifs';
import { GalleryHighlight } from '../../types/home';
import { CmsGalleryImage } from '../../types/cms';
import { CmsService } from '../../services/cmsService';

export interface GallerySectionProps {
  highlights?: (GalleryHighlight | CmsGalleryImage)[];
}

const normalizeHighlights = (items: any[]): GalleryHighlight[] => {
  const normalized = items.map((g, idx) => ({
    id: g._id || g.id || `gallery-${idx}`,
    title: g.title || 'Institute Moment',
    caption: g.caption || g.description || '',
    category: (typeof g.category === 'object' ? g.category?.name : g.category) || 'Practice',
    image:
      (typeof g.image === 'string' ? g.image : g.image?.url) ||
      GALLERY_HIGHLIGHTS[idx % GALLERY_HIGHLIGHTS.length]?.image ||
      '',
  }));

  // Ensure we have at least 3 items by falling back to static highlights
  while (normalized.length < 3) {
    normalized.push(GALLERY_HIGHLIGHTS[normalized.length]);
  }
  return normalized;
};

export const GallerySection: React.FC<GallerySectionProps> = ({ highlights: propHighlights }) => {
  const [highlights, setHighlights] = useState<GalleryHighlight[]>(() =>
    propHighlights && propHighlights.length > 0
      ? normalizeHighlights(propHighlights)
      : GALLERY_HIGHLIGHTS
  );

  useEffect(() => {
    if (propHighlights && propHighlights.length > 0) {
      setHighlights(normalizeHighlights(propHighlights));
    }
  }, [propHighlights]);

  useEffect(() => {
    const fetchLiveGallery = async () => {
      try {
        const homeData = await CmsService.getHomeContent();
        if (homeData?.galleryHighlights && homeData.galleryHighlights.length > 0) {
          setHighlights(normalizeHighlights(homeData.galleryHighlights));
        }
      } catch (err) {
        console.warn('Using default gallery highlights:', err);
      }
    };

    if (!propHighlights || propHighlights.length === 0) {
      fetchLiveGallery();
    }

    const handleUpdate = () => {
      fetchLiveGallery();
    };

    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [propHighlights]);

  const [img1, img2, img3] = highlights;

  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Institute Moments"
          title="Gallery"
          description="Photos from our classes and events"
          align="asymmetric"
          motif={<LotusMotif size={28} />}
          action={
            <LinkButton to="/gallery" variant="text" size="md" withArrow>
              View More Images
            </LinkButton>
          }
        />

        {/* Asymmetric Gallery Composition (Varying Dimensions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Large Feature Frame (7 cols) */}
          <Link
            href="/gallery"
            className="lg:col-span-7 bg-surface border border-border p-2 rounded-[2px] shadow-card group block hover:border-gold-500 transition-colors"
          >
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1px] bg-surface-subtle">
              <img
                src={img1?.image}
                alt={img1?.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3">
                <Badge variant="dark" size="sm">
                  {img1?.category}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-ivory">
                <h3 className="text-xl sm:text-2xl font-editorial font-normal leading-snug">
                  {img1?.title}
                </h3>
                {img1?.caption && (
                  <p className="text-xs text-ivory/80 font-sans mt-1 line-clamp-2">
                    {img1.caption}
                  </p>
                )}
              </div>
            </div>
          </Link>

          {/* Stacked Complementary Frames (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Frame 2 */}
            <Link
              href="/gallery"
              className="bg-surface border border-border p-2 rounded-[2px] shadow-card group relative flex-grow block hover:border-gold-500 transition-colors"
            >
              <div className="absolute top-3 right-3 z-10">
                <CornerFlourish position="top-right" className="text-gold-400" />
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1px] bg-surface-subtle">
                <img
                  src={img2?.image}
                  alt={img2?.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="plum" size="sm">
                    {img2?.category}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 px-1">
                <h4 className="text-sm font-editorial font-medium text-ink group-hover:text-plum-900 transition-colors">
                  {img2?.title}
                </h4>
                {img2?.caption && (
                  <p className="text-[11px] text-ink-muted font-sans line-clamp-1 mt-0.5">
                    {img2.caption}
                  </p>
                )}
              </div>
            </Link>

            {/* Frame 3 */}
            <Link
              href="/gallery"
              className="bg-surface border border-border p-2 rounded-[2px] shadow-card group relative flex-grow block hover:border-gold-500 transition-colors"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1px] bg-surface-subtle">
                <img
                  src={img3?.image}
                  alt={img3?.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="plum" size="sm">
                    {img3?.category}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 px-1">
                <h4 className="text-sm font-editorial font-medium text-ink group-hover:text-plum-900 transition-colors">
                  {img3?.title}
                </h4>
                {img3?.caption && (
                  <p className="text-[11px] text-ink-muted font-sans line-clamp-1 mt-0.5">
                    {img3.caption}
                  </p>
                )}
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GallerySection;
