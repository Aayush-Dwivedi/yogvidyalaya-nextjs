import { type NextRequest } from 'next/server';
import { storageService } from '@/lib/services/storage';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/**
 * POST /api/media/signed-url
 * Admin endpoint: Generates a time-limited signed URL for private or protected storage assets.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession(request);

    const body = await request.json().catch(() => ({}));
    const storagePath = body.path;
    const expiresIn = typeof body.expiresIn === 'number' ? body.expiresIn : 3600;

    if (!storagePath || typeof storagePath !== 'string') {
      return ApiResponse.badRequest('Storage path is required to generate a signed URL.');
    }

    const signedUrl = await storageService.createSignedUrl(storagePath, expiresIn);

    return ApiResponse.success(
      { signedUrl, path: storagePath, expiresIn },
      'Signed URL generated successfully from Supabase Storage'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
