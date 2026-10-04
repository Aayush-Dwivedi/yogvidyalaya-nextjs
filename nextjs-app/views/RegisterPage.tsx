'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !phone || !password || !confirmPassword) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      await register({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });
      router.replace('/dashboard');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-canvas flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 bg-surface p-8 sm:p-10 rounded-sm border border-border shadow-card relative overflow-hidden">
        {/* Decorative subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-plum-700 via-gold-500 to-plum-900" />

        <div className="text-center space-y-2">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-widest-editorial text-gold-600">
            Student Enrollment
          </span>
          <h2 className="font-editorial text-3xl font-bold tracking-tight text-plum-900">
            Join Kalptaru Yog Vidyalaya
          </h2>
          <p className="text-xs text-ink-muted max-w-sm mx-auto leading-relaxed">
            Create your sadhaka account to enroll in classical certification courses and reserve shala practice sessions.
          </p>
        </div>

        {(localError || error) && (
          <div className="p-3.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-snug">{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="e.g. Radhika Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            leftIcon={<UserIcon className="w-4 h-4 text-ink-faint" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. radhika@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4 text-ink-faint" />}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            leftIcon={<Phone className="w-4 h-4 text-ink-faint" />}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 characters with numbers & uppercase"
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

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4 text-ink-faint" />}
          />

          <div className="text-[11px] text-ink-muted leading-relaxed pt-1">
            By registering, you agree to uphold the ashram etiquette, classical discipline guidelines, and{' '}
            <Link href="/terms" className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
              Terms of Study
            </Link>
            .
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Student Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-border/80 text-center">
          <p className="text-xs text-ink-muted">
            Already registered as a student?{' '}
            <Link
              href="/login"
              className="text-gold-600 hover:text-gold-700 font-semibold underline underline-offset-2 ml-1"
            >
              Sign In to Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
