import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { GalleryService } from '@/lib/services/gallery.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/**
 * POST /api/gallery/batch
 * Admin endpoint: Create multiple gallery photos in bulk, section-wise.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const images = Array.isArray(body) ? body : body?.images;

    if (!Array.isArray(images) || images.length === 0) {
      return ApiResponse.badRequest('Payload must contain an array of gallery images in "images" field.');
    }

    // Basic validation on items
    for (const img of images) {
      if (!img.image?.url || !img.title) {
        return ApiResponse.badRequest('Every gallery item must include title and valid image object with url.');
      }
    }

    const created = await GalleryService.createMultipleGalleryImages(images);

    return ApiResponse.created(
      created,
      `${created.length} gallery images created successfully`
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
