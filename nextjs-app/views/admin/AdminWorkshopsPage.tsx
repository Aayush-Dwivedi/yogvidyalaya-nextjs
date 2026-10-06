'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsWorkshop } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Star,
  Search,
  Filter,
  Image as ImageIcon,
  Flame,
} from 'lucide-react';

export const AdminWorkshopsPage: React.FC = () => {
  const [workshops, setWorkshops] = useState<CmsWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'location' | 'instructor' | 'seo'>('basics');
  const [editingWorkshop, setEditingWorkshop] = useState<Partial<CmsWorkshop> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<CmsWorkshop | null>(null);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const items = await CmsService.getWorkshops('all');
      setWorkshops(items || []);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load workshops' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleOpenModal = (workshop?: CmsWorkshop) => {
    setActiveTab('basics');
    if (workshop) {
      setEditingWorkshop({
        ...workshop,
        image: workshop.coverImage || workshop.image,
        date: workshop.date ? new Date(workshop.date).toISOString().slice(0, 10) : '',
        endDate: workshop.endDate ? new Date(workshop.endDate).toISOString().slice(0, 10) : '',
        registrationDeadline: workshop.registrationDeadline
          ? new Date(workshop.registrationDeadline).toISOString().slice(0, 10)
          : '',
        startTime: workshop.startTime || '09:00 AM',
        endTime: workshop.endTime || '05:00 PM',
        capacity: workshop.capacity || { total: 25, booked: 0 },
        price: workshop.price || { amount: 3500, currency: 'INR', displayPrice: '₹3,500' },
        location: workshop.location || {
          venue: 'Kalptaru Yog Vidyalaya',
          city: 'Faridabad',
          address: 'N114 Piyush Heights, Sector 89, Faridabad – 121002',
        },
        instructor: workshop.instructor || {
          name: 'Mrs. Shuchi Mohan',
          title: 'Physiotherapist & Therapeutic Yoga Consultant',
        },
      });
    } else {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);

      const defaultDeadline = new Date(defaultDate);
      defaultDeadline.setDate(defaultDeadline.getDate() - 2);

      setEditingWorkshop({
        title: '',
        slug: '',
        description: '',
        shortDescription: '',
        date: defaultDate.toISOString().slice(0, 10),
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        duration: '1 Hr',
        mode: 'in-person',
        location: {
          venue: 'Kalptaru Yog Vidyalaya',
          city: 'Faridabad',
          address: 'N114 Piyush Heights, Sector 89, Faridabad – 121002',
          mapUrl: '',
          onlineLink: '',
        },
        capacity: { total: 25, booked: 0 },
        price: { amount: 0, currency: 'INR', isFree: true, displayPrice: 'Free' },
        registrationDeadline: defaultDeadline.toISOString().slice(0, 10),
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Physiotherapist & Therapeutic Yoga Consultant',
          bio: 'Founder & Lead Instructor of Kalptaru Yog Vidyalaya',
        },
        prerequisites: ['Open to all age groups'],
        status: 'published',
        featured: false,
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: ['yoga workshop', 'therapeutic yoga', 'faridabad yoga'],
        },
      });
    }
    setModalOpen(true);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await MediaService.uploadImage(file, 'workshops', editingWorkshop?.title || 'Workshop Cover');
      setEditingWorkshop((prev) => ({
        ...prev,
        coverImage: res,
        image: res,
      }));
      showToast('Workshop cover image uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop?.title || !editingWorkshop.description || !editingWorkshop.date || !editingWorkshop.duration) {
      showToast('Title, description, date, and duration are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const workshopId = editingWorkshop._id || editingWorkshop.id;

      const cover = editingWorkshop.coverImage || editingWorkshop.image || {
        url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
        path: 'workshops/default-workshop.jpg',
        bucket: 'kalptaru-media',
        alt: editingWorkshop.title,
      };

      const payload: Partial<CmsWorkshop> = {
        ...editingWorkshop,
        coverImage: cover,
        image: cover,
        shortDescription: editingWorkshop.shortDescription || editingWorkshop.description.slice(0, 160).trim(),
      };

      if (workshopId) {
        await CmsService.updateWorkshop(workshopId, payload);
        showToast('Workshop updated successfully! Live website synced.');
      } else {
        await CmsService.createWorkshop(payload);
        showToast('New workshop created successfully! Live website synced.');
      }

      setModalOpen(false);
      setEditingWorkshop(null);
      await loadWorkshops();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save workshop', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (workshop: CmsWorkshop) => {
    const workshopId = workshop._id || workshop.id;
    if (!workshopId) return;

    const nextStatus = workshop.status === 'published' ? 'draft' : 'published';
    try {
      await CmsService.toggleWorkshopStatus(workshopId, nextStatus as any);
      setWorkshops((prev) =>
        prev.map((w) => ((w._id || w.id) === workshopId ? { ...w, status: nextStatus } : w))
      );
      showToast(`Workshop "${workshop.title}" status changed to ${nextStatus}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleToggleFeatured = async (workshop: CmsWorkshop) => {
    const workshopId = workshop._id || workshop.id;
    if (!workshopId) return;

    const nextFeatured = !workshop.featured;
    try {
      await CmsService.toggleWorkshopFeatured(workshopId, nextFeatured);
      setWorkshops((prev) =>
        prev.map((w) => ((w._id || w.id) === workshopId ? { ...w, featured: nextFeatured } : w))
      );
      showToast(`Workshop "${workshop.title}" ${nextFeatured ? 'featured on homepage' : 'unfeatured'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle featured status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!workshopToDelete) return;
    const workshopId = workshopToDelete._id || workshopToDelete.id;
    if (!workshopId) return;

    try {
      setSaving(true);
      await CmsService.deleteWorkshop(workshopId);
      setWorkshops((prev) => prev.filter((w) => (w._id || w.id) !== workshopId));
      showToast(`Workshop "${workshopToDelete.title}" deleted.`);
      setDeleteModalOpen(false);
      setWorkshopToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete workshop', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered Workshops
  const filteredWorkshops = workshops.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location?.venue?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = filterMode === 'all' || w.mode === filterMode;
    const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Workshops & Sadhana Intensives..." />
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-sans tracking-widest uppercase bg-gold-50 text-gold-700 border border-gold-200">
              Sadhana Intensives
            </span>
            <span className="text-xs text-ink-muted">• Public Website Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Workshop Management
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Manage upcoming masterclasses, pranayama immersions, registration deadlines, seat occupancy, and fees.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadWorkshops}
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
            <span>Create New Workshop</span>
          </button>
        </div>
      </div>

      {/* Toolbar Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white border border-border p-3.5 rounded-xl font-sans text-xs shadow-soft">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-canvas border border-border rounded-lg px-3 py-1.5 shadow-xs">
          <Search className="w-4 h-4 text-ink-faint shrink-0" />
          <input
            type="text"
            placeholder="Search by workshop title, venue, instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-ink placeholder:text-ink-faint outline-none w-full text-xs font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-ink-muted font-medium">
            <Filter className="w-3.5 h-3.5 text-gold-600" />
            <span>Filters:</span>
          </div>

          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-white border border-border text-ink rounded px-2.5 py-1 text-xs outline-none shadow-xs"
          >
            <option value="all">All Modes</option>
            <option value="in-person">In-Person</option>
            <option value="residential">Residential</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-border text-ink rounded px-2.5 py-1 text-xs outline-none shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Workshop Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-canvas border-b border-border text-ink-muted uppercase tracking-wider font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3 font-semibold w-16 text-center">Cover</th>
                <th className="px-4 py-3 font-semibold">Workshop Title</th>
                <th className="px-4 py-3 font-semibold">Date & Time</th>
                <th className="px-4 py-3 font-semibold">Venue / Mode</th>
                <th className="px-4 py-3 font-semibold">Registration Deadline</th>
                <th className="px-4 py-3 font-semibold text-center">Capacity</th>
                <th className="px-4 py-3 font-semibold">Fee</th>
                <th className="px-4 py-3 font-semibold text-center">Featured</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredWorkshops.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-ink-muted">
                    No workshops found matching criteria. Click "Create New Workshop" above.
                  </td>
                </tr>
              ) : (
                filteredWorkshops.map((ws, index) => {
                  const wsId = (ws._id || ws.id) as string;
                  const isPublished = ws.status === 'published';
                  const coverUrl = ws.coverImage?.url || ws.image?.url;

                  const formattedDate = ws.date
                    ? new Date(ws.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'TBA';

                  const formattedDeadline = ws.registrationDeadline
                    ? new Date(ws.registrationDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Open';

                  return (
                    <tr
                      key={wsId || index}
                      className={`hover:bg-canvas/50 transition-colors ${
                        !isPublished ? 'opacity-60 bg-canvas/30' : ''
                      }`}
                    >
                      {/* Cover Thumbnail */}
                      <td className="px-4 py-3 text-center">
                        <div className="w-12 h-12 rounded-lg bg-canvas border border-border overflow-hidden flex items-center justify-center mx-auto shadow-xs">
                          {coverUrl ? (
                            <img src={coverUrl} alt={ws.title} className="w-full h-full object-cover" />
                          ) : (
                            <Flame className="w-5 h-5 text-gold-500" />
                          )}
                        </div>
                      </td>

                      {/* Title & Instructor */}
                      <td className="px-4 py-3">
                        <div className="font-editorial text-sm text-plum-900 font-bold line-clamp-1">
                          {ws.title}
                        </div>
                        <div className="text-[11px] text-gold-700 font-sans font-medium">
                          Guided by: {ws.instructor?.name || 'Lead Acharya'}
                        </div>
                        <div className="text-[10px] text-ink-muted">
                          {ws.duration}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3 whitespace-nowrap space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-ink font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gold-600" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="text-[11px] text-ink-muted flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-500" />
                          <span>{ws.startTime} - {ws.endTime}</span>
                        </div>
                      </td>

                      {/* Location & Mode */}
                      <td className="px-4 py-3 whitespace-nowrap space-y-1">
                        <div className="flex items-center gap-1 text-ink">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                          <span className="truncate max-w-[140px]">{ws.location?.venue || 'Tapovan Shala'}</span>
                        </div>
                        <Badge variant="neutral" size="sm">
                          {ws.mode}
                        </Badge>
                      </td>

                      {/* Registration Deadline */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-ink text-[11px] font-semibold">
                          {formattedDeadline}
                        </span>
                      </td>

                      {/* Capacity */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-[11px] text-ink-muted font-medium">
                          <Users className="w-3 h-3 text-gold-600" />
                          <span>{ws.capacity?.booked || 0} / {ws.capacity?.total || 25}</span>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-editorial text-sm text-plum-900 font-bold">
                          {ws.price?.displayPrice || `₹${ws.price?.amount?.toLocaleString() || '0'}`}
                        </div>
                      </td>

                      {/* Featured */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(ws)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            ws.featured
                              ? 'bg-gold-50 border-gold-300 text-gold-700 hover:bg-gold-100 shadow-xs'
                              : 'bg-canvas border-border text-ink-faint hover:text-ink'
                          }`}
                          title={ws.featured ? 'Featured on Homepage (Click to unfeature)' : 'Feature on Homepage'}
                        >
                          <Star className={`w-4 h-4 ${ws.featured ? 'fill-gold-500 text-gold-500' : ''}`} />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(ws)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                            isPublished
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(ws)}
                            className="p-1.5 text-plum-900 hover:text-plum-950 bg-canvas hover:bg-gold-50 border border-border rounded transition-colors shadow-xs"
                            title="Edit Workshop"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-gold-700" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setWorkshopToDelete(ws);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors shadow-xs"
                            title="Delete Workshop"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Workshop Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingWorkshop(null);
        }}
        title={editingWorkshop?._id || editingWorkshop?.id ? `Edit Workshop: ${editingWorkshop?.title}` : 'Create New Workshop'}
        size="lg"
      >
        <form onSubmit={handleSaveWorkshop} className="space-y-5 font-sans text-xs sm:text-sm">
          {/* Tabs */}
          <div className="flex border-b border-border gap-4 text-xs font-sans">
            <button
              type="button"
              onClick={() => setActiveTab('basics')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'basics'
                  ? 'border-gold-500 text-plum-900 font-semibold'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              1. Title, Timing & Logistics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('location')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'location'
                  ? 'border-gold-500 text-plum-900 font-semibold'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              2. Venue & Occupancy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('instructor')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'instructor'
                  ? 'border-gold-500 text-plum-900 font-semibold'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              3. Instructor & Cover Media
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'seo'
                  ? 'border-gold-500 text-plum-900 font-semibold'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              4. SEO & Metadata
            </button>
          </div>

          {/* TAB 1: Basics & Timing */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Workshop Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      setEditingWorkshop((prev) => ({
                        ...prev,
                        title,
                        slug: prev?.slug && prev.slug !== '' ? prev.slug : slug,
                      }));
                    }}
                    placeholder="e.g. Kumbhaka & Pranayama Intensive"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingWorkshop?.slug || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, slug: e.target.value })}
                    placeholder="e.g. pranayama-intensive"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 font-mono text-xs shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Comprehensive Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingWorkshop?.description || ''}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, description: e.target.value })}
                  placeholder="Masterclass overview, techniques transmitted, breath holding ratios, and transformational benefits..."
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingWorkshop?.shortDescription || ''}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, shortDescription: e.target.value })}
                  placeholder="One sentence summary for catalog preview..."
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 text-xs shadow-xs"
                />
              </div>

              {/* Dates & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingWorkshop?.date || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, date: e.target.value })}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.startTime || '09:00 AM'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, startTime: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    End Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.endTime || '05:00 PM'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, endTime: e.target.value })}
                    placeholder="e.g. 05:00 PM"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.duration || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, duration: e.target.value })}
                    placeholder="e.g. 2 Days / 16 Hours"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={editingWorkshop?.registrationDeadline || ''}
                    onChange={(e) =>
                      setEditingWorkshop({ ...editingWorkshop, registrationDeadline: e.target.value })
                    }
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={editingWorkshop?.mode || 'in-person'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, mode: e.target.value as any })}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="residential">Residential</option>
                    <option value="online">Online Live Streaming</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Status & Featured Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingWorkshop?.status === 'published'}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="rounded border-border text-plum-900 focus:ring-gold-400"
                  />
                  <span className="text-xs text-ink font-medium">Published on Live Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingWorkshop?.featured ?? false}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded border-border text-plum-900 focus:ring-gold-400"
                  />
                  <span className="text-xs text-ink font-medium">Feature on Homepage Masterclasses</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Venue, Location & Capacity */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.location?.venue || ''}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        location: {
                          ...editingWorkshop?.location,
                          venue: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Kalptaru Main Yoga Shala"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editingWorkshop?.location?.city || ''}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        location: {
                          ...editingWorkshop?.location,
                          venue: editingWorkshop?.location?.venue || 'Kalptaru Shala',
                          city: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Faridabad, Haryana"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Full Physical Address
                </label>
                <input
                  type="text"
                  value={editingWorkshop?.location?.address || ''}
                  onChange={(e) =>
                    setEditingWorkshop({
                      ...editingWorkshop,
                      location: {
                        ...editingWorkshop?.location,
                        venue: editingWorkshop?.location?.venue || 'Kalptaru Shala',
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. N114 Piyush Heights, Sector 89, Faridabad – 121002"
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 text-xs shadow-xs"
                />
              </div>

              {/* Pricing & Seat Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Investment Amount (INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingWorkshop?.price?.amount ?? 3500}
                    onChange={(e) => {
                      const amount = Number(e.target.value);
                      setEditingWorkshop({
                        ...editingWorkshop,
                        price: {
                          currency: 'INR',
                          amount,
                          isFree: amount === 0,
                          displayPrice: amount === 0 ? 'Complimentary' : `₹${amount.toLocaleString()}`,
                        },
                      });
                    }}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Total Seat Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingWorkshop?.capacity?.total ?? 25}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        capacity: {
                          total: Number(e.target.value),
                          booked: editingWorkshop?.capacity?.booked || 0,
                        },
                      })
                    }
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Seats Booked
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingWorkshop?.capacity?.booked ?? 0}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        capacity: {
                          total: editingWorkshop?.capacity?.total || 25,
                          booked: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Instructor & Media */}
          {activeTab === 'instructor' && (
            <div className="space-y-4">
              {/* Cover Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 bg-canvas border border-border rounded-xl shadow-xs">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Workshop Cover Banner
                  </label>
                  <p className="text-[11px] text-ink-muted mb-3">
                    Accepts JPEG, PNG, or WebP. Max 5MB.
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 transition-colors shadow-soft">
                    <ImageIcon className="w-4 h-4 text-gold-400" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Cover Banner'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleUploadCover}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-white flex items-center justify-center shadow-xs">
                  {(editingWorkshop?.coverImage?.url || editingWorkshop?.image?.url) ? (
                    <img
                      src={editingWorkshop.coverImage?.url || editingWorkshop.image?.url}
                      alt={editingWorkshop.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-ink-faint">No cover image uploaded</span>
                  )}
                </div>
              </div>

              {/* Lead Instructor */}
              <div className="p-4 bg-canvas border border-border rounded-xl space-y-3 shadow-xs">
                <h4 className="text-xs font-mono text-plum-900 font-bold uppercase">Master Instructor / Acharya</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-ink-muted mb-1 font-medium">Instructor Name *</label>
                    <input
                      type="text"
                      required
                      value={editingWorkshop?.instructor?.name || ''}
                      onChange={(e) =>
                        setEditingWorkshop({
                          ...editingWorkshop,
                          instructor: {
                            ...editingWorkshop?.instructor,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Mrs. Shuchi Mohan"
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-ink-muted mb-1 font-medium">Instructor Designation</label>
                    <input
                      type="text"
                      value={editingWorkshop?.instructor?.title || ''}
                      onChange={(e) =>
                        setEditingWorkshop({
                          ...editingWorkshop,
                          instructor: {
                            ...editingWorkshop?.instructor,
                            name: editingWorkshop?.instructor?.name || 'Mrs. Shuchi Mohan',
                            title: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Physiotherapist & Therapeutic Yoga Consultant"
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-ink-muted mb-1 font-medium">Bio / Lineage Note</label>
                  <textarea
                    rows={2}
                    value={editingWorkshop?.instructor?.bio || ''}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        instructor: {
                          ...editingWorkshop?.instructor,
                          name: editingWorkshop?.instructor?.name || 'Lead Acharya',
                          bio: e.target.value,
                        },
                      })
                    }
                    placeholder="Short bio or lineage credentials for the workshop..."
                    className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={editingWorkshop?.seo?.metaTitle || ''}
                  onChange={(e) =>
                    setEditingWorkshop({
                      ...editingWorkshop,
                      seo: { ...editingWorkshop?.seo, metaTitle: e.target.value },
                    })
                  }
                  placeholder="e.g. Pranayama & Breath Intensive Workshop | Kalptaru Yog Vidyalaya"
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 text-xs shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={editingWorkshop?.seo?.metaDescription || ''}
                  onChange={(e) =>
                    setEditingWorkshop({
                      ...editingWorkshop,
                      seo: { ...editingWorkshop?.seo, metaDescription: e.target.value },
                    })
                  }
                  placeholder="Compelling meta description for search results..."
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-gold-500 text-xs shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingWorkshop(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ink-muted hover:text-ink border border-border bg-white shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-2 rounded-lg text-xs font-sans font-medium bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50"
            >
              {saving ? 'Saving Workshop...' : 'Save Workshop'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Permanent Deletion"
        size="sm"
      >
        <div className="space-y-4 font-sans text-sm">
          <p className="text-ink">
            Are you sure you want to permanently delete{' '}
            <strong className="text-plum-900 font-bold">"{workshopToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-600 font-medium">
            This will immediately remove this workshop from the public schedule and homepage.
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
              {saving ? 'Deleting...' : 'Yes, Delete Workshop'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
