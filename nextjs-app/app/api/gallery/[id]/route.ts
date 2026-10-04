import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { GalleryService } from '@/lib/services/gallery.service';
import { updateGalleryImageSchema } from '@/lib/validators/gallery.validator';
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
    const image = await GalleryService.getGalleryImageById(id);
    return ApiResponse.success(image);
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
    const data = updateGalleryImageSchema.body.parse(body);

    const updated = await GalleryService.updateGalleryImage(id, data as any);
    return ApiResponse.success(updated, 'Gallery image updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await GalleryService.deleteGalleryImage(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
