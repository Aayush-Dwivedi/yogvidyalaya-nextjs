import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { GalleryService } from '@/lib/services/gallery.service';
import { updateGalleryCategorySchema } from '@/lib/validators/gallery.validator';
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
    const category = await GalleryService.getCategoryByIdOrSlug(id);
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
    const data = updateGalleryCategorySchema.body.parse(body);

    const updated = await GalleryService.updateCategory(id, data as any);
    return ApiResponse.success(updated, 'Gallery category updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await GalleryService.deleteCategory(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
