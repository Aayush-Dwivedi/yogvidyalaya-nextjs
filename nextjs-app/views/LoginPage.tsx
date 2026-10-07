'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
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
        setLocalError('Access restricted: Only administrative accounts are permitted.');
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setLocalError(errObj?.message || 'Login failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 px-6 sm:px-8 overflow-hidden animate-auric-canvas text-ivory select-none">
      {/* ─── LIVING ANIMATED BASE CANVAS OVERLAY ─── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-plum-950/70 via-transparent to-plum-950/85 pointer-events-none" />

      {/* ─── VIBRANT ANIMATED GRADIENT AURAS (LOGO GOLDEN #DAA53B & LOGO PURPLE #2A0725) ─── */}
      <div className="absolute -top-[15%] left-[10%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(218,165,59,0.32)_0%,rgba(218,165,59,0.15)_40%,transparent_75%)] blur-3xl animate-aura-1 pointer-events-none" />
      <div className="absolute -bottom-[15%] right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(42,7,37,0.85)_0%,rgba(26,7,25,0.60)_45%,transparent_80%)] blur-3xl animate-aura-2 pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(225,180,85,0.25)_0%,rgba(218,165,59,0.10)_45%,transparent_75%)] blur-3xl animate-aura-3 pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo and Emblem */}
        <div className="flex justify-center mb-4">
          <Link href="/" className="inline-block hover:scale-105 transition-transform group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Kalptaruu Yoga Vidhyalaya Emblem"
                className="w-16 h-16 rounded-full object-cover shadow-modal ring-2 ring-gold-400/50 group-hover:ring-gold-300 transition-all"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-400/20 to-plum-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </Link>
        </div>

        <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 drop-shadow-sm">
          Admin Sign In
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gold-200/80 font-sans font-light">
          Administrative access for Kalptaruu Yoga Vidhyalaya management
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative bg-[#1A0719]/85 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-2xl border border-gold-400/35 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(218,165,59,0.15)] space-y-6 overflow-hidden">
          
          {/* Top Animated Pure Gold Shimmer Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] auric-border-glow" />

          {(localError || error) && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-400/40 text-rose-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wide-editorial text-gold-300 font-semibold">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gold-400/80 pointer-events-none flex items-center">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="e.g. admin@kalptaruyogvidyalaya.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#2A0725]/60 text-gold-100 placeholder:text-gold-200/40 font-sans text-sm rounded-lg border border-gold-400/30 py-2.5 pl-10 pr-3.5 transition-all focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wide-editorial text-gold-300 font-semibold">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gold-400/80 pointer-events-none flex items-center">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#2A0725]/60 text-gold-100 placeholder:text-gold-200/40 font-sans text-sm rounded-lg border border-gold-400/30 py-2.5 pl-10 pr-10 transition-all focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gold-400/80 hover:text-gold-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-plum-950 font-sans font-semibold text-sm hover:from-gold-200 hover:to-gold-300 transition-all shadow-modal hover:shadow-[0_0_22px_rgba(218,165,59,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In to Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Secure Portal Notice */}
          <div className="text-center text-xs text-gold-200/70 pt-2 border-t border-gold-400/20 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Authorized administrative personnel only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
