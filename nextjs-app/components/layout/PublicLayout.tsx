'use client';

import React from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { ScrollToTop } from '../ScrollToTop';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal selection:bg-plum-900 selection:text-gold-200">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
