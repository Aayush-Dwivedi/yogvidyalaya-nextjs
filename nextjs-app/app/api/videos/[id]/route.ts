import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { VideoService } from '@/lib/services/video.service';
import { updateVideoSchema } from '@/lib/validators/video.validator';
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
    const video = await VideoService.getVideoById(id);
    return ApiResponse.success(video);
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
    const data = updateVideoSchema.body.parse(body);

    const updated = await VideoService.updateVideo(id, data as any);
    return ApiResponse.success(updated, 'Video updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await VideoService.deleteVideo(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
