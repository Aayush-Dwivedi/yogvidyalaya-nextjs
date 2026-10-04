import React from 'react';
import { cn } from '../utils/cn';

export type BadgeVariant = 'gold' | 'plum' | 'earth' | 'neutral' | 'dark' | 'success' | 'warning';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'gold',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-sans tracking-wide uppercase select-none rounded-[2px] transition-colors';

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold tracking-wide-editorial',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium tracking-wide-editorial',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    gold: 'bg-gold-50 text-gold-800 border border-gold-300/80',
    plum: 'bg-plum-100 text-plum-900 border border-plum-200/80',
    earth: 'bg-earth-100 text-earth-700 border border-earth-200/80',
    neutral: 'bg-surface-subtle text-ink-muted border border-border',
    dark: 'bg-plum-900 text-gold-200 border border-gold-400/30',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-300/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-300/80',
  };

  const dotColor: Record<BadgeVariant, string> = {
    gold: 'bg-gold-600',
    plum: 'bg-plum-700',
    earth: 'bg-earth-600',
    neutral: 'bg-ink-muted',
    dark: 'bg-gold-300',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor[variant])} />}
      <span>{children}</span>
    </span>
  );
};
