'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type ToastType = 'info' | 'success' | 'error' | 'gold';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastFn {
  (options: ToastOptions): void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  gold: (title: string, message?: string, duration?: number) => void;
}

interface ToastContextValue {
  toast: ToastFn;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'gold', title, message, duration = 4500 }: ToastOptions) => {
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

  const toast = Object.assign(showToast, {
    success: (title: string, message?: string, duration?: number) =>
      showToast({ type: 'success', title, message, duration }),
    error: (title: string, message?: string, duration?: number) =>
      showToast({ type: 'error', title, message, duration }),
    info: (title: string, message?: string, duration?: number) =>
      showToast({ type: 'info', title, message, duration }),
    gold: (title: string, message?: string, duration?: number) =>
      showToast({ type: 'gold', title, message, duration }),
  });

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
            className="fixed top-5 right-5 z-[9999] flex flex-col space-y-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
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
  const typeConfig: Record<
    ToastType,
    { border: string; bg: string; icon: React.ReactNode; titleColor: string }
  > = {
    gold: {
      border: 'border-gold-400/50 bg-amber-950/95 text-amber-100',
      bg: 'shadow-gold-950/30',
      icon: <Sparkles className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />,
      titleColor: 'text-gold-200',
    },
    info: {
      border: 'border-plum-500/40 bg-plum-950/95 text-plum-100',
      bg: 'shadow-plum-950/30',
      icon: <Info className="w-5 h-5 text-gold-300 shrink-0 mt-0.5" />,
      titleColor: 'text-plum-100',
    },
    success: {
      border: 'border-emerald-500/50 bg-emerald-950/95 text-emerald-100',
      bg: 'shadow-emerald-950/40',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-200',
    },
    error: {
      border: 'border-rose-500/50 bg-rose-950/95 text-rose-100',
      bg: 'shadow-rose-950/40',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-200',
    },
  };

  const current = typeConfig[item.type];

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-xl p-4 shadow-2xl backdrop-blur-md border animate-in fade-in slide-in-from-top-3 flex items-start gap-3 transition-all duration-300',
        current.border,
        current.bg
      )}
      role="alert"
    >
      {current.icon}

      <div className="flex-1 space-y-0.5">
        <h4 className={cn('text-sm font-semibold tracking-wide font-sans', current.titleColor)}>
          {item.title}
        </h4>
        {item.message && (
          <p className="text-xs text-white/80 leading-relaxed font-sans">{item.message}</p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="text-white/60 hover:text-white p-1 rounded transition-colors -mr-1 -mt-1"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

