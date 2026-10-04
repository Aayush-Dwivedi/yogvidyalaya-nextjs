import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { CourseService } from '@/lib/services/course.service';
import { createCourseSchema } from '@/lib/validators/course.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

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
    return ApiResponse.paginated(result.items, result.meta, 'Courses retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/courses — admin only
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession();

    const body = await request.json();
    const parsed = createCourseSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const course = await CourseService.createCourse(parsed.data as any);
    return ApiResponse.created(course, 'Course created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
