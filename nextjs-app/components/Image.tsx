'use client';

import React, { useState } from 'react';
import { cn } from '../utils/cn';

export type AspectRatio = 'square' | 'video' | 'portrait' | 'editorial' | 'wide' | 'auto';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: AspectRatio;
  caption?: string;
  priority?: boolean;
  bordered?: boolean;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio = 'auto',
  caption,
  priority = false,
  bordered = false,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectStyles: Record<AspectRatio, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    editorial: 'aspect-[4/5]',
    wide: 'aspect-[21/9]',
    auto: '',
  };

  return (
    <figure className={cn('relative overflow-hidden group', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-surface-subtle',
          bordered && 'border border-gold-400/40 p-1',
          aspectStyles[aspectRatio]
        )}
      >
        {/* Placeholder / Shimmer state before image loads */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-surface-subtle animate-pulse" />
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas-warm text-ink-muted p-4 text-center">
            <svg
              className="w-8 h-8 text-gold-400 mb-2 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.2" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.2" />
              <polyline points="21 15 16 10 5 21" strokeWidth="1.2" />
            </svg>
            <span className="text-xs font-serif italic text-ink-faint">Image unavailable</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              'w-full h-full object-cover transition-all duration-500 ease-out',
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            )}
            {...props}
          />
        )}
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-xs text-ink-muted font-sans font-light italic tracking-wide text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
