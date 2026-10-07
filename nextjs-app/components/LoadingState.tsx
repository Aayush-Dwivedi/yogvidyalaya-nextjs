import React from 'react';
import { cn } from '../utils/cn';

export interface LoadingStateProps {
  message?: string;
  variant?: 'tree' | 'spinner' | 'minimal';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  variant = 'tree',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {variant === 'tree' && (
        <div className="relative mb-4">
          <img
            src="/logo.png"
            alt="Kalptaruu Logo"
            className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/60 shadow-soft animate-pulse"
          />
          <div className="absolute inset-0 rounded-full border border-gold-300/40 animate-ping opacity-25 pointer-events-none" />
        </div>
      )}

      {variant === 'spinner' && (
        <div className="relative mb-4">
          <svg
            className="animate-spin h-8 w-8 text-gold-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {variant === 'minimal' && (
        <div className="flex space-x-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      <p className="text-xs uppercase tracking-widest-editorial text-ink-muted font-medium">
        {message}
      </p>
    </div>
  );
};

/**
 * Editorial Skeleton Shimmer for card and text placeholders
 */
export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-surface-subtle animate-pulse rounded-[2px] border border-border/50',
        className
      )}
      {...props}
    />
  );
};
