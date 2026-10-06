import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { CourseService } from '@/lib/services/course.service';
import { createCourseSchema } from '@/lib/validators/course.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/courses — public list
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = {
      status: searchParams.get('status') || 'published',
      featured: searchParams.get('featured') || undefined,
      level: searchParams.get('level') || undefined,
      mode: searchParams.get('mode') || undefined,
      search: searchParams.get('search') || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
      sort: searchParams.get('sort') || undefined,
    };
    const result = await CourseService.getCourses(query as any);
    const res = ApiResponse.paginated(result.items, result.meta, 'Courses retrieved');
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/courses — admin only
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const parsed = createCourseSchema.body.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const details = Object.entries(fieldErrors)
        .map(([k, v]) => `${k}: ${v?.join(', ')}`)
        .join('; ');
      return ApiResponse.badRequest(`Validation failed: ${details}`, fieldErrors);
    }

    const course = await CourseService.createCourse(parsed.data as any);
    return ApiResponse.created(course, 'Course created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
