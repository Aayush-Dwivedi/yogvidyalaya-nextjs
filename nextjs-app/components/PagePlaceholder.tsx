import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { SectionHeader } from './SectionHeader';
import { LinkButton } from './LinkButton';
import { LotusMotif } from './Motifs';

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
    <div className="relative py-16 sm:py-24 overflow-hidden">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-plum-900 transition-colors">
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="text-gold-500/80">/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-plum-900 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-plum-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Section Header */}
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
          motif={<LotusMotif size={36} />}
        />

        {/* Content Card */}
        <div className="bg-surface border border-gold-300/40 p-8 rounded-[2px] shadow-card max-w-2xl mt-8">
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans mb-6">
            {phaseNotice ||
              'Welcome to Kalptaru Yog Vidyalaya. Dedicated to authentic yogic science and holistic wellness. Experience traditional yoga practices for modern living.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
            <LinkButton href="/" variant="secondary" size="sm">
              Return Home
            </LinkButton>
            <LinkButton href="/courses" variant="outline" size="sm">
              Explore Courses
            </LinkButton>
            <LinkButton href="/contact" variant="text" size="sm">
              Contact Vidyalaya
            </LinkButton>
          </div>
        </div>
      </Container>
    </div>
  );
};
