import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { VideoService } from '@/lib/services/video.service';
import { extractYoutubeId } from '@/lib/utils/youtube';
import { VideosPage, NormalizedVideo } from '@/views/VideosPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Videos & Discourses',
  description:
    'Watch guided yoga sadhana practices, master discourses, and educational video sessions from Kalptaruu Yoga Vidhyalaya.',
  pathname: '/videos',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Videos & Discourses', path: '/videos' },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialVideos: NormalizedVideo[] | null = null;
  try {
    await connectDB();
    const result = await VideoService.getVideos({ status: 'published', limit: 100 });
    if (result?.items && Array.isArray(result.items)) {
      initialVideos = result.items
        .filter((v: any) => v && (v.status === undefined || v.status === 'published'))
        .map((v: any, idx: number) => {
          const yId = (v.youtubeVideoId && v.youtubeVideoId.length === 11)
            ? v.youtubeVideoId
            : extractYoutubeId(v.youtubeUrl || '') || '';
          return {
            id: String(v._id || v.id || `video-${idx}`),
            title: String(v.title || 'Classical Yoga Session'),
            youtubeId: yId,
            youtubeUrl: v.youtubeUrl,
            thumbnail:
              v.thumbnail?.url ||
              (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : ''),
            category: String(v.category || 'Discourse'),
            duration: String(v.duration || 'Session'),
            speaker: String(v.speaker || 'Mrs. Shuchi Mohan'),
            description: String(v.description || ''),
            featured: Boolean(v.featured),
            order: Number(v.order || 0),
            createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : undefined,
          };
        })
        .filter((v: any) => v.title && (v.youtubeId || v.thumbnail))
        .sort((a: any, b: any) => a.order - b.order);
    }
  } catch (err) {
    console.warn('Could not SSR videos data:', err);
  }

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <VideosPage initialVideos={initialVideos !== null ? initialVideos : undefined} />
    </>
  );
}



