'use client';

import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';

export const AdminInstituteCMS: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [institute, setInstitute] = useState<CmsInstitute>({
    name: 'Kalptaru Yog Vidyalaya',
    tagline: 'Traditional Yoga & Wellness',
    description:
      'Our programs include general fitness yoga, therapeutic yoga for specific health conditions, and professional teacher training courses. We combine traditional yoga practices with physiotherapy expertise, making our approach both effective and safe for everyone.',
    mission: 'Affiliated by Indian Yoga Association. Authentic traditional yogic practices combined with physiotherapy expertise.',
    vision: 'Holistic mind, body & spirit well-being safe and effective for everyone.',
    philosophy: 'Combining traditional yoga practices with physiotherapy expertise.',
    history: 'Founded by Mrs. Shuchi Mohan, Physiotherapist and Therapeutic Yoga Consultant.',
    establishedYear: 2011,
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
      showToast('Campus image added to gallery!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload campus image', 'error');
    } finally {
      setUploadingCampusImage(false);
    }
  };

  const handleRemoveCampusImage = (index: number) => {
    setInstitute((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSaveInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await CmsService.updateInstitute(institute);
      if (updated) {
        setInstitute((prev) => ({ ...prev, ...updated }));
      }
      showToast('Institute content and images saved successfully!');
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
        <LoadingState message="Loading Institute Sacred Profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
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
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-widest uppercase bg-gold-50 text-gold-800 border border-gold-300 font-semibold">
              Content
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Institute Details
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Configure institute name, spiritual philosophy, vision, mission, imagery, and contact details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900 hover:bg-plum-800 transition-colors font-semibold shadow-soft"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public About Page</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSaveInstitute} className="space-y-6">
        {/* Core Identity & Philosophy */}
        <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4 font-sans">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building2 className="w-4 h-4 text-gold-600" />
            <h2 className="text-lg font-editorial font-bold text-plum-900">Core Identity &amp; Vedic Philosophy</h2>
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
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={institute.tagline || ''}
              onChange={(e) => setInstitute({ ...institute, tagline: e.target.value })}
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
              Full Description / History Overview
            </label>
            <textarea
              rows={3}
              value={institute.description || institute.history || ''}
              onChange={(e) =>
                setInstitute({
                  ...institute,
                  description: e.target.value,
                  history: e.target.value,
                })
              }
              placeholder="The legacy, gurukula roots, and historical evolution of Kalptaru Vidyalaya..."
              className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={institute.mission || ''}
                onChange={(e) => setInstitute({ ...institute, mission: e.target.value })}
                placeholder="Preserving classical traditional sadhana..."
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
                placeholder="Creating awakened ambassadors of yogic science..."
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
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
                placeholder="Advaita Vedanta, Patanjali Yoga Sutras..."
                className="w-full bg-white border border-border rounded-lg px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
              />
            </div>
          </div>
        </div>

        {/* Supabase Storage Images */}
        <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gold-600" />
              <h2 className="text-lg font-editorial font-bold text-plum-900">
                Institute Imagery
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="p-4 bg-canvas border border-border rounded-lg space-y-3">
              <label className="block text-xs font-bold text-plum-900 uppercase tracking-wider">
                Emblem / Logo Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-white border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  {institute.branding?.logo?.url ? (
                    <img
                      src={institute.branding.logo.url}
                      alt="Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-[10px] text-ink-muted">No Logo</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-plum-900 text-gold-300 hover:bg-plum-800 rounded-lg text-xs font-semibold transition-colors shadow-soft">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingLogo}
                      onChange={handleUploadLogo}
                      className="hidden"
                    />
                  </label>
                  {institute.branding?.logo?.path && (
                    <p className="text-[10px] font-mono text-ink-muted truncate">
                      {institute.branding.logo.path}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="p-4 bg-canvas border border-border rounded-lg space-y-3">
              <label className="block text-xs font-bold text-plum-900 uppercase tracking-wider">
                Campus Cover / Hero Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 rounded-xl bg-white border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  {institute.branding?.coverImage?.url ? (
                    <img
                      src={institute.branding.coverImage.url}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-ink-muted">No Cover</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-plum-900 text-gold-300 hover:bg-plum-800 rounded-lg text-xs font-semibold transition-colors shadow-soft">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Cover'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingCover}
                      onChange={handleUploadCover}
                      className="hidden"
                    />
                  </label>
                  {institute.branding?.coverImage?.path && (
                    <p className="text-[10px] font-mono text-ink-muted truncate">
                      {institute.branding.coverImage.path}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Campus Facility Gallery Images */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-plum-900 uppercase tracking-wider">
                Campus &amp; Shala Photography ({institute.images?.length || 0})
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-plum-900 text-gold-300 hover:bg-plum-800 rounded text-xs font-semibold transition-colors shadow-soft">
                <Plus className="w-3.5 h-3.5" />
                <span>{uploadingCampusImage ? 'Uploading...' : 'Add Campus Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingCampusImage}
                  onChange={handleUploadCampusImage}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {institute.images && institute.images.length > 0 ? (
                institute.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-border bg-white shadow-xs"
                  >
                    <img src={img.url} alt={img.alt || 'Campus'} className="w-full h-24 object-cover" />
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
                  No campus photos added yet. Upload high-res photography.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details & Location */}
        <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-4 font-sans">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="w-4 h-4 text-gold-600" />
            <h2 className="text-lg font-editorial font-bold text-plum-900">Contact Details &amp; Physical Shala</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-600" />
                <span>Primary Email *</span>
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
                <span>Primary Phone *</span>
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-lg text-sm font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50"
          >
            {saving ? 'Saving Institute Changes...' : 'Save Institute Details'}
          </button>
        </div>
      </form>
    </div>
  );
};
