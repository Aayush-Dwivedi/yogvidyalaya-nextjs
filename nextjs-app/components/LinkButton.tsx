import React from 'react';
import Link from 'next/link';
import { ButtonVariant, ButtonSize } from './Button';
import { cn } from '../utils/cn';

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isExternal?: boolean;
  withArrow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  href,
  variant = 'primary',
  size = 'md',
  isExternal = false,
  withArrow = false,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) => {
  const targetHref = href || to || '/';

  const baseStyles =
    'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 select-none rounded-[2px] group';

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

  const combinedClasses = cn(
    baseStyles,
    variant !== 'text' && sizeStyles[size],
    variantStyles[variant],
    className
  );

  const arrowElement = withArrow && (
    <svg
      className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 8H13.5M13.5 8L8.5 3M13.5 8L8.5 13"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const content = (
    <>
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      {arrowElement}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={targetHref}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={targetHref} className={combinedClasses} {...props}>
      {content}
    </Link>
  );
};
