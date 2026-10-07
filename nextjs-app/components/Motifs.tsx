import React from 'react';
import { cn } from '../utils/cn';

interface MotifProps {
  className?: string;
  size?: number;
}

/**
 * Sacred Wish-Fulfilling Tree (Kalptaru) Emblem
 * Renders the official Kalptaruu Yoga Vidhyalaya logo emblem.
 */
export const KalptaruTree: React.FC<MotifProps> = ({ className, size = 64 }) => (
  <img
    src="/logo.png"
    alt="Kalptaruu Yoga Vidhyalaya Emblem"
    style={{ width: `${size}px`, height: `${size}px` }}
    className={cn(
      'rounded-full object-cover shrink-0 select-none shadow-xs inline-block',
      className
    )}
    loading="lazy"
  />
);

/**
 * Traditional Indian Line-Art Lotus Blossom
 * Subtle botanical geometry representing purity, consciousness, and elevation.
 */
export const LotusMotif: React.FC<MotifProps> = ({ className, size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('text-gold-500', className)}
    aria-hidden="true"
  >
    {/* Center petal */}
    <path
      d="M32 14 C32 14 26 26 26 38 C26 44 32 48 32 48 C32 48 38 44 38 38 C38 26 32 14 32 14 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="currentColor"
      fillOpacity="0.08"
    />
    {/* Left petal */}
    <path
      d="M26 38 C26 38 18 30 14 36 C10 42 16 46 22 47 C25 47.5 28 46 28 46"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    {/* Right petal */}
    <path
      d="M38 38 C38 38 46 30 50 36 C54 42 48 46 42 47 C39 47.5 36 46 36 46"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    {/* Base support arc */}
    <path
      d="M22 50 C26 53 38 53 42 50"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="32" cy="24" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Concentric Sacred Circle Motif
 * Fine meditative geometry for backdrops and section accents.
 */
export const SacredCircle: React.FC<MotifProps> = () => null;

/**
 * Ornamental Divider
 * Editorial hairline border with a center diamond / lotus emblem.
 */
export const OrnamentalDivider: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center justify-center my-8 w-full', className)}>
    <div className="h-px bg-gradient-to-r from-transparent via-gold-400/50 to-gold-400/80 flex-grow max-w-xs" />
    <div className="mx-4 flex items-center space-x-1.5 text-gold-500">
      <span className="w-1 h-1 rounded-full bg-gold-400" />
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <polygon points="8,1 15,8 8,15 1,8" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
      <span className="w-1 h-1 rounded-full bg-gold-400" />
    </div>
    <div className="h-px bg-gradient-to-l from-transparent via-gold-400/50 to-gold-400/80 flex-grow max-w-xs" />
  </div>
);

/**
 * Corner Flourish
 * Subtle fine gold corner ornament for editorial certificates, cards, or featured content.
 */
export const CornerFlourish: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position = 'top-left', className }) => {
  const rotationClass = {
    'top-left': '',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-gold-400/60 pointer-events-none', rotationClass, className)}
      aria-hidden="true"
    >
      <path d="M1 23V1H23" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
    </svg>
  );
};
