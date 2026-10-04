import React from 'react';
import { cn } from '../utils/cn';

export type SectionHeaderAlign = 'left' | 'center' | 'asymmetric';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: SectionHeaderAlign;
  motif?: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  motif,
  action,
  className,
  ...props
}) => {
  if (align === 'asymmetric') {
    return (
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 lg:mb-16',
          className
        )}
        {...props}
      >
        <div className="lg:col-span-7">
          {motif && <div className="mb-3 text-gold-500">{motif}</div>}
          {eyebrow && (
            <span className="block text-xs uppercase tracking-widest-editorial text-gold-600 font-semibold mb-2">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-plum-900 leading-[1.15]">
            {title}
          </h2>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-end space-y-4">
          {description && (
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans font-light">
              {description}
            </p>
          )}
          {action && <div className="pt-2">{action}</div>}
        </div>
      </div>
    );
  }

  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'mb-10 lg:mb-14',
        isCenter ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl',
        className
      )}
      {...props}
    >
      {motif && (
        <div className={cn('mb-3 text-gold-500', isCenter && 'flex justify-center')}>
          {motif}
        </div>
      )}
      {eyebrow && (
        <span className="block text-xs uppercase tracking-widest-editorial text-gold-600 font-semibold mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-plum-900 leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed font-sans font-light">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
