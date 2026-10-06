'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Container } from '../components/Container';
import { LotusMotif, OrnamentalDivider, CornerFlourish } from '../components/Motifs';
import { Badge } from '../components/Badge';
import { CmsService } from '../services/cmsService';
import { CmsGalleryImage, CmsGalleryCategory } from '../types/cms';
import {
  Image as ImageIcon,
  Sparkles,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Layers,
} from 'lucide-react';

interface DisplayPhoto {
  id: string;
  title: string;
  caption: string;
  category: string;
  image: string;
  date?: string;
}

const DEFAULT_GALLERY: DisplayPhoto[] = [
  {
    id: 'g-1',
    title: 'Surya Namaskar at Dawn',
    caption: 'Students aligning breath and movement during morning sadhana on the shala terrace.',
    category: 'Asana Practice',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
    date: 'Morning Sadhana',
  },
  {
    id: 'g-2',
    title: 'Therapeutic Postural Alignment',
    caption: 'Mrs. Shuchi Mohan guiding spine and joint restoration techniques with physiotherapy precision.',
    category: 'Therapy & Healing',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85',
    date: 'Therapy Intensive',
  },
  {
    id: 'g-3',
    title: 'Pranayama & Kumbhaka Masterclass',
    caption: 'Deep breathwork session cultivating mental stillness and vital energy regulation.',
    category: 'Pranayama',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85',
    date: 'Weekend Intensive',
  },
  {
    id: 'g-4',
    title: 'Institutional NCERT Wellness Workshop',
    caption: 'Interactive demonstration conducted for national educational and governmental forums.',
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=85',
    date: 'Special Event',
  },
  {
    id: 'g-5',
    title: 'Mindful Meditation & Dhyana',
    caption: 'Sadhakas immersed in contemplative silence, nurturing clarity and inner peace.',
    category: 'Meditation',
    image: 'https://images.unsplash.com/photo-1512290900672-1f41e57c66cb?auto=format&fit=crop&w=1200&q=85',
    date: 'Evening Dhyana',
  },
  {
    id: 'g-6',
    title: 'Classical Sanskrit Chanting & Satsang',
    caption: 'Vedic mantras resonating through the sanctified atmosphere of Kalptaru Yog Vidyalaya.',
    category: 'Satsang',
    image: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=1200&q=85',
    date: 'Annual Gathering',
  },
  {
    id: 'g-7',
    title: 'Teacher Training Anatomy Practicum',
    caption: 'Future yoga teachers analyzing biomechanical safety and joint protection in asanas.',
    category: 'Teacher Training',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=85',
    date: 'Certification Batch',
  },
  {
    id: 'g-8',
    title: 'Senior Citizen Restorative Sadhana',
    caption: 'Gentle, therapeutic chair yoga designed to enhance mobility and ease back and knee strain.',
    category: 'Therapy & Healing',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85',
    date: 'Restorative Care',
  },
];

export const GalleryPage: React.FC = () => {
  const [photos, setPhotos] = useState<DisplayPhoto[]>(DEFAULT_GALLERY);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      const [images, cats] = await Promise.all([
        CmsService.getGalleryImages('published'),
        CmsService.getGalleryCategories(),
      ]);

      if (images && images.length > 0) {
        const mapped: DisplayPhoto[] = images.map((img: any, idx: number) => ({
          id: img._id || img.id || `img-${idx}`,
          title: img.title || 'Kalptaru Moment',
          caption: img.caption || img.description || '',
          category:
            (typeof img.category === 'object' ? img.category?.name : img.category) || 'Tradition',
          image:
            (typeof img.image === 'string' ? img.image : img.image?.url) ||
            DEFAULT_GALLERY[idx % DEFAULT_GALLERY.length].image,
          date: img.createdAt ? new Date(img.createdAt).toLocaleDateString() : undefined,
        }));
        setPhotos(mapped);

        // Derive unique categories
        const uniqueCats = Array.from(new Set(mapped.map((p) => p.category).filter(Boolean)));
        if (cats && cats.length > 0) {
          cats.forEach((c) => {
            if (c.name && !uniqueCats.includes(c.name)) uniqueCats.push(c.name);
          });
        }
        setCategories(['All', ...uniqueCats]);
      } else {
        setPhotos(DEFAULT_GALLERY);
        setCategories(['All', 'Asana Practice', 'Therapy & Healing', 'Pranayama', 'Workshops', 'Meditation', 'Satsang']);
      }
    } catch (err) {
      console.warn('Using default gallery photos:', err);
      setPhotos(DEFAULT_GALLERY);
      setCategories(['All', 'Asana Practice', 'Therapy & Healing', 'Pranayama', 'Workshops', 'Meditation', 'Satsang']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryData();

    // Subscribe to live admin publish updates
    const handleSync = () => {
      loadGalleryData();
    };

    window.addEventListener('kalptaru-cms-updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  // Lightbox Navigation Handlers
  const handleNextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! + 1) % filteredPhotos.length));
  }, [lightboxIndex, filteredPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! - 1 + filteredPhotos.length) % filteredPhotos.length));
  }, [lightboxIndex, filteredPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNextPhoto, handlePrevPhoto]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* 1. Hero Header */}
      <section className="relative py-20 sm:py-24 bg-plum-950 text-ivory overflow-hidden border-b border-gold-500/30">
        <div className="absolute inset-0 bg-radial-gradient from-plum-900/60 via-plum-950/80 to-plum-950 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center space-x-3">
              <LotusMotif size={24} className="text-gold-400 shrink-0" />
              <span className="w-8 h-px bg-gold-400" />
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                Visual Chronicles
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-white leading-tight">
              Moments of Sadhana &amp; Community
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed max-w-2xl font-light">
              Glimpses into student sadhana, therapeutic workshops, teacher training immersions, and events at Kalptaru Yog Vidyalaya.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-gold-300 font-mono">
              <Layers className="w-4 h-4 text-gold-400" />
              <span>{photos.length} Captured Moments in High Definition</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Category Filter Navigation Bar */}
      <section className="sticky top-0 z-20 bg-canvas/95 backdrop-blur-md border-b border-border shadow-xs py-4">
        <Container size="wide">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-sans transition-all capitalize ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
                      : 'bg-canvas-warm hover:bg-gold-100 text-ink-muted hover:text-plum-950 border border-border/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-ink-muted hidden md:block shrink-0">
              Showing {filteredPhotos.length} of {photos.length}
            </span>
          </div>
        </Container>
      </section>

      {/* 3. Photo Gallery Masonry / Grid */}
      <section className="py-12 sm:py-16">
        <Container size="wide">
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-20 bg-canvas-warm rounded-2xl border border-border space-y-3">
              <ImageIcon className="w-12 h-12 text-gold-500 mx-auto" />
              <h3 className="text-xl font-editorial text-plum-900">No Photos in this Category</h3>
              <p className="text-xs text-ink-muted">Please select another category or check back soon.</p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 rounded-lg bg-plum-900 text-gold-300 text-xs font-semibold hover:bg-plum-800 transition-colors"
              >
                Show All Photos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative bg-surface rounded-xl overflow-hidden border border-border shadow-card hover:border-gold-500/80 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open photo: ${photo.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setLightboxIndex(index);
                  }}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-plum-950">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold bg-plum-950/80 text-gold-300 border border-gold-500/30 backdrop-blur-sm">
                        {photo.category}
                      </span>
                    </div>

                    {/* Zoom Icon Hover Indicator */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-plum-900/80 border border-gold-400/60 text-gold-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Overlay Title */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-editorial text-base sm:text-lg font-normal leading-snug drop-shadow-sm group-hover:text-gold-200 transition-colors">
                        {photo.title}
                      </h3>
                      {photo.date && (
                        <span className="text-[10px] text-white/70 font-mono block mt-0.5">
                          {photo.date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Caption Footer */}
                  {photo.caption && (
                    <div className="p-4 bg-canvas-warm/50 border-t border-border/50">
                      <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 font-sans font-light">
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 4. Lightbox Fullscreen Modal */}
      {activePhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-plum-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar: Title & Close */}
          <div
            className="flex items-center justify-between text-white max-w-6xl w-full mx-auto pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400">
                {activePhoto.category} &bull; {lightboxIndex + 1} of {filteredPhotos.length}
              </span>
              <h2 className="text-lg sm:text-2xl font-editorial font-normal text-ivory">
                {activePhoto.title}
              </h2>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Canvas */}
          <div
            className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain rounded-lg border border-gold-500/30 shadow-2xl"
            />

            {/* Prev Arrow */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-plum-900/80 hover:bg-gold-500 text-gold-300 hover:text-plum-950 border border-gold-400/40 transition-all shadow-modal"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-plum-900/80 hover:bg-gold-500 text-gold-300 hover:text-plum-950 border border-gold-400/40 transition-all shadow-modal"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Caption & Info */}
          <div
            className="max-w-3xl w-full mx-auto text-center pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {activePhoto.caption && (
              <p className="text-xs sm:text-sm text-ivory/80 font-sans font-light leading-relaxed">
                {activePhoto.caption}
              </p>
            )}
            <p className="text-[10px] text-gold-400/70 font-mono mt-2">
              Use Left &amp; Right Arrow Keys to navigate &bull; Esc to close
            </p>
          </div>
        </div>
      )}

      {/* 5. Bottom Flourish */}
      <div className="py-8 bg-canvas border-t border-border/60">
        <OrnamentalDivider className="opacity-40" />
      </div>
    </div>
  );
};

export default GalleryPage;
