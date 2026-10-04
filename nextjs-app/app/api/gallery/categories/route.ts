import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { GalleryService } from '@/lib/services/gallery.service';
import { createGalleryCategorySchema } from '@/lib/validators/gallery.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const categories = await GalleryService.getCategories();
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
    const data = createGalleryCategorySchema.body.parse(body);

    const created = await GalleryService.createCategory(data as any);
    return ApiResponse.created(created, 'Gallery category created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
