'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsTestimonial } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { LoadingState } from '../../components/LoadingState';
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Upload,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const AdminTestimonialsCMS: React.FC = () => {
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<CmsTestimonial> | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CmsTestimonial | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await CmsService.getTestimonials('all');
      setTestimonials(data || []);
    } catch (err: any) {
      console.error('Failed to load testimonials:', err);
      showToast(err.message || 'Failed to load testimonials', 'error');
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

  const handleOpenModal = (item?: CmsTestimonial) => {
    if (item) {
      setEditingItem({ ...item });
    } else {
      setEditingItem({
        name: '',
        roleOrTitle: '',
        programOrCourse: 'Therapeutic Yoga',
        quote: '',
        rating: 5,
        location: 'Mumbai, India',
        status: 'published',
        featured: true,
        order: testimonials.length + 1,
      });
    }
    setModalOpen(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    try {
      setUploadingAvatar(true);
      const uploaded = await MediaService.uploadImage(file, 'testimonials');
      setEditingItem((prev) => ({
        ...prev,
        avatar: {
          url: uploaded.url,
          path: uploaded.path || '',
          alt: `${prev?.name || 'Student'} avatar`,
        },
      }));
      showToast('Avatar image uploaded successfully!');
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      showToast(err.message || 'Failed to upload avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name?.trim() || !editingItem.quote?.trim() || !editingItem.roleOrTitle?.trim()) {
      showToast('Name, role/title, and quote are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const isEdit = Boolean(editingItem._id || editingItem.id);
      const id = (editingItem._id || editingItem.id) as string;

      if (isEdit) {
        await CmsService.updateTestimonial(id, editingItem);
        showToast('Testimonial updated successfully!');
      } else {
        await CmsService.createTestimonial(editingItem);
        showToast('New testimonial created successfully!');
      }

      setModalOpen(false);
      setEditingItem(null);
      await loadData();
      await CmsService.confirmAllChanges();
    } catch (err: any) {
      console.error('Failed to save testimonial:', err);
      showToast(err.message || 'Failed to save testimonial', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      setSaving(true);
      const id = (itemToDelete._id || itemToDelete.id) as string;
      await CmsService.deleteTestimonial(id);
      showToast('Testimonial deleted successfully!');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await loadData();
      await CmsService.confirmAllChanges();
    } catch (err: any) {
      console.error('Failed to delete testimonial:', err);
      showToast(err.message || 'Failed to delete testimonial', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: CmsTestimonial) => {
    try {
      const id = (item._id || item.id) as string;
      const nextStatus = item.status === 'published' ? 'draft' : 'published';
      await CmsService.updateTestimonial(id, { status: nextStatus });
      showToast(`Testimonial status changed to ${nextStatus}!`);
      await loadData();
      await CmsService.confirmAllChanges();
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.roleOrTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.programOrCourse && t.programOrCourse.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || t.rating?.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Alert */}
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

      {/* Header Banner - Standard Light Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-widest uppercase bg-gold-50 text-gold-800 border border-gold-300 font-semibold">
              Content CMS
            </span>
            <span className="text-xs text-ink-muted">• Voices of Sadhana</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Student &amp; Corporate Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Manage authentic reflections, course reviews, and client recommendations displayed below the video section on the home page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs font-medium"
            title="Refresh testimonials"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar - Clean Light Styling */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-border rounded-xl p-4 shadow-soft">
        <div className="flex items-center gap-2 bg-canvas border border-border rounded-lg px-3 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, role, quote..."
            className="bg-transparent text-ink placeholder:text-ink-muted outline-none w-full text-xs font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-ink-muted font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-border text-ink rounded-lg px-3 py-1.5 text-xs outline-none shadow-xs"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-ink-muted font-medium">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-white border border-border text-ink rounded-lg px-3 py-1.5 text-xs outline-none shadow-xs"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      {loading ? (
        <div className="py-16">
          <LoadingState message="Loading testimonials from CMS..." />
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-border shadow-soft space-y-4">
          <MessageSquare className="w-12 h-12 text-gold-600/40 mx-auto" />
          <h3 className="text-lg font-editorial font-bold text-plum-900">No Testimonials Found</h3>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
            {searchQuery
              ? 'No testimonials matched your search query. Try clearing filters.'
              : 'Add your first student or corporate testimonial to display on the home page.'}
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 shadow-soft"
          >
            Create Testimonial
          </button>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Student / Practitioner</th>
                  <th className="px-5 py-3 font-semibold">Program / Focus</th>
                  <th className="px-5 py-3 font-semibold">Quote Snippet</th>
                  <th className="px-5 py-3 font-semibold text-center">Rating</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTestimonials.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-canvas/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        {item.avatar?.url ? (
                          <img
                            src={item.avatar.url}
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gold-50 border border-gold-200 text-gold-800 font-bold font-editorial text-sm flex items-center justify-center">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-plum-950 text-sm">{item.name}</div>
                          <div className="text-xs text-ink-muted">{item.roleOrTitle}</div>
                          {item.location && (
                            <div className="text-[11px] text-ink-muted/70 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-gold-600" />
                              {item.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono text-gold-900 bg-gold-50 border border-gold-200">
                        {item.programOrCourse || 'General Yoga'}
                      </span>
                    </td>

                    <td className="px-5 py-4 max-w-sm">
                      <p className="text-xs text-ink line-clamp-2 italic font-editorial">
                        "{item.quote}"
                      </p>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <div className="inline-flex items-center space-x-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < (item.rating || 5)
                                ? 'fill-gold-500 text-gold-500'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge
                          variant={item.status === 'published' ? 'gold' : 'neutral'}
                          size="sm"
                        >
                          {item.status || 'published'}
                        </Badge>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-plum-900 hover:bg-canvas transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Testimonial Modal - Clean Light Theme */}
      {modalOpen && editingItem && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem._id || editingItem.id ? 'Edit Testimonial' : 'Create New Testimonial'}
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Student / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Dr. Radhika Sen"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Role / Title / Designation *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.roleOrTitle || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, roleOrTitle: e.target.value })}
                  placeholder="e.g. Cardiologist & Senior Sadhak"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Program or Course Completed
                </label>
                <input
                  type="text"
                  value={editingItem.programOrCourse || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, programOrCourse: e.target.value })}
                  placeholder="e.g. 200-Hour TTC / Therapeutic Yoga"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setEditingItem({ ...editingItem, rating: star })}
                    className="p-1 rounded hover:bg-canvas transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (editingItem.rating || 5)
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-ink-muted font-mono ml-2">
                  {editingItem.rating || 5} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Testimonial Quote *
              </label>
              <textarea
                required
                rows={4}
                value={editingItem.quote || ''}
                onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                placeholder="Share the sadhak's authentic journey, physical healing, or spiritual growth..."
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 leading-relaxed font-editorial italic shadow-xs"
              />
            </div>

            {/* Avatar URL or Upload */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Avatar Image (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {editingItem.avatar?.url ? (
                  <img
                    src={editingItem.avatar.url}
                    alt="Avatar preview"
                    className="w-12 h-12 rounded-full object-cover border border-border shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-800 text-base font-bold font-editorial">
                    {editingItem.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editingItem.avatar?.url || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        avatar: { url: e.target.value, path: '', alt: 'Avatar' },
                      })
                    }
                    placeholder="Enter image URL..."
                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-xs text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500"
                  />
                  <div className="flex items-center space-x-2">
                    <label className="px-3 py-1.5 rounded-lg bg-canvas border border-border text-xs text-ink hover:text-plum-900 cursor-pointer flex items-center space-x-1.5 shadow-xs font-medium">
                      <Upload className="w-3.5 h-3.5 text-gold-600" />
                      <span>{uploadingAvatar ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Publishing Status
                </label>
                <select
                  value={editingItem.status || 'published'}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      status: e.target.value as 'published' | 'draft',
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                >
                  <option value="published">Published (Visible on Home Page)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingItem.order || 1}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, order: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-border text-ink-muted hover:text-ink text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-plum-900 text-gold-300 font-semibold text-sm hover:bg-plum-800 shadow-soft disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && itemToDelete && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Testimonial"
          size="sm"
        >
          <div className="space-y-4 pt-2">
            <p className="text-sm text-ink">
              Are you sure you want to permanently delete the testimonial from{' '}
              <span className="font-semibold text-plum-900">{itemToDelete.name}</span>?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-ink-muted text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-500 shadow-xs disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminTestimonialsCMS;
