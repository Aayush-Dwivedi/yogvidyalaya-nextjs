'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsFounder } from '../../types/cms';
import { LoadingState } from '../../components/LoadingState';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Award,
  GraduationCap,
  Calendar,
  Eye,
  Star,
} from 'lucide-react';

export const AdminTrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<CmsFounder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Partial<CmsFounder> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form helper tags
  const [newQualification, setNewQualification] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const data = await CmsService.getFounders();
      setTrainers(data || []);
    } catch (err: any) {
      console.error('Failed to load trainers:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load trainers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleConfirmChanges = async () => {
    try {
      setConfirming(true);
      await CmsService.confirmAllChanges();
      showToast('All trainer changes confirmed and published to the live website!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to confirm changes', 'error');
    } finally {
      setConfirming(false);
    }
  };

  const handleOpenModal = (trainer?: CmsFounder) => {
    if (trainer) {
      setEditingTrainer({ ...trainer });
    } else {
      setEditingTrainer({
        name: '',
        title: 'Yoga Instructor',
        designation: 'Therapeutic Yoga Consultant',
        slug: '',
        bio: '',
        shortBio: '',
        experienceYears: 5,
        qualifications: [],
        specializations: [],
        status: 'published',
        featured: true,
        order: trainers.length + 1,
        image: {
          url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
          path: 'trainers/profile.jpg',
          alt: 'Trainer Portrait',
        },
      });
    }
    setNewQualification('');
    setNewSpecialization('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTrainer) return;

    try {
      setUploadingImage(true);
      const res = await MediaService.uploadImage(file, 'trainers', editingTrainer.name || 'Trainer');
      setEditingTrainer({
        ...editingTrainer,
        image: {
          url: res.url,
          path: res.path,
          alt: editingTrainer.name || 'Trainer Photo',
        },
      });
      showToast('Trainer photo uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddQualification = () => {
    if (!newQualification.trim() || !editingTrainer) return;
    const current = editingTrainer.qualifications || [];
    setEditingTrainer({
      ...editingTrainer,
      qualifications: [...current, newQualification.trim()],
    });
    setNewQualification('');
  };

  const handleRemoveQualification = (idx: number) => {
    if (!editingTrainer) return;
    const current = [...(editingTrainer.qualifications || [])];
    current.splice(idx, 1);
    setEditingTrainer({
      ...editingTrainer,
      qualifications: current,
    });
  };

  const handleAddSpecialization = () => {
    if (!newSpecialization.trim() || !editingTrainer) return;
    const current = editingTrainer.specializations || [];
    setEditingTrainer({
      ...editingTrainer,
      specializations: [...current, newSpecialization.trim()],
    });
    setNewSpecialization('');
  };

  const handleRemoveSpecialization = (idx: number) => {
    if (!editingTrainer) return;
    const current = [...(editingTrainer.specializations || [])];
    current.splice(idx, 1);
    setEditingTrainer({
      ...editingTrainer,
      specializations: current,
    });
  };

  const handleSaveTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainer) return;

    if (!editingTrainer.name?.trim()) {
      showToast('Trainer name is required', 'error');
      return;
    }

    try {
      setSaving(true);
      const rawSlug = editingTrainer.slug?.trim() || editingTrainer.name.trim();
      const slug =
        rawSlug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || 'trainer';

      // Clean image
      const photoUrl =
        (typeof editingTrainer.image === 'string' ? editingTrainer.image : editingTrainer.image?.url) ||
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=400&q=80';
      const photoPath =
        (typeof editingTrainer.image === 'object' && editingTrainer.image?.path?.trim()) ||
        'trainers/profile.jpg';
      const photoAlt =
        (typeof editingTrainer.image === 'object' && editingTrainer.image?.alt?.trim()) ||
        editingTrainer.name ||
        'Trainer Photo';

      const payload = {
        name: editingTrainer.name.trim(),
        title: editingTrainer.designation?.trim() || editingTrainer.title?.trim() || 'Yoga Instructor',
        designation: editingTrainer.designation?.trim() || editingTrainer.title?.trim() || 'Yoga Instructor',
        slug,
        bio:
          editingTrainer.bio?.trim() ||
          editingTrainer.shortBio?.trim() ||
          'Experienced yoga instructor at Kalptaru Yog Vidyalaya.',
        shortBio: editingTrainer.shortBio?.trim() || editingTrainer.bio?.trim() || '',
        experienceYears: Number(editingTrainer.experienceYears) || 0,
        qualifications: editingTrainer.qualifications || [],
        specializations: editingTrainer.specializations || [],
        status: editingTrainer.status || 'published',
        featured: editingTrainer.featured ?? true,
        order: Number(editingTrainer.order) || 1,
        image: {
          url: photoUrl,
          path: photoPath,
          alt: photoAlt,
          bucket: 'kalptaru-media',
        },
      };

      const trainerId = (editingTrainer._id || editingTrainer.id) as string;
      if (trainerId) {
        await CmsService.updateFounder(trainerId, payload);
        showToast('Trainer profile updated successfully!');
      } else {
        await CmsService.createFounder(payload);
        showToast('New trainer created successfully!');
      }

      setModalOpen(false);
      setEditingTrainer(null);
      await loadTrainers();

      // Trigger global event so live website reflects immediately
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kalptaru-cms-updated', { detail: { timestamp: Date.now() } }));
      }
    } catch (err: any) {
      console.error('Error saving trainer profile:', err);
      showToast(err.message || 'Failed to save trainer profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrainer = async (trainerId: string) => {
    if (!window.confirm('Are you sure you want to remove this trainer profile?')) {
      return;
    }

    try {
      await CmsService.deleteFounder(trainerId);
      setTrainers((prev) => prev.filter((t) => (t._id || t.id) !== trainerId));
      showToast('Trainer removed successfully.');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kalptaru-cms-updated', { detail: { timestamp: Date.now() } }));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete trainer', 'error');
    }
  };

  const handleToggleStatus = async (trainer: CmsFounder) => {
    const trainerId = (trainer._id || trainer.id) as string;
    if (!trainerId) return;

    try {
      const newStatus = trainer.status === 'published' ? 'draft' : 'published';
      await CmsService.updateFounder(trainerId, { status: newStatus });
      setTrainers((prev) =>
        prev.map((t) => ((t._id || t.id) === trainerId ? { ...t, status: newStatus } : t))
      );
      showToast(`Trainer status set to ${newStatus}.`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kalptaru-cms-updated', { detail: { timestamp: Date.now() } }));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleToggleFeatured = async (trainer: CmsFounder) => {
    const trainerId = (trainer._id || trainer.id) as string;
    if (!trainerId) return;

    try {
      const newFeatured = !trainer.featured;
      await CmsService.updateFounder(trainerId, { featured: newFeatured });
      setTrainers((prev) =>
        prev.map((t) => ((t._id || t.id) === trainerId ? { ...t, featured: newFeatured } : t))
      );
      showToast(`Trainer featured status updated.`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kalptaru-cms-updated', { detail: { timestamp: Date.now() } }));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update featured flag', 'error');
    }
  };

  if (loading) {
    return <LoadingState message="Loading trainers and faculty directory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-sans flex items-center justify-between border shadow-soft animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-ink-muted hover:text-ink">
            &times;
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-widest uppercase bg-gold-50 text-gold-800 border border-gold-300 font-semibold">
              Programs &amp; Faculty
            </span>
            <span className="text-xs text-ink-muted">• {trainers.length} Faculty Members</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Trainers &amp; Instructors
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Manage instructors, therapeutic consultants, and guest faculty associated with our courses and workshops.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleConfirmChanges}
            disabled={confirming}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans text-plum-950 bg-gold-500 hover:bg-gold-400 font-bold transition-all shadow-sm hover:scale-[1.02]"
            title="Publish all trainer updates to the live website"
          >
            {confirming ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-plum-950" />
            )}
            <span>{confirming ? 'Publishing...' : 'Confirm Changes'}</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900 hover:bg-plum-800 transition-colors font-semibold shadow-soft"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Trainer</span>
          </button>

          <button
            onClick={loadTrainers}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-surface-subtle transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Trainers Directory Grid */}
      {trainers.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center space-y-4 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center mx-auto border border-gold-200">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-editorial font-bold text-plum-900">No Trainers Found</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto mt-1">
              Add your first yoga instructor or faculty member to showcase them across courses and programs.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-plum-900 text-gold-300 text-xs font-semibold hover:bg-plum-800 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Trainer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((t) => {
            const id = (t._id || t.id) as string;
            const photoUrl =
              (typeof t.image === 'string' ? t.image : t.image?.url) ||
              'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={id}
                className="bg-white border border-border rounded-xl overflow-hidden shadow-soft flex flex-col justify-between hover:border-gold-400 transition-all group"
              >
                <div>
                  {/* Card Header Media */}
                  <div className="relative aspect-[4/3] bg-plum-950 overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(t)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                          t.status === 'published'
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {t.status || 'published'}
                      </button>

                      {t.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold bg-gold-500 text-plum-950 border border-gold-400 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-plum-950" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-editorial text-lg font-bold leading-tight">{t.name}</h3>
                      <p className="text-xs text-gold-300 font-sans mt-0.5">{t.designation || t.title}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Experience & Lineage */}
                    <div className="flex items-center justify-between text-xs font-mono text-ink-muted border-b border-border/60 pb-3">
                      <span className="flex items-center gap-1 text-gold-800 font-medium">
                        <Award className="w-3.5 h-3.5 text-gold-600" />
                        <span>{t.experienceYears ? `${t.experienceYears}+ Years Exp.` : 'Senior Faculty'}</span>
                      </span>
                      <span className="text-[11px] text-ink-faint">Order #{t.order || 1}</span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 font-sans">
                      {t.shortBio || t.bio}
                    </p>

                    {/* Specializations */}
                    {t.specializations && t.specializations.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-ink-faint font-semibold block">
                          Specializations
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {t.specializations.slice(0, 3).map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded bg-canvas-warm text-[10px] text-plum-900 border border-gold-200"
                            >
                              {spec}
                            </span>
                          ))}
                          {t.specializations.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-ink-faint">
                              +{t.specializations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-canvas border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleFeatured(t)}
                      className={`p-1.5 rounded border text-xs transition-colors ${
                        t.featured
                          ? 'border-gold-400 bg-gold-50 text-gold-700'
                          : 'border-border bg-white text-ink-faint hover:text-ink'
                      }`}
                      title={t.featured ? 'Unmark Featured' : 'Mark Featured'}
                    >
                      <Star className={`w-3.5 h-3.5 ${t.featured ? 'fill-gold-600' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-1.5 rounded-lg border border-border bg-white hover:bg-gold-50 hover:text-plum-900 text-ink-muted transition-colors text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gold-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTrainer(id)}
                      className="p-1.5 rounded-lg border border-border bg-white hover:bg-rose-50 hover:text-rose-700 text-ink-muted transition-colors text-xs"
                      title="Delete Trainer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Trainer Modal */}
      {modalOpen && editingTrainer && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingTrainer._id || editingTrainer.id ? `Edit Trainer: ${editingTrainer.name}` : 'Add New Trainer'}
          size="lg"
        >
          <form onSubmit={handleSaveTrainer} className="space-y-5 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingTrainer.name || ''}
                  onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                  placeholder="e.g. Mrs. Shuchi Mohan"
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider mb-1">
                  Designation / Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingTrainer.designation || editingTrainer.title || ''}
                  onChange={(e) =>
                    setEditingTrainer({
                      ...editingTrainer,
                      designation: e.target.value,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Physiotherapist & Lead Yoga Consultant"
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingTrainer.experienceYears || 5}
                  onChange={(e) =>
                    setEditingTrainer({ ...editingTrainer, experienceYears: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={editingTrainer.status || 'published'}
                  onChange={(e) =>
                    setEditingTrainer({ ...editingTrainer, status: e.target.value as any })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingTrainer.order || 1}
                  onChange={(e) =>
                    setEditingTrainer({ ...editingTrainer, order: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Photo Section */}
            <div className="p-4 bg-canvas-warm rounded-xl border border-gold-300/60 space-y-3">
              <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider">
                Trainer Portrait Photo
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-plum-950 border border-gold-400 overflow-hidden shrink-0">
                  <img
                    src={
                      (typeof editingTrainer.image === 'string'
                        ? editingTrainer.image
                        : editingTrainer.image?.url) ||
                      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={editingTrainer.name || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="url"
                    value={
                      typeof editingTrainer.image === 'string'
                        ? editingTrainer.image
                        : editingTrainer.image?.url || ''
                    }
                    onChange={(e) =>
                      setEditingTrainer({
                        ...editingTrainer,
                        image: {
                          url: e.target.value,
                          path: '',
                          alt: editingTrainer.name || 'Trainer Photo',
                        },
                      })
                    }
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />

                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-plum-900 text-gold-300 cursor-pointer hover:bg-plum-800 transition-colors text-xs font-medium">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                    <span className="text-[11px] text-ink-muted">JPG, PNG, WebP up to 5MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <div>
              <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider mb-1">
                Short Bio / Teaching Summary
              </label>
              <textarea
                rows={3}
                value={editingTrainer.shortBio || editingTrainer.bio || ''}
                onChange={(e) =>
                  setEditingTrainer({
                    ...editingTrainer,
                    shortBio: e.target.value,
                    bio: e.target.value,
                  })
                }
                placeholder="Brief summary of therapeutic background, teaching style, and focus..."
                className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            {/* Qualifications */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider">
                Qualifications &amp; Certifications
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQualification();
                    }
                  }}
                  placeholder="e.g. BPT (Physiotherapy), MDNIY Certified, YCB Level 3"
                  className="flex-1 bg-white border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-gold-500"
                />
                <button
                  type="button"
                  onClick={handleAddQualification}
                  className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-plum-950 font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(editingTrainer.qualifications || []).map((q, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-plum-50 border border-plum-200 text-plum-900 text-[11px]"
                  >
                    <span>{q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(idx)}
                      className="text-plum-400 hover:text-red-600 font-bold ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-plum-950 uppercase font-mono tracking-wider">
                Specializations / Focus Areas
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpecialization();
                    }
                  }}
                  placeholder="e.g. Asana Alignment, Spinal Rehabilitation, Prenatal Yoga"
                  className="flex-1 bg-white border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-gold-500"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialization}
                  className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-plum-950 font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(editingTrainer.specializations || []).map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-canvas-warm border border-gold-300 text-plum-950 text-[11px]"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(idx)}
                      className="text-gold-700 hover:text-red-600 font-bold ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured toggle */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="trainer-featured"
                checked={editingTrainer.featured ?? true}
                onChange={(e) => setEditingTrainer({ ...editingTrainer, featured: e.target.checked })}
                className="rounded border-border text-gold-500 focus:ring-gold-500"
              />
              <label htmlFor="trainer-featured" className="text-xs text-ink font-medium">
                Feature prominently on Programs and Faculty directory
              </label>
            </div>

            {/* Modal Buttons */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-canvas-warm hover:bg-zinc-200 text-ink text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-plum-900 hover:bg-plum-800 text-gold-300 text-xs font-semibold transition-colors shadow-soft disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Trainer Profile'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminTrainersPage;
