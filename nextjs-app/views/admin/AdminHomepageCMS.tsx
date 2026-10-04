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
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load homepage CMS content' });
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

  const handleOpenSlideModal = (slide?: CmsHeroSlide) => {
    if (slide) {
      setEditingSlide({ ...slide });
    } else {
      setEditingSlide({
        heading: '',
        subheading: '',
        description: '',
        quote: '',
        ctaText: 'Explore Programs',
        ctaUrl: '/programs',
        secondaryCtaText: 'Admissions Enquiry',
        secondaryCtaUrl: '/contact/enquiry',
        order: slides.length + 1,
        active: true,
        image: {
          url: '',
          path: '',
          alt: '',
        },
      });
    }
    setSlideModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // Supabase Storage upload via backend storage service
      const res = await MediaService.uploadImage(file, 'hero', editingSlide?.heading || file.name);
      setEditingSlide((prev) => ({
        ...prev,
        image: {
          url: res.url,
          path: res.path,
          bucket: res.bucket,
          size: res.size,
          mimeType: res.mimeType,
          alt: res.alt || file.name,
        },
      }));
      showToast('Image uploaded to Supabase Storage successfully!');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload image to Supabase Storage', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide?.heading || !editingSlide.description || !editingSlide.image?.url) {
      showToast('Heading, description, and an uploaded image are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const slideId = editingSlide._id || editingSlide.id;
      if (slideId) {
        await CmsService.updateHeroSlide(slideId, editingSlide);
        showToast('Hero slide updated successfully!');
      } else {
        await CmsService.createHeroSlide(editingSlide);
        showToast('New hero slide created successfully!');
      }
      setSlideModalOpen(false);
      setEditingSlide(null);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save hero slide', 'error');
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
      await CmsService.updateHomepageCta(homepageCta);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-sans tracking-widest uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
              Content Management System
            </span>
            <span className="text-xs text-ivory/50">• Public Website Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-ivory tracking-wide">
            Homepage CMS
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 font-sans mt-1">
            Manage hero carousel slides, featured curriculum, media highlights, and final conversion CTA.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900/60 border border-gold-500/30 hover:bg-plum-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-plum-950 bg-gold-500 hover:bg-gold-400 transition-colors font-medium shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gold-500/20 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-all ${
            activeTab === 'hero'
              ? 'bg-gold-500 text-plum-950 shadow-sm'
              : 'text-ivory/70 hover:text-ivory hover:bg-plum-900/40 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Hero Slides ({slides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-all ${
            activeTab === 'cta'
              ? 'bg-gold-500 text-plum-950 shadow-sm'
              : 'text-ivory/70 hover:text-ivory hover:bg-plum-900/40 border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Homepage CTA</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-all ${
            activeTab === 'courses'
              ? 'bg-gold-500 text-plum-950 shadow-sm'
              : 'text-ivory/70 hover:text-ivory hover:bg-plum-900/40 border border-transparent'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Featured Courses ({courses.filter((c) => c.featured).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workshops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-all ${
            activeTab === 'workshops'
              ? 'bg-gold-500 text-plum-950 shadow-sm'
              : 'text-ivory/70 hover:text-ivory hover:bg-plum-900/40 border border-transparent'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Featured Workshops ({workshops.filter((w) => w.featured).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-all ${
            activeTab === 'media'
              ? 'bg-gold-500 text-plum-950 shadow-sm'
              : 'text-ivory/70 hover:text-ivory hover:bg-plum-900/40 border border-transparent'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery & Video Highlights</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERO SLIDES */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-plum-900/40 p-4 rounded-xl border border-gold-500/20">
            <div>
              <h2 className="text-lg font-editorial text-ivory">Hero Slides Carousel</h2>
              <p className="text-xs text-ivory/70 font-sans">
                Active slides appear in sequential order in the main public hero carousel. Images stored in Supabase Storage.
              </p>
            </div>
            <button
              onClick={() => handleOpenSlideModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hero Slide</span>
            </button>
          </div>

          <div className="space-y-3">
            {slides.length === 0 ? (
              <div className="text-center py-12 bg-plum-950/30 border border-gold-500/10 rounded-xl">
                <Layers className="w-10 h-10 text-gold-500/40 mx-auto mb-3" />
                <p className="text-sm text-ivory/70 font-sans">No hero slides found.</p>
                <button
                  onClick={() => handleOpenSlideModal()}
                  className="mt-3 text-xs text-gold-400 hover:text-gold-300 underline"
                >
                  Create first hero slide
                </button>
              </div>
            ) : (
              slides.map((slide, index) => {
                const slideId = (slide._id || slide.id) as string;
                return (
                  <div
                    key={slideId || index}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                      slide.active
                        ? 'bg-plum-950/40 border-gold-500/30'
                        : 'bg-plum-950/20 border-white/5 opacity-70'
                    }`}
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden border border-gold-500/20 shrink-0 bg-plum-900/60 relative">
                        {slide.image?.url ? (
                          <img
                            src={slide.image.url}
                            alt={slide.heading}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gold-400/40 text-xs">
                            No image
                          </div>
                        )}
                        <span className="absolute top-1 left-1 bg-plum-950/80 text-[10px] text-gold-300 font-mono px-1.5 py-0.5 rounded border border-gold-500/20">
                          #{slide.order || index + 1}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-editorial text-ivory leading-tight">
                            {slide.heading}
                          </h3>
                          {slide.active ? (
                            <Badge variant="gold" size="sm">Active</Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">Inactive</Badge>
                          )}
                        </div>
                        {slide.subheading && (
                          <p className="text-xs text-gold-300 font-sans">{slide.subheading}</p>
                        )}
                        <p className="text-xs text-ivory/70 font-sans line-clamp-1 max-w-xl">
                          {slide.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-ivory/50 font-sans pt-1">
                          <span>Primary CTA: <strong className="text-gold-300">{slide.ctaText}</strong> ({slide.ctaUrl})</span>
                          {slide.image?.bucket && (
                            <span className="font-mono text-[10px] text-gold-400/60">
                              Supabase: {slide.image.path}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                      {/* Move up / down */}
                      <div className="flex items-center gap-1 bg-plum-900/50 p-1 rounded-lg border border-gold-500/10">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveSlide(index, 'up')}
                          className="p-1.5 text-ivory/70 hover:text-gold-300 disabled:opacity-30 disabled:hover:text-ivory/70 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === slides.length - 1}
                          onClick={() => handleMoveSlide(index, 'down')}
                          className="p-1.5 text-ivory/70 hover:text-gold-300 disabled:opacity-30 disabled:hover:text-ivory/70 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Active toggle */}
                      <button
                        onClick={() => handleToggleSlideActive(slide)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-sans transition-colors border ${
                          slide.active
                            ? 'bg-gold-500/10 border-gold-500/30 text-gold-300 hover:bg-gold-500/20'
                            : 'bg-white/5 border-white/10 text-ivory/60 hover:text-ivory'
                        }`}
                      >
                        {slide.active ? 'Hide' : 'Activate'}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenSlideModal(slide)}
                        className="p-2 text-gold-300 hover:text-gold-200 bg-plum-900/50 hover:bg-plum-900 border border-gold-500/20 rounded-lg transition-colors"
                        title="Edit Slide"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteSlide(slideId)}
                        className="p-2 text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 rounded-lg transition-colors"
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
          <div className="lg:col-span-2 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card">
            <div className="mb-6">
              <h2 className="text-xl font-editorial text-ivory">Homepage Final CTA Section</h2>
              <p className="text-xs sm:text-sm text-ivory/70 font-sans mt-1">
                Customize the high-conversion CTA banner displayed at the bottom of the public homepage.
              </p>
            </div>

            <form onSubmit={handleSaveCta} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                  Top Highlight Badge
                </label>
                <input
                  type="text"
                  value={homepageCta.badge || ''}
                  onChange={(e) => setHomepageCta({ ...homepageCta, badge: e.target.value })}
                  placeholder="e.g. Admissions Open • 2026 Batches"
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={homepageCta.title || ''}
                  onChange={(e) => setHomepageCta({ ...homepageCta, title: e.target.value })}
                  placeholder="e.g. JOIN Our Classes"
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 font-editorial text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                  Supporting Paragraph / Value Proposition
                </label>
                <textarea
                  rows={3}
                  required
                  value={homepageCta.description || ''}
                  onChange={(e) => setHomepageCta({ ...homepageCta, description: e.target.value })}
                  placeholder="Describe why sadhakas should enroll..."
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-3 p-3.5 bg-plum-900/30 border border-gold-500/20 rounded-lg">
                  <h4 className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                    Primary CTA Button
                  </h4>
                  <div>
                    <label className="block text-[11px] text-ivory/70 mb-1">Button Label</label>
                    <input
                      type="text"
                      value={homepageCta.primaryCtaText || ''}
                      onChange={(e) =>
                        setHomepageCta({ ...homepageCta, primaryCtaText: e.target.value })
                      }
                      className="w-full bg-plum-900/60 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-ivory/70 mb-1">Destination URL</label>
                    <input
                      type="text"
                      value={homepageCta.primaryCtaUrl || ''}
                      onChange={(e) =>
                        setHomepageCta({ ...homepageCta, primaryCtaUrl: e.target.value })
                      }
                      className="w-full bg-plum-900/60 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 p-3.5 bg-plum-900/30 border border-gold-500/20 rounded-lg">
                  <h4 className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                    Secondary CTA Button
                  </h4>
                  <div>
                    <label className="block text-[11px] text-ivory/70 mb-1">Button Label</label>
                    <input
                      type="text"
                      value={homepageCta.secondaryCtaText || ''}
                      onChange={(e) =>
                        setHomepageCta({ ...homepageCta, secondaryCtaText: e.target.value })
                      }
                      className="w-full bg-plum-900/60 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-ivory/70 mb-1">Destination URL</label>
                    <input
                      type="text"
                      value={homepageCta.secondaryCtaUrl || ''}
                      onChange={(e) =>
                        setHomepageCta({ ...homepageCta, secondaryCtaUrl: e.target.value })
                      }
                      className="w-full bg-plum-900/60 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-500/20 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg text-sm font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving CTA Changes...' : 'Save Homepage CTA'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Panel */}
          <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-gold-400" />
                <h3 className="text-sm font-sans font-semibold text-ivory uppercase tracking-wider">
                  Live Preview
                </h3>
              </div>
              <p className="text-xs text-ivory/60 mb-6 font-sans">
                This shows how the CTA appears to visitors on the public website.
              </p>

              <div className="bg-plum-900 border border-gold-500/40 rounded-xl p-6 text-center space-y-4 shadow-modal">
                {homepageCta.badge && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-sans tracking-wide bg-plum-950/80 text-gold-300 border border-gold-500/30">
                    {homepageCta.badge}
                  </span>
                )}
                <h4 className="text-xl font-editorial font-normal text-ivory leading-snug">
                  {homepageCta.title || 'CTA Headline'}
                </h4>
                <p className="text-xs text-ivory/80 font-sans font-light leading-relaxed">
                  {homepageCta.description || 'Description will appear here...'}
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    className="w-full py-2 bg-gold-500 text-plum-950 rounded-lg text-xs font-semibold shadow-sm hover:bg-gold-400"
                  >
                    {homepageCta.primaryCtaText || 'Explore Programs'}
                  </button>
                  <button
                    type="button"
                    className="w-full py-2 bg-plum-950/60 border border-gold-500/30 text-gold-200 rounded-lg text-xs hover:bg-plum-950"
                  >
                    {homepageCta.secondaryCtaText || 'Admissions Enquiry'}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-ivory/40 text-center font-sans mt-6">
              Saved CTA is immediately returned by GET /api/home.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FEATURED COURSES */}
      {/* ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-4 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-editorial text-ivory">Featured Courses on Homepage</h2>
              <p className="text-xs text-ivory/70 font-sans mt-0.5">
                Toggle which academic courses appear in the "Featured Programs" section of the public homepage.
              </p>
            </div>
            <span className="text-xs text-gold-400 font-sans">
              Currently Featured: <strong>{courses.filter((c) => c.featured).length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-plum-900/60 border-b border-gold-500/20 text-gold-300">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Duration / Mode</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Tuition</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-center">Featured on Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {courses.map((course) => {
                  const courseId = (course._id || course.id) as string;
                  return (
                    <tr key={courseId} className="hover:bg-plum-900/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {course.coverImage?.url ? (
                            <img
                              src={course.coverImage.url}
                              alt={course.title}
                              className="w-12 h-10 object-cover rounded border border-gold-500/20 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-10 rounded bg-plum-900 border border-gold-500/10 flex items-center justify-center text-[10px] text-ivory/40 shrink-0">
                              No Pic
                            </div>
                          )}
                          <div>
                            <div className="font-editorial text-sm text-ivory font-medium">
                              {course.title}
                            </div>
                            <div className="text-[11px] text-ivory/60 line-clamp-1">
                              {course.shortDescription || course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-ivory/80 whitespace-nowrap">
                        <div>{course.duration}</div>
                        <div className="text-[11px] text-gold-400/80">{course.mode}</div>
                      </td>
                      <td className="px-4 py-3.5 text-ivory/80 whitespace-nowrap font-mono">
                        {course.price?.displayPrice ||
                          (course.price?.amount ? `₹${course.price.amount.toLocaleString()}` : 'Free')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleCourseFeatured(courseId, course.featured)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            course.featured
                              ? 'bg-gold-500 text-plum-950 shadow-sm hover:bg-gold-400'
                              : 'bg-plum-900/60 text-ivory/60 hover:text-ivory border border-gold-500/20'
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
        <div className="space-y-4 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-editorial text-ivory">Featured Workshops on Homepage</h2>
              <p className="text-xs text-ivory/70 font-sans mt-0.5">
                Workshops marked as featured appear immediately in the homepage workshop carousel.
              </p>
            </div>
            <span className="text-xs text-gold-400 font-sans">
              Currently Featured: <strong>{workshops.filter((w) => w.featured).length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-plum-900/60 border-b border-gold-500/20 text-gold-300">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Workshop</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Date & Duration</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Fee</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-center">Featured on Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {workshops.map((workshop) => {
                  const workshopId = (workshop._id || workshop.id) as string;
                  return (
                    <tr key={workshopId} className="hover:bg-plum-900/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {workshop.coverImage?.url ? (
                            <img
                              src={workshop.coverImage.url}
                              alt={workshop.title}
                              className="w-12 h-10 object-cover rounded border border-gold-500/20 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-10 rounded bg-plum-900 border border-gold-500/10 flex items-center justify-center text-[10px] text-ivory/40 shrink-0">
                              No Pic
                            </div>
                          )}
                          <div>
                            <div className="font-editorial text-sm text-ivory font-medium">
                              {workshop.title}
                            </div>
                            <div className="text-[11px] text-ivory/60 line-clamp-1">
                              {workshop.shortDescription || workshop.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-ivory/80 whitespace-nowrap">
                        <div>{new Date(workshop.date).toLocaleDateString()}</div>
                        <div className="text-[11px] text-gold-400/80">{workshop.duration}</div>
                      </td>
                      <td className="px-4 py-3.5 text-ivory/80 whitespace-nowrap font-mono">
                        {workshop.price?.displayPrice ||
                          (workshop.price?.amount ? `₹${workshop.price.amount.toLocaleString()}` : 'Free')}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleWorkshopFeatured(workshopId, workshop.featured)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            workshop.featured
                              ? 'bg-gold-500 text-plum-950 shadow-sm hover:bg-gold-400'
                              : 'bg-plum-900/60 text-ivory/60 hover:text-ivory border border-gold-500/20'
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
          <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-editorial text-ivory">Gallery Highlights (Homepage)</h3>
                <p className="text-xs text-ivory/70 font-sans">
                  Select which campus & sadhana photos appear in the homepage gallery highlights strip.
                </p>
              </div>
              <span className="text-xs text-gold-400 font-sans">
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
                        ? 'border-gold-500 ring-2 ring-gold-500/40 shadow-modal'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.image.url}
                      alt={img.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2 bg-plum-950/90 text-left">
                      <div className="text-[11px] font-sans text-ivory line-clamp-1 font-medium">
                        {img.title}
                      </div>
                      <button
                        onClick={() => handleToggleGalleryFeatured(imgId, img.featured)}
                        className={`mt-1.5 w-full py-1 rounded text-[10px] font-sans transition-colors ${
                          img.featured
                            ? 'bg-gold-500 text-plum-950 font-semibold'
                            : 'bg-plum-900 text-ivory/70 hover:text-ivory'
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
          <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-editorial text-ivory">Featured Videos (Homepage)</h3>
                <p className="text-xs text-ivory/70 font-sans">
                  Select which YouTube video discourses or guided practices appear in the video spotlight.
                </p>
              </div>
              <span className="text-xs text-gold-400 font-sans">
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
                        ? 'bg-plum-900/50 border-gold-500/40'
                        : 'bg-plum-950/30 border-white/10 opacity-70'
                    }`}
                  >
                    {vid.thumbnail?.url ? (
                      <img
                        src={vid.thumbnail.url}
                        alt={vid.title}
                        className="w-20 h-14 object-cover rounded border border-gold-500/20 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-14 bg-plum-900 rounded flex items-center justify-center text-gold-400/40 shrink-0">
                        <VideoIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-editorial text-ivory line-clamp-1 font-medium">
                        {vid.title}
                      </div>
                      <div className="text-[10px] text-ivory/60 font-sans">{vid.speaker || vid.category}</div>
                      <button
                        onClick={() => handleToggleVideoFeatured(vidId, vid.featured)}
                        className={`mt-1 px-2.5 py-0.5 rounded text-[10px] font-sans ${
                          vid.featured
                            ? 'bg-gold-500 text-plum-950 font-semibold'
                            : 'bg-plum-900 text-ivory/70 border border-gold-500/20'
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
        size="lg"
      >
        <form onSubmit={handleSaveSlide} className="space-y-4 font-sans text-xs sm:text-sm">
          {/* Image Upload Area (Supabase Storage) */}
          <div className="space-y-2 p-3.5 bg-plum-900/30 border border-gold-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                Hero Background Image (Supabase Storage)
              </label>
              <span className="text-[10px] text-ivory/50">High-res WebP/JPG (1920x1080 recommended)</span>
            </div>

            {editingSlide?.image?.url ? (
              <div className="relative rounded-lg overflow-hidden border border-gold-500/30 max-h-48 group">
                <img
                  src={editingSlide.image.url}
                  alt={editingSlide.heading || 'Hero slide preview'}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-plum-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="cursor-pointer px-3 py-1.5 bg-gold-500 text-plum-950 rounded text-xs font-medium hover:bg-gold-400">
                    Replace Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="absolute bottom-1 right-2 bg-plum-950/80 px-2 py-0.5 rounded text-[10px] text-gold-400 font-mono">
                  {editingSlide.image.path || 'Supabase Storage'}
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gold-500/30 rounded-lg cursor-pointer bg-plum-950/40 hover:bg-plum-900/40 transition-colors">
                <Upload className="w-8 h-8 text-gold-400 mb-2" />
                <span className="text-xs text-ivory font-medium">
                  {uploadingImage ? 'Uploading to Supabase Storage...' : 'Click to upload image'}
                </span>
                <span className="text-[11px] text-ivory/50 mt-1">
                  Direct upload into Supabase Storage bucket 'kalptaru-media/hero'
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold-300 mb-1">Slide Heading *</label>
              <input
                type="text"
                required
                value={editingSlide?.heading || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, heading: e.target.value })}
                placeholder="e.g. Kalptaru Yog Vidyalaya"
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Subheading / Badge</label>
              <input
                type="text"
                value={editingSlide?.subheading || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, subheading: e.target.value })}
                placeholder="e.g. Traditional Yoga & Wellness"
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gold-300 mb-1">Slide Description *</label>
            <textarea
              rows={2}
              required
              value={editingSlide?.description || ''}
              onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
              placeholder="Detailed description of the slide philosophy or sanctuary..."
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs text-gold-300 mb-1">Sacred Quote / Shloka Reference</label>
            <input
              type="text"
              value={editingSlide?.quote || ''}
              onChange={(e) => setEditingSlide({ ...editingSlide, quote: e.target.value })}
              placeholder='e.g. "Yogas chitta vritti nirodha — Yoga is the stilling of the mind."'
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400 font-editorial"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gold-300 mb-1">Primary CTA Button</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingSlide?.ctaText || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                  placeholder="Button Label"
                  className="w-1/2 bg-plum-900/50 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory"
                />
                <input
                  type="text"
                  value={editingSlide?.ctaUrl || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaUrl: e.target.value })}
                  placeholder="URL (/programs)"
                  className="w-1/2 bg-plum-900/50 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gold-300 mb-1">Secondary CTA Button</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingSlide?.secondaryCtaText || ''}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })
                  }
                  placeholder="Button Label"
                  className="w-1/2 bg-plum-900/50 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory"
                />
                <input
                  type="text"
                  value={editingSlide?.secondaryCtaUrl || ''}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, secondaryCtaUrl: e.target.value })
                  }
                  placeholder="URL"
                  className="w-1/2 bg-plum-900/50 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gold-500/20">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingSlide?.active ?? true}
                onChange={(e) => setEditingSlide({ ...editingSlide, active: e.target.checked })}
                className="rounded border-gold-500/30 bg-plum-900 text-gold-500 focus:ring-gold-400"
              />
              <span className="text-xs text-ivory">Slide is Active on Public Site</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSlideModalOpen(false);
                  setEditingSlide(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-sans text-ivory/70 hover:text-ivory border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="px-5 py-2 rounded-lg text-xs font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Hero Slide'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
