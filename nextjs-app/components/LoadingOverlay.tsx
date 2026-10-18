'use client';

import React from 'react';
import { cn } from '../utils/cn';
import { KalptaruLoader, KalptaruLoaderProps } from './loader/KalptaruLoader';

export interface LoadingOverlayProps extends Omit<KalptaruLoaderProps, 'fullScreen' | 'overlay'> {
  /**
   * If true, blurs the wrapped children and displays the crisp, unblurred loading animation above.
   */
  isLoading: boolean;

  /**
   * Children components/content to be rendered and conditionally blurred in loading state.
   */
  children: React.ReactNode;

  /**
   * If true, overlays the entire viewport with blurred backdrop.
   * Default: false (overlays parent container)
   */
  fullScreen?: boolean;

  /**
   * Amount of blur applied to the background children.
   * Default: 'md'
   */
  blurAmount?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Optional container className
   */
  containerClassName?: string;
}

/**
 * LoadingOverlay: Wraps any UI component/section/page.
 * When `isLoading` is true, blurs the background content smoothly while keeping
 * the sacred Kalptaru loading animation razor-sharp and vibrant in the foreground.
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  fullScreen = false,
  blurAmount = 'md',
  containerClassName,
  message = 'Harmonizing breath & consciousness...',
  subMessage = 'Kalptaruu Yoga Vidhyalaya',
  size = 140,
  ...loaderProps
}) => {
  const blurClasses = {
    sm: 'blur-xs opacity-75',
    md: 'blur-sm sm:blur-md opacity-60',
    lg: 'blur-md sm:blur-lg opacity-50',
    xl: 'blur-lg sm:blur-xl opacity-40',
  }[blurAmount];

  if (fullScreen) {
    return (
      <>
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            isLoading && `${blurClasses} pointer-events-none select-none`,
            containerClassName
          )}
          aria-busy={isLoading}
          aria-hidden={isLoading ? 'true' : undefined}
        >
          {children}
        </div>
        {isLoading && (
          <KalptaruLoader
            fullScreen
            message={message}
            subMessage={subMessage}
            size={size}
            {...loaderProps}
          />
        )}
      </>
    );
  }

  return (
    <div className={cn('relative', containerClassName)} aria-busy={isLoading}>
      {/* Background Content - blurred when in loading state */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isLoading && `${blurClasses} pointer-events-none select-none`
        )}
        aria-hidden={isLoading ? 'true' : undefined}
      >
        {children}
      </div>

      {/* Loading Animation - crisp and unblurred in foreground */}
      {isLoading && (
        <KalptaruLoader
          overlay
          message={message}
          subMessage={subMessage}
          size={size}
          {...loaderProps}
        />
      )}
    </div>
  );
};

export default LoadingOverlay;
