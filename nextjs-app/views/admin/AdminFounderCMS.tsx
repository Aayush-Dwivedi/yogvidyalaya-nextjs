'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsFounder } from '../../types/cms';
import { LoadingState } from '../../components/LoadingState';
import {
  Users2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  RefreshCw,
  Award,
  Sparkles,
} from 'lucide-react';

export const AdminFounderCMS: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [founder, setFounder] = useState<CmsFounder>({
    name: 'Mrs. Shuchi Mohan',
    title: 'Founder & Lead Instructor',
    designation: 'Physiotherapist & Therapeutic Yoga Consultant',
    slug: 'shuchi-mohan',
    bio: 'My professional journey began in Physiotherapy, where I developed clinical expertise in rehabilitation and patient care. Over time, my interest in holistic healing led me toward Yoga Therapy and its integrative applications.',
    biography:
      'My professional journey began in Physiotherapy, where I developed clinical expertise in rehabilitation and patient care.\n\nOver time, my interest in holistic healing led me toward Yoga Therapy and its integrative applications.\n\nI further expanded my practice during my professional tenure at Morarji Desai National Institute of Yoga (MDNIY), where I gained institutional exposure through yoga therapy sessions and wellness programs conducted for uniformed personnel, along with engagements associated with various government ministries.\n\nMy work has also included invited wellness sessions and live programs in association with NCERT, as well as participation in national and international conferences and institutional events.\n\nI now carry this integrated approach of Physiotherapy and Yoga forward through my independent institute, Kalptaru Yog Vidyalaya.',
    shortBio: 'Physiotherapist & Therapeutic Yoga Consultant, Founder & Lead Instructor of Kalptaru Yog Vidyalaya.',
    quote: 'The photographs featured here reflect my professional and institutional experience.',
    message: 'The photographs featured here reflect my professional and institutional experience.',
    image: {
      url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      path: 'founder/shuchi-mohan.jpg',
      bucket: 'kalptaru-media',
      alt: 'Mrs. Shuchi Mohan',
    },
    qualifications: [
      'Physiotherapist',
      'Therapeutic Yoga Consultant',
      'Former Practitioner at Morarji Desai National Institute of Yoga (MDNIY)',
      'NCERT Live Program Resource Expert',
    ],
    achievements: [
      'Yoga therapy & wellness programs for uniformed personnel at MDNIY',
      'Invited wellness sessions & live programs in association with NCERT',
      'Participation in national and international conferences & institutional events',
      'Founder & Lead Instructor of Kalptaru Yog Vidyalaya',
    ],
    specializations: ['Therapeutic Yoga', 'Physiotherapy & Rehabilitation', 'Post-Cancer Recovery', 'Thyroid & Back Pain Special Care'],
    lineage: 'Traditional Yoga Practices Combined with Physiotherapy Expertise',
    experienceYears: 15,
    order: 1,
    status: 'published',
    featured: true,
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newQualification, setNewQualification] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const founders = await CmsService.getFounders();
      if (founders && founders.length > 0) {
        const primary = founders[0];
        setFounder({
          ...primary,
          designation: primary.designation || primary.title,
          biography: primary.biography || primary.bio,
          message: primary.message || primary.quote,
          achievements: primary.achievements || [
            'Recognized by AYUSH Ministry for Traditional Preservation',
            'Over 5,000 Sadhakas Graduated Worldwide',
            'Author of "The Unbroken Breath: Science of Kumbhaka"',
          ],
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load founder profile' });
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

  const handleUploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await MediaService.uploadImage(file, 'founder', founder.name || 'Founder Portrait');
      setFounder((prev) => ({
        ...prev,
        image: {
          url: res.url,
          path: res.path,
          bucket: res.bucket,
          size: res.size,
          mimeType: res.mimeType,
          alt: res.alt || 'Founder Portrait',
        },
      }));
      showToast('Profile image uploaded to Supabase Storage!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload profile image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    setFounder((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), newAchievement.trim()],
    }));
    setNewAchievement('');
  };

  const handleRemoveAchievement = (index: number) => {
    setFounder((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddQualification = () => {
    if (!newQualification.trim()) return;
    setFounder((prev) => ({
      ...prev,
      qualifications: [...(prev.qualifications || []), newQualification.trim()],
    }));
    setNewQualification('');
  };

  const handleRemoveQualification = (index: number) => {
    setFounder((prev) => ({
      ...prev,
      qualifications: (prev.qualifications || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSaveFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload: Partial<CmsFounder> = {
        ...founder,
        title: founder.designation || founder.title,
        designation: founder.designation || founder.title,
        bio: founder.biography || founder.bio,
        biography: founder.biography || founder.bio,
        quote: founder.message || founder.quote,
        message: founder.message || founder.quote,
      };

      const founderId = founder._id || founder.id;
      if (founderId) {
        await CmsService.updateFounder(founderId, payload);
      } else {
        const created = await CmsService.createFounder(payload);
        setFounder((prev) => ({ ...prev, _id: created._id || created.id }));
      }
      showToast('Founder profile updated successfully! Public API immediately updated.');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save founder profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Founder Stewardship Profile..." />
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
              Spiritual Stewardship
            </span>
            <span className="text-xs text-ivory/50">• Public Website Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-ivory tracking-wide">
            Founder Profile CMS
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 font-sans mt-1">
            Manage Acharya name, designation, biography, Supabase Storage portrait, achievements, and quote.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900/60 border border-gold-500/30 hover:bg-plum-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <a
            href="/about/founder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-plum-950 bg-gold-500 hover:bg-gold-400 transition-colors font-medium shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Founder Page</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSaveFounder} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image & Quick Summary Card */}
          <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card space-y-4 font-sans flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gold-300 uppercase tracking-wider">
                Founder Portrait Image
              </h2>

              <div className="relative group rounded-xl overflow-hidden border border-gold-500/30 bg-plum-900 aspect-square flex items-center justify-center">
                {founder.image?.url ? (
                  <img
                    src={founder.image.url}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gold-400/40 p-4">
                    <Users2 className="w-12 h-12 mx-auto mb-2" />
                    <span className="text-xs">No Portrait Uploaded</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-plum-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <label className="cursor-pointer px-4 py-2 bg-gold-500 text-plum-950 rounded-lg text-xs font-semibold hover:bg-gold-400 shadow-modal">
                    {uploadingImage ? 'Uploading to Supabase...' : 'Change Portrait'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleUploadProfileImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {founder.image?.path && (
                <div className="p-2 bg-plum-900/40 border border-gold-500/20 rounded text-[11px] font-mono text-gold-400/80 truncate">
                  Supabase: {founder.image.path}
                </div>
              )}

              <div className="p-3 bg-plum-900/20 border border-gold-500/10 rounded-lg space-y-1 text-xs text-ivory/80">
                <div className="flex justify-between">
                  <span className="text-ivory/50">Experience:</span>
                  <span className="font-mono text-gold-300">{founder.experienceYears || 25} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ivory/50">Lineage:</span>
                  <span className="text-ivory line-clamp-1">{founder.lineage || 'Traditional Hatha'}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-ivory/50 text-center">
              Image is safely stored in Supabase Storage bucket 'kalptaru-media/founder'.
            </p>
          </div>

          {/* Details & Biography */}
          <div className="lg:col-span-2 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card space-y-4 font-sans">
            <h2 className="text-lg font-editorial text-ivory border-b border-gold-500/20 pb-3">
              Personal Information & Spiritual Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={founder.name || ''}
                  onChange={(e) => setFounder({ ...founder, name: e.target.value })}
                  placeholder="e.g. Mrs. Shuchi Mohan"
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold-400 font-editorial text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                  Designation / Spiritual Title *
                </label>
                <input
                  type="text"
                  required
                  value={founder.designation || founder.title || ''}
                  onChange={(e) =>
                    setFounder({
                      ...founder,
                      designation: e.target.value,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Founder & Lead Instructor"
                  className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Sacred Message / Quote *
              </label>
              <textarea
                rows={2}
                required
                value={founder.message || founder.quote || ''}
                onChange={(e) =>
                  setFounder({
                    ...founder,
                    message: e.target.value,
                    quote: e.target.value,
                  })
                }
                placeholder="Direct spiritual message or sacred quote to sadhakas..."
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold-400 font-editorial text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Comprehensive Biography *
              </label>
              <textarea
                rows={5}
                required
                value={founder.biography || founder.bio || ''}
                onChange={(e) =>
                  setFounder({
                    ...founder,
                    biography: e.target.value,
                    bio: e.target.value,
                  })
                }
                placeholder="Full biography, early sadhana, gurukula education, tapasya, and mission..."
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Short Bio (for Cards & Highlights)
              </label>
              <input
                type="text"
                value={founder.shortBio || ''}
                onChange={(e) => setFounder({ ...founder, shortBio: e.target.value })}
                placeholder="One sentence summary of stewardship..."
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Achievements & Honors */}
        <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card space-y-4 font-sans">
          <div className="flex items-center gap-2 border-b border-gold-500/20 pb-3">
            <Award className="w-4 h-4 text-gold-400" />
            <h2 className="text-lg font-editorial text-ivory">
              Key Achievements & Stewardship Milestones
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add milestone (e.g. Recognized by AYUSH Ministry, 5,000+ Graduated Sadhakas)..."
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAchievement();
                  }
                }}
                className="flex-1 bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ivory focus:outline-none focus:border-gold-400"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="px-4 py-2 bg-gold-500 text-plum-950 rounded-lg text-xs font-medium hover:bg-gold-400 transition-colors shrink-0"
              >
                Add Achievement
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {founder.achievements && founder.achievements.length > 0 ? (
                founder.achievements.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 px-3 py-2 bg-plum-900/40 border border-gold-500/20 rounded-lg text-xs text-ivory"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1 shrink-0"
                      title="Delete achievement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-xs text-ivory/50">
                  No achievements listed. Add prominent milestones above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card space-y-4 font-sans">
          <div className="flex items-center gap-2 border-b border-gold-500/20 pb-3">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <h2 className="text-lg font-editorial text-ivory">Academic & Lineage Certifications</h2>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add credential (e.g. Master of Yogic Science, E-RYT 500 Yoga Alliance)..."
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQualification();
                  }
                }}
                className="flex-1 bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-ivory focus:outline-none focus:border-gold-400"
              />
              <button
                type="button"
                onClick={handleAddQualification}
                className="px-4 py-2 bg-gold-500 text-plum-950 rounded-lg text-xs font-medium hover:bg-gold-400 transition-colors shrink-0"
              >
                Add Credential
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {founder.qualifications && founder.qualifications.length > 0 ? (
                founder.qualifications.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-plum-900/60 border border-gold-500/30 rounded-lg text-xs text-gold-200"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(idx)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      &times;
                    </button>
                  </span>
                ))
              ) : (
                <div className="text-xs text-ivory/50">No qualifications added.</div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="px-8 py-3 rounded-lg text-sm font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-modal disabled:opacity-50"
          >
            {saving ? 'Saving Founder Profile...' : 'Save Founder Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
