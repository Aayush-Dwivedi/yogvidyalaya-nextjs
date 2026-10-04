import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  'aria-label': string; // Required for accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:opacity-40 disabled:pointer-events-none rounded-[2px]';

    const sizeStyles: Record<IconButtonSize, string> = {
      sm: 'w-7 h-7 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-11 h-11 text-base',
    };

    const variantStyles: Record<IconButtonVariant, string> = {
      primary: 'bg-plum-900 text-gold-200 hover:bg-plum-800 shadow-soft',
      secondary: 'bg-canvas text-plum-900 border border-gold-400/80 hover:bg-gold-50',
      outline: 'bg-transparent text-charcoal border border-border hover:border-gold-500/60 hover:text-plum-900',
      ghost: 'bg-transparent text-charcoal hover:bg-plum-100/50 hover:text-plum-900',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
