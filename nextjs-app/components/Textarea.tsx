import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs uppercase tracking-wide-editorial text-ink-muted font-semibold"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full bg-surface text-charcoal font-sans text-sm rounded-[2px] transition-all duration-150',
            'border border-border py-2.5 px-3.5 placeholder:text-ink-faint/70 resize-y',
            'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50',
            'disabled:bg-surface-subtle disabled:text-ink-faint disabled:cursor-not-allowed',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
            className
          )}
          {...props}
        />

        {error && <p className="text-xs text-rose-700 font-sans mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-ink-faint font-sans mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
