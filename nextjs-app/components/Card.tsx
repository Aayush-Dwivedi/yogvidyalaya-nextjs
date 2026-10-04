import React from 'react';
import { cn } from '../utils/cn';

export type CardVariant = 'default' | 'bordered' | 'editorial' | 'plum' | 'muted';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  ...props
}) => {
  const baseStyles = 'relative rounded-[2px] transition-all duration-200 overflow-hidden';

  const paddingStyles = {
    none: '',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  }[padding];

  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-surface border border-border text-charcoal shadow-soft',
    bordered: 'bg-surface border border-gold-400/60 text-charcoal shadow-soft',
    editorial: 'bg-surface border-t-2 border-t-gold-500 border-x border-b border-border text-charcoal shadow-card',
    plum: 'bg-plum-900 border border-plum-950/60 text-ivory shadow-card',
    muted: 'bg-surface-subtle border border-border/80 text-charcoal',
  };

  const hoverStyles = hoverable
    ? 'hover:border-gold-500/80 hover:shadow-card hover:-translate-y-[1px]'
    : '';

  return (
    <div
      className={cn(baseStyles, paddingStyles, variantStyles[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('mb-4 space-y-1.5', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' | 'h5' }
> = ({ className, as: Component = 'h3', children, ...props }) => (
  <Component
    className={cn('text-xl sm:text-2xl font-editorial font-normal leading-snug', className)}
    {...props}
  >
    {children}
  </Component>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs sm:text-sm text-ink-muted leading-relaxed font-sans', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('space-y-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('mt-6 pt-4 border-t border-border flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
