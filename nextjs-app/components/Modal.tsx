'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop with restrained blur */}
      <div
        className="fixed inset-0 bg-plum-950/60 backdrop-blur-[2px] transition-opacity animate-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-surface text-charcoal shadow-modal rounded-[2px] border-t-2 border-t-gold-500 border-x border-b border-border',
          'animate-fade-in p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto',
          sizeStyles,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/80">
          <div>
            {title && (
              <h3 id="modal-title" className="text-2xl font-editorial font-normal text-plum-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-ink-muted mt-1 font-sans">
                {description}
              </p>
            )}
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-ink-muted hover:text-plum-900"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>

        {/* Body Content */}
        <div className="space-y-4 font-sans text-sm text-charcoal">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
