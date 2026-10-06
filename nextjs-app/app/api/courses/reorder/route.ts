import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { CourseService } from '@/lib/services/course.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

async function handleReorder(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    await CourseService.reorderCourses(body);
    return ApiResponse.success(null, 'Courses reordered successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest) {
  return handleReorder(request);
}

export async function POST(request: NextRequest) {
  return handleReorder(request);
}
