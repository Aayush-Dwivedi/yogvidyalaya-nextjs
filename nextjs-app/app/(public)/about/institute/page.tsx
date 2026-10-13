import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { InstituteService } from '@/lib/services/institute.service';
import { FounderService } from '@/lib/services/founder.service';
import { InstitutePage } from '@/views/InstitutePage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'About the Institute',
  description:
    'Explore the heritage, tradition, and comprehensive learning sanctuary at Kalptaruu Yoga Vidhyalaya.',
  pathname: '/about/institute',
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialData: any = null;
  let initialFounder: any = null;
  try {
    await connectDB();
    const [inst, founderResult] = await Promise.all([
      InstituteService.getInstitute(),
      FounderService.getFounders({ limit: 1, status: 'published' }),
    ]);
    if (inst) {
      initialData = JSON.parse(JSON.stringify(inst));
    }
    if (founderResult.items && founderResult.items.length > 0) {
      initialFounder = JSON.parse(JSON.stringify(founderResult.items[0]));
    }
  } catch (err) {
    console.warn('Could not SSR institute data:', err);
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'About the Institute', path: '/about/institute' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <InstitutePage initialData={initialData || undefined} initialFounder={initialFounder || undefined} />
    </>
  );
}

