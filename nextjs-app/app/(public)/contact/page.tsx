import type { Metadata } from 'next';
import { ContactPage } from '@/views/ContactPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact Us',
  description:
    'Contact Kalptaruu Yoga Vidhyalaya for course enquiries, admissions, retreat details, and ashram visits.',
  pathname: '/contact',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Contact Us', path: '/contact' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <ContactPage />
    </>
  );
}

