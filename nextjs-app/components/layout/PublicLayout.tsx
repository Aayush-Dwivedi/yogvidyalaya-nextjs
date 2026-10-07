'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { ScrollToTop } from '../ScrollToTop';
import { cn } from '../../utils/cn';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#1A0719] text-charcoal selection:bg-plum-900 selection:text-gold-200">
      <ScrollToTop />
      <Navbar />
      <main className={cn('flex-grow flex flex-col', !isHome && 'pt-[72px] sm:pt-[80px]')}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
