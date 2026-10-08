'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { ProgramsSection } from '../sections/home/ProgramsSection';

export const ProgramsPage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If someone arrived via an old bookmark or link with #trainers, redirect directly to /trainers
      if (window.location.hash.toLowerCase().includes('trainer')) {
        window.location.replace('/trainers');
        return;
      }
      if (window.location.hash) {
        const el = document.getElementById(window.location.hash.replace('#', ''));
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    }
  }, []);

  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* Breadcrumb Header */}
      <div className="bg-canvas-warm border-b border-border py-4">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center space-x-2 text-xs font-mono tracking-widest uppercase">
            <Link href="/" className="hover:text-gold-600 transition-colors text-ink-muted">
              Home
            </Link>
            <span className="text-gold-500/60">/</span>
            <span className="text-gold-800 font-semibold">Programs</span>
          </nav>
        </Container>
      </div>

      {/* Main Programs Section (Trainers has its own dedicated page at /trainers) */}
      <ProgramsSection showTrainers={false} />
    </div>
  );
};

export default ProgramsPage;
