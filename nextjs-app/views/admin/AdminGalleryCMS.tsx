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
} from 'lucide-react';

export const AdminGalleryCMS: React.FC = () => {
  const [images, setImages] = useState<CmsGalleryImage[]>([]);
  const [categories, setCategories] = useState<CmsGalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload & Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Partial<CmsGalleryImage> | null>(null);

  // Category Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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
      showToast(`Category "${created.name}" created!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-gold-600" />
            <span>New Category</span>
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenUploadModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium bg-plum-900 hover:bg-plum-800 text-gold-300 transition-colors shadow-soft"
          >
            <Upload className="w-4 h-4 text-gold-400" />
            <span>Upload Photo</span>
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
            <button
              key={catId}
              onClick={() => setSelectedCategory(catId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors ${
                selectedCategory === catId
                  ? 'bg-plum-900 text-gold-300 font-semibold shadow-xs'
                  : 'text-ink-muted hover:text-plum-900 bg-canvas border border-border'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-border rounded-xl shadow-soft">
            <ImageIcon className="w-10 h-10 text-ink-faint mx-auto mb-2" />
            <p className="text-sm text-ink-muted font-sans">No photos in this category.</p>
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

      {/* New Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Create New Gallery Category"
        size="sm"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4 font-sans text-sm">
          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Asana Lab, Vedic Havans, Nature Retreats"
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs text-ink-muted hover:text-ink border border-border bg-white shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-xs bg-plum-900 text-gold-300 hover:bg-plum-800 font-medium transition-colors shadow-soft disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
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
    </div>
  );
};
