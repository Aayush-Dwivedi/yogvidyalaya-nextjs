import { connectDB } from '@/lib/db/mongoose';
import { HeroService } from '@/lib/services/hero.service';
import { HomePage } from '@/views/HomePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialHeroSlides: any[] | null = null;
  try {
    await connectDB();
    const slides = await HeroService.getHeroSlides(true);
    if (slides && slides.length > 0) {
      initialHeroSlides = JSON.parse(JSON.stringify(slides));
    }
  } catch (err) {
    console.warn('Could not SSR hero slides:', err);
  }

  return <HomePage initialHeroSlides={initialHeroSlides || undefined} />;
}
