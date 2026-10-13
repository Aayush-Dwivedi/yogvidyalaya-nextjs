import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { FounderService } from '@/lib/services/founder.service';
import { TrainersPage } from '@/views/TrainersPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Our Trainers & Faculty',
  description:
    'Meet our dedicated yoga teachers, faculty, and acharyas committed to traditional yogic instruction and personal guidance.',
  pathname: '/trainers',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Our Trainers & Faculty', path: '/trainers' },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialTrainers: any[] | null = null;
  try {
    await connectDB();
    const result = await FounderService.getFounders({ status: 'published', limit: 50 });
    if (result?.items) {
      initialTrainers = JSON.parse(JSON.stringify(result.items));
    }
  } catch (err) {
    console.warn('Could not SSR trainers data:', err);
  }

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <TrainersPage initialTrainers={initialTrainers !== null ? initialTrainers : undefined} />
    </>
  );
}



