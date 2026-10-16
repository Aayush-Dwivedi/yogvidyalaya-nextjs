'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { CornerFlourish, LotusMotif } from '../../components/Motifs';
import { GalleryHighlight } from '../../types/home';
import { CmsGalleryImage } from '../../types/cms';
import { CmsService } from '../../services/cmsService';
import { isOptimizedUrl } from '../../utils/imageUtils';

export interface GallerySectionProps {
  highlights?: (GalleryHighlight | CmsGalleryImage)[];
}

const normalizeHighlights = (items: any[]): GalleryHighlight[] => {
  if (!items || !Array.isArray(items)) return [];
  return items.map((g, idx) => ({
    id: g._id || g.id || `gallery-${idx}`,
    title: g.title || 'Institute Moment',
    caption: g.caption || g.description || '',
    category: (typeof g.category === 'object' ? g.category?.name : g.category) || 'Practice',
    image: (typeof g.image === 'string' ? g.image : g.image?.url) || '',
  })).filter(g => Boolean(g.image));
};

export const GallerySection: React.FC<GallerySectionProps> = ({ highlights: propHighlights }) => {
  const [highlights, setHighlights] = useState<GalleryHighlight[]>(() =>
    propHighlights && propHighlights.length > 0
      ? normalizeHighlights(propHighlights)
      : []
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
        } else {
          setHighlights([]);
        }
      } catch (err) {
        setHighlights([]);
      }
    };

    if (propHighlights === undefined) {
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

  if (!highlights || highlights.length === 0) {
    return null;
  }

  const [img1, img2, img3] = highlights;

  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Institute Moments"
          title="Gallery"
          description="Photos from our classes and events"
          align="asymmetric"
          action={
            <LinkButton to="/gallery" variant="text" size="md" withArrow>
              View More Images
            </LinkButton>
          }
        />

        {/* Asymmetric Gallery Composition (Varying Dimensions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Large Feature Frame */}
          <Link
            href="/gallery"
            className={`${img2 ? 'lg:col-span-7' : 'lg:col-span-12'} bg-surface border border-border p-2 rounded-[2px] shadow-card group block hover:border-gold-500 transition-colors`}
          >
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1px] bg-surface-subtle">
              {img1?.image && (
                <Image
                  src={img1.image}
                  alt={img1.title || 'Institute Moment'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                  unoptimized={!isOptimizedUrl(img1.image)}
                />
              )}
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

          {/* Stacked Complementary Frames */}
          {img2 && (
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
                  {img2?.image && (
                    <Image
                      src={img2.image}
                      alt={img2.title || 'Institute Moment'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 520px"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                      unoptimized={!isOptimizedUrl(img2.image)}
                    />
                  )}
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
              {img3 && (
                <Link
                  href="/gallery"
                  className="bg-surface border border-border p-2 rounded-[2px] shadow-card group relative flex-grow block hover:border-gold-500 transition-colors"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[1px] bg-surface-subtle">
                    {img3?.image && (
                      <Image
                        src={img3.image}
                        alt={img3.title || 'Institute Moment'}
                        fill
                        sizes="(max-width: 1024px) 100vw, 520px"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                        unoptimized={!isOptimizedUrl(img3.image)}
                      />
                    )}
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
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default GallerySection;
