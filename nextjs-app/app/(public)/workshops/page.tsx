import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { WorkshopService } from '@/lib/services/workshop.service';
import { WorkshopsPage } from '@/views/WorkshopsPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Yoga Workshops',
  description:
    'Participate in intensive yoga workshops, weekend immersions, and masterclasses conducted by experienced practitioners.',
  pathname: '/workshops',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Yoga Workshops', path: '/workshops' },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialWorkshops: any[] | null = null;
  try {
    await connectDB();
    const result = await WorkshopService.getWorkshops({ status: 'published', limit: 50 });
    if (result?.items) {
      initialWorkshops = JSON.parse(JSON.stringify(result.items));
    }
  } catch (err) {
    console.warn('Could not SSR workshops data:', err);
  }

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <WorkshopsPage initialWorkshops={initialWorkshops !== null ? initialWorkshops : undefined} />
    </>
  );
}



