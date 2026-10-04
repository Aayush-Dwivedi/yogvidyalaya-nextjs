'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginDemoStudent, loginDemoAdmin, isLoading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      const loggedUser = await login({ email, password });
      if (loggedUser.role === 'admin' || loggedUser.role === 'super_admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleStudentDemo = async () => {
    setLocalError(null);
    try {
      await loginDemoStudent();
      router.replace('/dashboard');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Student demo login failed.');
    }
  };

  const handleAdminDemo = async () => {
    setLocalError(null);
    try {
      await loginDemoAdmin();
      router.replace('/admin');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Admin demo login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo and Emblem */}
        <div className="flex justify-center mb-4">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Kalptaru Yog Vidyalaya Emblem"
              className="w-16 h-16 rounded-full object-cover border-2 border-gold-500 shadow-card"
            />
          </Link>
        </div>

        <h2 className="font-editorial text-3xl font-bold tracking-tight text-plum-900">
          Kalptaru Portal Sign In
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-ink-muted">
          Access your courses, shala bookings, and administrative modules
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 sm:rounded-[2px] sm:px-10 border border-border shadow-card space-y-6">
          {/* Quick Demo Logins Panel */}
          <div className="bg-canvas-warm border border-gold-500/30 rounded p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-plum-900 uppercase tracking-widest-editorial">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Instant Evaluator Logins</span>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Use pre-configured credentials to evaluate the student or admin portals immediately:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleStudentDemo}
                isLoading={isLoading}
                className="w-full text-xs"
              >
                Student Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAdminDemo}
                isLoading={isLoading}
                className="w-full text-xs border-plum-900/30 text-plum-900 hover:bg-plum-50"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gold-600" />
                Admin Demo
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-ink-faint">Or sign in with email</span>
            </div>
          </div>

          {(localError || error) && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. sadhaka@kalptaruyog.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4 text-ink-faint" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="w-4 h-4 text-ink-faint" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-ink-faint hover:text-ink transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-ink-muted">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border text-plum-900 focus:ring-gold-500"
                />
                <span>Remember me</span>
              </label>

              <span className="text-gold-700 hover:text-gold-900 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Kalptaru
            </Button>
          </form>

          {/* Registration Referral Footer */}
          <div className="text-center text-xs text-ink-muted pt-2 border-t border-border">
            <span>New to Kalptaru Yog Vidyalaya? </span>
            <Link
              href="/register"
              className="font-medium text-gold-700 hover:text-gold-900 underline underline-offset-2 ml-1"
            >
              Enroll as a Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
