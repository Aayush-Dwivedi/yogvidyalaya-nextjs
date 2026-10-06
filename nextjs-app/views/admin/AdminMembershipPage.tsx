'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { CmsMembershipPlan, CmsMembershipBatch } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Star,
  Search,
  Filter,
  Clock,
  Calendar,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminMembershipPage: React.FC = () => {
  const [plans, setPlans] = useState<CmsMembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCycle, setFilterCycle] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<CmsMembershipPlan> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<CmsMembershipPlan | null>(null);

  // Temporary builders for modal
  const [newFeature, setNewFeature] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchTiming, setNewBatchTiming] = useState('');
  const [newBatchDays, setNewBatchDays] = useState('');

  const loadPlans = async () => {
    try {
      setLoading(true);
      const items = await CmsService.getMembershipPlans('all');
      setPlans(items || []);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load membership plans' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleOpenModal = (plan?: CmsMembershipPlan) => {
    if (plan) {
      setEditingPlan({
        ...plan,
        price: plan.price || { amount: 2500, currency: 'INR', discountPercentage: 0 },
        batches: plan.batches || [],
        features: plan.features || [],
        termsAndConditions: plan.termsAndConditions || [],
      });
    } else {
      setEditingPlan({
        title: '',
        billingCycle: 'monthly',
        price: { amount: 2500, currency: 'INR', discountPercentage: 0, originalAmount: 3000 },
        description: 'Daily studio sadhana pass with guidance from accredited Acharyas.',
        batches: [
          { name: 'Morning Shala Batch', timing: '06:00 AM – 07:30 AM', days: 'Mon to Fri' },
          { name: 'Evening Dhyana Batch', timing: '06:30 PM – 08:00 PM', days: 'Mon to Fri' },
        ],
        features: [
          'Unlimited weekday shala practice access',
          'Full access to the Kalptaru Yogic Library',
          'Monthly 1-on-1 alignment review with lead Acharya',
          '10% discount on all weekend workshops & retreats',
        ],
        popular: false,
        order: plans.length + 1,
        status: 'published',
        termsAndConditions: [
          'Attendance is valid exclusively for enrolled batches.',
          'Monthly fees are non-transferable and renew on billing cycle date.',
        ],
      });
    }
    setModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setEditingPlan((prev) => ({
      ...prev,
      features: [...(prev?.features || []), newFeature.trim()],
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setEditingPlan((prev) => ({
      ...prev,
      features: (prev?.features || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddBatch = () => {
    if (!newBatchName.trim() || !newBatchTiming.trim()) {
      showToast('Please enter both batch name and timing.', 'error');
      return;
    }
    const newBatch: CmsMembershipBatch = {
      name: newBatchName.trim(),
      timing: newBatchTiming.trim(),
      days: newBatchDays.trim() || 'Mon to Fri',
    };
    setEditingPlan((prev) => ({
      ...prev,
      batches: [...(prev?.batches || []), newBatch],
    }));
    setNewBatchName('');
    setNewBatchTiming('');
    setNewBatchDays('');
  };

  const handleRemoveBatch = (index: number) => {
    setEditingPlan((prev) => ({
      ...prev,
      batches: (prev?.batches || []).filter((_, i) => i !== index),
    }));
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan?.title?.trim()) {
      showToast('Plan title is required.', 'error');
      return;
    }
    if (!editingPlan?.description?.trim()) {
      showToast('Plan description is required.', 'error');
      return;
    }
    if ((editingPlan.price?.amount ?? 0) < 0) {
      showToast('Price amount cannot be negative.', 'error');
      return;
    }

    try {
      setSaving(true);
      const planId = editingPlan._id || editingPlan.id;

      const payload: Partial<CmsMembershipPlan> = {
        title: editingPlan.title.trim(),
        billingCycle: editingPlan.billingCycle || 'monthly',
        price: {
          amount: Number(editingPlan.price?.amount) || 0,
          currency: editingPlan.price?.currency || 'INR',
          discountPercentage: Number(editingPlan.price?.discountPercentage) || 0,
          originalAmount: editingPlan.price?.originalAmount ? Number(editingPlan.price.originalAmount) : undefined,
        },
        description: editingPlan.description.trim(),
        batches: editingPlan.batches || [],
        features: editingPlan.features || [],
        popular: Boolean(editingPlan.popular),
        order: Number(editingPlan.order) || 0,
        status: editingPlan.status || 'published',
        termsAndConditions: editingPlan.termsAndConditions || [],
      };

      if (planId) {
        await CmsService.updateMembershipPlan(planId, payload);
        showToast('Membership plan updated successfully!');
      } else {
        await CmsService.createMembershipPlan(payload);
        showToast('New membership plan created successfully!');
      }

      setModalOpen(false);
      setEditingPlan(null);
      await loadPlans();
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || 'Failed to save membership plan';
      if (err.errors && typeof err.errors === 'object') {
        const details = Object.entries(err.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('; ');
        if (details) errorMsg = `Validation failed: ${details}`;
      }
      showToast(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (plan: CmsMembershipPlan) => {
    const planId = plan._id || plan.id;
    if (!planId) return;
    const nextStatus = plan.status === 'published' ? 'draft' : 'published';
    try {
      await CmsService.updateMembershipPlan(planId, { status: nextStatus });
      setPlans((prev) =>
        prev.map((p) => ((p._id || p.id) === planId ? { ...p, status: nextStatus } : p))
      );
      showToast(`Plan "${plan.title}" marked as ${nextStatus}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update plan status', 'error');
    }
  };

  const handleTogglePopular = async (plan: CmsMembershipPlan) => {
    const planId = plan._id || plan.id;
    if (!planId) return;
    const nextPopular = !plan.popular;
    try {
      await CmsService.updateMembershipPlan(planId, { popular: nextPopular });
      setPlans((prev) =>
        prev.map((p) => ((p._id || p.id) === planId ? { ...p, popular: nextPopular } : p))
      );
      showToast(`Plan "${plan.title}" ${nextPopular ? 'marked as popular' : 'unmarked'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update popular flag', 'error');
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    const planId = planToDelete._id || planToDelete.id;
    if (!planId) return;

    try {
      setSaving(true);
      await CmsService.deleteMembershipPlan(planId);
      setPlans((prev) => prev.filter((p) => (p._id || p.id) !== planId));
      showToast(`Membership plan "${planToDelete.title}" deleted successfully.`);
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete membership plan', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered List
  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCycle = filterCycle === 'all' || p.billingCycle === filterCycle;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesCycle && matchesStatus;
  });

  if (loading) {
    return <LoadingState message="Loading membership plans..." />;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-modal border text-sm font-medium animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
              : 'bg-rose-950 text-rose-100 border-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <div className="flex items-center space-x-2 text-gold-600 mb-1">
            <CreditCard className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">
              Programs / Memberships
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-plum-900 font-bold">
            Membership Plans &amp; Shala Passes
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Manage daily sadhana tiers, batch timings, member privileges, and recurring passes for the membership page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans text-plum-950 bg-gold-500 hover:bg-gold-400 font-bold transition-all shadow-sm hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Membership Plan</span>
          </button>
          <button
            onClick={loadPlans}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-surface-subtle transition-colors shadow-xs font-medium"
            title="Refresh plans list"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-soft flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name or description..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-subtle border border-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Filter className="w-3.5 h-3.5 text-gold-600" />
            <span>Cycle:</span>
            <select
              value={filterCycle}
              onChange={(e) => setFilterCycle(e.target.value)}
              className="py-1 px-2 text-xs bg-surface-subtle border border-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-gold-500"
            >
              <option value="all">All Cycles</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-Yearly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1 px-2 text-xs bg-surface-subtle border border-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-gold-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-border">
          <CreditCard className="w-10 h-10 text-gold-600/60 mx-auto mb-3" />
          <h3 className="font-editorial text-lg text-plum-900 font-bold">No Membership Plans Found</h3>
          <p className="text-xs text-ink-muted mt-1 max-w-md mx-auto">
            {searchQuery || filterCycle !== 'all' || filterStatus !== 'all'
              ? 'Try modifying your search query or filter selections.'
              : 'Create your first membership plan to feature daily passes on the live membership page.'}
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans text-plum-950 bg-gold-500 hover:bg-gold-400 font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const planId = plan._id || plan.id || '';
            const isPopular = Boolean(plan.popular);
            const isPublished = plan.status === 'published';

            return (
              <div
                key={planId}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-soft hover:shadow-card ${
                  isPopular
                    ? 'border-gold-500/80 ring-1 ring-gold-500/30'
                    : 'border-border hover:border-plum-900/30'
                }`}
              >
                {/* Card Header & Badge */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-surface-subtle text-ink-muted border border-border">
                      {plan.billingCycle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isPopular && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-700 border border-gold-500/40">
                          <Star className="w-2.5 h-2.5 fill-gold-600 text-gold-600" />
                          Popular
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-editorial text-xl text-plum-900 font-bold leading-tight">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-ink-muted font-sans mt-2 line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price Block */}
                  <div className="mt-4 pt-4 border-t border-border/60 flex items-baseline gap-2">
                    <span className="font-editorial text-3xl font-bold text-plum-950">
                      ₹{plan.price.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-ink-muted font-mono">
                      / {plan.billingCycle === 'monthly' ? 'month' : plan.billingCycle}
                    </span>
                    {plan.price.originalAmount && plan.price.originalAmount > plan.price.amount && (
                      <span className="text-xs text-ink-muted/70 line-through font-mono">
                        ₹{plan.price.originalAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                    {plan.price.discountPercentage ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-auto">
                        {plan.price.discountPercentage}% OFF
                      </span>
                    ) : null}
                  </div>

                  {/* Batches Preview */}
                  {plan.batches && plan.batches.length > 0 && (
                    <div className="mt-4 space-y-1.5 bg-canvas-warm/70 p-3 rounded-lg border border-border/50">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-gold-700 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Included Batches</span>
                      </p>
                      {plan.batches.map((b, idx) => (
                        <div key={idx} className="text-xs flex items-center justify-between text-ink">
                          <span className="font-medium text-[11px] truncate">{b.name}</span>
                          <span className="text-[10px] font-mono text-ink-muted">{b.timing}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features Checklist */}
                  <div className="mt-4 space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-semibold">
                      Included Privileges ({plan.features?.length || 0})
                    </p>
                    <ul className="space-y-1.5">
                      {(plan.features || []).slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-ink leading-snug">
                          <Check className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                      {(plan.features?.length || 0) > 4 && (
                        <li className="text-[11px] text-gold-700 font-medium pl-5">
                          +{(plan.features?.length || 0) - 4} more privileges
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-3.5 bg-surface-subtle border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePopular(plan)}
                      className={`p-1.5 rounded transition-colors ${
                        isPopular
                          ? 'text-gold-600 hover:text-gold-700 bg-gold-500/10'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                      title={isPopular ? 'Remove Popular badge' : 'Set as Popular'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isPopular ? 'fill-gold-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(plan)}
                      className={`text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                        isPublished
                          ? 'text-zinc-600 hover:text-zinc-900 bg-white border border-border'
                          : 'text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      {isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-plum-900 hover:text-plum-950 font-medium bg-white hover:bg-surface border border-border rounded transition-colors"
                    >
                      <Edit2 className="w-3 h-3 text-gold-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setPlanToDelete(plan);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Plan Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditingPlan(null);
          }
        }}
        title={editingPlan?._id || editingPlan?.id ? 'Edit Membership Plan' : 'Add New Membership Plan'}
        size="lg"
      >
        <form onSubmit={handleSavePlan} className="space-y-5 text-ink font-sans text-xs">
          {/* Basics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-plum-900 block">Plan Title *</label>
              <input
                type="text"
                required
                value={editingPlan?.title || ''}
                onChange={(e) => setEditingPlan((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Monthly Sadhana Pass"
                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-plum-900 block">Billing Cycle *</label>
              <select
                value={editingPlan?.billingCycle || 'monthly'}
                onChange={(e) =>
                  setEditingPlan((prev) => ({
                    ...prev,
                    billingCycle: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-plum-900 block">Status</label>
              <select
                value={editingPlan?.status || 'published'}
                onChange={(e) =>
                  setEditingPlan((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-3.5 bg-canvas-warm/80 rounded-xl border border-border/80 space-y-3">
            <h4 className="font-editorial text-sm font-bold text-plum-900">Pricing &amp; Discounts</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-ink block">Effective Amount (₹) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingPlan?.price?.amount ?? 0}
                  onChange={(e) =>
                    setEditingPlan((prev) => ({
                      ...prev,
                      price: {
                        ...(prev?.price || { currency: 'INR' }),
                        amount: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full px-3 py-1.5 bg-white border border-border rounded text-ink text-xs focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-ink block">Original Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingPlan?.price?.originalAmount ?? ''}
                  onChange={(e) =>
                    setEditingPlan((prev) => ({
                      ...prev,
                      price: {
                        ...(prev?.price || { amount: 0, currency: 'INR' }),
                        originalAmount: e.target.value ? Number(e.target.value) : undefined,
                      },
                    }))
                  }
                  placeholder="e.g. 3000 (optional)"
                  className="w-full px-3 py-1.5 bg-white border border-border rounded text-ink text-xs focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-ink block">Discount %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingPlan?.price?.discountPercentage ?? 0}
                  onChange={(e) =>
                    setEditingPlan((prev) => ({
                      ...prev,
                      price: {
                        ...(prev?.price || { amount: 0, currency: 'INR' }),
                        discountPercentage: Number(e.target.value),
                      },
                    }))
                  }
                  placeholder="e.g. 15"
                  className="w-full px-3 py-1.5 bg-white border border-border rounded text-ink text-xs focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-plum-900 block">Description *</label>
            <textarea
              required
              rows={2}
              value={editingPlan?.description || ''}
              onChange={(e) => setEditingPlan((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Outline practitioner suitability, batch access, and lineage philosophy..."
              className="w-full px-3 py-2 bg-white border border-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-gold-500 text-xs"
            />
          </div>

          {/* Batches Builder */}
          <div className="space-y-2 p-3 bg-surface-subtle rounded-xl border border-border">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-plum-900">Included Shala Batches</label>
              <span className="text-[10px] text-ink-muted">Morning / Evening timings</span>
            </div>

            {editingPlan?.batches && editingPlan.batches.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {editingPlan.batches.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-white border border-border/80 rounded text-xs"
                  >
                    <div>
                      <span className="font-semibold text-plum-900">{b.name}</span>
                      <span className="text-ink-muted font-mono ml-2">({b.timing} • {b.days})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBatch(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Batch name (e.g. Morning Shala)"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-border rounded text-xs"
              />
              <input
                type="text"
                placeholder="Timing (e.g. 06:00 AM – 07:30 AM)"
                value={newBatchTiming}
                onChange={(e) => setNewBatchTiming(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-border rounded text-xs"
              />
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Days (e.g. Mon to Fri)"
                  value={newBatchDays}
                  onChange={(e) => setNewBatchDays(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-border rounded text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddBatch}
                  className="px-3 py-1.5 bg-plum-900 hover:bg-plum-800 text-white font-medium rounded shrink-0 text-xs"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Features Builder */}
          <div className="space-y-2 p-3 bg-surface-subtle rounded-xl border border-border">
            <label className="font-semibold text-plum-900 block">Privileges &amp; Features</label>
            {editingPlan?.features && editingPlan.features.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {editingPlan.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-white border border-border/80 rounded text-xs"
                  >
                    <span className="text-ink">{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add privilege bullet (e.g. Free access to yogic library)..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="w-full px-3 py-1.5 bg-white border border-border rounded text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-1.5 bg-plum-900 hover:bg-plum-800 text-white font-medium rounded shrink-0 text-xs"
              >
                Add Feature
              </button>
            </div>
          </div>

          {/* Popular toggle & order */}
          <div className="flex items-center justify-between p-3 bg-white border border-border rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(editingPlan?.popular)}
                onChange={(e) => setEditingPlan((prev) => ({ ...prev, popular: e.target.checked }))}
                className="w-4 h-4 text-gold-600 rounded border-border focus:ring-gold-500"
              />
              <span className="font-semibold text-plum-900">Mark as Popular / Recommended Plan</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-ink-muted">Display Order:</span>
              <input
                type="number"
                value={editingPlan?.order ?? 0}
                onChange={(e) => setEditingPlan((prev) => ({ ...prev, order: Number(e.target.value) }))}
                className="w-16 px-2 py-1 bg-surface-subtle border border-border rounded text-center text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setModalOpen(false);
                setEditingPlan(null);
              }}
              className="px-4 py-2 text-ink-muted hover:text-ink font-medium bg-white border border-border rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-plum-950 font-bold rounded-lg text-xs shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingPlan?._id || editingPlan?.id ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!saving) {
            setDeleteModalOpen(false);
            setPlanToDelete(null);
          }
        }}
        title="Confirm Plan Deletion"
        size="sm"
      >
        <div className="space-y-4 font-sans text-xs">
          <p className="text-ink leading-relaxed">
            Are you sure you want to permanently delete the membership plan{' '}
            <strong className="text-plum-950 font-semibold">"{planToDelete?.title}"</strong>?
          </p>
          <p className="text-rose-600 font-medium">
            This card will be removed from the public website immediately.
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setDeleteModalOpen(false);
                setPlanToDelete(null);
              }}
              className="px-3.5 py-1.5 text-ink-muted hover:text-ink border border-border rounded text-xs bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleDeletePlan}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded text-xs shadow-xs"
            >
              {saving ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminMembershipPage;
