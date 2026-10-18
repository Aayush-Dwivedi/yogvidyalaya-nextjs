'use client';

import React from 'react';
import { KalptaruLoader } from '@/components';

export default function AdminLoading() {
  return (
    <div className="relative min-h-[75vh] w-full flex items-center justify-center overflow-hidden py-16 px-4">
      {/* ─── REALISTIC BLURRED BACKGROUND ADMIN CMS LAYOUT ─── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-start pt-12 px-6 pointer-events-none select-none overflow-hidden"
        style={{
          filter: 'blur(14px)',
          WebkitFilter: 'blur(14px)',
          opacity: 0.35,
          transform: 'scale(1.04)',
        }}
        aria-hidden="true"
      >
        <div className="w-48 h-8 rounded-lg bg-plum-800/40 mb-4 animate-pulse" />
        <div className="w-80 h-4 rounded-full bg-ivory/20 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl w-full mb-6">
          <div className="h-28 rounded-xl bg-plum-900/40 border border-gold-400/20 p-4" />
          <div className="h-28 rounded-xl bg-plum-900/40 border border-gold-400/20 p-4" />
          <div className="h-28 rounded-xl bg-plum-900/40 border border-gold-400/20 p-4" />
          <div className="h-28 rounded-xl bg-plum-900/40 border border-gold-400/20 p-4" />
        </div>

        <div className="h-64 max-w-5xl w-full rounded-2xl bg-plum-900/30 border border-gold-400/15" />
      </div>

      {/* ─── TRANSLUCENT FROSTED GLASS BACKDROP ─── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(26, 7, 25, 0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/* ─── CRISP, UNBLURRED LOADING ANIMATION IN FOREGROUND ─── */}
      <div className="relative z-10">
        <KalptaruLoader
          message="Loading Admin Management Sanctuary..."
          subMessage="Kalptaruu Yoga Vidhyalaya"
          size={130}
        />
      </div>
    </div>
  );
}
