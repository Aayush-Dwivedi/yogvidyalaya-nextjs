import React from 'react';
import { cn } from '../utils/cn';

export interface KalptaruLogoProps {
  /**
   * Numeric size in pixels for the circular emblem or image
   */
  size?: number;
  /**
   * Include the official Institute of Classical Yoga text label
   */
  withText?: boolean;
  /**
   * Color theme variant for text label
   */
  variant?: 'light' | 'dark';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * If true, renders only the image without container wrapping
   */
  imageOnly?: boolean;
  /**
   * Custom alt attribute
   */
  alt?: string;
}

export const KalptaruLogo: React.FC<KalptaruLogoProps> = ({
  size = 40,
  withText = false,
  variant = 'light',
  className,
  imageOnly = false,
  alt = 'Kalptaruu Yoga Vidhyalaya Logo',
}) => {
  const logoImage = (
    <img
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn(
        'rounded-full object-cover shrink-0 select-none shadow-soft transition-transform group-hover:scale-105',
        className
      )}
      loading="eager"
    />
  );

  if (imageOnly || !withText) {
    return logoImage;
  }

  const isLight = variant === 'light';

  return (
    <div className={cn('flex items-center space-x-3 select-none group', className)}>
      {logoImage}
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            'font-editorial text-lg sm:text-xl font-normal tracking-wide transition-colors',
            isLight
              ? 'text-plum-900 group-hover:text-plum-800'
              : 'text-ivory group-hover:text-gold-200'
          )}
        >
          Kalptaruu Yoga Vidhyalaya
        </span>
        <span
          className={cn(
            'text-[9px] uppercase tracking-widest-editorial font-semibold',
            isLight ? 'text-gold-700' : 'text-gold-400'
          )}
        >
          Institute of Classical Yoga
        </span>
      </div>
    </div>
  );
};

export default KalptaruLogo;
