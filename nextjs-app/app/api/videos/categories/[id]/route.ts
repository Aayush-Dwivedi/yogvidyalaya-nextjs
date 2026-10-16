import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { VideoService } from '@/lib/services/video.service';
import { updateVideoCategorySchema } from '@/lib/validators/video.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const category = await VideoService.getCategoryByIdOrSlug(id);
    return ApiResponse.success(category);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    const body = await request.json();
    const data = updateVideoCategorySchema.body.parse(body);

    const updated = await VideoService.updateCategory(id, data as any);
    return ApiResponse.success(updated, 'Video category updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await VideoService.deleteCategory(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
