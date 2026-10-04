import React from 'react';
import { cn } from '../utils/cn';
import { LotusMotif } from './Motifs';

export interface EmptyStateProps {
  title: string;
  description?: string;
  motif?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  motif,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[2px] bg-canvas-warm border border-border/80 max-w-lg mx-auto',
        className
      )}
    >
      <div className="mb-4 text-gold-500 opacity-80">
        {motif || <LotusMotif size={56} />}
      </div>

      <h3 className="text-xl sm:text-2xl font-editorial font-normal text-plum-900 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans max-w-sm mb-6">
          {description}
        </p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
};
