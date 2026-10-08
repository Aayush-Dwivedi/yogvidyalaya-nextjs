'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CmsService } from '../../services/cmsService';
import { LoadingState } from '../../components/LoadingState';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Navigation,
  Globe,
  Share2,
  RefreshCw,
  Eye,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ContactFormData {
  email: string;
  phone: string;
  alternatePhone: string;
  whatsappLink: string;
  whatsappNumber: string;
  hours: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    mapUrl: string;
  };
}

export const AdminContactCMS: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [contact, setContact] = useState<ContactFormData>({
    email: 'shuchimohan@kalptaruyogvidyalaya.com',
    phone: '09818047984',
    alternatePhone: '',
    whatsappLink: 'https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL',
    whatsappNumber: '09818047984',
    hours: 'Mon – Sat: 06:00 AM – 08:00 PM',
    address: {
      street: 'N114 Piyush Heights, Sector 89',
      city: 'Faridabad',
      state: 'Haryana',
      postalCode: '121002',
      country: 'India',
      mapUrl: '',
    },
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await CmsService.getInstitute();
      if (data && data.contact) {
        setContact({
          email: data.contact.email || 'shuchimohan@kalptaruyogvidyalaya.com',
          phone: data.contact.phone || '09818047984',
          alternatePhone: data.contact.alternatePhone || '',
          whatsappLink:
            data.contact.whatsappLink || 'https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL',
          whatsappNumber: data.contact.whatsappNumber || data.contact.phone || '09818047984',
          hours: data.contact.hours || 'Mon – Sat: 06:00 AM – 08:00 PM',
          address: {
            street: data.contact.address?.street || 'N114 Piyush Heights, Sector 89',
            city: data.contact.address?.city || 'Faridabad',
            state: data.contact.address?.state || 'Haryana',
            postalCode: data.contact.address?.postalCode || '121002',
            country: data.contact.address?.country || 'India',
            mapUrl: data.contact.address?.mapUrl || '',
          },
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to load contact information',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);

      const updated = await CmsService.updateInstitute({
        contact: {
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          alternatePhone: contact.alternatePhone.trim(),
          whatsappLink: contact.whatsappLink.trim(),
          whatsappNumber: contact.whatsappNumber.trim(),
          hours: contact.hours.trim(),
          address: {
            street: contact.address.street.trim(),
            city: contact.address.city.trim(),
            state: contact.address.state.trim(),
            postalCode: contact.address.postalCode.trim(),
            country: contact.address.country.trim(),
            mapUrl: contact.address.mapUrl.trim(),
          },
        },
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('kalptaru_cached_institute', JSON.stringify(updated));
        window.dispatchEvent(
          new CustomEvent('kalptaru-cms-updated', { detail: { timestamp: Date.now() } })
        );
      }

      setStatusMessage({
        type: 'success',
        text: 'Contact details saved successfully! Both About Institute and Contact pages have been updated in real-time.',
      });

      // Clear toast after 6 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 6000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update contact details. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const formattedFullAddress = `${contact.address.street}, ${contact.address.city}${
    contact.address.postalCode ? ` – ${contact.address.postalCode}` : ''
  }, ${contact.address.state}, ${contact.address.country}`;

  const mapEmbedPreviewSrc =
    contact.address.mapUrl.includes('output=embed') ||
    contact.address.mapUrl.includes('/embed')
      ? contact.address.mapUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(
          formattedFullAddress
        )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const mapDirectUrl =
    contact.address.mapUrl &&
    !contact.address.mapUrl.includes('output=embed') &&
    contact.address.mapUrl !== 'https://maps.google.com'
      ? contact.address.mapUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          formattedFullAddress
        )}`;

  if (loading) {
    return <LoadingState message="Loading contact settings..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ─── Top Header & Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-700 font-semibold mb-1">
            <span>Global Contact Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900">
            Contact Details &amp; Location
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-2xl">
            Editing contact info here updates both the <strong>About Institute</strong> page (<code>/about/institute</code>) and the <strong>Contact</strong> page (<code>/contact</code>), as well as the website footer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/about/institute"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-border text-xs font-medium text-ink hover:text-plum-900 hover:border-gold-400 transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-gold-600" />
            <span>View Institute Page</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <Link
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-border text-xs font-medium text-ink hover:text-plum-900 hover:border-gold-400 transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-gold-600" />
            <span>View Contact Page</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={loadData}
            title="Refresh Data"
            className="p-2 rounded-lg bg-white border border-border text-ink hover:text-plum-900 shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Status Message Toast ─── */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 shadow-xs transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{statusMessage.text}</div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT: Form Inputs (7 Cols) ─── */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Direct Phone & Email Communications */}
            <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-600" />
                  <h2 className="text-base font-bold text-plum-900 font-sans">
                    1. Direct Phone &amp; Email Helpline
                  </h2>
                </div>
                <span className="text-[11px] text-ink-muted">Voice &amp; Email</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                    Primary Phone Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="09818047984"
                    className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Direct calling link for students &amp; visitors.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                    Alternate Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={contact.alternatePhone}
                    onChange={(e) => setContact({ ...contact, alternatePhone: e.target.value })}
                    placeholder="+91 98180 47984"
                    className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Secondary backup or helpline number.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="shuchimohan@kalptaruyogvidyalaya.com"
                    className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Admissions, formal queries, and invitations.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-600" />
                    <span>Operating / Visiting Hours</span>
                  </label>
                  <input
                    type="text"
                    value={contact.hours}
                    onChange={(e) => setContact({ ...contact, hours: e.target.value })}
                    placeholder="Mon – Sat: 06:00 AM – 08:00 PM"
                    className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Working schedule displayed across both pages.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. WhatsApp Community & Direct Chat */}
            <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <img
                      src="/whatsapp-icon.png"
                      alt="WhatsApp"
                      className="w-3.5 h-3.5 object-contain"
                    />
                  </div>
                  <h2 className="text-base font-bold text-plum-900 font-sans">
                    2. WhatsApp Community &amp; Support Link
                  </h2>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">Active Community</span>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  WhatsApp Group / Chat Invite Link *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={contact.whatsappLink}
                    onChange={(e) => setContact({ ...contact, whatsappLink: e.target.value })}
                    placeholder="https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL"
                    className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                  {contact.whatsappLink && (
                    <a
                      href={contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-ink-muted mt-1">
                  Used by the prominent WhatsApp buttons on the Contact Page and floating help links.
                </p>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  WhatsApp Support Phone Number
                </label>
                <input
                  type="text"
                  value={contact.whatsappNumber}
                  onChange={(e) => setContact({ ...contact, whatsappNumber: e.target.value })}
                  placeholder="09818047984"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                />
              </div>
            </div>

            {/* 3. Physical Ashram Address */}
            <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <h2 className="text-base font-bold text-plum-900 font-sans">
                    3. Physical Institute Address
                  </h2>
                </div>
                <span className="text-[11px] text-ink-muted">Faridabad Ashram</span>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Street Address / Building *
                </label>
                <input
                  type="text"
                  required
                  value={contact.address.street}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, street: e.target.value },
                    })
                  }
                  placeholder="N114 Piyush Heights, Sector 89"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact.address.city}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        address: { ...contact.address, city: e.target.value },
                      })
                    }
                    placeholder="Faridabad"
                    className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                    State &amp; Postal PIN Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Haryana"
                      value={contact.address.state}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          address: { ...contact.address, state: e.target.value },
                        })
                      }
                      className="w-1/2 bg-white border border-border rounded-lg px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="121002"
                      value={contact.address.postalCode}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          address: { ...contact.address, postalCode: e.target.value },
                        })
                      }
                      className="w-1/2 bg-white border border-border rounded-lg px-3 py-2 text-xs sm:text-sm text-ink font-mono focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={contact.address.country}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, country: e.target.value },
                    })
                  }
                  placeholder="India"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            {/* 4. Google Maps URL & Embed Configuration */}
            <div className="bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-gold-600" />
                  <h2 className="text-base font-bold text-plum-900 font-sans">
                    4. Google Maps &amp; Navigation URL
                  </h2>
                </div>
                <span className="text-[11px] text-ink-muted">Interactive Map</span>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1.5">
                  Custom Google Maps Embed or Share URL (Optional)
                </label>
                <input
                  type="text"
                  value={contact.address.mapUrl}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, mapUrl: e.target.value },
                    })
                  }
                  placeholder="e.g. https://maps.google.com/?q=Piyush+Heights+Faridabad or leave blank for auto address embed"
                  className="w-full bg-white border border-border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-ink focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                />
                <p className="text-[11px] text-ink-muted mt-1.5 leading-relaxed">
                  💡 If left empty, the system automatically embeds an interactive Google Map centered on <code>{formattedFullAddress}</code>.
                </p>
              </div>

              {/* Live Embedded Map Preview in Admin */}
              <div className="rounded-xl border border-border overflow-hidden bg-surface-subtle">
                <div className="px-4 py-2.5 bg-plum-950 text-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span className="font-semibold text-gold-300 font-mono text-[11px]">
                      Live Map Embed Test
                    </span>
                  </div>
                  <a
                    href={mapDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-gold-300 hover:text-gold-200 underline"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative w-full h-56 bg-surface">
                  <iframe
                    title="Admin Map Preview"
                    src={mapEmbedPreviewSrc}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Live Previews (5 Cols) ─── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            {/* Live Preview Header Card */}
            <div className="bg-plum-950 text-white rounded-2xl p-6 shadow-medium border border-gold-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-gold-400 font-mono font-semibold">
                  Dual Live Preview
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Realtime Sync
                </span>
              </div>
              <h3 className="text-lg font-editorial text-gold-100 font-bold">
                How It Appears to Visitors
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Saving these details synchronizes the cards on the Contact Page, the Sanctuary Location section on the About Institute Page, and the footer.
              </p>
            </div>

            {/* Preview on /contact */}
            <div className="bg-canvas-warm rounded-2xl p-5 border border-gold-300/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gold-300/40 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-plum-900 tracking-wider">
                  Contact Page Preview (/contact)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gold-100 text-gold-800 font-semibold">
                  Card Stack
                </span>
              </div>

              {/* WhatsApp Preview Card */}
              <div className="p-3.5 rounded-xl bg-white border border-gold-300/40 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 p-2">
                  <img
                    src="/whatsapp-icon.png"
                    alt="WhatsApp"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 font-bold">
                    Official WhatsApp
                  </div>
                  <div className="text-xs font-semibold text-plum-950 truncate">
                    Join Active Group
                  </div>
                </div>
              </div>

              {/* Phone Preview Card */}
              <div className="p-3.5 rounded-xl bg-white border border-gold-300/40 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200">
                  <Phone className="w-4 h-4 text-gold-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gold-700 font-bold">
                    Direct Phone Line
                  </div>
                  <div className="text-xs font-semibold text-plum-950 font-mono truncate">
                    {contact.phone || '09818047984'}
                  </div>
                  <div className="text-[10px] text-ink-muted truncate">
                    {contact.hours}
                  </div>
                </div>
              </div>

              {/* Email Preview Card */}
              <div className="p-3.5 rounded-xl bg-white border border-gold-300/40 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200">
                  <Mail className="w-4 h-4 text-gold-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gold-700 font-bold">
                    Electronic Mail
                  </div>
                  <div className="text-xs font-semibold text-plum-950 truncate">
                    {contact.email || 'shuchimohan@kalptaruyogvidyalaya.com'}
                  </div>
                </div>
              </div>

              {/* Address Preview Card */}
              <div className="p-3.5 rounded-xl bg-white border border-gold-300/40 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200">
                  <MapPin className="w-4 h-4 text-gold-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gold-700 font-bold">
                    Institute Address
                  </div>
                  <div className="text-xs font-semibold text-plum-950 truncate">
                    Kalptaruu Yoga Vidhyalaya
                  </div>
                  <div className="text-[11px] text-ink-muted leading-tight mt-0.5 line-clamp-2">
                    {formattedFullAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview on /about/institute */}
            <div className="bg-canvas-warm rounded-2xl p-5 border border-gold-300/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gold-300/40 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-plum-900 tracking-wider">
                  Institute Page Preview (/about/institute)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-plum-100 text-plum-900 font-semibold">
                  Section 7
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-white border border-border">
                  <span className="text-[10px] font-mono uppercase text-gold-700 font-bold block">
                    Sanctuary Address
                  </span>
                  <span className="text-xs text-plum-950 font-medium block mt-0.5">
                    {formattedFullAddress}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-white border border-border">
                    <span className="text-[10px] font-mono uppercase text-gold-700 font-bold block">
                      Helpline
                    </span>
                    <span className="text-xs text-plum-950 font-mono font-medium block mt-0.5">
                      {contact.phone}
                    </span>
                    <span className="text-[10px] text-ink-muted block mt-0.5 truncate">
                      {contact.hours}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-border">
                    <span className="text-[10px] font-mono uppercase text-gold-700 font-bold block">
                      Admissions
                    </span>
                    <span className="text-xs text-plum-950 font-medium block mt-0.5 truncate">
                      {contact.email}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-plum-900 text-white text-[11px] flex items-center justify-between">
                  <span>Interactive Map Status</span>
                  <span className="text-gold-300 font-semibold">Embedded Active</span>
                </div>
              </div>
            </div>

            {/* Save Card */}
            <div className="bg-white border border-border rounded-2xl p-5 shadow-soft space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-sans font-bold text-sm bg-gold-500 hover:bg-gold-400 text-plum-950 transition-all shadow-soft disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving All Details...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Contact Details Everywhere</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-ink-muted text-center leading-tight">
                Instantly refreshes both public pages and the database.
              </p>
            </div>
          </div>
        </div>

        {/* Global Save Button Sticky Bar for Mobile */}
        <div className="lg:hidden sticky bottom-4 z-30 p-3 bg-white/95 backdrop-blur border border-border rounded-xl shadow-modal flex items-center justify-between gap-4">
          <div className="text-xs text-ink-muted truncate">
            Syncs to Institute &amp; Contact pages
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-sans font-bold bg-gold-500 hover:bg-gold-400 text-plum-950 transition-colors shadow-soft shrink-0 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save All</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminContactCMS;
