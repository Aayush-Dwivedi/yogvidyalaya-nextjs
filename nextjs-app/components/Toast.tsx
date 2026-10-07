'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export type ToastType = 'info' | 'success' | 'error' | 'gold';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'gold', title, message, duration = 4500 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
            aria-live="polite"
          >
            {toasts.map((item) => (
              <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastCard: React.FC<{ item: ToastItem; onDismiss: () => void }> = ({ item, onDismiss }) => {
  const typeStyles: Record<ToastType, string> = {
    gold: 'border-l-4 border-l-gold-500 bg-surface border-y border-r border-gold-300/40 text-charcoal',
    info: 'border-l-4 border-l-plum-800 bg-surface border-y border-r border-border text-charcoal',
    success: 'border-l-4 border-l-emerald-600 bg-surface border-y border-r border-border text-charcoal',
    error: 'border-l-4 border-l-rose-700 bg-surface border-y border-r border-rose-200 text-charcoal',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-[2px] p-4 shadow-card animate-fade-in flex items-start justify-between gap-3',
        typeStyles[item.type]
      )}
      role="alert"
    >
      <div className="space-y-0.5">
        <h4 className="text-sm font-semibold tracking-wide text-plum-900 font-sans">
          {item.title}
        </h4>
        {item.message && (
          <p className="text-xs text-ink-muted leading-relaxed font-sans">{item.message}</p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="text-ink-faint hover:text-plum-900 p-1 transition-colors"
        aria-label="Dismiss notification"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
