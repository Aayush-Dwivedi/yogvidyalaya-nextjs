'use client';

import React from 'react';
import { cn } from '../utils/cn';

interface AuricBackgroundProps {
  className?: string;
  showOrbs?: boolean;
  showBottomBorder?: boolean;
}

export const AuricBackground: React.FC<AuricBackgroundProps> = ({
  className,
  showOrbs = true,
  showBottomBorder = true,
}) => {
  return (
    <>
      {/* ─── LIVING ANIMATED CANVAS (LOGO PURPLE #2A0725 & #1A0719) ─── */}
      <div className={cn('absolute inset-0 z-0 animate-auric-canvas pointer-events-none', className)} />

      {/* ─── ATMOSPHERIC DEPTH OVERLAYS ─── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1A0719]/80 via-transparent to-[#1A0719]/90 pointer-events-none" />

      {/* ─── VIBRANT ANIMATED GRADIENT AURAS (LOGO GOLDEN #DAA53B & DEEP PURPLE #2A0725 ONLY) ─── */}
      {showOrbs && (
        <>
          {/* Aura 1: Primary Logo Gold Radiance (#DAA53B) floating smoothly */}
          <div className="absolute -top-[25%] left-[8%] sm:left-[15%] w-[450px] h-[450px] sm:w-[700px] sm:h-[700px] rounded-full bg-[radial-gradient(circle,rgba(218,165,59,0.36)_0%,rgba(218,165,59,0.16)_40%,transparent_80%)] blur-3xl animate-aura-1 pointer-events-none" />

          {/* Aura 2: Deep Logo Purple (#2A0725) Drift across bottom-right */}
          <div className="absolute -bottom-[25%] right-[5%] sm:right-[12%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full bg-[radial-gradient(circle,rgba(42,7,37,0.85)_0%,rgba(26,7,25,0.60)_45%,transparent_80%)] blur-3xl animate-aura-2 pointer-events-none" />

          {/* Aura 3: Secondary Warm Logo Gold Glow */}
          <div className="absolute top-[20%] right-[22%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-[radial-gradient(circle,rgba(225,180,85,0.28)_0%,rgba(218,165,59,0.12)_45%,transparent_75%)] blur-3xl animate-aura-3 pointer-events-none" />

          {/* Aura 4: Ambient Golden Horizon Wave at center/bottom */}
          <div className="absolute inset-x-0 bottom-0 h-48 sm:h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(218,165,59,0.20)_0%,rgba(42,7,37,0.35)_50%,transparent_75%)] blur-2xl animate-auric-flow pointer-events-none" />
        </>
      )}

      {/* ─── ANIMATED PURE GOLDEN SHIMMER BORDER AT BOTTOM ─── */}
      {showBottomBorder && (
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] auric-border-glow pointer-events-none" />
      )}
    </>
  );
};

export default AuricBackground;
