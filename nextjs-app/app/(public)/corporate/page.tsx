import type { Metadata } from 'next';
import { CorporatePage } from '@/views/CorporatePage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Corporate Yoga & Wellness',
  description:
    'Workplace wellness programs, desk fatigue relief, ergonomics, and mindfulness sessions tailored for organizations.',
  pathname: '/corporate',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Corporate Yoga & Wellness', path: '/corporate' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <CorporatePage />
    </>
  );
}

