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
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-ink-muted">
            <Link href="/" className="hover:text-plum-900 transition-colors">
              Home
            </Link>
            <span className="text-gold-500/80">/</span>
            <span className="text-plum-900 font-medium">Programs</span>
          </nav>
        </Container>
      </div>

      {/* Main Programs Section (Trainers has its own dedicated page at /trainers) */}
      <ProgramsSection showTrainers={false} />
    </div>
  );
};

export default ProgramsPage;
