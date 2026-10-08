import { connectDB } from '@/lib/db/mongoose';
import { GalleryService } from '@/lib/services/gallery.service';
import { GalleryPage, DisplayPhoto } from '@/views/GalleryPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialPhotos: DisplayPhoto[] | null = null;
  let initialCategories: string[] | null = null;

  try {
    await connectDB();
    const [result, cats] = await Promise.all([
      GalleryService.getGalleryImages({ status: 'published', limit: 100 }),
      GalleryService.getCategories(),
    ]);

    if (result && result.items && result.items.length > 0) {
      initialPhotos = result.items.map((img: any, idx: number) => ({
        id: String(img._id || img.id || `img-${idx}`),
        title: String(img.title || 'Kalptaruu Moment'),
        caption: String(img.caption || img.description || ''),
        category: String(
          (typeof img.category === 'object' ? img.category?.name : img.category) || 'Tradition'
        ),
        image: String(
          (typeof img.image === 'string' ? img.image : img.image?.url) || ''
        ),
        date: img.createdAt ? new Date(img.createdAt).toLocaleDateString() : undefined,
      }));

      const uniqueCats = Array.from(new Set(initialPhotos.map((p) => p.category).filter(Boolean)));
      if (cats && cats.length > 0) {
        cats.forEach((c: any) => {
          if (c.name && !uniqueCats.includes(c.name)) uniqueCats.push(c.name);
        });
      }
      initialCategories = ['All', ...uniqueCats];
    }
  } catch (err) {
    console.warn('Could not SSR gallery:', err);
  }

  return (
    <GalleryPage
      initialPhotos={initialPhotos || undefined}
      initialCategories={initialCategories || undefined}
    />
  );
}
