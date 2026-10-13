import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { HomeService } from '@/lib/services/home.service';
import { HomePage } from '@/views/HomePage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: {
    absolute: 'Kalptaruu Yoga Vidhyalaya — Ancient Wisdom, Modern Journey',
  },
  description:
    'Authentic yoga courses, immersive workshops, and traditional sadhana rooted in ancient Indian yogic science.',
  pathname: '/',
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialHomeData: any = null;
  try {
    await connectDB();
    const data = await HomeService.getHomeContent();
    if (data) {
      initialHomeData = JSON.parse(JSON.stringify(data));
    }
  } catch (err) {
    console.warn('Could not SSR homepage data:', err);
  }

  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getWebSiteSchema()} />
      <HomePage
        initialData={initialHomeData || undefined}
        initialHeroSlides={initialHomeData?.heroSlides || undefined}
      />
    </>
  );
}

