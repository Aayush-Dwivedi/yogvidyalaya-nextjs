'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

interface NavItemChild {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavItemChild[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    children: [
      { label: 'About Founder', href: '/about/founder', description: 'The visionary lineage and spiritual stewardship' },
      { label: 'About Institute', href: '/about/institute', description: 'Our heritage, philosophy, and learning sanctity' },
    ],
  },
  {
    label: 'Programs',
    children: [
      { label: 'Courses', href: '/programs/courses', description: 'Comprehensive certification and foundational study' },
      { label: 'Workshops', href: '/programs/workshops', description: 'Immersive weekend intensives and masterclasses' },
      { label: 'Corporate', href: '/programs/corporate', description: 'Workplace wellness and executive mindfulness' },
      { label: 'Membership', href: '/programs/membership', description: 'Ongoing daily practice and ashram access' },
      { label: 'Trainers', href: '/trainers', description: 'Our qualified faculty and instructors' },
      { label: 'Videos', href: '/videos', description: 'Discourses, guided sadhanas, and lectures' },
    ],
  },
  {
    label: 'Gallery',
    href: '/gallery',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Detect scroll position to alter header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileSubmenu = (label: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isRouteActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 text-ivory',
        isScrolled
          ? 'shadow-card py-3 sm:py-3.5 animate-auric-navbar backdrop-blur-md border-b border-gold-500/25'
          : pathname === '/'
            ? 'shadow-none py-4 sm:py-5 border-none bg-gradient-to-b from-[#1A0719]/90 via-[#1A0719]/40 to-transparent backdrop-blur-[2px]'
            : 'shadow-soft py-3.5 sm:py-4 animate-auric-navbar border-none'
      )}
    >
      {/* ─── SCROLLED BORDER GLOW ONLY (NO LINE BETWEEN HEADER AND HERO SECTION) ─── */}
      {isScrolled && (
        <div className="absolute bottom-0 inset-x-0 h-[1px] auric-border-glow opacity-85 pointer-events-none" />
      )}

      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between relative">
          {/* Brand Identity / Logo (Left) */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 rounded-[2px]"
            >
              <div className="relative shrink-0">
                <img
                  src="/logo.png"
                  alt="Kalptaruu Yoga Vidhyalaya Logo"
                  className="w-11 h-11 rounded-full object-cover shadow-soft ring-1 ring-gold-400/40 group-hover:ring-gold-300 group-hover:scale-[1.04] transition-all"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-400/20 to-plum-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-lg sm:text-xl text-white tracking-wide font-normal leading-tight group-hover:text-gold-200 transition-colors">
                  Kalptaruu Yoga Vidhyalaya
                </span>
                <span className="text-[9px] uppercase tracking-widest-editorial text-gold-400 font-semibold">
                  Traditional Yoga &amp; Wellness
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (DEAD CENTER OF HEADER) */}
          <nav className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-2 absolute left-1/2 -translate-x-1/2" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                const isOpen = activeDropdown === item.label;
                const isChildActive = item.children.some((child) => isRouteActive(child.href));

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium uppercase tracking-wide-editorial rounded-md transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 cursor-pointer',
                        isChildActive || isOpen
                          ? 'text-gold-300 font-semibold'
                          : 'text-white/90 hover:text-gold-300'
                      )}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={cn(
                          'w-3.5 h-3.5 text-gold-400 transition-transform duration-200',
                          isOpen && 'rotate-180 text-gold-300'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Animated Auric Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 w-72 pt-2 animate-fade-in z-50">
                        <div className="relative animate-auric-dropdown border border-gold-400/40 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(216,178,110,0.18)] rounded-[4px] p-2 space-y-1 overflow-hidden backdrop-blur-xl">
                          {/* Top Animated Pure Gold Shimmer Accent */}
                          <div className="absolute top-0 inset-x-0 h-[2px] auric-border-glow" />

                          {item.children.map((child) => {
                            const isCurrent = isRouteActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  'block px-3.5 py-2.5 rounded-[3px] transition-colors group',
                                  isCurrent
                                    ? 'bg-plum-950 border border-gold-400/40 text-gold-300 font-semibold'
                                    : 'text-white/90 hover:bg-plum-800/80 hover:text-gold-200'
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-sans text-xs tracking-wide font-medium">{child.label}</span>
                                  {isCurrent && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(216,178,110,0.8)] shrink-0" />
                                  )}
                                </div>
                                {child.description && (
                                  <p className="text-[11px] text-white/60 mt-0.5 leading-snug line-clamp-1 group-hover:text-gold-100/90">
                                    {child.description}
                                  </p>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isCurrent = isRouteActive(item.href!);
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={cn(
                    'px-3 py-2 text-xs font-sans uppercase tracking-wide-editorial rounded-md transition-colors relative',
                    isCurrent
                      ? 'text-gold-300 font-semibold'
                      : 'text-white/90 hover:text-gold-300'
                  )}
                >
                  <span>{item.label}</span>
                  {isCurrent && (
                    <span className="absolute bottom-0 inset-x-2.5 h-[2px] bg-gold-400 rounded-full shadow-[0_0_8px_rgba(216,178,110,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Navigation CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin') ? (
              <Link
                href="/admin"
                className="inline-flex items-center text-xs uppercase tracking-wide-editorial text-plum-950 font-semibold px-4 py-2 rounded-full bg-gold-400 hover:bg-gold-300 transition-colors shadow-soft"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-plum-950 bg-white hover:bg-gold-200 transition-all shadow-soft group cursor-pointer"
              >
                <span>Admissions</span>
                <svg
                  className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
            className="lg:hidden p-2 text-white hover:text-gold-300 hover:bg-gold-500/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Overlay with Living Auric Atmosphere */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-plum-950/60 backdrop-blur-md animate-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Content Panel with living auric animated gradient */}
          <nav
            className="relative animate-auric-drawer border-b border-gold-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-h-[calc(100vh-72px)] overflow-y-auto px-6 py-6 space-y-6 text-white backdrop-blur-xl"
          >
            {/* Top drawer accent glow */}
            <div className="absolute top-0 inset-x-0 h-[2px] auric-border-glow pointer-events-none" />

            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest-editorial text-gold-400 font-semibold block border-b border-gold-500/20 pb-1.5">
                Navigation
              </span>

              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  if (item.children) {
                    const isExpanded = !!mobileExpanded[item.label];
                    const isAnyChildActive = item.children.some((child) => isRouteActive(child.href));

                    return (
                      <div key={item.label} className="border-b border-white/10 py-1">
                        <button
                          type="button"
                          onClick={() => toggleMobileSubmenu(item.label)}
                          className={cn(
                            'flex items-center justify-between w-full py-2 text-sm font-sans tracking-wide text-left transition-colors cursor-pointer',
                            isAnyChildActive ? 'text-gold-300 font-semibold' : 'text-white/85 hover:text-gold-300'
                          )}
                        >
                          <span>{item.label}</span>
                          <svg
                            className={cn(
                              'w-4 h-4 text-gold-400 transition-transform duration-200',
                              isExpanded && 'rotate-180 text-gold-300'
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="pl-3 pr-1 py-1 space-y-2 border-l-2 border-gold-400/50 bg-plum-950/40 rounded-r-sm ml-2 mb-2 animate-fade-in">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  'block py-1.5 text-xs font-sans tracking-wide transition-colors',
                                  isRouteActive(child.href)
                                    ? 'text-gold-300 font-semibold'
                                    : 'text-white/70 hover:text-gold-200'
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href!}
                      className={cn(
                        'block py-2.5 text-sm font-sans tracking-wide border-b border-white/10 transition-colors',
                        isRouteActive(item.href!)
                          ? 'text-gold-300 font-semibold'
                          : 'text-white/85 hover:text-gold-300'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Navigation CTA */}
            <div className="pt-6 border-t border-gold-500/20 space-y-2.5">
              {isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin') ? (
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold text-plum-950 bg-gold-400 hover:bg-gold-300 transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-plum-950 bg-white hover:bg-gold-200 transition-colors"
                >
                  <span>Admissions Enquiry</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
