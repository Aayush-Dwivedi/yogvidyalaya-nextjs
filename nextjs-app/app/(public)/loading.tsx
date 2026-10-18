'use client';

import React from 'react';
import { KalptaruLoader } from '@/components';

export default function PublicLoading() {
  return (
    <div className="relative min-h-[75vh] w-full flex items-center justify-center overflow-hidden py-16 px-4">
      {/* ─── 1. REALISTIC BLURRED BACKGROUND PAGE LAYOUT ─── */}
      {/* This ensures the user visibly sees the website layout blurred in the background */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-start pt-12 px-6 pointer-events-none select-none overflow-hidden"
        style={{
          filter: 'blur(14px)',
          WebkitFilter: 'blur(14px)',
          opacity: 0.4,
          transform: 'scale(1.04)',
        }}
        aria-hidden="true"
      >
        {/* Blurred Title & Subtitle */}
        <div className="w-44 h-6 rounded-full bg-gold-400/30 mb-4 animate-pulse" />
        <div className="w-96 max-w-full h-12 rounded-xl bg-gradient-to-r from-gold-300/30 via-plum-700/50 to-gold-400/30 mb-4" />
        <div className="w-72 max-w-full h-4 rounded-full bg-ivory/20 mb-12" />

        {/* Blurred Card Previews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="h-60 rounded-2xl bg-plum-900/40 border border-gold-400/20 p-6 flex flex-col justify-end space-y-3">
            <div className="w-16 h-4 bg-gold-400/30 rounded" />
            <div className="w-3/4 h-5 bg-gold-200/30 rounded" />
            <div className="w-full h-3 bg-ivory/15 rounded" />
          </div>
          <div className="h-60 rounded-2xl bg-plum-900/40 border border-gold-400/20 p-6 flex flex-col justify-end space-y-3">
            <div className="w-16 h-4 bg-gold-400/30 rounded" />
            <div className="w-3/4 h-5 bg-gold-200/30 rounded" />
            <div className="w-full h-3 bg-ivory/15 rounded" />
          </div>
          <div className="h-60 rounded-2xl bg-plum-900/40 border border-gold-400/20 p-6 flex flex-col justify-end space-y-3">
            <div className="w-16 h-4 bg-gold-400/30 rounded" />
            <div className="w-3/4 h-5 bg-gold-200/30 rounded" />
            <div className="w-full h-3 bg-ivory/15 rounded" />
          </div>
        </div>
      </div>

      {/* ─── 2. TRANSLUCENT FROSTED GLASS BACKDROP ─── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(26, 7, 25, 0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/* ─── 3. CRISP, UNBLURRED LOADING ANIMATION IN FOREGROUND ─── */}
      <div className="relative z-10">
        <KalptaruLoader
          message="Harmonizing breath & consciousness..."
          subMessage="Kalptaruu Yoga Vidhyalaya"
          size={140}
        />
      </div>
    </div>
  );
}
