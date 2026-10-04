'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  UserCheck,
  GraduationCap,
  ShoppingBag,
  CalendarCheck,
  Sparkles,
  Award,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Badge } from '../Badge';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

const NAVIGATION_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    children: [
      {
        name: 'Manage Profile',
        href: '/dashboard/profile',
        icon: UserCheck,
      },
    ],
  },
  {
    name: 'My Courses',
    href: '/dashboard/courses',
    icon: GraduationCap,
  },
  {
    name: 'Purchases',
    href: '/dashboard/purchases',
    icon: ShoppingBag,
  },
  {
    name: 'Bookings',
    href: '/dashboard/bookings',
    icon: CalendarCheck,
  },
  {
    name: 'Workshop Schedule',
    href: '/dashboard/workshops',
    icon: Sparkles,
  },
  {
    name: 'Membership',
    href: '/dashboard/membership',
    icon: Award,
  },
  {
    name: 'Payment History',
    href: '/dashboard/payments',
    icon: Receipt,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const getPageTitle = () => {
    const path = pathname || '';
    if (path === '/dashboard') return 'Student Dashboard';
    if (path.includes('/dashboard/profile')) return 'Manage Profile';
    if (path.includes('/dashboard/courses')) return 'My Courses & Enrolments';
    if (path.includes('/dashboard/purchases')) return 'Purchases & Invoices';
    if (path.includes('/dashboard/bookings')) return 'Shala & Session Bookings';
    if (path.includes('/dashboard/workshops')) return 'Workshop Schedule';
    if (path.includes('/dashboard/membership')) return 'Current Membership';
    if (path.includes('/dashboard/payments')) return 'Payment History & Ledger';
    if (path.includes('/dashboard/settings')) return 'Account Settings';
    return 'Student Portal';
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'KY';

  return (
    <div className="min-h-screen bg-canvas flex flex-col lg:flex-row text-ink font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center justify-between shadow-soft">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-plum-900 hover:bg-surface-subtle rounded focus:outline-none focus:ring-1 focus:ring-gold-500"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png"
              alt="Kalptaru Yog Vidyalaya Logo"
              className="w-8 h-8 rounded-full object-cover border border-gold-500/60 shadow-soft"
            />
            <span className="font-editorial text-lg text-plum-900 font-bold">
              Student Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {user?.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-gold-500"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-plum-900 text-gold-400 font-semibold text-xs flex items-center justify-center border border-gold-500/40">
              {initials}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-plum-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Unified Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen lg:flex lg:flex-col ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Top: Logo & Title */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <img
                  src="/logo.png"
                  alt="Kalptaru Yog Vidyalaya Logo"
                  className="w-10 h-10 rounded-full object-cover border border-gold-500/60 shadow-soft group-hover:scale-105 transition-transform shrink-0"
                />
                <div>
                  <h2 className="font-editorial text-lg text-plum-900 font-bold leading-tight">
                    Kalptaru Yog
                  </h2>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-gold-600">
                    Student Portal
                  </p>
                </div>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1.5 text-ink-muted hover:text-plum-900"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Profile Card Snippet */}
            <div className="p-3 bg-canvas border border-border/70 rounded flex items-center gap-3">
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-gold-500 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-plum-900 text-gold-400 font-semibold text-sm flex items-center justify-center border border-gold-500/40 shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-plum-900 truncate">
                  {user?.name || 'Sadhaka Student'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="gold" size="sm" className="py-0 px-1.5 text-[10px]">
                    Student
                  </Badge>
                  <span className="text-[11px] text-ink-muted truncate">
                    {user?.city || 'Shala Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isChildActive = hasChildren
                ? item.children!.some((c) => pathname === c.href)
                : false;
              const isDirectActive = pathname === item.href;
              const isActive = isDirectActive || (hasChildren && isChildActive);

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex-1 flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded transition-colors duration-150 ${
                        isActive
                          ? 'bg-plum-900 text-gold-400 font-semibold shadow-soft'
                          : 'text-ink-muted hover:text-plum-900 hover:bg-surface-subtle'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="tracking-wide">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono bg-gold-500/20 text-gold-700 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        className={`p-2 hover:bg-surface-subtle text-ink-muted transition-transform ${
                          isDirectActive || isChildActive ? 'text-gold-500' : ''
                        } ${profileDropdownOpen ? 'rotate-180' : ''}`}
                        aria-label="Toggle profile sub-menu"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Sub-menu (Profile -> Manage Profile) */}
                  {hasChildren && profileDropdownOpen && (
                    <div className="pl-7 pr-1 space-y-1 py-1">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        const isSubActive = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center space-x-2.5 px-3 py-1.5 text-xs rounded transition-colors ${
                              isSubActive
                                ? 'text-gold-600 font-semibold bg-gold-50/60'
                                : 'text-ink-faint hover:text-plum-900 hover:bg-surface-subtle'
                            }`}
                          >
                            <ChildIcon className="w-3.5 h-3.5" />
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer: Return to Public Site & Sign Out */}
          <div className="p-4 border-t border-border space-y-2 bg-canvas/30">
            <Link
              href="/"
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-ink-muted hover:text-plum-900 hover:bg-surface-subtle rounded transition-colors"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-gold-600" />
                <span>Visit Main Vidyalaya</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border px-8 py-4 items-center justify-between shadow-soft">
          <div>
            <h1 className="font-editorial text-2xl text-plum-900 font-medium tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-ink-muted mt-0.5 font-sans">
              Welcome back, <span className="font-semibold text-plum-900">{user?.name}</span>. Dedicated to your holistic yogic sadhana.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-plum-900 transition-colors"
            >
              Visit Public Site <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Link>

            <div className="h-4 w-[1px] bg-border" />

            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-3 hover:opacity-85 transition-opacity"
            >
              <div className="text-right">
                <p className="text-xs font-semibold text-plum-900 leading-tight">
                  {user?.name}
                </p>
                <p className="text-[10px] text-ink-faint">
                  {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Acharya Admin' : 'Student Sadhaka'}
                </p>
              </div>
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-gold-500 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-plum-900 text-gold-400 font-semibold text-xs flex items-center justify-center border border-gold-500/40">
                  {initials}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Content Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
