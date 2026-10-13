import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { InstituteService } from '@/lib/services/institute.service';
import { AboutPage } from '@/views/AboutPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'About Us',
  description:
    'Learn about Kalptaruu Yoga Vidhyalaya, our traditional yogic lineage, teaching sanctity, and holistic wellness philosophy.',
  pathname: '/about',
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialData: any = null;
  try {
    await connectDB();
    const inst = await InstituteService.getInstitute();
    if (inst) {
      initialData = JSON.parse(JSON.stringify(inst));
    }
  } catch (err) {
    console.warn('Could not SSR institute data:', err);
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <AboutPage initialData={initialData || undefined} />
    </>
  );
}

