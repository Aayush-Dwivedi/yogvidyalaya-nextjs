import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { CourseService } from '@/lib/services/course.service';
import { updateCourseSchema } from '@/lib/validators/course.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// GET /api/courses/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const course = await CourseService.getCourseByIdOrSlug(id);
    return ApiResponse.success(course, 'Course retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}

// PATCH /api/courses/[id] — admin only
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateCourseSchema.body.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const details = Object.entries(fieldErrors)
        .map(([k, v]) => `${k}: ${v?.join(', ')}`)
        .join('; ');
      return ApiResponse.badRequest(`Validation failed: ${details}`, fieldErrors);
    }

    const course = await CourseService.updateCourse(id, parsed.data as any);
    return ApiResponse.success(course, 'Course updated');
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/courses/[id] — admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await params;
    await CourseService.deleteCourse(id);
    return ApiResponse.success(null, 'Course deleted');
  } catch (error) {
    return handleRouteError(error);
  }
}
