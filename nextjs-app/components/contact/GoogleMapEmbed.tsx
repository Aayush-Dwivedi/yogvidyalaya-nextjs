'use client';

import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { getMapDirectUrl, getMapEmbedUrl } from '../../utils/mapUtils';

export interface GoogleMapEmbedProps {
  mapEmbedSrc?: string;
  mapDirectUrl?: string;
  rawUrl?: string;
  title?: string;
  heightClass?: string;
  className?: string;
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  mapEmbedSrc,
  mapDirectUrl,
  rawUrl,
  title = 'Kalptaruu Yoga Vidhyalaya — Interactive Map & Directions',
  heightClass = 'h-[360px] sm:h-[430px]',
  className = '',
}) => {
  const embedSrc = mapEmbedSrc || getMapEmbedUrl(rawUrl);
  const directUrl = mapDirectUrl || getMapDirectUrl(rawUrl);

  if (!embedSrc) return null;

  return (
    <div className={`overflow-hidden rounded-2xl border border-gold-300/60 shadow-sm bg-canvas-warm ${className}`}>
      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-plum-950 text-white text-xs border-b border-gold-500/30">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="font-semibold font-mono tracking-wider text-gold-300 uppercase text-[11px] sm:text-xs">
            {title}
          </span>
        </div>
        {directUrl && (
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 hover:text-gold-200 transition-colors text-xs font-medium border border-gold-400/30"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Interactive Map Iframe */}
      <div className={`relative w-full ${heightClass} bg-canvas`}>
        <iframe
          title="Kalptaruu Yoga Vidhyalaya Location"
          src={embedSrc}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
};
