import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { FounderService } from '@/lib/services/founder.service';
import { FounderPage } from '@/views/FounderPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Our Founder',
  description:
    'Discover the visionary lineage, spiritual stewardship, and teachings of the founder of Kalptaruu Yoga Vidhyalaya.',
  pathname: '/about/founder',
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialFounder: any = null;
  try {
    await connectDB();
    const result = await FounderService.getFounders({ limit: 1, status: 'published' });
    if (result.items && result.items.length > 0) {
      initialFounder = JSON.parse(JSON.stringify(result.items[0]));
    }
  } catch (err) {
    console.warn('Could not SSR founder data:', err);
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Founder', path: '/about/founder' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <FounderPage initialData={initialFounder || undefined} />
    </>
  );
}


