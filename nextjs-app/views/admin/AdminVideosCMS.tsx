'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsVideo, CmsVideoCategory } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import {
  Video as VideoIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Upload,
  Star,
  Clock,
  User,
  FolderPlus,
  Tag,
  Filter,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AdminVideosCMS: React.FC = () => {
  const [videos, setVideos] = useState<CmsVideo[]>([]);
  const [categories, setCategories] = useState<CmsVideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Category filtering & management state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategorySection, setShowCategorySection] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);
  const [manageCategoryModalOpen, setManageCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CmsVideoCategory | null>(null);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);

  // Inline category creation in Video Modal
  const [showInlineNewCat, setShowInlineNewCat] = useState(false);
  const [inlineNewCatName, setInlineNewCatName] = useState('');

  // Video Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<CmsVideo> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<CmsVideo | null>(null);

  const notifyVideosUpdated = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kalptaru-cms-updated'));
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedVideos, fetchedCategories] = await Promise.all([
        CmsService.getVideos('all'),
        CmsService.getVideoCategories().catch((err) => {
          console.warn('Could not fetch video categories directly:', err);
          return [] as CmsVideoCategory[];
        }),
      ]);

      setVideos(fetchedVideos || []);
      setCategories(fetchedCategories || []);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load video library' });
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

  // Helper to extract YouTube ID from standard URLs
  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  const handleOpenModal = (video?: CmsVideo) => {
    setShowInlineNewCat(false);
    setInlineNewCatName('');

    if (video) {
      setEditingVideo({ ...video });
    } else {
      const defaultCategory =
        categories.length > 0
          ? categories[0].name
          : 'Philosophy Discourse';

      setEditingVideo({
        youtubeUrl: '',
        youtubeVideoId: '',
        title: '',
        description: '',
        category: defaultCategory,
        speaker: 'Mrs. Shuchi Mohan',
        duration: '',
        featured: false,
        order: videos.length + 1,
        status: 'published',
        thumbnail: undefined,
      });
    }
    setModalOpen(true);
  };

  const handleUrlChange = (url: string) => {
    const videoId = extractYoutubeId(url);
    setEditingVideo((prev) => ({
      ...prev,
      youtubeUrl: url,
      youtubeVideoId: videoId,
      thumbnail:
        !prev?.thumbnail?.url && videoId
          ? {
              url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              path: `youtube/${videoId}.jpg`,
              bucket: 'external',
              alt: prev?.title || 'YouTube Thumbnail',
            }
          : prev?.thumbnail,
    }));
  };

  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumb(true);
      const res = await MediaService.uploadImage(file, 'videos', editingVideo?.title || file.name);
      setEditingVideo((prev) => ({
        ...prev,
        thumbnail: {
          url: res.url,
          path: res.path,
          bucket: res.bucket,
          size: res.size,
          mimeType: res.mimeType,
          alt: res.alt || file.name,
        },
      }));
      showToast('Custom thumbnail uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload thumbnail', 'error');
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo?.youtubeUrl || !editingVideo.title) {
      showToast('YouTube URL and video title are required.', 'error');
      return;
    }

    // If an inline new category was entered
    let finalCategory = editingVideo.category || 'Philosophy Discourse';
    if (showInlineNewCat && inlineNewCatName.trim()) {
      try {
        const createdCat = await CmsService.createVideoCategory({
          name: inlineNewCatName.trim(),
        });
        setCategories((prev) => [...prev, createdCat]);
        finalCategory = createdCat.name;
      } catch (err: any) {
        showToast(err.message || 'Failed to create inline category', 'error');
        return;
      }
    }

    try {
      setSaving(true);
      const videoId = editingVideo._id || editingVideo.id;
      const payload: Partial<CmsVideo> = {
        ...editingVideo,
        category: finalCategory,
        youtubeVideoId: editingVideo.youtubeVideoId || extractYoutubeId(editingVideo.youtubeUrl),
      };

      if (videoId) {
        await CmsService.updateVideo(videoId, payload);
        showToast('Video details updated successfully!');
      } else {
        await CmsService.createVideo(payload);
        showToast('New video added to library successfully!');
      }

      notifyVideosUpdated();
      setModalOpen(false);
      setEditingVideo(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save video', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Category creation handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      showToast('Please provide a category name', 'error');
      return;
    }

    // Check if category name already exists
    if (
      categories.some(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      showToast(`Category "${trimmed}" already exists.`, 'error');
      return;
    }

    try {
      setCategorySaving(true);
      const created = await CmsService.createVideoCategory({
        name: trimmed,
        description: newCategoryDesc.trim() || undefined,
        order: categories.length + 1,
      });

      setCategories((prev) => [...prev, created]);
      setNewCategoryName('');
      setNewCategoryDesc('');
      notifyVideosUpdated();
      showToast(`Category "${created.name}" created successfully!`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to create video category', 'error');
    } finally {
      setCategorySaving(false);
    }
  };

  // Delete Category handler
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const catId = (categoryToDelete._id || categoryToDelete.id) as string;
    if (!catId) return;

    try {
      setCategorySaving(true);
      await CmsService.deleteVideoCategory(catId);
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== catId));

      if (selectedCategory === categoryToDelete.name || selectedCategory === categoryToDelete.slug) {
        setSelectedCategory('all');
      }

      showToast(`Category "${categoryToDelete.name}" deleted successfully.`);
      notifyVideosUpdated();
      setDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setCategorySaving(false);
    }
  };

  const handleToggleFeatured = async (video: CmsVideo) => {
    const vidId = video._id || video.id;
    if (!vidId) return;

    try {
      const nextFeatured = !video.featured;
      await CmsService.updateVideo(vidId, { featured: nextFeatured });
      setVideos((prev) =>
        prev.map((v) => ((v._id || v.id) === vidId ? { ...v, featured: nextFeatured } : v))
      );
      notifyVideosUpdated();
      showToast(`Video ${nextFeatured ? 'featured on homepage' : 'unfeatured'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update video', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    const vidId = videoToDelete._id || videoToDelete.id;
    if (!vidId) return;

    try {
      setSaving(true);
      await CmsService.deleteVideo(vidId);
      setVideos((prev) => prev.filter((v) => (v._id || v.id) !== vidId));
      notifyVideosUpdated();
      showToast('Video deleted successfully.');
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete video', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Helper to count videos in a category
  const getCategoryVideoCount = (catName: string, catSlug?: string) => {
    const targetName = (catName || '').toLowerCase().trim();
    const targetSlug = (catSlug || '').toLowerCase().trim();
    return videos.filter((v) => {
      const vidCat = (v.category || '').toLowerCase().trim();
      return vidCat === targetName || (targetSlug && vidCat === targetSlug);
    }).length;
  };

  // Filtered videos
  const filteredVideos = videos.filter((vid) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'featured') return vid.featured;

    const targetCat = categories.find(
      (c) => (c._id || c.id) === selectedCategory || c.slug === selectedCategory || c.name === selectedCategory
    );

    const vidCat = (vid.category || '').toLowerCase().trim();
    if (targetCat) {
      return (
        vidCat === targetCat.name.toLowerCase().trim() ||
        vidCat === targetCat.slug.toLowerCase().trim()
      );
    }
    return vidCat === selectedCategory.toLowerCase().trim();
  });

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Video Discourses & Practices..." />
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
            <span className="px-2.5 py-0.5 rounded text-[11px] font-sans tracking-widest uppercase bg-gold-50 text-gold-700 border border-gold-200 font-semibold">
              Media
            </span>
            <span className="text-[11px] text-ink-muted font-sans font-medium">
              {videos.length} total videos • {categories.length} categories
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Videos &amp; Category Manager
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Manage discourses, guided sadhanas, custom thumbnails, video categories, and homepage feature status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setManageCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans font-medium text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-gold-600" />
            <span>Manage Categories ({categories.length})</span>
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium bg-plum-900 hover:bg-plum-800 text-gold-300 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {/* DEDICATED SECTION: Video Category & Add Category Section */}
      <div className="bg-white border border-border rounded-xl shadow-soft overflow-hidden">
        {/* Section Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-canvas to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-editorial font-bold text-plum-900">
                  Video Categories
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-plum-50 text-plum-800 border border-plum-200">
                  {categories.length} Categories
                </span>
              </div>
              <p className="text-xs text-ink-muted font-sans">
                Create new categories, categorize video discourses, and filter your archive.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCategorySection(!showCategorySection)}
            className="text-xs font-sans text-ink-muted hover:text-plum-900 flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-canvas transition-colors"
          >
            <span>{showCategorySection ? 'Hide Panel' : 'Show Panel'}</span>
            {showCategorySection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Section Content */}
        {showCategorySection && (
          <div className="p-5 sm:p-6 space-y-6">
            {/* Add Category Form */}
            <div className="bg-canvas/50 border border-border/80 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4 text-gold-600" />
                <h3 className="text-xs font-sans font-bold text-plum-900 uppercase tracking-wider">
                  Add New Category
                </h3>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-sans font-medium text-ink-muted mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Asana Alignment, Pranayama &amp; Kriyas, Yoga Nidra"
                      className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-sans font-medium text-ink-muted mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      placeholder="Short summary of this discourse category"
                      className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      disabled={categorySaving || !newCategoryName.trim()}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50 h-[38px]"
                    >
                      <Plus className="w-3.5 h-3.5 text-gold-400" />
                      <span>{categorySaving ? 'Adding...' : 'Add Category'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Existing Categories List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-sans font-bold text-plum-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-gold-600" />
                  <span>Existing Categories &amp; Video Count</span>
                </h4>
                <span className="text-[11px] text-ink-muted font-sans">
                  Click any category pill to filter the video archive below
                </span>
              </div>

              {categories.length === 0 ? (
                <p className="text-xs text-ink-muted italic py-2">
                  No custom categories yet. Add your first category using the form above.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat) => {
                    const catId = (cat._id || cat.id) as string;
                    const count = getCategoryVideoCount(cat.name, cat.slug);
                    const isSelected =
                      selectedCategory === cat.name ||
                      selectedCategory === cat.slug ||
                      selectedCategory === catId;

                    return (
                      <div
                        key={catId || cat.slug}
                        className={`group inline-flex items-center rounded-lg border transition-all shadow-xs ${
                          isSelected
                            ? 'bg-plum-900 border-plum-900 text-gold-300 shadow-sm'
                            : 'bg-white border-border text-ink hover:border-gold-400 hover:bg-gold-50/40'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                          className="px-3 py-1.5 text-xs font-sans font-medium flex items-center gap-1.5"
                          title={`Click to filter videos by "${cat.name}"`}
                        >
                          <Tag className={`w-3 h-3 ${isSelected ? 'text-gold-400' : 'text-gold-600'}`} />
                          <span>{cat.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                              isSelected
                                ? 'bg-plum-800 text-gold-200 border border-plum-700'
                                : 'bg-canvas text-ink-muted border border-border/80'
                            }`}
                          >
                            {count}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToDelete(cat);
                            setDeleteCategoryModalOpen(true);
                          }}
                          className={`p-1.5 border-l transition-colors ${
                            isSelected
                              ? 'border-plum-800 text-gold-400 hover:bg-rose-900/60 hover:text-rose-200'
                              : 'border-border text-ink-faint hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={`Delete category "${cat.name}"`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-border shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted font-sans px-1 flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3 text-gold-600" />
            <span>Filter Videos:</span>
          </span>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors ${
              selectedCategory === 'all'
                ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
                : 'text-ink-muted hover:text-plum-900 bg-canvas border border-border'
            }`}
          >
            All Videos ({videos.length})
          </button>

          <button
            onClick={() => setSelectedCategory('featured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors ${
              selectedCategory === 'featured'
                ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
                : 'text-ink-muted hover:text-plum-900 bg-canvas border border-border'
            }`}
          >
            ★ Featured ({videos.filter((v) => v.featured).length})
          </button>

          {categories.map((cat) => {
            const catId = (cat._id || cat.id) as string;
            const count = getCategoryVideoCount(cat.name, cat.slug);
            const isSelected =
              selectedCategory === cat.name ||
              selectedCategory === cat.slug ||
              selectedCategory === catId;

            return (
              <button
                key={catId || cat.slug}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors ${
                  isSelected
                    ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
                    : 'text-ink-muted hover:text-plum-900 bg-canvas border border-border'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setShowCategorySection(true);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-sans font-medium text-gold-700 bg-gold-50 hover:bg-gold-100 border border-gold-200 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-border rounded-xl shadow-soft">
            <VideoIcon className="w-10 h-10 text-ink-faint mx-auto mb-2" />
            <p className="text-sm text-ink-muted font-sans">
              No videos found in selected category ({selectedCategory}).
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-3 text-xs text-gold-700 hover:underline font-semibold"
              >
                Clear filter &amp; view all videos
              </button>
            )}
          </div>
        ) : (
          filteredVideos.map((vid, index) => {
            const vidId = (vid._id || vid.id) as string;
            const thumbUrl =
              vid.thumbnail?.url ||
              (vid.youtubeVideoId
                ? `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`
                : '');

            return (
              <div
                key={vidId || index}
                className="group bg-white border border-border rounded-xl overflow-hidden shadow-soft flex flex-col justify-between hover:border-gold-300 hover:shadow-card transition-all"
              >
                <div>
                  <div className="relative aspect-video bg-canvas overflow-hidden">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-faint">
                        <VideoIcon className="w-8 h-8" />
                      </div>
                    )}

                    {/* Order badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[10px] text-plum-900 font-mono border border-border shadow-xs">
                      Order #{vid.order}
                    </span>

                    {/* Duration badge */}
                    {vid.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/90 text-[11px] text-ink font-mono flex items-center gap-1 border border-border shadow-xs">
                        <Clock className="w-3 h-3 text-gold-600" />
                        <span>{vid.duration}</span>
                      </span>
                    )}

                    {/* Featured Star */}
                    <button
                      onClick={() => handleToggleFeatured(vid)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                        vid.featured
                          ? 'bg-gold-50 text-gold-700 border border-gold-300 shadow-xs'
                          : 'bg-white/80 text-ink-faint hover:text-gold-600 border border-border'
                      }`}
                      title={vid.featured ? 'Featured on Homepage' : 'Click to feature on Homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${vid.featured ? 'fill-gold-500 text-gold-500' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 space-y-2 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="neutral" size="sm">
                        {vid.category || 'Discourse'}
                      </Badge>
                      {vid.featured && <Badge variant="gold" size="sm">★ Home Featured</Badge>}
                    </div>

                    <h3 className="font-editorial text-base text-plum-900 font-bold line-clamp-2 leading-snug">
                      {vid.title}
                    </h3>

                    {vid.speaker && (
                      <div className="flex items-center gap-1.5 text-xs text-gold-700 font-medium">
                        <User className="w-3.5 h-3.5 text-gold-600" />
                        <span>{vid.speaker}</span>
                      </div>
                    )}

                    {vid.description && (
                      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    )}

                    <div className="pt-1 flex items-center justify-between text-[11px] text-ink-faint font-mono">
                      <span>ID: {vid.youtubeVideoId || 'N/A'}</span>
                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-700 hover:text-gold-800 flex items-center gap-1 font-semibold"
                      >
                        <span>YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card footer controls */}
                <div className="p-3 border-t border-border bg-canvas/40 flex items-center justify-between">
                  <span className="text-[11px] text-ink-muted font-sans capitalize">
                    Status: {vid.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenModal(vid)}
                      className="p-1.5 text-plum-900 hover:text-plum-950 bg-white hover:bg-gold-50 border border-border rounded transition-colors shadow-xs"
                      title="Edit video"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gold-700" />
                    </button>
                    <button
                      onClick={() => {
                        setVideoToDelete(vid);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors shadow-xs"
                      title="Delete video"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Video Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingVideo(null);
        }}
        title={editingVideo?._id || editingVideo?.id ? 'Edit Video Details' : 'Add New YouTube Video'}
        size="md"
      >
        <form onSubmit={handleSaveVideo} className="space-y-4 font-sans text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              YouTube URL *
            </label>
            <input
              type="url"
              required
              value={editingVideo?.youtubeUrl || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 font-mono shadow-xs"
            />
            {editingVideo?.youtubeVideoId && (
              <p className="text-[11px] text-emerald-700 mt-1 font-mono font-medium">
                Detected YouTube Video ID: {editingVideo.youtubeVideoId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              Video Title *
            </label>
            <input
              type="text"
              required
              value={editingVideo?.title || ''}
              onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
              placeholder="e.g. The Essence of Classical Yoga: Beyond Asana Physicality"
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
            />
          </div>

          {/* Category Section in Video Modal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider">
                Video Category *
              </label>
              <button
                type="button"
                onClick={() => setShowInlineNewCat(!showInlineNewCat)}
                className="text-xs text-gold-700 hover:text-gold-800 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{showInlineNewCat ? 'Use Existing Category' : 'Create New Category'}</span>
              </button>
            </div>

            {showInlineNewCat ? (
              <div className="p-3 bg-canvas border border-dashed border-gold-300 rounded-lg space-y-2">
                <label className="block text-[11px] text-plum-900 font-semibold">
                  New Category Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={inlineNewCatName}
                    onChange={(e) => setInlineNewCatName(e.target.value)}
                    placeholder="e.g. Shatkarma &amp; Detoxification"
                    className="flex-1 bg-white border border-border rounded-lg px-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>
                <p className="text-[10px] text-ink-muted">
                  This new category will be saved and automatically assigned to this video.
                </p>
              </div>
            ) : (
              <select
                value={editingVideo?.category || (categories[0]?.name || 'Discourse')}
                onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink focus:outline-none focus:border-gold-500 shadow-xs"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id || c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Philosophy Discourse">Philosophy Discourse</option>
                    <option value="Guided Practice">Guided Practice</option>
                    <option value="Campus Overview">Campus Overview</option>
                    <option value="Masterclass">Masterclass</option>
                    <option value="Chanting & Dhyana">Chanting & Dhyana</option>
                  </>
                )}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Speaker / Teacher
              </label>
              <input
                type="text"
                value={editingVideo?.speaker || ''}
                onChange={(e) => setEditingVideo({ ...editingVideo, speaker: e.target.value })}
                placeholder="Mrs. Shuchi Mohan"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Duration (MM:SS)
              </label>
              <input
                type="text"
                value={editingVideo?.duration || ''}
                onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                placeholder="28:45"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={editingVideo?.order || 0}
              onChange={(e) =>
                setEditingVideo({ ...editingVideo, order: Number(e.target.value) })
              }
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              Description / Summary
            </label>
            <textarea
              rows={3}
              value={editingVideo?.description || ''}
              onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
              placeholder="Summary of the discourse, scriptural citations, or practice guidelines..."
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
            />
          </div>

          {/* Thumbnail Section */}
          <div className="p-3 bg-canvas border border-border rounded-lg space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-plum-900 uppercase tracking-wider">
                Video Thumbnail
              </label>
              <span className="text-[10px] text-ink-muted">Optional Custom Cover</span>
            </div>

            {editingVideo?.thumbnail?.url ? (
              <div className="flex items-center gap-3">
                <img
                  src={editingVideo.thumbnail.url}
                  alt="Thumbnail"
                  className="w-24 h-16 object-cover rounded border border-border shadow-xs"
                />
                <div className="space-y-1">
                  <label className="cursor-pointer px-3 py-1 bg-plum-900 text-gold-300 rounded text-xs font-medium hover:bg-plum-800 shadow-soft">
                    Replace Thumbnail
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingThumb}
                      onChange={handleUploadThumbnail}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex items-center gap-2 p-3 border border-dashed border-border rounded cursor-pointer bg-white hover:border-gold-400 shadow-xs">
                <Upload className="w-4 h-4 text-gold-600" />
                <span className="text-xs text-ink font-medium">
                  {uploadingThumb ? 'Uploading...' : 'Upload custom thumbnail'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingThumb}
                  onChange={handleUploadThumbnail}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingVideo?.featured ?? false}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, featured: e.target.checked })
                }
                className="rounded border-border text-plum-900 focus:ring-gold-400"
              />
              <span className="text-xs text-ink font-medium">Feature in Homepage Video Spotlight</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingVideo(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ink-muted hover:text-ink border border-border bg-white shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingThumb}
              className="px-5 py-2 rounded-lg text-xs font-sans font-medium bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Video'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Full Categories Management Modal */}
      <Modal
        isOpen={manageCategoryModalOpen}
        onClose={() => setManageCategoryModalOpen(false)}
        title="Manage Video Categories"
        size="md"
      >
        <div className="space-y-6 font-sans text-sm">
          {/* Add Category in Modal */}
          <form onSubmit={handleCreateCategory} className="space-y-3 pb-5 border-b border-border">
            <h4 className="text-xs font-sans text-plum-900 font-bold uppercase tracking-wider">
              Create New Category
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Asana Alignment, Pranayama, Vedic Havans"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs text-xs"
              />
              <input
                type="text"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                placeholder="Optional short description..."
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs text-xs"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={categorySaving || !newCategoryName.trim()}
                  className="px-4 py-2 rounded-lg text-xs bg-plum-900 text-gold-300 hover:bg-plum-800 font-medium transition-colors shadow-soft disabled:opacity-50"
                >
                  {categorySaving ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans text-plum-900 font-bold uppercase tracking-wider">
              Existing Video Categories ({categories.length})
            </h4>

            {categories.length === 0 ? (
              <p className="text-xs text-ink-muted italic">No categories created yet.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-border/60 border border-border rounded-lg">
                {categories.map((cat) => {
                  const catId = (cat._id || cat.id) as string;
                  const count = getCategoryVideoCount(cat.name, cat.slug);

                  return (
                    <div
                      key={catId || cat.slug}
                      className="p-3 flex items-center justify-between hover:bg-canvas transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-plum-900">{cat.name}</p>
                        <p className="text-[10px] text-ink-muted font-mono">
                          slug: {cat.slug} • {count} videos
                        </p>
                        {cat.description && (
                          <p className="text-[11px] text-ink-muted mt-0.5">{cat.description}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCategoryToDelete(cat);
                          setDeleteCategoryModalOpen(true);
                        }}
                        title={`Delete category "${cat.name}"`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setManageCategoryModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs text-ink-muted hover:text-ink border border-border bg-white shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <Modal
        isOpen={deleteCategoryModalOpen}
        onClose={() => setDeleteCategoryModalOpen(false)}
        title="Confirm Category Deletion"
        size="sm"
      >
        <div className="space-y-4 font-sans text-sm">
          <p className="text-ink">
            Are you sure you want to delete the category{' '}
            <strong className="text-plum-900 font-bold">"{categoryToDelete?.name}"</strong>?
          </p>
          <p className="text-xs text-rose-600 font-medium">
            Existing videos will not be deleted, but this category option will be removed from future selection.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteCategoryModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs text-ink-muted hover:text-ink border border-border bg-white shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={categorySaving}
              onClick={confirmDeleteCategory}
              className="px-4 py-2 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm disabled:opacity-50"
            >
              {categorySaving ? 'Deleting...' : 'Yes, Delete Category'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Video Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Video Deletion"
        size="sm"
      >
        <div className="space-y-4 font-sans text-sm">
          <p className="text-ink">
            Are you sure you want to permanently delete{' '}
            <strong className="text-plum-900 font-bold">"{videoToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-600 font-medium">
            The video will be removed from archives and public homepage featured videos.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs text-ink-muted hover:text-ink border border-border bg-white shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Yes, Delete Video'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
