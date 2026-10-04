import React from 'react';
import { cn } from '../utils/cn';

export type ContainerSize = 'prose' | 'narrow' | 'default' | 'wide' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  clean?: boolean; // disables default x-padding if needed
}

export const Container: React.FC<ContainerProps> = ({
  className,
  size = 'default',
  clean = false,
  children,
  ...props
}) => {
  const sizeStyles: Record<ContainerSize, string> = {
    prose: 'max-w-3xl',
    narrow: 'max-w-4xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full',
        !clean && 'px-4 sm:px-6 md:px-8 lg:px-12',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
