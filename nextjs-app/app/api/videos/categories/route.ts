import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { VideoService } from '@/lib/services/video.service';
import { createVideoCategorySchema } from '@/lib/validators/video.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const categories = await VideoService.getCategories();
    return ApiResponse.success(categories);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const data = createVideoCategorySchema.body.parse(body);

    const created = await VideoService.createCategory(data as any);
    return ApiResponse.created(created, 'Video category created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
