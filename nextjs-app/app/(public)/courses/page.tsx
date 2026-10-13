import type { Metadata } from 'next';
import { connectDB } from '@/lib/db/mongoose';
import { CourseService } from '@/lib/services/course.service';
import { CoursesPage } from '@/views/CoursesPage';
import { createPageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = createPageMetadata({
  title: 'Yoga Courses',
  description:
    'Explore structured yoga courses, foundational study, and comprehensive yogic sadhana programs at Kalptaruu Yoga Vidhyalaya.',
  pathname: '/courses',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Yoga Courses', path: '/courses' },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  let initialCourses: any[] | null = null;
  try {
    await connectDB();
    const result = await CourseService.getCourses({ status: 'published', limit: 50 });
    if (result?.items) {
      initialCourses = JSON.parse(JSON.stringify(result.items));
    }
  } catch (err) {
    console.warn('Could not SSR courses data:', err);
  }

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <CoursesPage initialCourses={initialCourses !== null ? initialCourses : undefined} />
    </>
  );
}



