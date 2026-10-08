'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsCorporateProgram, CmsCorporateModule } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { LoadingState } from '../../components/LoadingState';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Upload,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';

export const AdminCorporatePage: React.FC = () => {
  const [programs, setPrograms] = useState<CmsCorporateProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<CmsCorporateProgram> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<CmsCorporateProgram | null>(null);

  // Deliverables & Modules builder state
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDuration, setNewModuleDuration] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await CmsService.getCorporatePrograms('all');
      setPrograms(data || []);
    } catch (err: any) {
      console.error('Failed to load corporate programs:', err);
      showToast(err.message || 'Failed to load corporate programs', 'error');
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

  const handleOpenModal = (program?: CmsCorporateProgram) => {
    if (program) {
      setEditingProgram({ ...program });
    } else {
      setEditingProgram({
        title: '',
        slug: '',
        tagline: 'Customized Yogic Wellness for Enterprise',
        shortDescription: 'Combat desk fatigue, realign ergonomics, and elevate cognitive clarity across your workforce.',
        description: 'Comprehensive workplace wellness package incorporating therapeutic asanas, pranayama for stress reduction, and mindful leadership sessions tailored to your organizational rhythm.',
        format: 'on-site',
        duration: '4-8 Weeks / Flexible',
        targetAudience: 'All Employees & Leadership Teams',
        deliverables: [
          'Desk-side posture alignment workshops',
          'Guided daily breathwork & stress reset audios',
          'Physiotherapist-designed spine health assessments',
          'Bi-weekly employee wellness and engagement reports',
        ],
        modules: [
          {
            title: 'Foundations of Spine Ergonomics & Postural Health',
            duration: '60 Mins',
            description: 'Direct physiological correction for desk workers to eliminate cervical and lumbar tension.',
          },
          {
            title: 'Pranayama for High-Stress Executive Performance',
            duration: '45 Mins',
            description: 'Scientific autonomic nervous system regulation for cognitive clarity and sustained focus.',
          },
        ],
        pricingModel: 'custom-quote',
        startingPrice: { amount: 25000, currency: 'INR' },
        status: 'published',
        featured: true,
        order: programs.length + 1,
      });
    }
    setNewDeliverable('');
    setNewModuleTitle('');
    setNewModuleDuration('');
    setNewModuleDesc('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProgram) return;

    try {
      setUploadingImage(true);
      const uploaded = await MediaService.uploadImage(file, 'corporate');
      setEditingProgram((prev) => ({
        ...prev,
        coverImage: {
          url: uploaded.url,
          path: uploaded.path || '',
          alt: `${prev?.title || 'Corporate Program'} Cover`,
        },
      }));
      showToast('Cover image uploaded successfully!');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const addDeliverable = () => {
    if (!newDeliverable.trim() || !editingProgram) return;
    const current = editingProgram.deliverables || [];
    setEditingProgram({
      ...editingProgram,
      deliverables: [...current, newDeliverable.trim()],
    });
    setNewDeliverable('');
  };

  const removeDeliverable = (index: number) => {
    if (!editingProgram) return;
    const current = editingProgram.deliverables || [];
    setEditingProgram({
      ...editingProgram,
      deliverables: current.filter((_, i) => i !== index),
    });
  };

  const addModule = () => {
    if (!newModuleTitle.trim() || !editingProgram) return;
    const current = editingProgram.modules || [];
    const newMod: CmsCorporateModule = {
      title: newModuleTitle.trim(),
      duration: newModuleDuration.trim() || '60 Mins',
      description: newModuleDesc.trim() || 'Session details and practice guidance.',
    };
    setEditingProgram({
      ...editingProgram,
      modules: [...current, newMod],
    });
    setNewModuleTitle('');
    setNewModuleDuration('');
    setNewModuleDesc('');
  };

  const removeModule = (index: number) => {
    if (!editingProgram) return;
    const current = editingProgram.modules || [];
    setEditingProgram({
      ...editingProgram,
      modules: current.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    if (!editingProgram.title?.trim() || !editingProgram.shortDescription?.trim()) {
      showToast('Title and short description are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const slug =
        editingProgram.slug?.trim() ||
        editingProgram.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const payload = {
        ...editingProgram,
        slug,
      };

      const isEdit = Boolean(editingProgram._id || editingProgram.id);
      const id = (editingProgram._id || editingProgram.id) as string;

      if (isEdit) {
        await CmsService.updateCorporateProgram(id, payload);
        showToast('Corporate program updated successfully!');
      } else {
        await CmsService.createCorporateProgram(payload);
        showToast('New corporate program created successfully!');
      }

      setModalOpen(false);
      setEditingProgram(null);
      await loadData();
      await CmsService.confirmAllChanges();
    } catch (err: any) {
      console.error('Failed to save corporate program:', err);
      showToast(err.message || 'Failed to save corporate program', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!programToDelete) return;
    try {
      setSaving(true);
      const id = (programToDelete._id || programToDelete.id) as string;
      await CmsService.deleteCorporateProgram(id);
      showToast('Corporate program deleted successfully!');
      setDeleteModalOpen(false);
      setProgramToDelete(null);
      await loadData();
      await CmsService.confirmAllChanges();
    } catch (err: any) {
      console.error('Failed to delete corporate program:', err);
      showToast(err.message || 'Failed to delete corporate program', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (program: CmsCorporateProgram) => {
    try {
      const id = (program._id || program.id) as string;
      const nextStatus = program.status === 'published' ? 'draft' : 'published';
      await CmsService.updateCorporateProgram(id, { status: nextStatus });
      showToast(`Program status set to ${nextStatus}!`);
      await loadData();
      await CmsService.confirmAllChanges();
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFormat = formatFilter === 'all' || p.format === formatFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesFormat && matchesStatus;
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
              Programs CMS
            </span>
            <span className="text-xs text-ink-muted">• Executive &amp; Enterprise Wellness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Corporate Yogic Wellness Programs
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Design and manage tailored workplace wellness modules, on-site retreats, ergonomic workshops, and executive health packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs font-medium"
            title="Refresh corporate programs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Create Program</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-border rounded-xl p-4 shadow-soft">
        <div className="flex items-center gap-2 bg-canvas border border-border rounded-lg px-3 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs, deliverables..."
            className="bg-transparent text-ink placeholder:text-ink-muted outline-none w-full text-xs font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-ink-muted font-medium">Format:</span>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="bg-white border border-border text-ink rounded-lg px-3 py-1.5 text-xs outline-none shadow-xs capitalize"
            >
              <option value="all">All Formats</option>
              <option value="on-site">On-Site</option>
              <option value="virtual">Virtual</option>
              <option value="retreat">Executive Retreat</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-ink-muted font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-border text-ink rounded-lg px-3 py-1.5 text-xs outline-none shadow-xs"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Programs Table */}
      {loading ? (
        <div className="py-16">
          <LoadingState message="Loading corporate packages from CMS..." />
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-border shadow-soft space-y-4">
          <Briefcase className="w-12 h-12 text-gold-600/40 mx-auto" />
          <h3 className="text-lg font-editorial font-bold text-plum-900">No Corporate Programs Found</h3>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
            {searchQuery
              ? 'No programs matched your search query. Try clearing filters.'
              : 'Add your first enterprise package to display on the public Corporate Wellness page.'}
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 shadow-soft"
          >
            Create Program
          </button>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Program Package</th>
                  <th className="px-5 py-3 font-semibold">Format</th>
                  <th className="px-5 py-3 font-semibold">Target Audience</th>
                  <th className="px-5 py-3 font-semibold">Modules / Deliverables</th>
                  <th className="px-5 py-3 font-semibold">Pricing Model</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPrograms.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-canvas/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-semibold text-plum-950 text-sm flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.featured && (
                            <span className="px-2 py-0.2 rounded text-[10px] bg-gold-50 text-gold-800 border border-gold-300 font-mono">
                              Featured
                            </span>
                          )}
                        </div>
                        {item.tagline && (
                          <div className="text-xs text-gold-800 font-medium">{item.tagline}</div>
                        )}
                        <div className="text-xs text-ink-muted line-clamp-1 mt-0.5">
                          {item.shortDescription}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono capitalize text-gold-900 bg-gold-50 border border-gold-200">
                        {item.format}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-ink">
                      {item.targetAudience || 'General Workforce'}
                    </td>

                    <td className="px-5 py-4 text-xs text-ink-muted">
                      <div>{item.modules?.length || 0} Modules</div>
                      <div className="text-gold-700 font-medium">{item.deliverables?.length || 0} Deliverables</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs">
                        <span className="text-plum-950 font-medium capitalize font-mono">
                          {item.pricingModel?.replace('-', ' ') || 'Custom Quote'}
                        </span>
                        {item.startingPrice?.amount && (
                          <div className="text-[11px] text-ink-muted">
                            From ₹{item.startingPrice.amount.toLocaleString()}
                          </div>
                        )}
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
                          title="Edit Program"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProgramToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Program"
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

      {/* Add / Edit Modal - Clean Light Theme */}
      {modalOpen && editingProgram && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingProgram._id || editingProgram.id ? 'Edit Corporate Program' : 'Create Corporate Program'}
          size="xl"
        >
          <form onSubmit={handleSave} className="space-y-5 pt-2 max-h-[80vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProgram.title || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                  placeholder="e.g. Ergonomics & Executive Stress Reset"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingProgram.tagline || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, tagline: e.target.value })}
                  placeholder="e.g. Postural Realignment for Modern Teams"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Format
                </label>
                <select
                  value={editingProgram.format || 'on-site'}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      format: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs capitalize"
                >
                  <option value="on-site">On-Site Shala / Office</option>
                  <option value="virtual">Virtual Live Stream</option>
                  <option value="retreat">Executive Retreat</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={editingProgram.duration || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, duration: e.target.value })}
                  placeholder="e.g. 4 Weeks / 8 Sessions"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={editingProgram.targetAudience || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, targetAudience: e.target.value })}
                  placeholder="e.g. Desk Workers, Executives"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Short Description *
              </label>
              <textarea
                required
                rows={2}
                value={editingProgram.shortDescription || ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, shortDescription: e.target.value })}
                placeholder="High-level overview visible on cards and previews..."
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Full Curriculum &amp; Methodology Description
              </label>
              <textarea
                rows={3}
                value={editingProgram.description || ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                placeholder="Detailed objectives, pedagogical approach, and organizational benefits..."
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
              />
            </div>

            {/* Deliverables Builder */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
                Key Deliverables &amp; Takeaways ({editingProgram.deliverables?.length || 0})
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDeliverable();
                    }
                  }}
                  placeholder="Add deliverable (e.g. Guided daily pranayama audio packs)..."
                  className="flex-1 px-3.5 py-2 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="px-4 py-2 bg-canvas border border-border text-ink hover:text-plum-900 rounded-xl text-xs font-semibold shadow-xs"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {editingProgram.deliverables?.map((del, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-canvas border border-border text-xs text-ink"
                  >
                    <span>{del}</span>
                    <button
                      type="button"
                      onClick={() => removeDeliverable(idx)}
                      className="text-ink-muted hover:text-rose-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Modules Builder */}
            <div className="space-y-3 pt-2 border-t border-border">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
                Curriculum Modules ({editingProgram.modules?.length || 0})
              </label>

              <div className="bg-canvas p-3.5 rounded-xl border border-border space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="Module Title"
                    className="sm:col-span-2 px-3 py-1.5 bg-white border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="text"
                    value={newModuleDuration}
                    onChange={(e) => setNewModuleDuration(e.target.value)}
                    placeholder="Duration (e.g. 60 Mins)"
                    className="px-3 py-1.5 bg-white border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-gold-500"
                  />
                </div>
                <textarea
                  rows={2}
                  value={newModuleDesc}
                  onChange={(e) => setNewModuleDesc(e.target.value)}
                  placeholder="Module Description..."
                  className="w-full px-3 py-1.5 bg-white border border-border rounded-lg text-xs text-ink focus:outline-none focus:border-gold-500"
                />
                <button
                  type="button"
                  onClick={addModule}
                  className="px-3 py-1.5 bg-white border border-border text-ink hover:text-plum-900 rounded-lg text-xs font-semibold shadow-xs"
                >
                  Add Module
                </button>
              </div>

              <div className="space-y-2">
                {editingProgram.modules?.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-border flex items-start justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-plum-950 flex items-center gap-2">
                        <span>{mod.title}</span>
                        {mod.duration && (
                          <span className="text-[10px] text-gold-700 font-mono font-medium">({mod.duration})</span>
                        )}
                      </div>
                      <p className="text-ink-muted">{mod.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeModule(idx)}
                      className="text-ink-muted hover:text-rose-600 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Model & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Pricing Model
                </label>
                <select
                  value={editingProgram.pricingModel || 'custom-quote'}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      pricingModel: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                >
                  <option value="custom-quote">Custom Enterprise Quote</option>
                  <option value="fixed-package">Fixed Package Price</option>
                  <option value="per-seat">Per-Seat / Per-Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Starting Price (INR)
                </label>
                <input
                  type="number"
                  value={editingProgram.startingPrice?.amount || 0}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      startingPrice: {
                        amount: Number(e.target.value),
                        currency: 'INR',
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Status
                </label>
                <select
                  value={editingProgram.status || 'published'}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
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
                {saving ? 'Saving...' : 'Save Corporate Program'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && programToDelete && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Corporate Program"
          size="sm"
        >
          <div className="space-y-4 pt-2">
            <p className="text-sm text-ink">
              Are you sure you want to permanently delete the program package{' '}
              <span className="font-semibold text-plum-900">{programToDelete.title}</span>?
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

export default AdminCorporatePage;
