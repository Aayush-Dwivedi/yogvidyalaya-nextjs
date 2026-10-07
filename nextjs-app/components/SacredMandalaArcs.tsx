'use client';

import React from 'react';
import { cn } from '../utils/cn';

interface SacredMandalaArcsProps {
  className?: string;
}

export const SacredMandalaArcs: React.FC<SacredMandalaArcsProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        'relative select-none pointer-events-none flex items-center justify-center w-full h-full',
        className
      )}
      aria-hidden="true"
    >
      {/* SVG Canvas for High-Precision Sacred Geometry Concentric Rings */}
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(216,178,110,0.22)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* ─── LAYER 2: Primary Outer Spaced Dots Ring ───────────────────────── */}
        {/* Rotates: Counter-Clockwise Slow (120s) */}
        <g className="animate-sacred-ccw-slow" style={{ transformOrigin: '500px 500px' }}>
          <circle
            cx="500"
            cy="500"
            r="450"
            stroke="#E1C48C"
            strokeWidth="3"
            strokeDasharray="2 20"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
        </g>

        {/* ─── LAYER 3: Elegant Celestial Dashes Ring ────────────────────────── */}
        {/* Rotates: Clockwise Medium-Slow (140s) */}
        <g className="animate-sacred-cw-slow" style={{ transformOrigin: '500px 500px' }}>
          <circle
            cx="500"
            cy="500"
            r="410"
            stroke="#EDDCB6"
            strokeWidth="2.2"
            strokeDasharray="32 18"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
        </g>

        {/* ─── LAYER 4: Delicate Starry Micro-Dots Ring ───────────────────────── */}
        {/* Rotates: Counter-Clockwise Medium (85s) */}
        <g className="animate-sacred-ccw-mid" style={{ transformOrigin: '500px 500px' }}>
          <circle
            cx="500"
            cy="500"
            r="375"
            stroke="#D8B26E"
            strokeWidth="1.8"
            strokeDasharray="1.5 9"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
        </g>

        {/* ─── LAYER 5: Distinct Beaded Markers Ring ─────────────────────────── */}
        {/* Rotates: Clockwise Medium (95s) */}
        <g className="animate-sacred-cw-mid" style={{ transformOrigin: '500px 500px' }}>
          <circle
            cx="500"
            cy="500"
            r="335"
            stroke="#FFF2D6"
            strokeWidth="3.5"
            strokeDasharray="2.5 24"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
          {/* Subtle concentric track */}
          <circle
            cx="500"
            cy="500"
            r="325"
            stroke="#C5A059"
            strokeWidth="1"
            strokeDasharray="6 10"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
        </g>

        {/* ─── LAYER 6: Harmonic Dashes Ring ─────────────────────────────────── */}
        {/* Rotates: Counter-Clockwise Fast (75s) */}
        <g className="animate-sacred-ccw-mid" style={{ transformOrigin: '500px 500px' }}>
          <circle
            cx="500"
            cy="500"
            r="290"
            stroke="#E1C48C"
            strokeWidth="2"
            strokeDasharray="18 14"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
        </g>

        {/* ─── LAYER 7: Inner Constellation Dots Ring ─────────────────────────── */}
        {/* Rotates: Clockwise Fast (60s) */}
        <g className="animate-sacred-cw-fast" style={{ transformOrigin: '500px 500px' }}>
          <circle
            cx="500"
            cy="500"
            r="250"
            stroke="#EDDCB6"
            strokeWidth="2.4"
            strokeDasharray="1.5 14"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
        </g>

        {/* ─── LAYER 8: Architectural Guidance Circle ────────────────────────── */}
        {/* Rotates: Counter-Clockwise (90s) */}
        <g className="animate-sacred-ccw-slow" style={{ transformOrigin: '500px 500px' }}>
          <circle
            cx="500"
            cy="500"
            r="215"
            stroke="#C5A059"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
        </g>
      </svg>
    </div>
  );
};

export default SacredMandalaArcs;
