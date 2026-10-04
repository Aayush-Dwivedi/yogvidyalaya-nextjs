import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:opacity-50 disabled:pointer-events-none select-none rounded-[2px]';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 font-medium',
      md: 'text-sm px-5 py-2.5 gap-2 font-medium',
      lg: 'text-base px-7 py-3.5 gap-2.5 font-medium',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-plum-900 text-gold-200 border border-plum-950/40 hover:bg-plum-800 hover:text-gold-100 hover:shadow-soft active:translate-y-[0.5px]',
      secondary:
        'bg-canvas text-plum-900 border border-gold-500/70 hover:bg-gold-50 hover:border-gold-600 active:translate-y-[0.5px]',
      outline:
        'bg-transparent text-charcoal border border-border hover:border-gold-500/60 hover:text-plum-900 hover:bg-surface-subtle',
      ghost:
        'bg-transparent text-charcoal hover:bg-plum-100/50 hover:text-plum-900',
      text:
        'bg-transparent text-plum-900 underline underline-offset-4 decoration-gold-400/80 hover:decoration-gold-600 hover:text-plum-950 px-0 py-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variant !== 'text' && sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Please wait...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
