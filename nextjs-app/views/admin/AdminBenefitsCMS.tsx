'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { CmsBenefit } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Heart,
  Brain,
  Activity,
  ShieldCheck,
  Zap,
  Sun,
} from 'lucide-react';

const COMMON_ICONS = [
  { name: 'Heart', icon: Heart, label: 'Physical Wellness' },
  { name: 'Brain', icon: Brain, label: 'Mental Poise' },
  { name: 'Activity', icon: Activity, label: 'Vitality & Breath' },
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'Immunity & Detox' },
  { name: 'Sparkles', icon: Sparkles, label: 'Spiritual Awakening' },
  { name: 'Zap', icon: Zap, label: 'Kundalini Energy' },
  { name: 'Sun', icon: Sun, label: 'Daily Sadhana' },
];

export const AdminBenefitsCMS: React.FC = () => {
  const [benefits, setBenefits] = useState<CmsBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Partial<CmsBenefit> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [benefitToDelete, setBenefitToDelete] = useState<CmsBenefit | null>(null);

  const loadBenefits = async () => {
    try {
      setLoading(true);
      const items = await CmsService.getBenefits('all');
      setBenefits(items || []);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load benefits' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenefits();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleOpenModal = (benefit?: CmsBenefit) => {
    if (benefit) {
      setEditingBenefit({
        ...benefit,
        active: benefit.active !== undefined ? benefit.active : benefit.status === 'published',
      });
    } else {
      setEditingBenefit({
        title: '',
        description: '',
        icon: 'Sparkles',
        order: benefits.length + 1,
        active: true,
        category: 'general',
        sanskritTerm: '',
        scriptureRef: '',
      });
    }
    setModalOpen(true);
  };

  const handleSaveBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBenefit?.title || !editingBenefit.description) {
      showToast('Title and description are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const benefitId = editingBenefit._id || editingBenefit.id;
      const payload: Partial<CmsBenefit> = {
        ...editingBenefit,
        status: editingBenefit.active ? 'published' : 'draft',
      };

      if (benefitId) {
        await CmsService.updateBenefit(benefitId, payload);
        showToast('Benefit updated successfully!');
      } else {
        await CmsService.createBenefit(payload);
        showToast('Benefit created successfully!');
      }

      setModalOpen(false);
      setEditingBenefit(null);
      await loadBenefits();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save benefit', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (benefit: CmsBenefit) => {
    const benefitId = benefit._id || benefit.id;
    if (!benefitId) return;

    const currentActive = benefit.active !== undefined ? benefit.active : benefit.status === 'published';
    const nextActive = !currentActive;

    try {
      await CmsService.updateBenefit(benefitId, {
        active: nextActive,
        status: nextActive ? 'published' : 'draft',
      });

      setBenefits((prev) =>
        prev.map((b) =>
          (b._id || b.id) === benefitId
            ? { ...b, active: nextActive, status: nextActive ? 'published' : 'draft' }
            : b
        )
      );

      showToast(`Benefit "${benefit.title}" is now ${nextActive ? 'Active' : 'Hidden'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle benefit status', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!benefitToDelete) return;
    const benefitId = benefitToDelete._id || benefitToDelete.id;
    if (!benefitId) return;

    try {
      setSaving(true);
      await CmsService.deleteBenefit(benefitId);
      setBenefits((prev) => prev.filter((b) => (b._id || b.id) !== benefitId));
      showToast('Benefit deleted successfully.');
      setDeleteModalOpen(false);
      setBenefitToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete benefit', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Brain':
        return <Brain className="w-4 h-4 text-sky-400" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-teal-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-gold-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-gold-400" />;
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Classical Sadhana Benefits..." />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-sans tracking-widest uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
              Transformational Benefits
            </span>
            <span className="text-xs text-ivory/50">• Public Website Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-ivory tracking-wide">
            Benefits Management (CRUD)
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 font-sans mt-1">
            Manage holistic benefits of classical yoga: title, description, icon, display order, and active visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadBenefits}
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
            <span>Add New Benefit</span>
          </button>
        </div>
      </div>

      {/* Benefits Table */}
      <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-plum-900/60 border-b border-gold-500/20 text-gold-300">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider w-16 text-center">Order</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider w-16 text-center">Icon</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Benefit Title & Sanskrit Term</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-center">Active Status</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {benefits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-ivory/50">
                    No benefits found. Click "Add New Benefit" above to create one.
                  </td>
                </tr>
              ) : (
                benefits.map((benefit, index) => {
                  const benefitId = (benefit._id || benefit.id) as string;
                  const isActive =
                    benefit.active !== undefined ? benefit.active : benefit.status === 'published';

                  return (
                    <tr
                      key={benefitId || index}
                      className={`hover:bg-plum-900/30 transition-colors ${
                        !isActive ? 'opacity-50 bg-plum-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center font-mono text-gold-400 font-semibold">
                        #{benefit.order !== undefined ? benefit.order : index + 1}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="w-8 h-8 rounded-lg bg-plum-900/60 border border-gold-500/20 flex items-center justify-center mx-auto">
                          {renderIcon(benefit.icon)}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-editorial text-sm text-ivory font-medium">
                          {benefit.title}
                        </div>
                        {benefit.sanskritTerm && (
                          <div className="text-[11px] text-gold-300/80 font-sans italic">
                            {benefit.sanskritTerm}
                          </div>
                        )}
                        {benefit.scriptureRef && (
                          <div className="text-[10px] text-ivory/40 font-mono">
                            Ref: {benefit.scriptureRef}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-ivory/80 max-w-sm">
                        <p className="line-clamp-2 leading-relaxed">{benefit.description}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge
                          variant={
                            benefit.category === 'spiritual'
                              ? 'gold'
                              : benefit.category === 'mental'
                              ? 'dark'
                              : benefit.category === 'physical'
                              ? 'neutral'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {benefit.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleActive(benefit)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-white/5 border border-white/10 text-ivory/50 hover:text-ivory'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenModal(benefit)}
                            className="p-1.5 text-gold-300 hover:text-gold-200 bg-plum-900/50 hover:bg-plum-900 border border-gold-500/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setBenefitToDelete(benefit);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 rounded transition-colors"
                            title="Delete"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBenefit(null);
        }}
        title={editingBenefit?._id || editingBenefit?.id ? 'Edit Benefit' : 'Add New Benefit'}
        size="md"
      >
        <form onSubmit={handleSaveBenefit} className="space-y-4 font-sans text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
              Benefit Title *
            </label>
            <input
              type="text"
              required
              value={editingBenefit?.title || ''}
              onChange={(e) => setEditingBenefit({ ...editingBenefit, title: e.target.value })}
              placeholder="e.g. Physical Wellness, Mental Poise, Stress Reduction"
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Sanskrit Term
              </label>
              <input
                type="text"
                value={editingBenefit?.sanskritTerm || ''}
                onChange={(e) =>
                  setEditingBenefit({ ...editingBenefit, sanskritTerm: e.target.value })
                }
                placeholder="e.g. Sharira Shuddhi"
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={editingBenefit?.category || 'general'}
                onChange={(e) =>
                  setEditingBenefit({
                    ...editingBenefit,
                    category: e.target.value as any,
                  })
                }
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
              >
                <option value="physical">Physical</option>
                <option value="mental">Mental</option>
                <option value="spiritual">Spiritual</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={editingBenefit?.description || ''}
              onChange={(e) =>
                setEditingBenefit({ ...editingBenefit, description: e.target.value })
              }
              placeholder="Explain how regular sadhana brings this holistic physiological or psychic transformation..."
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
              Scripture Reference / Shloka Source
            </label>
            <input
              type="text"
              value={editingBenefit?.scriptureRef || ''}
              onChange={(e) =>
                setEditingBenefit({ ...editingBenefit, scriptureRef: e.target.value })
              }
              placeholder="e.g. Hatha Yoga Pradipika (1.17)"
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
              Icon Key
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {COMMON_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = editingBenefit?.icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setEditingBenefit({ ...editingBenefit, icon: item.name })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                        : 'bg-plum-900/30 border-gold-500/10 text-ivory/60 hover:text-ivory'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-[10px] truncate max-w-full">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={editingBenefit?.order || 0}
                onChange={(e) =>
                  setEditingBenefit({ ...editingBenefit, order: Number(e.target.value) })
                }
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingBenefit?.active ?? true}
                  onChange={(e) =>
                    setEditingBenefit({ ...editingBenefit, active: e.target.checked })
                  }
                  className="rounded border-gold-500/30 bg-plum-900 text-gold-500 focus:ring-gold-400"
                />
                <span className="text-xs text-ivory">Active on Public Website</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gold-500/20">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingBenefit(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ivory/70 hover:text-ivory border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg text-xs font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Benefit'}
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
            Are you sure you want to permanently delete the benefit{' '}
            <strong className="text-gold-300">"{benefitToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-300/80">
            This benefit card will be immediately removed from the public website.
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
              {saving ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
