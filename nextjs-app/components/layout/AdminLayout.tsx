'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Home,
  Building2,
  Users2,
  Sparkles,
  GraduationCap,
  CalendarDays,
  Briefcase,
  Award,
  Image,
  Video,
  Users,
  CalendarCheck,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminNavGroup {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: SubMenuItem[];
}

const ADMIN_NAVIGATION: AdminNavGroup[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Content',
    icon: FileText,
    children: [
      { name: 'Home', href: '/admin/content/homepage', icon: Home },
      { name: 'Institute', href: '/admin/content/institute', icon: Building2 },
      { name: 'Contact Details', href: '/admin/content/contact', icon: PhoneCall },
      { name: 'Founder', href: '/admin/content/founder', icon: Users2 },
      { name: 'Benefits', href: '/admin/content/benefits', icon: Sparkles },
      { name: 'Testimonials', href: '/admin/content/testimonials', icon: MessageSquare },
    ],
  },
  {
    name: 'Programs',
    icon: GraduationCap,
    children: [
      { name: 'Courses', href: '/admin/programs/courses', icon: GraduationCap },
      { name: 'Workshops', href: '/admin/programs/workshops', icon: CalendarDays },
      { name: 'Trainers', href: '/admin/programs/trainers', icon: Users },
      { name: 'Corporate', href: '/admin/programs/corporate', icon: Briefcase },
      { name: 'Memberships', href: '/admin/programs/membership', icon: Award },
    ],
  },
  {
    name: 'Media',
    icon: Image,
    children: [
      { name: 'Gallery', href: '/admin/media/gallery', icon: Image },
      { name: 'Videos', href: '/admin/media/videos', icon: Video },
    ],
  },
  {
    name: 'Bookings',
    href: '/admin/bookings',
    icon: CalendarCheck,
  },
  {
    name: 'Enquiries',
    href: '/admin/enquiries',
    icon: MessageSquare,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => ({
    Content: pathname.includes('/admin/content'),
    Programs: pathname.includes('/admin/programs'),
    Media: pathname.includes('/admin/media'),
  }));

  React.useEffect(() => {
    if (pathname.includes('/admin/content')) {
      setExpandedGroups((prev) => ({ ...prev, Content: true }));
    } else if (pathname.includes('/admin/programs')) {
      setExpandedGroups((prev) => ({ ...prev, Programs: true }));
    } else if (pathname.includes('/admin/media')) {
      setExpandedGroups((prev) => ({ ...prev, Media: true }));
    }
  }, [pathname]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const getBreadcrumbLabel = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.includes('/admin/content/homepage')) return 'Content / Home';
    if (pathname.includes('/admin/content/institute')) return 'Content / Institute';
    if (pathname.includes('/admin/content/founder')) return 'Content / Founder';
    if (pathname.includes('/admin/content/benefits')) return 'Content / Benefits';
    if (pathname.includes('/admin/programs/courses')) return 'Programs / Courses';
    if (pathname.includes('/admin/programs/workshops')) return 'Programs / Workshops';
    if (pathname.includes('/admin/programs/trainers')) return 'Programs / Trainers';
    if (pathname.includes('/admin/programs/corporate')) return 'Programs / Corporate';
    if (pathname.includes('/admin/programs/membership')) return 'Programs / Memberships';
    if (pathname.includes('/admin/media/gallery')) return 'Media / Gallery';
    if (pathname.includes('/admin/media/videos')) return 'Media / Videos';
    if (pathname.includes('/admin/bookings')) return 'Bookings';
    if (pathname.includes('/admin/enquiries')) return 'Enquiries';
    if (pathname.includes('/admin/settings')) return 'Settings';
    return 'Admin';
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F8F6F1] flex flex-col lg:flex-row text-ink font-sans">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#1C0D1B] border-b border-plum-900/50 px-4 py-3 flex items-center justify-between shadow-soft text-white shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gold-400 hover:text-white rounded focus:outline-none"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png"
              alt="Kalptaruu Yoga Vidhyalaya Logo"
              className="w-8 h-8 rounded-full object-cover shadow-xs shrink-0"
            />
            <div>
              <span className="font-editorial text-lg text-white font-bold leading-tight block">
                Kalptaruu Yoga Vidhyalaya
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-semibold">
                Admin
              </span>
            </div>
          </div>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-plum-950 bg-gold-400 hover:bg-gold-300 transition-colors shrink-0"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Live Site</span>
        </a>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-plum-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Administrative Sidebar (Desktop Fixed, Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1C0D1B] border-r border-plum-900/60 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 text-white ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Top Branding Header */}
          <div className="p-4 border-b border-plum-900/60 bg-[#150914] shrink-0">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center space-x-3 group">
                <img
                  src="/logo.png"
                  alt="Kalptaruu Yoga Vidhyalaya Logo"
                  className="w-9 h-9 rounded-full object-cover shadow-soft group-hover:scale-105 transition-transform shrink-0"
                />
                <div>
                  <h2 className="font-editorial text-base text-white font-bold leading-tight">
                    Kalptaruu Yoga
                  </h2>
                  <p className="text-[9px] uppercase font-mono tracking-widest text-gold-400 font-bold">
                    Admin
                  </p>
                </div>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1 text-gold-400 hover:text-white"
                aria-label="Close admin drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {ADMIN_NAVIGATION.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isDirectActive = item.href ? pathname === item.href : false;
              const isChildActive = hasChildren
                ? item.children!.some((child) => pathname === child.href)
                : false;
              const isExpanded = expandedGroups[item.name] ?? false;

              if (hasChildren) {
                return (
                  <div key={item.name} className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.name)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded transition-colors duration-150 ${
                        isChildActive
                          ? 'bg-plum-900/60 text-gold-400 font-semibold'
                          : 'text-zinc-300 hover:text-white hover:bg-plum-900/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 text-gold-500 shrink-0" />
                        <span className="tracking-wide">{item.name}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-150 ${
                          isExpanded ? 'rotate-180 text-gold-400' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="pl-6 pr-1 space-y-0.5 py-0.5">
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon;
                          const isSubActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center space-x-2 px-2.5 py-1.5 text-[11px] font-mono rounded transition-colors ${
                                isSubActive
                                  ? 'bg-gold-500/20 text-gold-300 font-semibold border-l-2 border-gold-400'
                                  : 'text-zinc-400 hover:text-white hover:bg-plum-900/30'
                              }`}
                            >
                              <ChildIcon className="w-3.5 h-3.5 shrink-0 text-gold-600" />
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded transition-colors duration-150 ${
                    isDirectActive
                      ? 'bg-gold-500 text-plum-950 font-bold shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-plum-900/40'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isDirectActive ? 'text-plum-950' : 'text-gold-500'}`} />
                    <span className="tracking-wide">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions: Logout */}
          <div className="p-3 border-t border-plum-900/60 bg-[#150914] space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 rounded border border-rose-900/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-border px-8 py-3.5 items-center justify-between shadow-soft shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium text-plum-900 font-mono">
              {getBreadcrumbLabel()}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-plum-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </a>
          </div>
        </header>

        {/* Workspace Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
