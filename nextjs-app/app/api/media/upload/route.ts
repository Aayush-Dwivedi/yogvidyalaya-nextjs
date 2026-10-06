import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { storageService, StorageService } from '@/lib/services/storage';
import { MediaAsset } from '@/lib/models/MediaAsset';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';
import type { StorageFolder } from '@/lib/services/storage/storage.interface';

export const runtime = 'nodejs';

const VALID_FOLDERS = new Set<StorageFolder>([
  'hero', 'courses', 'workshops', 'gallery', 'founder',
  'institute', 'videos', 'site-assets', 'student', 'general',
]);

const ALLOWED_STUDENT_IMAGE_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/jpg',
]);

const MAX_STUDENT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_ADMIN_FILE_SIZE = 25 * 1024 * 1024;  // 25 MB

function resolveFolder(raw?: string | null): StorageFolder {
  if (raw && VALID_FOLDERS.has(raw.toLowerCase() as StorageFolder)) {
    return raw.toLowerCase() as StorageFolder;
  }
  return 'general';
}

/**
 * POST /api/media/upload
 * Supports single file upload via multipart/form-data.
 * Role-aware authorization:
 *   - Students: can ONLY upload to folder 'student' (avatar/profile photo, max 5MB, images only)
 *   - Admin / Super Admin: can upload to any valid folder
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireSession(request);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return ApiResponse.badRequest('No file uploaded. Provide a file with field name "file".');
    }

    const requestedFolder = resolveFolder(formData.get('folder') as string | null);

    // Role-based boundary enforcement
    if (session.role === 'student') {
      if (requestedFolder !== 'student') {
        return ApiResponse.forbidden('Students are only authorized to upload profile images to the student folder.');
      }
      if (!ALLOWED_STUDENT_IMAGE_TYPES.has(file.type.toLowerCase())) {
        return ApiResponse.badRequest('Invalid file type. Only JPEG, PNG, and WebP images are permitted for profile photos.');
      }
      if (file.size > MAX_STUDENT_FILE_SIZE) {
        return ApiResponse.badRequest('File size exceeds the 5MB limit for student uploads.');
      }
    } else if (!['admin', 'super_admin'].includes(session.role)) {
      return ApiResponse.forbidden('Unauthorized to upload media assets.');
    } else {
      if (file.size > MAX_ADMIN_FILE_SIZE) {
        return ApiResponse.badRequest('File size exceeds the 25MB limit.');
      }
    }

    const storagePath = StorageService.buildStoragePath(file.name, requestedFolder);
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await storageService.upload(buffer, storagePath, {
      contentType: file.type,
      originalFilename: file.name,
      folder: requestedFolder,
      upsert: true,
    });

    const altText = (formData.get('alt') as string) || file.name;

    const asset = await MediaAsset.create({
      path: result.path,
      bucket: result.bucket,
      originalFilename: file.name,
      mimeType: file.type,
      size: file.size,
      publicUrl: result.publicUrl,
      folder: requestedFolder,
      alt: altText,
    });

    return ApiResponse.created(
      {
        id: asset._id.toString(),
        path: asset.path,
        bucket: asset.bucket,
        originalFilename: asset.originalFilename,
        mimeType: asset.mimeType,
        size: asset.size,
        publicUrl: asset.publicUrl,
        folder: asset.folder,
        alt: asset.alt,
        createdAt: asset.createdAt,
      },
      'Media uploaded successfully to Supabase Storage'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
