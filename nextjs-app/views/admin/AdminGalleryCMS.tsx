'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsGalleryImage, CmsGalleryCategory } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import {
  Image as ImageIcon,
  Upload,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderPlus,
  Star,
  Filter,
  Layers,
  Plus,
  X,
  UploadCloud,
  FolderUp,
  Check,
  FileImage,
} from 'lucide-react';

export const AdminGalleryCMS: React.FC = () => {
  const [images, setImages] = useState<CmsGalleryImage[]>([]);
  const [categories, setCategories] = useState<CmsGalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload & Edit Modal (Single)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Partial<CmsGalleryImage> | null>(null);

  // Bulk Upload Modal (Section-wise)
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchTargetCategory, setBatchTargetCategory] = useState<string>('');
  const [batchFiles, setBatchFiles] = useState<
    Array<{ file: File; id: string; title: string; previewUrl: string }>
  >([]);
  const [batchEvent, setBatchEvent] = useState('');
  const [batchStatus, setBatchStatus] = useState<'published' | 'draft'>('published');
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; stage: string }>({
    current: 0,
    total: 0,
    stage: '',
  });
  const [inlineNewCatName, setInlineNewCatName] = useState('');
  const [showInlineNewCat, setShowInlineNewCat] = useState(false);

  // Category Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<CmsGalleryCategory | null>(null);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<CmsGalleryImage | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedImages, fetchedCategories] = await Promise.all([
        CmsService.getGalleryImages('all'),
        CmsService.getGalleryCategories(),
      ]);

      setImages(fetchedImages || []);
      setCategories(fetchedCategories || []);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load gallery' });
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

  const notifyGalleryUpdated = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('kalptaru_cached_gallery_photos');
        localStorage.removeItem('kalptaru_cached_gallery_categories');
        window.dispatchEvent(new CustomEvent('kalptaru-cms-updated', { detail: { timestamp: Date.now() } }));
      } catch {}
    }
  };

  const handleOpenBatchModal = (preselectedCatId?: string) => {
    const defaultCat = preselectedCatId || (categories.length > 0 ? (categories[0]._id || categories[0].id) : '');
    setBatchTargetCategory((defaultCat as string) || '');
    setBatchFiles([]);
    setBatchEvent('');
    setBatchStatus('published');
    setShowInlineNewCat(false);
    setInlineNewCatName('');
    setBatchModalOpen(true);
  };

  const handleBatchFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const newItems = selected.map((file, idx) => {
      // Format file name into a clean, human title (e.g. "morning_asana_01.jpg" -> "Morning Asana 01")
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        file,
        id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        title: cleanName || `Gallery Photo ${images.length + idx + 1}`,
        previewUrl: URL.createObjectURL(file),
      };
    });

    setBatchFiles((prev) => [...prev, ...newItems]);
    // Reset file input value so same files can be reselected if needed
    e.target.value = '';
  };

  const handleRemoveBatchFile = (id: string) => {
    setBatchFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateBatchTitle = (id: string, newTitle: string) => {
    setBatchFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleBatchUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (batchFiles.length === 0) {
      showToast('Please select at least one photo to upload.', 'error');
      return;
    }

    let targetCatId = batchTargetCategory;

    // If user is creating a new category inline:
    if (showInlineNewCat && inlineNewCatName.trim()) {
      try {
        const createdCat = await CmsService.createGalleryCategory({ name: inlineNewCatName.trim() });
        targetCatId = (createdCat._id || createdCat.id) as string;
        setCategories((prev) => [...prev, createdCat]);
        setBatchTargetCategory(targetCatId);
        setShowInlineNewCat(false);
        setInlineNewCatName('');
      } catch (err: any) {
        showToast(err.message || 'Failed to create new section', 'error');
        return;
      }
    }

    if (!targetCatId) {
      showToast('Please select or create a target section / category.', 'error');
      return;
    }

    const targetCatObj = categories.find((c) => (c._id || c.id) === targetCatId);

    try {
      setBatchUploading(true);
      setBatchProgress({
        current: 0,
        total: batchFiles.length,
        stage: `Preparing ${batchFiles.length} photos for upload...`,
      });

      const uploadedImagesData: Partial<CmsGalleryImage>[] = [];

      // Upload each file with live progress updates
      for (let i = 0; i < batchFiles.length; i++) {
        const item = batchFiles[i];
        setBatchProgress({
          current: i + 1,
          total: batchFiles.length,
          stage: `Uploading photo ${i + 1} of ${batchFiles.length} (${item.title})...`,
        });

        const uploadRes = await MediaService.uploadImage(item.file, 'gallery', item.title);

        uploadedImagesData.push({
          title: item.title,
          category: targetCatId,
          categorySlug: targetCatObj?.slug,
          event: batchEvent.trim(),
          featured: false,
          status: batchStatus,
          order: images.length + i + 1,
          image: {
            url: uploadRes.url,
            path: uploadRes.path,
            bucket: uploadRes.bucket,
            size: uploadRes.size,
            mimeType: uploadRes.mimeType,
            alt: uploadRes.alt || item.title,
          },
        });
      }

      setBatchProgress({
        current: batchFiles.length,
        total: batchFiles.length,
        stage: 'Saving photos to gallery section...',
      });

      // Save records in batch to MongoDB
      await CmsService.createGalleryImagesBatch(uploadedImagesData);

      notifyGalleryUpdated();
      showToast(
        `Successfully uploaded ${batchFiles.length} photos to section "${targetCatObj?.name || 'Selected Section'}"!`
      );

      setBatchModalOpen(false);
      setBatchFiles([]);
      setBatchEvent('');
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload photos. Please try again.', 'error');
    } finally {
      setBatchUploading(false);
    }
  };

  const handleOpenUploadModal = (img?: CmsGalleryImage) => {
    if (img) {
      setEditingImage({
        ...img,
        category:
          typeof img.category === 'object' && img.category !== null
            ? (img.category as any)._id
            : img.category,
      });
    } else {
      setEditingImage({
        title: '',
        description: '',
        category: categories.length > 0 ? categories[0]._id || categories[0].id : '',
        categorySlug: categories.length > 0 ? categories[0].slug : '',
        event: '',
        featured: false,
        order: images.length + 1,
        status: 'published',
        image: {
          url: '',
          path: '',
          alt: '',
        },
      });
    }
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // Supabase Storage upload
      const res = await MediaService.uploadImage(file, 'gallery', editingImage?.title || file.name);
      setEditingImage((prev) => ({
        ...prev,
        title: prev?.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        image: {
          url: res.url,
          path: res.path,
          bucket: res.bucket,
          size: res.size,
          mimeType: res.mimeType,
          alt: res.alt || file.name,
        },
      }));
      showToast('Photo uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage?.title || !editingImage.image?.url) {
      showToast('Image title and an uploaded photo are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const imgId = editingImage._id || editingImage.id;

      // Find category slug if available
      const catObj = categories.find(
        (c) => (c._id || c.id) === (editingImage.category as string)
      );
      const payload: Partial<CmsGalleryImage> = {
        ...editingImage,
        categorySlug: catObj?.slug || editingImage.categorySlug,
      };

      if (imgId) {
        await CmsService.updateGalleryImage(imgId, payload);
        showToast('Gallery image updated successfully!');
      } else {
        await CmsService.createGalleryImage(payload);
        showToast('New photo added to gallery successfully!');
      }

      notifyGalleryUpdated();
      setModalOpen(false);
      setEditingImage(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save gallery photo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (image: CmsGalleryImage) => {
    const imgId = image._id || image.id;
    if (!imgId) return;

    try {
      const nextFeatured = !image.featured;
      await CmsService.updateGalleryImage(imgId, { featured: nextFeatured });
      setImages((prev) =>
        prev.map((img) => ((img._id || img.id) === imgId ? { ...img, featured: nextFeatured } : img))
      );
      notifyGalleryUpdated();
      showToast(`Photo ${nextFeatured ? 'featured on homepage' : 'unfeatured'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle featured status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    const imgId = imageToDelete._id || imageToDelete.id;
    if (!imgId) return;

    try {
      setSaving(true);
      await CmsService.deleteGalleryImage(imgId);
      setImages((prev) => prev.filter((img) => (img._id || img.id) !== imgId));
      notifyGalleryUpdated();
      showToast('Gallery photo deleted successfully.');
      setDeleteModalOpen(false);
      setImageToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete photo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      setSaving(true);
      const created = await CmsService.createGalleryCategory({
        name: newCategoryName.trim(),
        slug,
      });
      setCategories((prev) => [...prev, created]);
      setNewCategoryName('');
      setCategoryModalOpen(false);
      notifyGalleryUpdated();
      showToast(`Category "${created.name}" created!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const catId = (categoryToDelete._id || categoryToDelete.id) as string;
    try {
      setSaving(true);
      await CmsService.deleteGalleryCategory(catId);
      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== catId));
      if (selectedCategory === catId || selectedCategory === categoryToDelete.slug) {
        setSelectedCategory('all');
      }
      notifyGalleryUpdated();
      showToast(`Category "${categoryToDelete.name}" deleted successfully.`);
      setDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredImages = images.filter((img) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'featured') return img.featured;
    const catId = typeof img.category === 'object' && img.category !== null ? (img.category as any)._id : img.category;
    return catId === selectedCategory || img.categorySlug === selectedCategory;
  });

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Sacred Media Gallery..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
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
            <span className="px-2.5 py-0.5 rounded text-[11px] font-sans tracking-widest uppercase bg-gold-50 text-gold-700 border border-gold-200">
              Media
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Gallery
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Upload, edit, delete, categorize, reorder, and feature ashram & sadhana photography.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans font-medium text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-gold-600" />
            <span>Manage &amp; Delete Categories</span>
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenBatchModal(selectedCategory !== 'all' && selectedCategory !== 'featured' ? selectedCategory : undefined)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold bg-gold-500 hover:bg-gold-400 text-plum-950 transition-colors shadow-soft"
          >
            <Layers className="w-4 h-4" />
            <span>Upload Multiple Photos</span>
          </button>
          <button
            onClick={() => handleOpenUploadModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium bg-plum-900 hover:bg-plum-800 text-gold-300 transition-colors shadow-soft"
          >
            <Upload className="w-4 h-4 text-gold-400" />
            <span>Single Photo</span>
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-xl border border-border shadow-soft">
        <span className="text-xs text-ink-muted font-sans px-2 flex items-center gap-1 font-medium">
          <Filter className="w-3 h-3 text-gold-600" />
          <span>Filter:</span>
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors ${
            selectedCategory === 'all'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
              : 'text-ink-muted hover:text-plum-900 bg-canvas border border-border'
          }`}
        >
          All Photos ({images.length})
        </button>
        <button
          onClick={() => setSelectedCategory('featured')}
          className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors ${
            selectedCategory === 'featured'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
              : 'text-ink-muted hover:text-plum-900 bg-canvas border border-border'
          }`}
        >
          ★ Featured on Home ({images.filter((img) => img.featured).length})
        </button>
        {categories.map((cat) => {
          const catId = (cat._id || cat.id) as string;
          const count = images.filter((img) => {
            const id = typeof img.category === 'object' && img.category !== null ? (img.category as any)._id : img.category;
            return id === catId || img.categorySlug === cat.slug;
          }).length;

          return (
            <div key={catId} className="inline-flex items-center rounded-lg border border-border overflow-hidden shadow-xs">
              <button
                onClick={() => setSelectedCategory(catId)}
                className={`px-3 py-1.5 text-xs font-sans transition-colors ${
                  selectedCategory === catId
                    ? 'bg-plum-900 text-gold-300 font-semibold'
                    : 'text-ink-muted hover:text-plum-900 bg-canvas hover:bg-white'
                }`}
              >
                {cat.name} ({count})
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryToDelete(cat);
                  setDeleteCategoryModalOpen(true);
                }}
                title={`Delete category "${cat.name}"`}
                aria-label={`Delete category ${cat.name}`}
                className="px-2 py-1.5 text-xs transition-colors border-l border-border bg-rose-50 text-rose-600 hover:text-white hover:bg-rose-600 flex items-center justify-center"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {selectedCategory !== 'all' && selectedCategory !== 'featured' && (
          <button
            onClick={() => handleOpenBatchModal(selectedCategory)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold-100 hover:bg-gold-200 text-plum-950 border border-gold-300 transition-colors ml-auto shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-gold-700" />
            <span>+ Add Multiple to This Section</span>
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-border rounded-xl shadow-soft space-y-3">
            <ImageIcon className="w-10 h-10 text-ink-faint mx-auto mb-2" />
            <p className="text-sm text-ink-muted font-sans">No photos in this section.</p>
            <button
              onClick={() => handleOpenBatchModal(selectedCategory !== 'all' && selectedCategory !== 'featured' ? selectedCategory : undefined)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-gold-500 hover:bg-gold-400 text-plum-950 transition-colors shadow-soft"
            >
              <Layers className="w-4 h-4" />
              <span>Upload Multiple Photos Here</span>
            </button>
          </div>
        ) : (
          filteredImages.map((img) => {
            const imgId = (img._id || img.id) as string;
            const categoryName =
              typeof img.category === 'object' && img.category !== null
                ? (img.category as any).name
                : categories.find((c) => (c._id || c.id) === img.category)?.name || 'General';

            return (
              <div
                key={imgId}
                className="group bg-white border border-border rounded-xl overflow-hidden shadow-soft flex flex-col justify-between hover:border-gold-300 hover:shadow-card transition-all"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
                    <img
                      src={img.image.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Order badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[10px] text-plum-900 font-mono border border-border shadow-xs">
                      Order #{img.order}
                    </span>

                    {/* Featured Star */}
                    <button
                      onClick={() => handleToggleFeatured(img)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                        img.featured
                          ? 'bg-gold-50 text-gold-700 border border-gold-300 shadow-xs'
                          : 'bg-white/80 text-ink-faint hover:text-gold-600 border border-border'
                      }`}
                      title={img.featured ? 'Featured on Homepage' : 'Click to feature on Homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${img.featured ? 'fill-gold-500 text-gold-500' : ''}`} />
                    </button>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-sans text-gold-700 font-semibold">
                        {categoryName}
                      </span>
                      {img.featured && <Badge variant="gold" size="sm">Featured</Badge>}
                    </div>

                    <h3 className="font-editorial text-base text-plum-900 font-bold line-clamp-1">
                      {img.title}
                    </h3>

                    {img.description && (
                      <p className="text-xs text-ink-muted font-sans line-clamp-2 leading-relaxed">
                        {img.description}
                      </p>
                    )}

                    {img.image?.path && (
                      <p className="text-[10px] font-mono text-ink-faint truncate pt-1">
                        {img.image.path}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card footer controls */}
                <div className="p-3 border-t border-border bg-canvas/40 flex items-center justify-between">
                  <span className="text-[11px] text-ink-muted font-sans capitalize">
                    Status: {img.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenUploadModal(img)}
                      className="p-1.5 text-plum-900 hover:text-plum-950 bg-white hover:bg-gold-50 border border-border rounded transition-colors shadow-xs"
                      title="Edit photo details"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gold-700" />
                    </button>
                    <button
                      onClick={() => {
                        setImageToDelete(img);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors shadow-xs"
                      title="Delete photo"
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

      {/* Upload & Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingImage(null);
        }}
        title={editingImage?._id || editingImage?.id ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
        size="md"
      >
        <form onSubmit={handleSaveImage} className="space-y-4 font-sans text-xs sm:text-sm">
          {/* Supabase Storage Upload */}
          <div className="space-y-2 p-3.5 bg-canvas border border-border rounded-lg shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-plum-900 uppercase tracking-wider">
                Photo
              </label>
            </div>

            {editingImage?.image?.url ? (
              <div className="relative rounded-lg overflow-hidden border border-border max-h-48 group shadow-xs">
                <img
                  src={editingImage.image.url}
                  alt={editingImage.title || 'Preview'}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-plum-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer px-3 py-1.5 bg-plum-900 text-gold-300 rounded text-xs font-medium hover:bg-plum-800 shadow-soft">
                    Replace Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer bg-white hover:border-gold-400 transition-colors shadow-xs">
                <Upload className="w-8 h-8 text-gold-600 mb-2" />
                <span className="text-xs text-plum-900 font-semibold">
                  {uploadingImage ? 'Uploading photo...' : 'Click or Drag to Upload Photo'}
                </span>
                <span className="text-[11px] text-ink-muted mt-1">
                  Accepts JPEG, PNG, or WebP. Max 5MB.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              Photo Title *
            </label>
            <input
              type="text"
              required
              value={editingImage?.title || ''}
              onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
              placeholder="e.g. Dawn Surya Namaskar on the Pavilions"
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={(editingImage?.category as string) || ''}
                onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink focus:outline-none focus:border-gold-500 shadow-xs"
              >
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Event / Occasion
              </label>
              <input
                type="text"
                value={editingImage?.event || ''}
                onChange={(e) => setEditingImage({ ...editingImage, event: e.target.value })}
                placeholder="e.g. Navratri Sadhana, 200-Hour TTC"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              Caption / Description
            </label>
            <textarea
              rows={2}
              value={editingImage?.description || ''}
              onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
              placeholder="Describe the asana posture, chanting circle, or ashram setting..."
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={editingImage?.order || 0}
                onChange={(e) =>
                  setEditingImage({ ...editingImage, order: Number(e.target.value) })
                }
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingImage?.featured ?? false}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, featured: e.target.checked })
                  }
                  className="rounded border-border text-plum-900 focus:ring-gold-400"
                />
                <span className="text-xs text-ink font-medium">Feature on Homepage</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingImage(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ink-muted hover:text-ink border border-border bg-white shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-5 py-2 rounded-lg text-xs font-sans font-medium bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Gallery Photo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Manage / New Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Manage Gallery Categories"
        size="md"
      >
        <div className="space-y-6 font-sans text-sm">
          {/* Add Category Form */}
          <form onSubmit={handleCreateCategory} className="space-y-3 pb-5 border-b border-border">
            <h4 className="text-xs font-sans text-plum-900 font-bold uppercase tracking-wider">
              Create New Category
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Asana Lab, Vedic Havans, Nature Retreats"
                className="flex-1 bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs text-xs"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg text-xs bg-plum-900 text-gold-300 hover:bg-plum-800 font-medium transition-colors shadow-soft disabled:opacity-50 whitespace-nowrap"
              >
                {saving ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans text-plum-900 font-bold uppercase tracking-wider">
              Existing Categories ({categories.length})
            </h4>

            {categories.length === 0 ? (
              <p className="text-xs text-ink-muted italic">No custom categories created yet.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-border/60 border border-border rounded-lg">
                {categories.map((cat) => {
                  const catId = (cat._id || cat.id) as string;
                  const count = images.filter((img) => {
                    const id = typeof img.category === 'object' && img.category !== null ? (img.category as any)._id : img.category;
                    return id === catId || img.categorySlug === cat.slug;
                  }).length;

                  return (
                    <div
                      key={catId}
                      className="p-3 flex items-center justify-between hover:bg-canvas transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-plum-900">{cat.name}</p>
                        <p className="text-[10px] text-ink-muted font-mono">{cat.slug} • {count} photos</p>
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
                        <span>Delete Category</span>
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
              onClick={() => setCategoryModalOpen(false)}
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
            Are you sure you want to permanently delete the category{' '}
            <strong className="text-plum-900 font-bold">"{categoryToDelete?.name}"</strong>?
          </p>
          <p className="text-xs text-ink-muted">
            Photos in this category will not be deleted, but they will be categorized under All/General.
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
              disabled={saving}
              onClick={confirmDeleteCategory}
              className="px-4 py-2 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Yes, Delete Category'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Photo Deletion"
        size="sm"
      >
        <div className="space-y-4 font-sans text-sm">
          <p className="text-ink">
            Are you sure you want to permanently delete{' '}
            <strong className="text-plum-900 font-bold">"{imageToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-600 font-medium">
            The image will be removed from the gallery and public homepage highlights.
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
              {saving ? 'Deleting...' : 'Yes, Delete Photo'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Bulk Upload Modal (Section-wise) ─── */}
      <Modal
        isOpen={batchModalOpen}
        onClose={() => {
          if (!batchUploading) {
            setBatchModalOpen(false);
            setBatchFiles([]);
          }
        }}
        title="Upload Multiple Photos (Section-wise)"
        size="lg"
      >
        <form onSubmit={handleBatchUploadSubmit} className="space-y-5 font-sans text-xs sm:text-sm">
          {/* Section Selection */}
          <div className="p-4 bg-canvas border border-border rounded-xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-plum-900 uppercase tracking-wider flex items-center gap-1.5">
                <FolderPlus className="w-3.5 h-3.5 text-gold-600" />
                <span>Target Section / Category *</span>
              </label>
              <button
                type="button"
                onClick={() => setShowInlineNewCat(!showInlineNewCat)}
                className="text-xs font-semibold text-gold-700 hover:text-gold-900 underline underline-offset-2 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{showInlineNewCat ? 'Choose Existing Section' : 'Create New Section'}</span>
              </button>
            </div>

            {showInlineNewCat ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  autoFocus
                  value={inlineNewCatName}
                  onChange={(e) => setInlineNewCatName(e.target.value)}
                  placeholder="e.g. Asana Practice, Shala Architecture, NCERT Yoga Camp"
                  className="flex-1 bg-white border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
                <span className="text-[11px] text-ink-muted">Will be created on upload</span>
              </div>
            ) : (
              <select
                required
                value={batchTargetCategory}
                onChange={(e) => setBatchTargetCategory(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs font-medium"
              >
                <option value="" disabled>-- Select Gallery Section / Category --</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={(c._id || c.id) as string}>
                    {c.name} ({images.filter((img) => ((typeof img.category === 'object' && img.category !== null ? (img.category as any)._id : img.category) === (c._id || c.id) || img.categorySlug === c.slug)).length} photos)
                  </option>
                ))}
              </select>
            )}
            <p className="text-[11px] text-ink-muted">
              All photos in this batch will be organized under this section on the public Gallery page.
            </p>
          </div>

          {/* Multiple File Picker Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-plum-900 uppercase tracking-wider block">
              Select Photos *
            </label>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-gold-400 rounded-xl cursor-pointer bg-white transition-all shadow-xs group">
              <UploadCloud className="w-9 h-9 text-gold-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm text-plum-900 font-bold">
                Click or Drag &amp; Drop Multiple Images Here
              </span>
              <span className="text-[11px] text-ink-muted mt-1">
                Select JPEG, PNG, or WebP pictures. Hold Ctrl/Cmd or Shift to select multiple files at once.
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={batchUploading}
                onChange={handleBatchFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {/* Common Optional Settings: Event Tag & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                Event / Occasion Tag (Optional)
              </label>
              <input
                type="text"
                value={batchEvent}
                onChange={(e) => setBatchEvent(e.target.value)}
                placeholder="e.g. International Yoga Day 2026, Morning Sadhana"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                Publish Status
              </label>
              <select
                value={batchStatus}
                onChange={(e) => setBatchStatus(e.target.value as any)}
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
              >
                <option value="published">Published (Visible to public)</option>
                <option value="draft">Draft (Admin only)</option>
              </select>
            </div>
          </div>

          {/* Selected Photos Queue List */}
          {batchFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-plum-900">
                  Selected Queue ({batchFiles.length} photos)
                </span>
                <button
                  type="button"
                  onClick={() => setBatchFiles([])}
                  className="text-[11px] text-rose-600 hover:text-rose-800 font-medium underline"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 rounded-xl border border-border p-2 bg-canvas">
                {batchFiles.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg border border-border shadow-xs"
                  >
                    <span className="text-xs font-mono font-bold text-ink-muted w-5 text-right shrink-0">
                      {idx + 1}.
                    </span>
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateBatchTitle(item.id, e.target.value)}
                        placeholder="Photo Title"
                        className="w-full bg-canvas-warm border border-border rounded px-2.5 py-1 text-xs text-ink focus:outline-none focus:border-gold-500 font-medium"
                      />
                      <span className="text-[10px] text-ink-muted block mt-0.5 truncate">
                        {item.file.name} ({(item.file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBatchFile(item.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors shrink-0"
                      title="Remove from batch"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {batchUploading && (
            <div className="p-4 bg-plum-50 border border-plum-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-plum-950">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-600" />
                  <span>{batchProgress.stage}</span>
                </span>
                <span className="font-mono font-bold">
                  {batchProgress.current} / {batchProgress.total}
                </span>
              </div>
              <div className="w-full h-2.5 bg-plum-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-300 rounded-full"
                  style={{
                    width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              disabled={batchUploading}
              onClick={() => {
                setBatchModalOpen(false);
                setBatchFiles([]);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ink-muted hover:text-ink border border-border bg-white shadow-xs disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={batchUploading || batchFiles.length === 0}
              className="px-5 py-2.5 rounded-lg text-xs font-sans font-bold bg-gold-500 hover:bg-gold-400 text-plum-950 shadow-soft transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {batchUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading Batch...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>
                    Upload {batchFiles.length > 0 ? `${batchFiles.length} Photos` : 'Photos'} to Section
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
