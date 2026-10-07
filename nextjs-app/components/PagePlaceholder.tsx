import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { LinkButton } from './LinkButton';
import { LotusMotif } from './Motifs';
import { AuricBackground } from './AuricBackground';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PagePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  phaseNotice?: string;
}

export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({
  eyebrow,
  title,
  description,
  breadcrumbs,
  phaseNotice,
}) => {
  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* ─── 1. HERO HEADER WITH FEELABLE ANIMATED AURIC GRADIENT ─── */}
      <section className="relative py-20 sm:py-28 bg-plum-950 text-ivory overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono tracking-widest text-gold-400/80 uppercase">
              <Link href="/" className="hover:text-gold-300 transition-colors">
                Home
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-gold-500/60">/</span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-gold-300 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gold-200 font-semibold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            <div className="flex items-center space-x-3 pt-2">
              <LotusMotif size={24} className="text-gold-400 shrink-0" />
              <span className="w-8 h-px bg-gold-400" />
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                {eyebrow}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed max-w-2xl font-light">
              {description}
            </p>
          </div>
        </Container>
      </section>

      {/* ─── 2. CONTENT SECTION ─── */}
      <section className="py-16 sm:py-20 bg-canvas">
        <Container size="default">
          <div className="bg-surface border border-gold-300/40 p-8 sm:p-10 rounded-[3px] shadow-card max-w-2xl">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans mb-8">
              {phaseNotice ||
                'Welcome to Kalptaruu Yoga Vidhyalaya. Dedicated to authentic yogic science and holistic wellness. Experience traditional yoga practices for modern living.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border">
              <LinkButton href="/" variant="secondary" size="sm">
                Return Home
              </LinkButton>
              <LinkButton href="/programs/courses" variant="outline" size="sm">
                Explore Courses
              </LinkButton>
              <LinkButton href="/contact" variant="text" size="sm">
                Contact Vidhyalaya
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

