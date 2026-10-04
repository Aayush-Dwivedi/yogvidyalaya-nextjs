import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { GalleryService } from '@/lib/services/gallery.service';
import { createGalleryImageSchema, getGalleryImagesSchema } from '@/lib/validators/gallery.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const query = getGalleryImagesSchema.query.parse(rawQuery);

    const result = await GalleryService.getGalleryImages(query as any);
    return ApiResponse.paginated(result.items, result.meta);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const data = createGalleryImageSchema.body.parse(body);

    const created = await GalleryService.createGalleryImage(data as any);
    return ApiResponse.created(created, 'Gallery image created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
