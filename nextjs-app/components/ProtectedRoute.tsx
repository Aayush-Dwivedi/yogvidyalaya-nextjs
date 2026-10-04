'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from './LoadingState';
import { ShieldAlert, ArrowRight, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'student' | 'admin' | 'super_admin'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <LoadingState message="Connecting to Kalptaru Portal..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Role-based boundary enforcement
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6 text-ink">
        <div className="max-w-md w-full bg-surface border border-border p-8 rounded shadow-card space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl text-plum-900 font-bold">
            Administrative Access Restricted
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Your authenticated session (<strong className="text-plum-900">{user.email}</strong>, role: <span className="font-mono uppercase text-gold-700">{user.role}</span>) does not possess administrative clearance to access this area.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-plum-900 text-gold-200 rounded hover:bg-plum-800 transition-colors"
            >
              Return to Student Portal <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold border border-border rounded text-plum-900 hover:bg-surface-subtle transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" /> Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
