import type { Metadata } from 'next';
import { MembershipPage } from '@/views/MembershipPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Yoga Sadhana Membership',
  description:
    'Join our daily sadhana community with flexible yoga memberships, regular classes, and ashram access.',
  pathname: '/membership',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Yogic Membership', path: '/membership' },
];

export default function Page() {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <MembershipPage />
    </>
  );
}

