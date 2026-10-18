'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '../../utils/cn';
import { AlertCircle, RotateCcw, Clock } from 'lucide-react';

export interface KalptaruLoaderProps {
  /**
   * Status message displayed under the animated emblem.
   * Default: "Harmonizing breath & consciousness..."
   */
  message?: string;

  /**
   * Secondary subtitle / status detail
   */
  subMessage?: string;

  /**
   * If true, renders as a full-screen fixed overlay with backdrop blur.
   * Default: false
   */
  fullScreen?: boolean;

  /**
   * If true, renders as an absolute overlay within a relative parent container with backdrop blur.
   * Default: false
   */
  overlay?: boolean;

  /**
   * Whether to wrap inline loader with a frosted glass blurred backdrop card.
   * Default: false
   */
  blurBackground?: boolean;

  /**
   * Diameter in pixels of the central emblem.
   * Default: 140
   */
  size?: number;

  /**
   * True if the API or async operation timed out.
   */
  isTimeout?: boolean;

  /**
   * Custom timeout error message to display when timed out.
   */
  timeoutMessage?: string;

  /**
   * Callback invoked when user clicks the Retry button on timeout.
   */
  onRetry?: () => void;

  /**
   * Show live elapsed seconds ticker under loader
   * Default: false
   */
  showElapsed?: boolean;

  /**
   * Current elapsed seconds (from useEmblemLoader)
   */
  elapsedSeconds?: number;

  /**
   * Configurable minimum duration in seconds (for display or reference)
   */
  minDurationSeconds?: number;

  /**
   * Additional container classes
   */
  className?: string;
}

export const KalptaruLoader: React.FC<KalptaruLoaderProps> = ({
  message = 'Harmonizing breath & consciousness...',
  subMessage = 'Kalptaruu Yoga Vidhyalaya',
  fullScreen = false,
  overlay = false,
  blurBackground = false,
  size = 140,
  isTimeout = false,
  timeoutMessage = 'The request took longer than expected and timed out.',
  onRetry,
  showElapsed = false,
  elapsedSeconds,
  minDurationSeconds,
  className,
}) => {
  // Dimensions
  const containerSize = size + 64; // extra room for orbital sweep and sparks
  const orbitRadius = (size + 24) / 2;
  const strokeWidth = 3.5;

  const content = (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-6 text-center select-none',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* ─── 1. TIMEOUT STATE ─── */}
      {isTimeout ? (
        <div className="flex flex-col items-center max-w-sm mx-auto p-8 rounded-3xl bg-plum-950/95 border border-gold-500/40 shadow-modal text-ivory space-y-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-plum-900 border border-gold-400/50 flex items-center justify-center text-gold-400 shadow-soft">
            <Clock className="w-8 h-8 animate-pulse text-gold-300" />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xl font-editorial font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              Request Timed Out
            </h4>
            <p className="text-xs text-ivory/80 font-sans leading-relaxed">
              {timeoutMessage}
            </p>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 text-plum-950 font-sans font-semibold text-xs shadow-modal hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          )}
        </div>
      ) : (
        /* ─── 2. ACTIVE ANIMATED EMBLEM ─── */
        <div className="flex flex-col items-center">
          {/* Main Visual Arena */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
          >
            {/* Ambient Radial Auric Glow Behind Emblem */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-radial from-gold-500/20 via-plum-900/40 to-transparent blur-xl pointer-events-none"
              style={{ transform: 'scale(1.2)' }}
            />

            {/* Floating Golden Sparks / Embers matching screenshot */}
            {/* Speck 1: Top-Right (tilted ~35deg) */}
            <div
              className="absolute w-3.5 h-1.5 bg-gradient-to-r from-gold-300 to-gold-500 rounded-[1px] shadow-[0_0_8px_rgba(218,165,59,0.8)] pointer-events-none animate-speck-drift"
              style={
                {
                  top: '12%',
                  right: '10%',
                  '--speck-rot': '38deg',
                  '--speck-dx': '3px',
                  '--speck-dy': '-6px',
                  animationDelay: '0s',
                } as React.CSSProperties
              }
            />

            {/* Speck 2: Bottom-Right (tilted ~-20deg) */}
            <div
              className="absolute w-2.5 h-1 bg-gradient-to-r from-gold-200 to-gold-400 rounded-[1px] shadow-[0_0_6px_rgba(218,165,59,0.7)] pointer-events-none animate-speck-drift"
              style={
                {
                  bottom: '14%',
                  right: '22%',
                  '--speck-rot': '-22deg',
                  '--speck-dx': '-4px',
                  '--speck-dy': '5px',
                  animationDelay: '1.2s',
                } as React.CSSProperties
              }
            />

            {/* Speck 3: Bottom-Left (tilted ~45deg) */}
            <div
              className="absolute w-3 h-1.5 bg-gradient-to-r from-gold-300 to-gold-500 rounded-[1px] shadow-[0_0_8px_rgba(218,165,59,0.8)] pointer-events-none animate-speck-drift"
              style={
                {
                  bottom: '22%',
                  left: '12%',
                  '--speck-rot': '48deg',
                  '--speck-dx': '4px',
                  '--speck-dy': '6px',
                  animationDelay: '0.6s',
                } as React.CSSProperties
              }
            />

            {/* Speck 4: Mid-Left subtle ember */}
            <div
              className="absolute w-2 h-1 bg-gold-400 rounded-full shadow-[0_0_5px_rgba(218,165,59,0.9)] pointer-events-none animate-speck-drift"
              style={
                {
                  top: '46%',
                  left: '6%',
                  '--speck-rot': '15deg',
                  '--speck-dx': '-3px',
                  '--speck-dy': '-4px',
                  animationDelay: '1.8s',
                } as React.CSSProperties
              }
            />

            {/* SVG Orbit Tracks & Sweeping Golden Arc Tracer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox={`0 0 ${containerSize} ${containerSize}`}
            >
              <defs>
                {/* Arc Linear Gradient for Sweeping Tail */}
                <linearGradient
                  id="kalptaruArcGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#C5A059" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#E1C48C" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FFE8B0" stopOpacity="1" />
                </linearGradient>

                {/* Subtle Inner Ring Glow Filter */}
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Faint Concentric Orbit Track Ring */}
              <circle
                cx={containerSize / 2}
                cy={containerSize / 2}
                r={orbitRadius}
                fill="none"
                stroke="#C5A059"
                strokeWidth="1"
                strokeOpacity="0.25"
                strokeDasharray="4 6"
                className="animate-emblem-orbit-reverse"
              />

              {/* Rotating Sweeping Golden Arc Tracer (from screenshot) */}
              <g className="animate-emblem-orbit">
                <circle
                  cx={containerSize / 2}
                  cy={containerSize / 2}
                  r={orbitRadius}
                  fill="none"
                  stroke="url(#kalptaruArcGrad)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${orbitRadius * 1.05} ${orbitRadius * 5.2}`}
                  filter="url(#goldGlow)"
                />
              </g>
            </svg>

            {/* Central Kalptaru Emblem Container */}
            <div
              className="relative rounded-full p-1 bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-modal animate-emblem-breath z-0"
              style={{ width: `${size}px`, height: `${size}px` }}
            >
              {/* Inner Rim Accent */}
              <div className="w-full h-full rounded-full overflow-hidden bg-plum-950 p-[2px] relative flex items-center justify-center">
                <Image
                  src="/kalptaru-logo.webp"
                  alt="Kalptaruu Yoga Vidhyalaya Emblem"
                  width={size}
                  height={size}
                  priority
                  className="w-full h-full rounded-full object-cover select-none pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Typography & Status Messaging */}
          <div className="mt-5 space-y-1.5 max-w-xs text-center z-10">
            {subMessage && (
              <p className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-gold-400/90 font-medium">
                {subMessage}
              </p>
            )}

            <h3 className="text-sm sm:text-base font-editorial font-normal text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-300 leading-snug">
              {message}
            </h3>

            {/* Optional Elapsed Ticker & Minimum Duration hint */}
            {showElapsed && typeof elapsedSeconds === 'number' && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-gold-400/60 pt-1">
                <span>{elapsedSeconds.toFixed(1)}s elapsed</span>
                {minDurationSeconds ? (
                  <span>• (min {minDurationSeconds}s)</span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ─── 1. FULL-SCREEN BLURRED OVERLAY ───
  // The underlying page remains visible and is heavily blurred (16px), while the loader is razor-sharp
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-300 animate-in fade-in select-none"
        style={{
          WebkitBackdropFilter: 'blur(16px)',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(26, 7, 25, 0.40)',
        }}
      >
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  // ─── 2. RELATIVE / IN-CONTAINER BLURRED OVERLAY ───
  // Overlays a parent container with blurred background, keeping the loader sharp
  if (overlay) {
    return (
      <div
        className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden transition-all duration-300 animate-in fade-in select-none rounded-[inherit]"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(26, 7, 25, 0.40)',
        }}
      >
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  // ─── 3. INLINE FROSTED GLASS CARD MODE ───
  if (blurBackground) {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-3xl p-8 sm:p-12 backdrop-blur-md bg-plum-950/40 border border-gold-500/20 shadow-card transition-all duration-300"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  return content;
};

export default KalptaruLoader;
