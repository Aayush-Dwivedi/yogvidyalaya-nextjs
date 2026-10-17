'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
  MessageSquare,
  Trash2,
  AlertCircle,
  Eye,
  Calendar,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

interface DatabaseEnquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  programInterest: 'course' | 'workshop' | 'corporate' | 'membership' | 'general';
  message: string;
  status: 'new' | 'in_progress' | 'contacted' | 'resolved';
  notes?: string;
  createdAt: string;
}

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<DatabaseEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<DatabaseEnquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/enquiries?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setEnquiries(Array.isArray(data.data) ? data.data : data.data.items || []);
      }
    } catch (err) {
      console.error('Failed to load enquiries from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleOpenDetails = (enq: DatabaseEnquiry) => {
    setSelectedEnquiry(enq);
    setAdminNotes(enq.notes || '');
  };

  const handleUpdateStatus = async (newStatus: DatabaseEnquiry['status']) => {
    if (!selectedEnquiry) return;
    try {
      setUpdatingStatus(true);
      const res = await fetch(`/api/enquiries/${selectedEnquiry._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: adminNotes }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Enquiry marked as ${newStatus}` });
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus, notes: adminNotes });
        setEnquiries((prev) =>
          prev.map((item) =>
            item._id === selectedEnquiry._id ? { ...item, status: newStatus, notes: adminNotes } : item
          )
        );
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to update status' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error connecting to database' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this enquiry from the database?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item._id !== id));
        if (selectedEnquiry?._id === id) setSelectedEnquiry(null);
        setStatusMessage({ type: 'success', text: 'Enquiry deleted from database' });
      }
    } catch (err) {
      alert('Failed to delete enquiry');
    }
  };

  const getStatusBadge = (status: DatabaseEnquiry['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="warning" size="sm" className="capitalize">New</Badge>;
      case 'in_progress':
        return <Badge variant="plum" size="sm" className="capitalize">In Progress</Badge>;
      case 'contacted':
        return <Badge variant="gold" size="sm" className="capitalize">Contacted</Badge>;
      case 'resolved':
        return <Badge variant="success" size="sm" className="capitalize">Resolved</Badge>;
      default:
        return <Badge variant="neutral" size="sm" className="capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-ink font-sans">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-editorial font-bold text-plum-950">
              Visitor Inquiries Ledger
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-800 text-[10px] font-mono font-semibold">
              Live Database
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            All prospective student and general inquiries submitted on the main website are stored here directly in MongoDB.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle text-xs font-semibold text-plum-950 border border-border shadow-xs transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold px-1 hover:opacity-75"
          >
            &times;
          </button>
        </div>
      )}

      {/* ─── Filters & Search Bar ─── */}
      <div className="bg-surface rounded-xl border border-border p-4 shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'new', 'in_progress', 'contacted', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                statusFilter === tab
                  ? 'bg-plum-950 text-gold-300 font-semibold shadow-xs'
                  : 'text-ink-muted hover:text-plum-900 hover:bg-surface-subtle'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-72">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, query..."
              className="w-full bg-white border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-gold-500 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-plum-950 text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Filter
          </button>
        </form>
      </div>

      {/* ─── Ledger Table ─── */}
      <div className="bg-white rounded-xl border border-border shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-gold-600 mx-auto" />
            <p className="text-xs text-ink-muted">Querying MongoDB database...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-ink-muted mx-auto opacity-50" />
            <h3 className="text-sm font-semibold text-plum-900">No Inquiries Found</h3>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              There are currently no inquiries in the database matching this filter. New submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface border-b border-border text-[11px] font-mono uppercase text-ink-muted">
                  <th className="py-3 px-4 font-semibold">Sender Details</th>
                  <th className="py-3 px-4 font-semibold">Interest</th>
                  <th className="py-3 px-4 font-semibold">Message Preview</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Received</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-gold-50/25 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-plum-950 text-xs">{enq.name}</div>
                      <div className="text-[11px] text-ink-muted font-mono">{enq.email}</div>
                      {enq.phone && (
                        <div className="text-[11px] text-gold-700 font-mono">{enq.phone}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 capitalize font-mono text-[11px] text-plum-900">
                      <span className="px-2 py-0.5 rounded bg-surface border border-border">
                        {enq.programInterest}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-xs text-ink leading-relaxed">
                        {enq.message}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(enq.status)}</td>

                    <td className="py-3.5 px-4 text-[11px] font-mono text-ink-muted whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetails(enq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface hover:bg-gold-100 text-plum-900 text-[11px] font-medium border border-border transition-colors cursor-pointer"
                        title="View Full Inquiry"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEnquiry(enq._id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        title="Delete from Database"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Detail Inspection Modal ─── */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Inquiry Details — ${selectedEnquiry.name}`}
        >
          <div className="space-y-5 text-xs font-sans text-ink">
            {/* Sender Overview Card */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-editorial font-bold text-plum-950">
                    {selectedEnquiry.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-ink-muted text-xs mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gold-600" />
                      <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline font-mono">
                        {selectedEnquiry.email}
                      </a>
                    </span>
                    {selectedEnquiry.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gold-600" />
                        <a href={`tel:${selectedEnquiry.phone}`} className="hover:underline font-mono">
                          {selectedEnquiry.phone}
                        </a>
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(selectedEnquiry.status)}
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-muted font-mono">
                <span>Interest: <strong className="text-plum-900 capitalize">{selectedEnquiry.programInterest}</strong></span>
                <span>
                  Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-plum-900 tracking-wider">
                Message Content
              </label>
              <div className="p-4 rounded-xl bg-white border border-border text-ink leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-plum-900 tracking-wider">
                Internal Follow-up Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about calls, batch recommendation, or fee discussion..."
                className="w-full bg-white border border-border rounded-lg p-3 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
              />
            </div>

            {/* Update Status Actions */}
            <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-ink-muted">Set Status:</span>
                {(['new', 'in_progress', 'contacted', 'resolved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    disabled={updatingStatus || selectedEnquiry.status === st}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize border transition-colors cursor-pointer ${
                      selectedEnquiry.status === st
                        ? 'bg-plum-950 text-gold-300 border-plum-950'
                        : 'bg-white hover:bg-surface-subtle text-ink-muted border-border'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {selectedEnquiry.phone && (
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-3.5 h-3.5 object-contain" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
