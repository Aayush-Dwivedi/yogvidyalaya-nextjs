'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import {
  CmsHeroSlide,
  CmsHomepageCta,
  CmsCourse,
  CmsWorkshop,
  CmsGalleryImage,
  CmsVideo,
} from '../../types/cms';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Upload,
  ExternalLink,
  Layers,
  GraduationCap,
  Calendar,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  Link2,
  Sun,
  Camera,
  Check,
} from 'lucide-react';

export const AdminHomepageCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'cta' | 'courses' | 'workshops' | 'media'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [slides, setSlides] = useState<CmsHeroSlide[]>([]);
  const [homepageCta, setHomepageCta] = useState<CmsHomepageCta>({
    badge: 'Traditional Yoga & Wellness',
    title: 'JOIN Our Classes',
    description:
      "Whether you're looking to get fit, manage a health condition, or become a yoga teacher, we have a program for you. Get in touch to learn more.",
    primaryCtaText: 'Browse Courses',
    primaryCtaUrl: '/programs/courses',
    secondaryCtaText: 'Get in Touch',
    secondaryCtaUrl: '/contact/enquiry',
  });
  const [courses, setCourses] = useState<CmsCourse[]>([]);
  const [workshops, setWorkshops] = useState<CmsWorkshop[]>([]);
  const [galleryImages, setGalleryImages] = useState<CmsGalleryImage[]>([]);
  const [videos, setVideos] = useState<CmsVideo[]>([]);

  // Slide modal state
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<CmsHeroSlide> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load all initial homepage data
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedSlides, fetchedCta, fetchedCourses, fetchedWorkshops, fetchedGallery, fetchedVideos] =
        await Promise.all([
          CmsService.getHeroSlides(false),
          CmsService.getHomepageCta(),
          CmsService.getCourses('all'),
          CmsService.getWorkshops('all'),
          CmsService.getGalleryImages('all'),
          CmsService.getVideos('all'),
        ]);

      setSlides(fetchedSlides || []);
      if (fetchedCta && Object.keys(fetchedCta).length > 0) {
        setHomepageCta((prev) => ({ ...prev, ...fetchedCta }));
      }
      setCourses(fetchedCourses || []);
      setWorkshops(fetchedWorkshops || []);
      setGalleryImages(fetchedGallery || []);
      setVideos(fetchedVideos || []);
    } catch (err: any) {
      console.error('Failed to load homepage CMS data', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load homepage content' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // ==========================================
  // HERO SLIDE ACTIONS
  // ==========================================

  const GOLDEN_PRESETS = [
    {
      name: 'Mountain Sunset',
      desc: 'Sunset mountain pavilion meditation (Mockup match)',
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85',
    },
    {
      name: 'Beach Sunset',
      desc: 'Golden hour sunset silhouette on beach',
      url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=85',
    },
    {
      name: 'Golden Sunlight',
      desc: 'Tranquil outdoor nature yoga asana',
      url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1400&q=85',
    },
    {
      name: 'Morning Radiance',
      desc: 'Pranayama in tranquil morning golden glow',
      url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1400&q=85',
    },
  ];

  const handleOpenSlideModal = (slide?: CmsHeroSlide) => {
    if (slide) {
      const rawImage = slide.image;
      const imageUrl = (typeof rawImage === 'string' ? rawImage : rawImage?.url) || '';
      setEditingSlide({
        ...slide,
        image: {
          url: imageUrl,
          path: typeof rawImage === 'object' ? rawImage?.path || 'media/hero.jpg' : 'media/hero.jpg',
          bucket: typeof rawImage === 'object' ? rawImage?.bucket || 'kalptaru-media' : 'kalptaru-media',
          alt: slide.heading || 'Hero slide',
        },
      });
    } else {
      setEditingSlide({
        heading: 'Kalptaruu Yoga Vidhyalaya',
        subheading: 'Traditional Yoga & Wellness',
        description:
          'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
        quote: 'Affiliated by Indian Yoga Association',
        ctaText: 'Explore Courses',
        ctaUrl: '/programs/courses',
        secondaryCtaText: 'Contact Us',
        secondaryCtaUrl: '/contact',
        order: slides.length + 1,
        active: true,
        image: {
          url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85',
          path: 'media/hero.jpg',
          bucket: 'kalptaru-media',
          alt: 'Kalptaruu Yoga Vidhyalaya',
        },
      });
    }
    setSlideModalOpen(true);
  };

  const handleImageUrlChange = (url: string) => {
    setEditingSlide((prev) => ({
      ...prev,
      image: {
        url: url.trim(),
        path: url.trim().replace(/^https?:\/\/[^\/]+\//, '').slice(0, 50) || 'media/hero.jpg',
        bucket: 'external',
        alt: prev?.heading || 'Hero slide image',
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // Try backend upload
      try {
        const res = await MediaService.uploadImage(file, 'hero', editingSlide?.heading || file.name);
        if (res && res.url) {
          setEditingSlide((prev) => ({
            ...prev,
            image: {
              url: res.url,
              path: res.path || `hero/${file.name}`,
              bucket: res.bucket || 'kalptaru-media',
              size: res.size,
              mimeType: res.mimeType,
              alt: res.alt || file.name,
            },
          }));
          showToast('Image uploaded successfully!');
          return;
        }
      } catch (uploadErr) {
        console.warn('Backend upload unavailable, using base64 preview:', uploadErr);
      }

      // Fallback: Read as Data URL
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setEditingSlide((prev) => ({
          ...prev,
          image: {
            url: dataUrl,
            path: `uploads/${file.name}`,
            bucket: 'local',
            alt: file.name,
          },
        }));
        showToast('Image loaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawImage = editingSlide?.image;
    const imageUrl = (typeof rawImage === 'string' ? rawImage : rawImage?.url)?.trim();

    if (!editingSlide?.heading || !editingSlide.description || !imageUrl) {
      showToast('Heading, description, and an image are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const slideId = editingSlide._id || editingSlide.id;
      const payload = {
        ...editingSlide,
        heading: editingSlide.heading.trim(),
        subheading: editingSlide.subheading?.trim() || 'Traditional Yoga & Wellness',
        description: editingSlide.description.trim(),
        quote: editingSlide.quote?.trim() || 'Affiliated by Indian Yoga Association',
        image: {
          url: imageUrl,
          path: typeof rawImage === 'object' && rawImage?.path ? rawImage.path : 'media/hero.jpg',
          bucket: typeof rawImage === 'object' && rawImage?.bucket ? rawImage.bucket : 'kalptaru-media',
          alt: editingSlide.heading.trim(),
        },
        ctaText: editingSlide.ctaText?.trim() || 'Explore Courses',
        ctaUrl: editingSlide.ctaUrl?.trim() || '/programs/courses',
        secondaryCtaText: editingSlide.secondaryCtaText?.trim() || 'Contact Us',
        secondaryCtaUrl: editingSlide.secondaryCtaUrl?.trim() || '/contact',
      };

      if (slideId) {
        await CmsService.updateHeroSlide(slideId, payload);
        showToast('Hero slide updated successfully!');
      } else {
        await CmsService.createHeroSlide(payload);
        showToast('New hero slide created successfully!');
      }

      setSlideModalOpen(false);
      setEditingSlide(null);
      await loadData();

      // Trigger public site live revalidation & immediately cache to localStorage
      if (typeof window !== 'undefined') {
        try {
          const freshSlides = await CmsService.getHeroSlides(true);
          if (freshSlides && freshSlides.length > 0) {
            localStorage.setItem('kalptaru_cached_hero_slides', JSON.stringify(freshSlides));
          }
        } catch {}
        window.dispatchEvent(new CustomEvent('kalptaru-cms-updated'));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save hero slide', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedDefaultSlides = async () => {
    try {
      setSaving(true);
      const defaults = [
        {
          heading: 'Kalptaruu Yoga Vidhyalaya',
          subheading: 'Traditional Yoga & Wellness',
          description:
            'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
          quote: 'Affiliated by Indian Yoga Association',
          ctaText: 'Explore Courses',
          ctaUrl: '/programs/courses',
          secondaryCtaText: 'Contact Us',
          secondaryCtaUrl: '/contact',
          order: 1,
          active: true,
          image: {
            url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85',
            path: 'presets/mountain-sunset.jpg',
            bucket: 'presets',
          },
        },
        {
          heading: 'Kalptaruu Yoga Vidhyalaya',
          subheading: 'Traditional Yoga & Wellness',
          description:
            'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
          quote: 'Affiliated by Indian Yoga Association',
          ctaText: 'Explore Courses',
          ctaUrl: '/programs/courses',
          secondaryCtaText: 'Contact Us',
          secondaryCtaUrl: '/contact',
          order: 2,
          active: true,
          image: {
            url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=85',
            path: 'presets/beach-sunset.jpg',
            bucket: 'presets',
          },
        },
        {
          heading: 'Kalptaruu Yoga Vidhyalaya',
          subheading: 'Traditional Yoga & Wellness',
          description:
            'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
          quote: 'Affiliated by Indian Yoga Association',
          ctaText: 'Explore Courses',
          ctaUrl: '/programs/courses',
          secondaryCtaText: 'Contact Us',
          secondaryCtaUrl: '/contact',
          order: 3,
          active: true,
          image: {
            url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1400&q=85',
            path: 'presets/golden-sunlight.jpg',
            bucket: 'presets',
          },
        },
      ];

      for (const s of defaults) {
        await CmsService.createHeroSlide(s as any);
      }
      showToast('Loaded 3 default golden hero slides successfully!');
      await loadData();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kalptaru-cms-updated'));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to populate default slides', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSlideActive = async (slide: CmsHeroSlide) => {
    const slideId = slide._id || slide.id;
    if (!slideId) return;

    try {
      const newStatus = !slide.active;
      await CmsService.updateHeroSlide(slideId, { active: newStatus });
      setSlides((prev) =>
        prev.map((s) => ((s._id || s.id) === slideId ? { ...s, active: newStatus } : s))
      );
      showToast(`Slide ${newStatus ? 'activated' : 'deactivated'}. Public site reflects this immediately.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update slide status', 'error');
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this hero slide?')) {
      return;
    }

    try {
      await CmsService.deleteHeroSlide(slideId);
      setSlides((prev) => prev.filter((s) => (s._id || s.id) !== slideId));
      showToast('Hero slide deleted successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete hero slide', 'error');
    }
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Recalculate order values
    const payload = newSlides.map((slide, idx) => ({
      id: (slide._id || slide.id) as string,
      order: idx + 1,
    }));

    try {
      setSlides(newSlides);
      await CmsService.reorderHeroSlides(payload);
      showToast('Hero slides reordered successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder hero slides', 'error');
      await loadData();
    }
  };

  // ==========================================
  // HOMEPAGE CTA SAVE
  // ==========================================

  const handleSaveCta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...homepageCta,
        primaryCtaUrl: homepageCta.primaryCtaUrl || '/programs/courses',
        secondaryCtaUrl: homepageCta.secondaryCtaUrl || '/contact/enquiry',
      };
      await CmsService.updateHomepageCta(payload);
      showToast('Homepage CTA updated successfully! Public website reflects new CTA.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update Homepage CTA', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // FEATURED ITEMS TOGGLES
  // ==========================================

  const handleToggleCourseFeatured = async (courseId: string, current: boolean) => {
    try {
      await CmsService.toggleCourseFeatured(courseId, !current);
      setCourses((prev) =>
        prev.map((c) => ((c._id || c.id) === courseId ? { ...c, featured: !current } : c))
      );
      showToast(`Course featured status set to ${!current ? 'Featured' : 'Standard'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update course', 'error');
    }
  };

  const handleToggleWorkshopFeatured = async (workshopId: string, current: boolean) => {
    try {
      await CmsService.toggleWorkshopFeatured(workshopId, !current);
      setWorkshops((prev) =>
        prev.map((w) => ((w._id || w.id) === workshopId ? { ...w, featured: !current } : w))
      );
      showToast(`Workshop featured status set to ${!current ? 'Featured' : 'Standard'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update workshop', 'error');
    }
  };

  const handleToggleGalleryFeatured = async (imageId: string, current: boolean) => {
    try {
      await CmsService.updateGalleryImage(imageId, { featured: !current });
      setGalleryImages((prev) =>
        prev.map((g) => ((g._id || g.id) === imageId ? { ...g, featured: !current } : g))
      );
      showToast(`Gallery highlight status updated.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update gallery image', 'error');
    }
  };

  const handleToggleVideoFeatured = async (videoId: string, current: boolean) => {
    try {
      await CmsService.updateVideo(videoId, { featured: !current });
      setVideos((prev) =>
        prev.map((v) => ((v._id || v.id) === videoId ? { ...v, featured: !current } : v))
      );
      showToast(`Video homepage status updated.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update video', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Homepage Content Management..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm transition-all duration-300 shadow-modal ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="flex-1 font-sans">{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 uppercase tracking-wider"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-widest uppercase bg-gold-50 text-gold-800 border border-gold-300 font-semibold">
              Content
            </span>
            <span className="text-xs text-ink-muted">• Public Website Live</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Home Page Content
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Manage hero carousel slides, featured curriculum, media highlights, and final conversion CTA.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-surface-subtle transition-colors shadow-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900 hover:bg-plum-800 transition-colors font-semibold shadow-soft"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'hero'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <Sliders className="w-4 h-4 text-gold-500" />
          <span>Hero Slides ({slides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'cta'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold-500" />
          <span>Homepage CTA</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'courses'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-gold-500" />
          <span>Featured Courses ({courses.filter((c) => c.featured).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workshops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'workshops'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <Calendar className="w-4 h-4 text-gold-500" />
          <span>Featured Workshops ({workshops.filter((w) => w.featured).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'media'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-gold-500" />
          <span>Gallery &amp; Video Highlights</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERO SLIDES */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-border shadow-soft">
            <div>
              <h2 className="text-lg font-editorial font-bold text-plum-900">Hero Slides Carousel</h2>
              <p className="text-xs text-ink-muted font-sans">
                Active slides appear in sequential order inside the sacred rotating circular hero frame on the homepage.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSeedDefaultSlides}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors border border-gold-400/30 shadow-soft"
                title="Seed 3 curated golden sunset slides into database"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restore Golden Presets</span>
              </button>
              <button
                onClick={() => handleOpenSlideModal()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-bold bg-gold-500 hover:bg-gold-400 text-plum-950 transition-colors shadow-soft"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Hero Slide</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {slides.length === 0 ? (
              <div className="text-center py-12 bg-white border border-border rounded-xl shadow-soft space-y-3">
                <Layers className="w-10 h-10 text-gold-500/50 mx-auto" />
                <div>
                  <p className="text-sm text-ink-muted font-sans font-medium">No hero slides found in database.</p>
                  <p className="text-xs text-ink-faint font-sans mt-0.5">
                    You can add a custom slide or instantly load the 3 golden sunset defaults.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleSeedDefaultSlides}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-bold bg-gold-500 hover:bg-gold-400 text-plum-950 shadow-soft"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Load 3 Golden Sunset Slides</span>
                  </button>
                  <button
                    onClick={() => handleOpenSlideModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-semibold bg-canvas text-ink hover:text-plum-900 border border-border"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom Slide</span>
                  </button>
                </div>
              </div>
            ) : (
              slides.map((slide, index) => {
                const slideId = (slide._id || slide.id) as string;
                return (
                  <div
                    key={slideId || index}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border transition-all ${
                      slide.active
                        ? 'bg-white border-border hover:border-gold-400 shadow-soft'
                        : 'bg-surface-subtle border-border opacity-70'
                    }`}
                  >
                    {/* Sacred Circular Hero Frame & Details */}
                    <div className="flex items-start gap-4">
                      {/* Authentic Hero Frame Preview */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0 flex items-center justify-center bg-[#1A0719] p-1 border border-gold-400/40 shadow-soft group">
                        <svg
                          className="absolute -inset-1 w-[calc(100%+0.5rem)] h-[calc(100%+0.5rem)] pointer-events-none animate-orbit-rotate"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="48"
                            stroke="#DAA53B"
                            strokeWidth="0.8"
                            strokeDasharray="3 3"
                            fill="none"
                            opacity="0.5"
                          />
                          <circle cx="50" cy="2" r="2.5" fill="#DAA53B" />
                        </svg>
                        <div className="w-full h-full rounded-full overflow-hidden border border-gold-400/60 relative bg-[#1A0719]">
                          {slide.image?.url ? (
                            <img
                              src={slide.image.url}
                              alt={slide.heading}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gold-400/50 text-[10px]">
                              No image
                            </div>
                          )}
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-plum-950/90 text-[9px] text-gold-300 font-mono font-bold px-1.5 py-0.2 rounded-full border border-gold-400/30">
                            #{slide.order || index + 1}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-editorial font-bold text-plum-900 leading-tight">
                            {slide.heading}
                          </h3>
                          {slide.active ? (
                            <Badge variant="success" size="sm">Active</Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">Inactive</Badge>
                          )}
                        </div>
                        {slide.subheading && (
                          <p className="text-xs text-gold-700 font-sans font-semibold">{slide.subheading}</p>
                        )}
                        <p className="text-xs text-ink-muted font-sans line-clamp-1 max-w-xl">
                          {slide.description}
                        </p>
                        {slide.quote && (
                          <p className="text-[11px] text-ink-faint italic font-editorial">
                            &ldquo;{slide.quote}&rdquo;
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-faint font-sans pt-1">
                          <span>
                            Primary CTA:{' '}
                            <strong className="text-plum-900 font-semibold">
                              {slide.ctaText || 'Explore Courses'}
                            </strong>{' '}
                            <span className="text-ink-muted">({slide.ctaUrl || '/programs/courses'})</span>
                          </span>
                          {slide.secondaryCtaText && (
                            <span>
                              Secondary:{' '}
                              <strong className="text-plum-900 font-semibold">
                                {slide.secondaryCtaText}
                              </strong>{' '}
                              <span className="text-ink-muted">({slide.secondaryCtaUrl || '/contact'})</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-border">
                      {/* Move up / down */}
                      <div className="flex items-center gap-1 bg-canvas p-1 rounded-lg border border-border shadow-xs">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveSlide(index, 'up')}
                          className="p-1.5 text-ink-muted hover:text-plum-900 disabled:opacity-30 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === slides.length - 1}
                          onClick={() => handleMoveSlide(index, 'down')}
                          className="p-1.5 text-ink-muted hover:text-plum-900 disabled:opacity-30 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Active toggle */}
                      <button
                        onClick={() => handleToggleSlideActive(slide)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors border shadow-xs ${
                          slide.active
                            ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 font-medium'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-medium'
                        }`}
                      >
                        {slide.active ? 'Hide' : 'Activate'}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenSlideModal(slide)}
                        className="p-2 text-gold-700 hover:text-gold-900 bg-gold-50 hover:bg-gold-100 border border-gold-200 rounded-lg transition-colors shadow-xs"
                        title="Edit Slide"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteSlide(slideId)}
                        className="p-2 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-xs"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HOMEPAGE CTA */}
      {/* ========================================================================= */}
      {activeTab === 'cta' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
            <div className="mb-6 pb-4 border-b border-border">
              <h2 className="text-xl font-editorial font-bold text-plum-900">Homepage Final CTA Section</h2>
              <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
                Customize the high-conversion CTA banner displayed at the bottom of the public homepage.
              </p>
            </div>

            <form onSubmit={handleSaveCta} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Top Highlight Badge
                </label>
                <input
                  type="text"
                  value={homepageCta.badge || ''}
                  onChange={(e) => setHomepageCta({ ...homepageCta, badge: e.target.value })}
                  placeholder="e.g. Admissions Open • 2026 Batches"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={homepageCta.title || ''}
                  onChange={(e) => setHomepageCta({ ...homepageCta, title: e.target.value })}
                  placeholder="e.g. JOIN Our Classes"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs font-editorial text-base font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Supporting Paragraph / Value Proposition
                </label>
                <textarea
                  rows={3}
                  required
                  value={homepageCta.description || ''}
                  onChange={(e) => setHomepageCta({ ...homepageCta, description: e.target.value })}
                  placeholder="Describe why sadhakas should enroll..."
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-3 p-3.5 bg-canvas border border-border rounded-lg">
                  <h4 className="text-xs font-bold text-plum-900 uppercase tracking-wider">
                    Primary CTA Button
                  </h4>
                  <div>
                    <label className="block text-[11px] text-ink-muted font-medium mb-1">Button Label</label>
                    <input
                      type="text"
                      value={homepageCta.primaryCtaText || ''}
                      onChange={(e) =>
                        setHomepageCta({ ...homepageCta, primaryCtaText: e.target.value })
                      }
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 p-3.5 bg-canvas border border-border rounded-lg">
                  <h4 className="text-xs font-bold text-plum-900 uppercase tracking-wider">
                    Secondary CTA Button
                  </h4>
                  <div>
                    <label className="block text-[11px] text-ink-muted font-medium mb-1">Button Label</label>
                    <input
                      type="text"
                      value={homepageCta.secondaryCtaText || ''}
                      onChange={(e) =>
                        setHomepageCta({ ...homepageCta, secondaryCtaText: e.target.value })
                      }
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg text-sm font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50"
                >
                  {saving ? 'Saving CTA Changes...' : 'Save Homepage CTA'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Panel */}
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                <Eye className="w-4 h-4 text-gold-600" />
                <h3 className="text-xs font-sans font-bold text-plum-900 uppercase tracking-wider">
                  Live Preview
                </h3>
              </div>
              <p className="text-xs text-ink-muted mb-5 font-sans">
                Real-time simulation of how the CTA looks to public visitors.
              </p>

              <div className="bg-gradient-to-br from-plum-950 to-plum-900 border border-gold-500/30 rounded-xl p-6 text-center space-y-4 shadow-modal">
                {homepageCta.badge && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-sans tracking-wide bg-plum-900 text-gold-300 border border-gold-500/40 font-medium">
                    {homepageCta.badge}
                  </span>
                )}
                <h4 className="text-xl font-editorial font-bold text-ivory leading-snug">
                  {homepageCta.title || 'CTA Headline'}
                </h4>
                <p className="text-xs text-ivory/80 font-sans font-light leading-relaxed">
                  {homepageCta.description || 'Description will appear here...'}
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-plum-950 rounded-lg text-xs font-bold shadow-soft transition-colors"
                  >
                    {homepageCta.primaryCtaText || 'Explore Programs'}
                  </button>
                  <button
                    type="button"
                    className="w-full py-2 bg-plum-900 hover:bg-plum-800 border border-gold-500/30 text-gold-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    {homepageCta.secondaryCtaText || 'Admissions Enquiry'}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted text-center font-sans mt-6 pt-3 border-t border-border">
              Saved changes appear immediately on the website.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FEATURED COURSES */}
      {/* ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-4 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <h2 className="text-xl font-editorial font-bold text-plum-900">Featured Courses on Homepage</h2>
              <p className="text-xs text-ink-muted font-sans mt-0.5">
                Toggle which academic courses appear in the "Featured Programs" section of the public homepage.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gold-50 text-gold-800 border border-gold-300">
              Featured: {courses.filter((c) => c.featured).length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Duration / Mode</th>
                  <th className="px-4 py-3 font-semibold">Tuition</th>
                  <th className="px-4 py-3 font-semibold text-center">Featured on Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {courses.map((course) => {
                  const courseId = (course._id || course.id) as string;
                  return (
                    <tr key={courseId} className="hover:bg-canvas/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {course.coverImage?.url ? (
                            <img
                              src={course.coverImage.url}
                              alt={course.title}
                              className="w-12 h-10 object-cover rounded border border-border shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-12 h-10 rounded bg-canvas border border-border flex items-center justify-center text-[10px] text-ink-faint shrink-0">
                              No Pic
                            </div>
                          )}
                          <div>
                            <div className="font-editorial text-sm text-plum-900 font-bold">
                              {course.title}
                            </div>
                            <div className="text-[11px] text-ink-muted line-clamp-1">
                              {course.shortDescription || course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-ink whitespace-nowrap">
                        <div className="font-medium">{course.duration}</div>
                        <div className="text-[11px] text-gold-700 font-medium">{course.mode}</div>
                      </td>
                      <td className="px-4 py-3.5 text-plum-900 whitespace-nowrap font-mono font-semibold">
                        {course.price?.displayPrice ||
                          (course.price?.amount ? `₹${course.price.amount.toLocaleString()}` : 'Free')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleCourseFeatured(courseId, course.featured)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-xs ${
                            course.featured
                              ? 'bg-gold-50 border border-gold-300 text-gold-800 hover:bg-gold-100'
                              : 'bg-white border border-border text-ink-muted hover:text-plum-900 hover:bg-canvas'
                          }`}
                        >
                          {course.featured ? 'Featured ★' : 'Standard'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FEATURED WORKSHOPS */}
      {/* ========================================================================= */}
      {activeTab === 'workshops' && (
        <div className="space-y-4 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <h2 className="text-xl font-editorial font-bold text-plum-900">Featured Workshops on Homepage</h2>
              <p className="text-xs text-ink-muted font-sans mt-0.5">
                Workshops marked as featured appear immediately in the homepage workshop carousel.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gold-50 text-gold-800 border border-gold-300">
              Featured: {workshops.filter((w) => w.featured).length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Workshop</th>
                  <th className="px-4 py-3 font-semibold">Date & Duration</th>
                  <th className="px-4 py-3 font-semibold">Fee</th>
                  <th className="px-4 py-3 font-semibold text-center">Featured on Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {workshops.map((workshop) => {
                  const workshopId = (workshop._id || workshop.id) as string;
                  return (
                    <tr key={workshopId} className="hover:bg-canvas/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {workshop.coverImage?.url ? (
                            <img
                              src={workshop.coverImage.url}
                              alt={workshop.title}
                              className="w-12 h-10 object-cover rounded border border-border shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-12 h-10 rounded bg-canvas border border-border flex items-center justify-center text-[10px] text-ink-faint shrink-0">
                              No Pic
                            </div>
                          )}
                          <div>
                            <div className="font-editorial text-sm text-plum-900 font-bold">
                              {workshop.title}
                            </div>
                            <div className="text-[11px] text-ink-muted line-clamp-1">
                              {workshop.shortDescription || workshop.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-ink whitespace-nowrap">
                        <div className="font-medium">{new Date(workshop.date).toLocaleDateString()}</div>
                        <div className="text-[11px] text-gold-700 font-medium">{workshop.duration}</div>
                      </td>
                      <td className="px-4 py-3.5 text-plum-900 whitespace-nowrap font-mono font-semibold">
                        {workshop.price?.displayPrice ||
                          (workshop.price?.amount ? `₹${workshop.price.amount.toLocaleString()}` : 'Free')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleWorkshopFeatured(workshopId, workshop.featured)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-xs ${
                            workshop.featured
                              ? 'bg-gold-50 border border-gold-300 text-gold-800 hover:bg-gold-100'
                              : 'bg-white border border-border text-ink-muted hover:text-plum-900 hover:bg-canvas'
                          }`}
                        >
                          {workshop.featured ? 'Featured ★' : 'Standard'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GALLERY & VIDEO HIGHLIGHTS */}
      {/* ========================================================================= */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Gallery Highlights */}
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-editorial font-bold text-plum-900">Gallery Highlights (Homepage)</h3>
                <p className="text-xs text-ink-muted font-sans mt-0.5">
                  Select which campus & sadhana photos appear in the homepage gallery highlights strip.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-gold-50 text-gold-800 border border-gold-300">
                Featured: {galleryImages.filter((g) => g.featured).length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {galleryImages.map((img) => {
                const imgId = (img._id || img.id) as string;
                return (
                  <div
                    key={imgId}
                    className={`relative rounded-lg overflow-hidden border transition-all ${
                      img.featured
                        ? 'border-gold-500 ring-2 ring-gold-400/30 shadow-md'
                        : 'border-border opacity-70 hover:opacity-100 shadow-xs'
                    }`}
                  >
                    <img
                      src={img.image.url}
                      alt={img.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2 bg-white border-t border-border text-left">
                      <div className="text-[11px] font-sans text-plum-900 line-clamp-1 font-semibold">
                        {img.title}
                      </div>
                      <button
                        onClick={() => handleToggleGalleryFeatured(imgId, img.featured)}
                        className={`mt-1.5 w-full py-1 rounded text-[10px] font-sans font-semibold transition-colors shadow-xs ${
                          img.featured
                            ? 'bg-gold-500 text-plum-950 hover:bg-gold-400'
                            : 'bg-canvas text-ink-muted hover:text-plum-900 border border-border'
                        }`}
                      >
                        {img.featured ? 'Featured ★' : 'Feature'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Highlights */}
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-editorial font-bold text-plum-900">Featured Videos (Homepage)</h3>
                <p className="text-xs text-ink-muted font-sans mt-0.5">
                  Select which YouTube video discourses or guided practices appear in the video spotlight.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-gold-50 text-gold-800 border border-gold-300">
                Featured: {videos.filter((v) => v.featured).length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((vid) => {
                const vidId = (vid._id || vid.id) as string;
                return (
                  <div
                    key={vidId}
                    className={`p-3 rounded-lg border flex gap-3 transition-all ${
                      vid.featured
                        ? 'bg-gold-50/30 border-gold-300 shadow-soft'
                        : 'bg-white border-border hover:border-gold-300 shadow-xs'
                    }`}
                  >
                    {vid.thumbnail?.url ? (
                      <img
                        src={vid.thumbnail.url}
                        alt={vid.title}
                        className="w-20 h-14 object-cover rounded border border-border shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-20 h-14 bg-canvas rounded flex items-center justify-center text-ink-muted shrink-0 border border-border">
                        <VideoIcon className="w-5 h-5 text-gold-600" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-editorial font-bold text-plum-900 line-clamp-1">
                        {vid.title}
                      </div>
                      <div className="text-[10px] text-ink-muted font-sans">{vid.speaker || vid.category}</div>
                      <button
                        onClick={() => handleToggleVideoFeatured(vidId, vid.featured)}
                        className={`mt-1 px-2.5 py-0.5 rounded text-[10px] font-sans font-semibold transition-colors shadow-xs ${
                          vid.featured
                            ? 'bg-gold-500 text-plum-950 hover:bg-gold-400'
                            : 'bg-canvas text-ink-muted hover:text-plum-900 border border-border'
                        }`}
                      >
                        {vid.featured ? 'Featured ★' : 'Set Featured'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERO SLIDE MODAL (ADD / EDIT) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={slideModalOpen}
        onClose={() => {
          setSlideModalOpen(false);
          setEditingSlide(null);
        }}
        title={editingSlide?._id || editingSlide?.id ? 'Edit Hero Slide' : 'Add New Hero Slide'}
        size="xl"
      >
        <form onSubmit={handleSaveSlide} className="space-y-6 font-sans text-xs sm:text-sm">
          {/* ── 1. HERO FRAME VISUAL STUDIO ── */}
          <div className="bg-canvas border border-border rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-editorial font-bold text-plum-900 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-gold-500" />
                  <span>Sacred Circular Hero Frame Photo</span>
                </h3>
                <p className="text-[11px] text-ink-muted">
                  The photo will appear inside the golden celestial circular orbit frame on the public homepage.
                </p>
              </div>
              <span className="text-[10px] text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded-full font-mono font-medium self-start sm:self-auto">
                1:1 Aspect Frame
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Column: Live Sacred Circular Frame Preview */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#1A0719] to-[#2A0725] rounded-xl border border-gold-500/30 shadow-modal">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                  {/* Rotating Celestial Orbit Ring */}
                  <svg
                    className="absolute -inset-2.5 w-[calc(100%+1.25rem)] h-[calc(100%+1.25rem)] pointer-events-none animate-orbit-rotate z-0"
                    viewBox="0 0 300 300"
                  >
                    <circle
                      cx="150"
                      cy="150"
                      r="142"
                      stroke="#DAA53B"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      fill="none"
                      opacity="0.5"
                    />
                    <circle cx="150" cy="8" r="5" stroke="#DAA53B" strokeWidth="1.5" fill="#2A0725" />
                    <circle cx="150" cy="8" r="1.5" fill="#DAA53B" />
                    <circle cx="250" cy="250" r="4" stroke="#DAA53B" strokeWidth="1" fill="#2A0725" />
                    <circle cx="250" cy="250" r="1.5" fill="#DAA53B" />
                  </svg>

                  {/* Circular Image Window */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gold-400/80 shadow-[0_0_30px_rgba(218,165,59,0.35)] bg-[#1A0719] z-10 flex items-center justify-center">
                    {editingSlide?.image?.url ? (
                      <img
                        src={editingSlide.image.url}
                        alt={editingSlide.heading || 'Hero slide preview'}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gold-300/60 p-4 text-center">
                        <Camera className="w-8 h-8 mb-1.5 text-gold-400" />
                        <span className="text-[11px]">Select or upload photo</span>
                      </div>
                    )}
                    {/* Soft radial vignette */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_60%,rgba(26,7,25,0.45)_95%)] pointer-events-none" />
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-[10px] font-mono tracking-wider uppercase">
                    <Sun className="w-3 h-3 text-gold-400" />
                    Public Frame Preview
                  </span>
                </div>
              </div>

              {/* Right Column: 3 Photo Methods */}
              <div className="md:col-span-7 space-y-4">
                {/* Method 1: Curated Golden Sunset Presets */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-plum-900 uppercase tracking-wider block">
                    Option A: Recommended Golden Sunset Presets (1-Click)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOLDEN_PRESETS.map((preset, idx) => {
                      const isSelected = editingSlide?.image?.url === preset.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleImageUrlChange(preset.url)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'bg-plum-900 text-gold-200 border-gold-400 ring-2 ring-gold-400/30 shadow-soft'
                              : 'bg-white hover:bg-gold-50/50 text-ink border-border hover:border-gold-300 shadow-xs'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-9 h-9 rounded-full object-cover border border-gold-400/60 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold truncate leading-tight">
                              {preset.name}
                            </div>
                            <div className="text-[9px] opacity-70 truncate font-sans">
                              {preset.desc}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Method 2: Direct Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-plum-900 uppercase tracking-wider block">
                    Option B: Direct Photo URL (WebP, JPG, CDN)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
                      <Link2 className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="url"
                      value={editingSlide?.image?.url || ''}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://images.unsplash.com/... or your image URL"
                      className="w-full bg-white border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs font-mono"
                    />
                  </div>
                </div>

                {/* Method 3: File Upload */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-plum-900 uppercase tracking-wider block">
                    Option C: Upload from Computer
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-canvas border border-border rounded-lg text-xs font-medium text-plum-900 cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-gold-600" />
                      <span>{uploadingImage ? 'Uploading image...' : 'Choose Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-ink-muted">
                      JPG, PNG, or WebP (max 5MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. SLIDE CONTENT & HEADINGS ── */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-plum-900 mb-1">
                  Slide Heading *
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide?.heading || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, heading: e.target.value })}
                  placeholder="e.g. Kalptaruu Yoga Vidhyalaya"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink text-sm focus:outline-none focus:border-gold-500 shadow-xs font-editorial font-bold text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-plum-900 mb-1">
                  Subheading / Badge
                </label>
                <input
                  type="text"
                  value={editingSlide?.subheading || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subheading: e.target.value })}
                  placeholder="e.g. Traditional Yoga & Wellness"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink text-sm focus:outline-none focus:border-gold-500 shadow-xs font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-plum-900 mb-1">
                Slide Description *
              </label>
              <textarea
                rows={2}
                required
                value={editingSlide?.description || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                placeholder="Detailed description of the yogic discipline or sanctuary approach..."
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink text-sm focus:outline-none focus:border-gold-500 shadow-xs resize-y font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-plum-900 mb-1">
                Sacred Quote / Lineage Reference
              </label>
              <input
                type="text"
                value={editingSlide?.quote || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, quote: e.target.value })}
                placeholder='e.g. "Affiliated by Indian Yoga Association"'
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink text-sm focus:outline-none focus:border-gold-500 shadow-xs font-editorial italic"
              />
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2 p-3 bg-canvas border border-border rounded-lg">
                <h4 className="text-xs font-bold text-plum-900 uppercase tracking-wider">
                  Primary Action Button
                </h4>
                <div>
                  <label className="block text-[11px] text-ink-muted mb-0.5">Button Label</label>
                  <input
                    type="text"
                    value={editingSlide?.ctaText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    placeholder="Explore Courses"
                    className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-ink-muted mb-0.5">Button URL</label>
                  <input
                    type="text"
                    value={editingSlide?.ctaUrl || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaUrl: e.target.value })}
                    placeholder="/programs/courses"
                    className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 bg-canvas border border-border rounded-lg">
                <h4 className="text-xs font-bold text-plum-900 uppercase tracking-wider">
                  Secondary Action Button
                </h4>
                <div>
                  <label className="block text-[11px] text-ink-muted mb-0.5">Button Label</label>
                  <input
                    type="text"
                    value={editingSlide?.secondaryCtaText || ''}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })
                    }
                    placeholder="Contact Us"
                    className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-ink-muted mb-0.5">Button URL</label>
                  <input
                    type="text"
                    value={editingSlide?.secondaryCtaUrl || ''}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, secondaryCtaUrl: e.target.value })
                    }
                    placeholder="/contact"
                    className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. ACTIONS & ACTIVE TOGGLE ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={editingSlide?.active ?? true}
                onChange={(e) => setEditingSlide({ ...editingSlide, active: e.target.checked })}
                className="w-4 h-4 rounded border-border text-gold-600 focus:ring-gold-500"
              />
              <span className="text-xs text-plum-900 font-semibold">
                Slide is Active on Public Homepage
              </span>
            </label>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setSlideModalOpen(false);
                  setEditingSlide(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas shadow-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Slide...</span>
                  </>
                ) : (
                  <span>Save Hero Slide</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
