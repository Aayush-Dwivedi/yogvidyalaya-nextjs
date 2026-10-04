import React from 'react';
import { cn } from '../utils/cn';
import { OrnamentalDivider } from './Motifs';

export type DividerVariant = 'subtle' | 'gold' | 'ornamental' | 'vertical';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DividerVariant;
  spacing?: 'sm' | 'md' | 'lg' | 'none';
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'subtle',
  spacing = 'md',
  className,
  ...props
}) => {
  if (variant === 'ornamental') {
    return <OrnamentalDivider className={className} />;
  }

  const spacingClasses = {
    none: 'my-0',
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
  }[spacing];

  if (variant === 'vertical') {
    return (
      <div
        className={cn('inline-block w-px self-stretch bg-border min-h-[1.5rem]', className)}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  const variantStyles = {
    subtle: 'border-border',
    gold: 'border-gold-400/40',
  }[variant as 'subtle' | 'gold'];

  return (
    <hr
      className={cn('border-0 border-t w-full', spacingClasses, variantStyles, className)}
      role="separator"
      {...props}
    />
  );
};
