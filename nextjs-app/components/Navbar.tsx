'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../utils/cn';
import { LinkButton } from './LinkButton';
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
      { label: 'Trainers', href: '/programs#trainers', description: 'Our qualified faculty and instructors' },
      { label: 'Videos', href: '/videos', description: 'Discourses, guided sadhanas, and lectures' },
    ],
  },
  {
    label: 'Gallery',
    children: [
      { label: 'Latest', href: '/gallery', description: 'Moments of sadhana, campus life, and celebrations' },
      { label: 'Events', href: '/gallery/events', description: 'Conferences, international yoga day, and retreats' },
    ],
  },
  {
    label: 'Contact',
    children: [
      { label: 'Get in Touch', href: '/contact', description: 'Campus location, direct email, and timings' },
      { label: 'Course Enquiry', href: '/contact/enquiry', description: 'Guidance on curriculum eligibility and admissions' },
    ],
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
      style={{ backgroundColor: '#FDFBF7' }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 border-b border-border bg-[#FDFBF7]',
        isScrolled
          ? 'shadow-card py-3 sm:py-3.5'
          : 'shadow-soft py-4 sm:py-4.5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Identity / Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 rounded-[2px]"
          >
            <img
              src="/logo.png"
              alt="Kalptaru Yog Vidyalaya Logo"
              className="w-11 h-11 rounded-full object-cover border border-gold-500/60 shadow-soft group-hover:scale-[1.04] transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-editorial text-lg sm:text-xl text-plum-900 tracking-wide font-normal leading-tight group-hover:text-plum-800 transition-colors">
                Kalptaru Yog Vidyalaya
              </span>
              <span className="text-[9px] uppercase tracking-widest-editorial text-gold-700 font-semibold">
                Traditional Yoga & Wellness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
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
                        'flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium uppercase tracking-wide-editorial rounded-[2px] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500',
                        isChildActive
                          ? 'text-plum-900 font-semibold'
                          : 'text-ink-muted hover:text-plum-900 hover:bg-surface-subtle/80'
                      )}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={cn(
                          'w-3.5 h-3.5 text-gold-600 transition-transform duration-200',
                          isOpen && 'rotate-180 text-plum-900'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 w-72 pt-2 animate-fade-in z-50">
                        <div className="bg-white border-t-2 border-t-gold-500 border border-border shadow-modal rounded-[2px] p-2 space-y-1">
                          {item.children.map((child) => {
                            const isCurrent = isRouteActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                   'block px-3.5 py-2.5 rounded-[2px] transition-colors group',
                                   isCurrent
                                     ? 'bg-plum-50 text-plum-950 font-medium'
                                     : 'text-ink hover:bg-canvas-warm hover:text-plum-950'
                                 )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-sans text-xs tracking-wide font-medium">{child.label}</span>
                                  {isCurrent && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-600 shrink-0" />
                                  )}
                                </div>
                                {child.description && (
                                  <p className="text-[11px] text-ink-muted mt-0.5 leading-snug line-clamp-1 group-hover:text-ink">
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
                    'px-3 py-2 text-xs font-sans uppercase tracking-wide-editorial rounded-[2px] transition-colors',
                    isCurrent
                      ? 'text-plum-900 font-semibold border-b border-gold-500'
                      : 'text-ink-muted hover:text-plum-900 hover:bg-surface-subtle/80'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Authentication / CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wide-editorial text-plum-900 font-semibold px-3 py-2 border border-gold-500/70 rounded bg-gold-50/60 hover:bg-gold-50 transition-colors shadow-soft"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Student Portal
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs uppercase tracking-wide-editorial text-plum-900 font-medium px-3 py-2 hover:text-plum-700 transition-colors"
                >
                  Login
                </Link>
                <LinkButton href="/register" variant="primary" size="sm">
                  Register
                </LinkButton>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
            className="lg:hidden p-2 text-plum-900 hover:text-plum-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 rounded-[2px]"
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

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-plum-950/40 backdrop-blur-sm animate-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Content Panel */}
          <nav
            style={{ backgroundColor: '#FDFBF7' }}
            className="relative bg-[#FDFBF7] border-b border-border shadow-modal max-h-[calc(100vh-72px)] overflow-y-auto px-6 py-6 space-y-6"
          >
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest-editorial text-gold-600 font-semibold block border-b border-border/60 pb-1.5">
                Navigation
              </span>

              <div className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  if (item.children) {
                    const isExpanded = !!mobileExpanded[item.label];
                    const isAnyChildActive = item.children.some((child) => isRouteActive(child.href));

                    return (
                      <div key={item.label} className="border-b border-border/50 py-1">
                        <button
                          type="button"
                          onClick={() => toggleMobileSubmenu(item.label)}
                          className={cn(
                            'flex items-center justify-between w-full py-2 text-sm font-sans tracking-wide text-left transition-colors',
                            isAnyChildActive ? 'text-plum-900 font-semibold' : 'text-charcoal'
                          )}
                        >
                          <span>{item.label}</span>
                          <svg
                            className={cn(
                              'w-4 h-4 text-gold-600 transition-transform duration-200',
                              isExpanded && 'rotate-180'
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="pl-3 pr-1 py-1 space-y-2 border-l border-gold-400/40 ml-2 mb-2 animate-fade-in">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  'block py-1.5 text-xs font-sans tracking-wide transition-colors',
                                  isRouteActive(child.href)
                                    ? 'text-plum-900 font-semibold'
                                    : 'text-ink-muted hover:text-plum-900'
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
                        'block py-2.5 text-sm font-sans tracking-wide border-b border-border/50 transition-colors',
                        isRouteActive(item.href!)
                          ? 'text-plum-900 font-semibold'
                          : 'text-charcoal hover:text-plum-900'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-6 border-t border-border space-y-2.5">
              {isAuthenticated && user ? (
                <LinkButton href="/dashboard" variant="primary" size="md" className="w-full">
                  Go to Student Portal
                </LinkButton>
              ) : (
                <>
                  <LinkButton href="/register" variant="primary" size="md" className="w-full">
                    Register as Student
                  </LinkButton>
                  <LinkButton href="/login" variant="secondary" size="md" className="w-full">
                    Student Login
                  </LinkButton>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
