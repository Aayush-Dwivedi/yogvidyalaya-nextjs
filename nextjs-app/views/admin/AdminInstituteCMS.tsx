'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsInstitute, StorageImage } from '../../types/cms';
import { LoadingState } from '../../components/LoadingState';
import {
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Award,
  BarChart3,
  BookOpen,
  Link2,
  Eye,
  Layers,
} from 'lucide-react';

export const AdminInstituteCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'identity' | 'metrics' | 'heritage' | 'pillars' | 'imagery' | 'contact'
  >('identity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [institute, setInstitute] = useState<CmsInstitute>({
    name: 'Kalptaruu Yoga Vidhyalaya',
    tagline: 'Where Timeless Vedic Lineage Meets Modern Rehabilitative Science',
    eyebrow: 'Sanctuary of Traditional Yoga & Clinical Physiotherapy',
    affiliationText: 'Affiliated with Indian Yoga Association (IYA)',
    description:
      'Affiliated by the Indian Yoga Association (IYA), Kalptaruu Yoga Vidhyalaya was founded by Mrs. Shuchi Mohan (Senior Physiotherapist & Therapeutic Yoga Consultant, Former Resource Expert at MDNIY). We offer comprehensive certification courses, therapeutic rehabilitation programs, and lifestyle disease reversal rooted in classical Patanjali traditions and anatomy-conscious physiotherapy.',
    mission:
      'To preserve, practice, and disseminate the authentic, sacred disciplines of classical yoga, bringing radiant health, inner equanimity, and spiritual elevation to sincere seekers worldwide.',
    vision:
      'To stand as a globally revered sanctuary of traditional yogic learning and sadhana, bridging Vedic heritage with contemporary wellbeing.',
    philosophy:
      'Rooted in the Ashtanga and Hatha traditions of Patanjali and the ancient Natha lineage, we honor yoga not merely as physical postures, but as a comprehensive spiritual science of self-realization.',
    history:
      'Founded with a sacred mission to make yoga both accessible and medically safe, Kalptaruu Yoga Vidhyalaya was established to counteract the commercial dilution of classical yoga. Under the visionary stewardship of Mrs. Shuchi Mohan, the institute uniquely integrates authentic Hatha and Ashtanga yoga disciplines with rigorous clinical physiotherapy knowledge.',
    establishedYear: 2011,
    stats: [
      { label: 'Happy Students & Seekers', value: '5000+', detail: '5000+', order: 1 },
      { label: 'Years Institutional Legacy', value: '15+', detail: '15+', order: 2 },
      { label: 'Personalized Care & Guidance', value: '100%', detail: '100%', order: 3 },
      { label: 'Accredited Programs Offered', value: 'Multiple', detail: 'Multiple', order: 4 },
    ],
    pillars: [
      {
        title: 'Classical Parampara',
        subtitle: 'Authentic Lineage',
        description:
          'Preserving the sacred purity of Patanjali Ashtanga yoga and classical Hatha sadhana with authentic mantras and meditative stillness.',
      },
      {
        title: 'Clinical Chikitsa',
        subtitle: 'Musculoskeletal Science',
        description:
          'Therapeutic rehabilitation customized under clinical physiotherapy oversight to reverse chronic musculoskeletal conditions safely.',
      },
      {
        title: 'Spiritual Transformation',
        subtitle: 'Self-Realization',
        description:
          'Cultivating inner equanimity, energetic purification through pranayama, and holistic alignment of body, breath, and mind.',
      },
    ],
    branding: {
      logo: undefined,
      coverImage: undefined,
      favicon: '/logo.png',
    },
    images: [],
    contact: {
      email: 'shuchimohan@kalptaruyogvidyalaya.com',
      phone: '09818047984',
      alternatePhone: '',
      address: {
        street: 'N114 Piyush Heights, Sector 89',
        city: 'Faridabad',
        state: 'Haryana',
        postalCode: '121002',
        country: 'India',
        mapUrl: 'https://maps.google.com',
      },
      hours: 'Mon – Sat: 06:00 AM – 08:00 PM',
    },
    socialLinks: {
      instagram: '',
      youtube: '',
      facebook: '',
      twitter: '',
      linkedin: '',
    },
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingCampusImage, setUploadingCampusImage] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await CmsService.getInstitute();
      if (data) {
        setInstitute((prev) => ({
          ...prev,
          ...data,
          eyebrow: data.eyebrow || prev.eyebrow,
          affiliationText: data.affiliationText || prev.affiliationText,
          stats: data.stats && data.stats.length > 0 ? data.stats : prev.stats,
          pillars: data.pillars && data.pillars.length > 0 ? data.pillars : prev.pillars,
          branding: { ...prev.branding, ...data.branding },
          contact: {
            ...prev.contact,
            ...data.contact,
            address: { ...prev.contact.address, ...data.contact?.address },
          },
          socialLinks: { ...prev.socialLinks, ...data.socialLinks },
          images: data.images || prev.images || [],
        }));
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load institute details' });
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

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const res = await MediaService.uploadImage(file, 'institute', 'Institute Logo');
      setInstitute((prev) => ({
        ...prev,
        branding: {
          ...prev.branding,
          logo: {
            url: res.url,
            path: res.path,
            bucket: res.bucket,
            size: res.size,
            mimeType: res.mimeType,
            alt: 'Institute Sacred Emblem Logo',
          },
        },
      }));
      showToast('Logo uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload logo', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      const res = await MediaService.uploadImage(file, 'institute', 'Institute Cover Image');
      setInstitute((prev) => ({
        ...prev,
        branding: {
          ...prev.branding,
          coverImage: {
            url: res.url,
            path: res.path,
            bucket: res.bucket,
            size: res.size,
            mimeType: res.mimeType,
            alt: 'Institute Campus Cover Image',
          },
        },
      }));
      showToast('Cover image uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload cover image', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUploadCampusImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCampusImage(true);
      const res = await MediaService.uploadImage(file, 'institute', file.name);
      const newImage: StorageImage = {
        url: res.url,
        path: res.path,
        bucket: res.bucket,
        size: res.size,
        mimeType: res.mimeType,
        alt: file.name,
      };
      setInstitute((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImage],
      }));
      showToast('Campus photo added to gallery!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload campus image', 'error');
    } finally {
      setUploadingCampusImage(false);
    }
  };

  const handleAddCampusImageUrl = (url: string) => {
    if (!url.trim()) return;
    const newImage: StorageImage = {
      url: url.trim(),
      path: 'external/campus.jpg',
      bucket: 'external',
      alt: 'Campus Photography',
    };
    setInstitute((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImage],
    }));
    showToast('Campus photo URL added!');
  };

  const handleRemoveCampusImage = (index: number) => {
    setInstitute((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleStatChange = (index: number, field: 'value' | 'label', val: string) => {
    setInstitute((prev) => {
      const stats = [...(prev.stats || [])];
      if (!stats[index]) {
        stats[index] = { label: '', value: '', order: index + 1 };
      }
      stats[index] = { ...stats[index], [field]: val };
      return { ...prev, stats };
    });
  };

  const handlePillarChange = (
    index: number,
    field: 'title' | 'subtitle' | 'description',
    val: string
  ) => {
    setInstitute((prev) => {
      const pillars = [...(prev.pillars || [])];
      if (!pillars[index]) {
        pillars[index] = { title: '', subtitle: '', description: '' };
      }
      pillars[index] = { ...pillars[index], [field]: val };
      return { ...prev, pillars };
    });
  };

  const handleSaveInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await CmsService.updateInstitute(institute);
      if (updated) {
        setInstitute((prev) => ({ ...prev, ...updated }));
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'kalptaru_cached_institute',
            JSON.stringify({ ...institute, ...updated })
          );
          window.dispatchEvent(new CustomEvent('kalptaru-cms-updated'));
          window.dispatchEvent(new Event('storage'));
        }
      }
      showToast('Institute content and images saved successfully! Live website updated.');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update institute details', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Institute CMS Profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-widest uppercase bg-gold-50 text-gold-800 border border-gold-300 font-semibold">
              CMS Editor
            </span>
            <span className="text-xs text-ink-muted font-sans">• About Institute Page</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Manage Institute Details
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-0.5">
            Edit the public About Institute page text, hero credentials, 4 counters, story narrative, pillars, imagery, and contact info.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <a
            href="/about/institute"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900 hover:bg-plum-800 transition-colors font-semibold shadow-soft"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Page</span>
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'identity'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <Building2 className="w-4 h-4 text-gold-500" />
          <span>1. Hero &amp; Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'metrics'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-gold-500" />
          <span>2. Institutional Metrics (4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('heritage')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'heritage'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <BookOpen className="w-4 h-4 text-gold-500" />
          <span>3. Story &amp; Philosophy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pillars')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'pillars'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <Layers className="w-4 h-4 text-gold-500" />
          <span>4. Learning Pillars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('imagery')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'imagery'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-gold-500" />
          <span>5. Campus Imagery</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-sans transition-all ${
            activeTab === 'contact'
              ? 'bg-plum-900 text-gold-300 font-semibold shadow-soft'
              : 'bg-white text-ink hover:text-plum-900 hover:bg-surface-subtle border border-border font-medium shadow-xs'
          }`}
        >
          <MapPin className="w-4 h-4 text-gold-500" />
          <span>6. Contact &amp; Location</span>
        </button>
      </div>

      <form onSubmit={handleSaveInstitute} className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: HERO & CORE IDENTITY */}
        {/* ========================================================================= */}
        {activeTab === 'identity' && (
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold-600" />
                <h2 className="text-lg font-editorial font-bold text-plum-900">
                  Hero Banner &amp; Institutional Identity
                </h2>
              </div>
              <span className="text-[11px] text-ink-muted">Appears in top living Auric banner</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Institute Name *
                </label>
                <input
                  type="text"
                  required
                  value={institute.name || ''}
                  onChange={(e) => setInstitute({ ...institute, name: e.target.value })}
                  placeholder="Kalptaruu Yoga Vidhyalaya"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 font-editorial text-base font-bold shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Established Year
                </label>
                <input
                  type="number"
                  value={institute.establishedYear || 2011}
                  onChange={(e) =>
                    setInstitute({ ...institute, establishedYear: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Hero Tagline / Subtitle
              </label>
              <input
                type="text"
                value={institute.tagline || ''}
                onChange={(e) => setInstitute({ ...institute, tagline: e.target.value })}
                placeholder="Where Timeless Vedic Lineage Meets Modern Rehabilitative Science"
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Hero Eyebrow Pill Text
                </label>
                <input
                  type="text"
                  value={institute.eyebrow || ''}
                  onChange={(e) => setInstitute({ ...institute, eyebrow: e.target.value })}
                  placeholder="Sanctuary of Traditional Yoga & Clinical Physiotherapy"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Affiliation Pill Text
                </label>
                <input
                  type="text"
                  value={institute.affiliationText || ''}
                  onChange={(e) => setInstitute({ ...institute, affiliationText: e.target.value })}
                  placeholder="Affiliated with Indian Yoga Association (IYA)"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Main Lead Description (Hero Banner)
              </label>
              <textarea
                rows={3}
                value={institute.description || ''}
                onChange={(e) => setInstitute({ ...institute, description: e.target.value })}
                placeholder="Describe the founder background, certification scope, and clinical yoga approach..."
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 4 INSTITUTIONAL METRICS */}
        {/* ========================================================================= */}
        {activeTab === 'metrics' && (
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold-600" />
                <h2 className="text-lg font-editorial font-bold text-plum-900">
                  Institutional Metrics (The 4 Counters)
                </h2>
              </div>
              <span className="text-[11px] text-ink-muted">Golden numbers under the hero section</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((idx) => {
                const stat = institute.stats?.[idx] || { label: '', value: '' };
                const defaults = [
                  { val: '5000+', lbl: 'Happy Students & Seekers' },
                  { val: '15+', lbl: 'Years Institutional Legacy' },
                  { val: '100%', lbl: 'Personalized Care & Guidance' },
                  { val: 'Multiple', lbl: 'Accredited Programs Offered' },
                ];
                return (
                  <div key={idx} className="p-4 bg-canvas border border-border rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-gold-800 uppercase">
                        Counter #{idx + 1}
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Display Value</label>
                      <input
                        type="text"
                        value={stat.value ?? defaults[idx].val}
                        onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        placeholder={defaults[idx].val}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-sm font-editorial font-bold text-plum-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Label / Caption</label>
                      <input
                        type="text"
                        value={stat.label ?? defaults[idx].lbl}
                        onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        placeholder={defaults[idx].lbl}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STORY & PHILOSOPHY */}
        {/* ========================================================================= */}
        {activeTab === 'heritage' && (
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold-600" />
                <h2 className="text-lg font-editorial font-bold text-plum-900">
                  Genesis Story &amp; Spiritual Philosophy
                </h2>
              </div>
              <span className="text-[11px] text-ink-muted">Historical lineage &amp; core vision</span>
            </div>

            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Genesis &amp; Heritage Narrative (Our Story Section)
              </label>
              <textarea
                rows={4}
                value={institute.history || ''}
                onChange={(e) => setInstitute({ ...institute, history: e.target.value })}
                placeholder="The founding journey of Mrs. Shuchi Mohan bridging classical yoga with MDNIY and physiotherapy..."
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Spiritual Philosophy
              </label>
              <textarea
                rows={3}
                value={institute.philosophy || ''}
                onChange={(e) => setInstitute({ ...institute, philosophy: e.target.value })}
                placeholder="Rooted in Patanjali Ashtanga and Natha parampara..."
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={institute.mission || ''}
                  onChange={(e) => setInstitute({ ...institute, mission: e.target.value })}
                  placeholder="Preserving authentic sadhana disciplines worldwide..."
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={institute.vision || ''}
                  onChange={(e) => setInstitute({ ...institute, vision: e.target.value })}
                  placeholder="To stand as a globally revered sanctuary..."
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: THREE PILLARS OF LEARNING */}
        {/* ========================================================================= */}
        {activeTab === 'pillars' && (
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold-600" />
                <h2 className="text-lg font-editorial font-bold text-plum-900">
                  Three Core Pillars of Learning
                </h2>
              </div>
              <span className="text-[11px] text-ink-muted">The 3 cards on the public page</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[0, 1, 2].map((idx) => {
                const pillar = institute.pillars?.[idx] || { title: '', subtitle: '', description: '' };
                const defaults = [
                  {
                    t: 'Classical Parampara',
                    sub: 'Authentic Lineage',
                    desc: 'Preserving the sacred purity of Patanjali Ashtanga yoga and classical Hatha sadhana with authentic mantras and meditative stillness.',
                  },
                  {
                    t: 'Clinical Chikitsa',
                    sub: 'Musculoskeletal Science',
                    desc: 'Therapeutic rehabilitation customized under clinical physiotherapy oversight to reverse chronic musculoskeletal conditions safely.',
                  },
                  {
                    t: 'Spiritual Transformation',
                    sub: 'Self-Realization',
                    desc: 'Cultivating inner equanimity, energetic purification through pranayama, and holistic alignment of body, breath, and mind.',
                  },
                ];
                return (
                  <div key={idx} className="p-4 bg-canvas border border-border rounded-xl space-y-3">
                    <span className="text-[10px] font-mono font-bold text-gold-800 uppercase block">
                      Pillar #{idx + 1}
                    </span>
                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Pillar Title</label>
                      <input
                        type="text"
                        value={pillar.title || defaults[idx].t}
                        onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs font-editorial font-bold text-plum-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Subtitle / Badge</label>
                      <input
                        type="text"
                        value={pillar.subtitle || defaults[idx].sub}
                        onChange={(e) => handlePillarChange(idx, 'subtitle', e.target.value)}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-gold-700 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Description</label>
                      <textarea
                        rows={3}
                        value={pillar.description || defaults[idx].desc}
                        onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 resize-y"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CAMPUS IMAGERY */}
        {/* ========================================================================= */}
        {activeTab === 'imagery' && (
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gold-600" />
                <h2 className="text-lg font-editorial font-bold text-plum-900">
                  Institute Imagery &amp; Photography
                </h2>
              </div>
              <span className="text-[11px] text-ink-muted">High-res WebP/JPG</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emblem / Logo */}
              <div className="p-4 bg-canvas border border-border rounded-xl space-y-3">
                <label className="block text-xs font-bold text-plum-900 uppercase tracking-wider">
                  Emblem / Sacred Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#1A0719] border border-gold-400/40 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {institute.branding?.logo?.url ? (
                      <img
                        src={institute.branding.logo.url}
                        alt="Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-[10px] text-gold-300">No Logo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={institute.branding?.logo?.url || ''}
                      onChange={(e) =>
                        setInstitute((prev) => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            logo: {
                              url: e.target.value,
                              path: 'logo.png',
                              bucket: 'branding',
                              alt: 'Emblem Logo',
                            },
                          },
                        }))
                      }
                      placeholder="Logo Image URL"
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-gold-500"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-plum-900 text-gold-300 hover:bg-plum-800 rounded text-xs font-semibold transition-colors shadow-soft">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingLogo ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingLogo}
                        onChange={handleUploadLogo}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Cover / Heritage Story Image */}
              <div className="p-4 bg-canvas border border-border rounded-xl space-y-3">
                <label className="block text-xs font-bold text-plum-900 uppercase tracking-wider">
                  Story Section Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-20 rounded-xl bg-white border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {institute.branding?.coverImage?.url ? (
                      <img
                        src={institute.branding.coverImage.url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-ink-muted">Default Story Photo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={institute.branding?.coverImage?.url || ''}
                      onChange={(e) =>
                        setInstitute((prev) => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            coverImage: {
                              url: e.target.value,
                              path: 'cover.jpg',
                              bucket: 'branding',
                              alt: 'Story Photo',
                            },
                          },
                        }))
                      }
                      placeholder="Cover Image URL"
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-gold-500"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-plum-900 text-gold-300 hover:bg-plum-800 rounded text-xs font-semibold transition-colors shadow-soft">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingCover ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingCover}
                        onChange={handleUploadCover}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus & Shala Gallery */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-plum-900 uppercase tracking-wider">
                  Campus &amp; Shala Photography ({institute.images?.length || 0})
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-plum-900 text-gold-300 hover:bg-plum-800 rounded text-xs font-semibold transition-colors shadow-soft">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCampusImage ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingCampusImage}
                      onChange={handleUploadCampusImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {institute.images && institute.images.length > 0 ? (
                  institute.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden border border-border bg-white shadow-xs"
                    >
                      <img
                        src={img.url}
                        alt={img.alt || 'Campus'}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCampusImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded bg-rose-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-800"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-6 text-center text-xs text-ink-muted border border-dashed border-border rounded-lg bg-canvas">
                    No extra campus photos added yet. Use upload above to showcase your ashram shala.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CONTACT & LOCATION */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-600" />
                <h2 className="text-lg font-editorial font-bold text-plum-900">
                  Campus Location &amp; Contact Details
                </h2>
              </div>
              <span className="text-[11px] text-ink-muted">Displays in sanctuary address section</span>
            </div>

            <div className="p-3.5 rounded-lg bg-gold-50/80 border border-gold-300/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <span className="text-plum-950 font-medium">
                💡 Prefer a dedicated contact center? You can also use the unified <strong>Contact Details Manager</strong> with dual live previews for both Institute and Contact pages.
              </span>
              <Link
                href="/admin/content/contact"
                className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-plum-950 font-semibold text-xs shrink-0 transition-colors text-center"
              >
                Open Contact Manager &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold-600" />
                  <span>Admissions Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={institute.contact.email || ''}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      contact: { ...institute.contact, email: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold-600" />
                  <span>Primary Helpline *</span>
                </label>
                <input
                  type="text"
                  required
                  value={institute.contact.phone || ''}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      contact: { ...institute.contact, phone: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Alternate Phone
                </label>
                <input
                  type="text"
                  value={institute.contact.alternatePhone || ''}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      contact: { ...institute.contact, alternatePhone: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={institute.contact.address.street || ''}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      contact: {
                        ...institute.contact,
                        address: { ...institute.contact.address, street: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={institute.contact.address.city || ''}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      contact: {
                        ...institute.contact,
                        address: { ...institute.contact.address, city: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  State &amp; Postal Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="State"
                    value={institute.contact.address.state || ''}
                    onChange={(e) =>
                      setInstitute({
                        ...institute,
                        contact: {
                          ...institute.contact,
                          address: { ...institute.contact.address, state: e.target.value },
                        },
                      })
                    }
                    className="w-1/2 bg-white border border-border rounded px-2.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                  <input
                    type="text"
                    placeholder="PIN"
                    value={institute.contact.address.postalCode || ''}
                    onChange={(e) =>
                      setInstitute({
                        ...institute,
                        contact: {
                          ...institute.contact,
                          address: { ...institute.contact.address, postalCode: e.target.value },
                        },
                      })
                    }
                    className="w-1/2 bg-white border border-border rounded px-2.5 py-2 text-xs text-ink font-mono focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-600" />
                  <span>Operating Hours</span>
                </label>
                <input
                  type="text"
                  value={institute.contact.hours || ''}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      contact: { ...institute.contact, hours: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={institute.contact.address.mapUrl || ''}
                  onChange={(e) =>
                    setInstitute({
                      ...institute,
                      contact: {
                        ...institute.contact,
                        address: { ...institute.contact.address, mapUrl: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-border rounded-xl shadow-soft">
          <div className="text-xs text-ink-muted font-sans">
            Saving will update the public <strong className="text-plum-900">/about/institute</strong> page in real time.
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-xs sm:text-sm font-sans font-bold bg-gold-500 hover:bg-gold-400 text-plum-950 transition-colors shadow-soft disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Institute Details</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
