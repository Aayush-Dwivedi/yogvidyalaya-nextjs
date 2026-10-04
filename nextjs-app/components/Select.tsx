import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      id,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs uppercase tracking-wide-editorial text-ink-muted font-semibold"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-surface text-charcoal font-sans text-sm rounded-[2px] transition-all duration-150',
              'border border-border py-2.5 pl-3.5 pr-9 appearance-none cursor-pointer',
              'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50',
              'disabled:bg-surface-subtle disabled:text-ink-faint disabled:cursor-not-allowed',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Antique Gold subtle dropdown chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gold-600">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && <p className="text-xs text-rose-700 font-sans mt-1">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-ink-faint font-sans mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
