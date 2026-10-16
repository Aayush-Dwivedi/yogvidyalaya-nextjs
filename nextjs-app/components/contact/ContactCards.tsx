'use client';

import React from 'react';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { getMapDirectUrl } from '../../utils/mapUtils';

export interface ContactDataProps {
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsappLink?: string;
  whatsappNumber?: string;
  hours?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    mapUrl?: string;
    mapDirectUrl?: string;
    mapEmbedUrl?: string;
  };
}

export interface ContactCardsProps {
  contactData?: ContactDataProps;
  layout?: 'stacked' | 'grid';
  className?: string;
}

export const ContactCards: React.FC<ContactCardsProps> = ({
  contactData,
  layout = 'stacked',
  className = '',
}) => {
  const WHATSAPP_LINK =
    contactData?.whatsappLink || 'https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL';
  const PHONE_NUMBER = contactData?.phone || '09818047984';
  const ALTERNATE_PHONE = contactData?.alternatePhone || '';
  const EMAIL_ADDRESS = contactData?.email || 'shuchimohan@kalptaruyogvidyalaya.com';
  const PHYSICAL_ADDRESS = contactData?.address?.street
    ? `${contactData.address.street}, ${contactData.address.city || 'Faridabad'}${
        contactData.address.postalCode ? ` – ${contactData.address.postalCode}` : ''
      }`
    : 'N114 Piyush Heights, Sector 89, Faridabad – 121002';
  const HOURS = contactData?.hours || 'Mon – Sat: 06:00 AM – 08:00 PM';
  const MAP_DIRECT_URL = getMapDirectUrl(
    contactData?.address?.mapUrl || (contactData?.address as any)?.mapDirectUrl || ''
  );

  const containerClasses =
    layout === 'grid'
      ? `grid grid-cols-1 md:grid-cols-2 gap-5 ${className}`
      : `space-y-4 ${className}`;

  return (
    <div className={containerClasses}>
      {/* 1. WhatsApp Community / Direct */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded-xl bg-canvas-warm border border-gold-300/60 hover:border-gold-500 transition-all group shadow-sm hover:shadow-card"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 group-hover:scale-105 transition-transform p-2.5">
            <img
              src="/whatsapp-icon.png"
              alt="WhatsApp"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-800 font-semibold">
                WhatsApp Community &amp; Help
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <p className="text-sm font-semibold text-plum-950 mt-1 truncate">
              Official Kalptaruu WhatsApp Group
            </p>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Click to join our active group for direct support, updates, and admission chats.
            </p>
          </div>
        </div>
      </a>

      {/* 2. Telephone */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="block p-5 rounded-xl bg-canvas-warm border border-gold-300/60 hover:border-gold-500 transition-all group shadow-sm hover:shadow-card"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200 group-hover:scale-105 transition-transform">
            <Phone className="w-5 h-5 text-gold-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-mono tracking-wider text-gold-700 font-semibold block">
              Direct Phone Line
            </span>
            <p className="text-base font-semibold text-plum-950 mt-1 font-mono">
              {PHONE_NUMBER}
            </p>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              {HOURS}
              {ALTERNATE_PHONE && (
                <span className="block mt-0.5 text-ink-muted">
                  Alt: <span className="font-mono text-plum-900 font-medium">{ALTERNATE_PHONE}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      </a>

      {/* 3. Electronic Mail */}
      <a
        href={`mailto:${EMAIL_ADDRESS}`}
        className="block p-5 rounded-xl bg-canvas-warm border border-gold-300/60 hover:border-gold-500 transition-all group shadow-sm hover:shadow-card"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 text-gold-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-mono tracking-wider text-gold-700 font-semibold block">
              Electronic Mail
            </span>
            <p className="text-sm font-semibold text-plum-950 mt-1 truncate">
              {EMAIL_ADDRESS}
            </p>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              For formal correspondence, institutional invitations, and enquiries.
            </p>
          </div>
        </div>
      </a>

      {/* 4. Physical Shala Address */}
      <div className="p-5 rounded-xl bg-canvas-warm border border-gold-300/60 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-plum-50 text-plum-900 flex items-center justify-center shrink-0 border border-plum-200">
            <MapPin className="w-5 h-5 text-gold-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs uppercase font-mono tracking-wider text-gold-700 font-semibold block">
              Institute Address
            </span>
            <p className="text-sm font-semibold text-plum-950 mt-1">
              Kalptaruu Yoga Vidhyalaya
            </p>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              {PHYSICAL_ADDRESS}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gold-200/50 text-[11px] text-gold-700 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Hours: {HOURS}</span>
              </div>
              {MAP_DIRECT_URL && (
                <a
                  href={MAP_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gold-800 hover:text-plum-950 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
