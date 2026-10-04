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
      showToast('Workshop cover image uploaded to Supabase Storage!');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-sans tracking-widest uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
              Sadhana Intensives
            </span>
            <span className="text-xs text-ivory/50">• Public Website Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-ivory tracking-wide">
            Workshop Management
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 font-sans mt-1">
            Manage upcoming masterclasses, pranayama immersions, registration deadlines, seat occupancy, and fees.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadWorkshops}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900/60 border border-gold-500/30 hover:bg-plum-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Workshop</span>
          </button>
        </div>
      </div>

      {/* Toolbar Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-plum-950/30 border border-gold-500/15 p-3.5 rounded-xl font-sans text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-plum-900/50 border border-gold-500/20 rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-gold-400/60 shrink-0" />
          <input
            type="text"
            placeholder="Search by workshop title, venue, instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-ivory placeholder-ivory/40 outline-none w-full text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-gold-300/80">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-plum-900/60 border border-gold-500/20 text-ivory rounded px-2.5 py-1 text-xs outline-none"
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
            className="bg-plum-900/60 border border-gold-500/20 text-ivory rounded px-2.5 py-1 text-xs outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Workshop Table */}
      <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-plum-900/60 border-b border-gold-500/20 text-gold-300">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider w-16 text-center">Cover</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Workshop Title</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Venue / Mode</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Registration Deadline</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-center">Capacity</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Fee</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-center">Featured</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {filteredWorkshops.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-ivory/50">
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
                      className={`hover:bg-plum-900/30 transition-colors ${
                        !isPublished ? 'opacity-60 bg-plum-950/20' : ''
                      }`}
                    >
                      {/* Cover Thumbnail */}
                      <td className="px-4 py-3 text-center">
                        <div className="w-12 h-12 rounded-lg bg-plum-900/60 border border-gold-500/20 overflow-hidden flex items-center justify-center mx-auto">
                          {coverUrl ? (
                            <img src={coverUrl} alt={ws.title} className="w-full h-full object-cover" />
                          ) : (
                            <Flame className="w-5 h-5 text-gold-400/50" />
                          )}
                        </div>
                      </td>

                      {/* Title & Instructor */}
                      <td className="px-4 py-3">
                        <div className="font-editorial text-sm text-ivory font-medium line-clamp-1">
                          {ws.title}
                        </div>
                        <div className="text-[11px] text-gold-400/80 font-sans">
                          Guided by: {ws.instructor?.name || 'Lead Acharya'}
                        </div>
                        <div className="text-[10px] text-ivory/50">
                          {ws.duration}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3 whitespace-nowrap space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-ivory font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gold-400" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="text-[11px] text-ivory/60 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-400/70" />
                          <span>{ws.startTime} - {ws.endTime}</span>
                        </div>
                      </td>

                      {/* Location & Mode */}
                      <td className="px-4 py-3 whitespace-nowrap space-y-1">
                        <div className="flex items-center gap-1 text-ivory">
                          <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{ws.location?.venue || 'Tapovan Shala'}</span>
                        </div>
                        <Badge variant="neutral" size="sm">
                          {ws.mode}
                        </Badge>
                      </td>

                      {/* Registration Deadline */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-gold-300 text-[11px]">
                          {formattedDeadline}
                        </span>
                      </td>

                      {/* Capacity */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-[11px] text-ivory/80">
                          <Users className="w-3 h-3 text-gold-400" />
                          <span>{ws.capacity?.booked || 0} / {ws.capacity?.total || 25}</span>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-editorial text-sm text-gold-300 font-semibold">
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
                              ? 'bg-gold-500/20 border-gold-400 text-gold-300 hover:bg-gold-500/30'
                              : 'bg-white/5 border-white/10 text-ivory/40 hover:text-ivory'
                          }`}
                          title={ws.featured ? 'Featured on Homepage (Click to unfeature)' : 'Feature on Homepage'}
                        >
                          <Star className={`w-4 h-4 ${ws.featured ? 'fill-gold-400 text-gold-400' : ''}`} />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(ws)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                            isPublished
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
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
                            className="p-1.5 text-gold-300 hover:text-gold-200 bg-plum-900/50 hover:bg-plum-900 border border-gold-500/20 rounded transition-colors"
                            title="Edit Workshop"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setWorkshopToDelete(ws);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 rounded transition-colors"
                            title="Delete Workshop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
          <div className="flex border-b border-gold-500/20 gap-4 text-xs font-sans">
            <button
              type="button"
              onClick={() => setActiveTab('basics')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'basics'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory/60 hover:text-ivory'
              }`}
            >
              1. Title, Timing & Logistics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('location')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'location'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory/60 hover:text-ivory'
              }`}
            >
              2. Venue & Occupancy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('instructor')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'instructor'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory/60 hover:text-ivory'
              }`}
            >
              3. Instructor & Cover Media
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`pb-2 font-medium border-b-2 transition-colors ${
                activeTab === 'seo'
                  ? 'border-gold-400 text-gold-300'
                  : 'border-transparent text-ivory/60 hover:text-ivory'
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
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingWorkshop?.slug || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, slug: e.target.value })}
                    placeholder="e.g. pranayama-intensive"
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                  Comprehensive Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingWorkshop?.description || ''}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, description: e.target.value })}
                  placeholder="Masterclass overview, techniques transmitted, breath holding ratios, and transformational benefits..."
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingWorkshop?.shortDescription || ''}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, shortDescription: e.target.value })}
                  placeholder="One sentence summary for catalog preview..."
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 text-xs"
                />
              </div>

              {/* Dates & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gold-500/20">
                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingWorkshop?.date || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, date: e.target.value })}
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.startTime || '09:00 AM'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, startTime: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    End Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.endTime || '05:00 PM'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, endTime: e.target.value })}
                    placeholder="e.g. 05:00 PM"
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop?.duration || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, duration: e.target.value })}
                    placeholder="e.g. 2 Days / 16 Hours"
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={editingWorkshop?.registrationDeadline || ''}
                    onChange={(e) =>
                      setEditingWorkshop({ ...editingWorkshop, registrationDeadline: e.target.value })
                    }
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={editingWorkshop?.mode || 'in-person'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, mode: e.target.value as any })}
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="residential">Residential</option>
                    <option value="online">Online Live Streaming</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Status & Featured Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gold-500/20">
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
                    className="rounded border-gold-500/30 bg-plum-900 text-gold-500 focus:ring-gold-400"
                  />
                  <span className="text-xs text-ivory">Published on Live Website</span>
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
                    className="rounded border-gold-500/30 bg-plum-900 text-gold-500 focus:ring-gold-400"
                  />
                  <span className="text-xs text-ivory">Feature on Homepage Masterclasses</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Venue, Location & Capacity */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 text-xs"
                />
              </div>

              {/* Pricing & Seat Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gold-500/20">
                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                    className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Instructor & Media */}
          {activeTab === 'instructor' && (
            <div className="space-y-4">
              {/* Cover Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 bg-plum-900/30 border border-gold-500/20 rounded-xl">
                <div>
                  <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
                    Workshop Cover Banner
                  </label>
                  <p className="text-[11px] text-ivory/60 mb-3">
                    Stored securely in Supabase Storage bucket 'kalptaru-media/workshops'.
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-plum-950 rounded-lg text-xs font-semibold hover:bg-gold-400 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading to Supabase...' : 'Upload Cover Banner'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleUploadCover}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="aspect-video rounded-lg overflow-hidden border border-gold-500/30 bg-plum-900 flex items-center justify-center">
                  {(editingWorkshop?.coverImage?.url || editingWorkshop?.image?.url) ? (
                    <img
                      src={editingWorkshop.coverImage?.url || editingWorkshop.image?.url}
                      alt={editingWorkshop.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-ivory/40">No cover image uploaded</span>
                  )}
                </div>
              </div>

              {/* Lead Instructor */}
              <div className="p-4 bg-plum-900/30 border border-gold-500/20 rounded-xl space-y-3">
                <h4 className="text-xs font-mono text-gold-400 uppercase">Master Instructor / Acharya</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-ivory/70 mb-1">Instructor Name *</label>
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
                      className="w-full bg-plum-900/60 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-ivory/70 mb-1">Instructor Designation</label>
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
                      className="w-full bg-plum-900/60 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-ivory/70 mb-1">Bio / Lineage Note</label>
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
                    className="w-full bg-plum-900/60 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-ivory focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1">
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
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3 py-2 text-ivory focus:outline-none focus:border-gold-400 text-xs"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gold-500/20">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingWorkshop(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ivory/70 hover:text-ivory border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-2 rounded-lg text-xs font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm disabled:opacity-50"
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
          <p className="text-ivory/80">
            Are you sure you want to permanently delete{' '}
            <strong className="text-gold-300">"{workshopToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-300/80">
            This will immediately remove this workshop from the public schedule and homepage.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs text-ivory/70 hover:text-ivory border border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-sm disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Yes, Delete Workshop'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
