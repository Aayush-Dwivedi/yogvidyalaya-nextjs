import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs uppercase tracking-wide-editorial text-ink-muted font-semibold"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-ink-faint pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-surface text-charcoal font-sans text-sm rounded-[2px] transition-all duration-150',
              'border border-border py-2.5 px-3.5 placeholder:text-ink-faint/70',
              'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50',
              'disabled:bg-surface-subtle disabled:text-ink-faint disabled:cursor-not-allowed',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-ink-faint flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-rose-700 font-sans mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-ink-faint font-sans mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
