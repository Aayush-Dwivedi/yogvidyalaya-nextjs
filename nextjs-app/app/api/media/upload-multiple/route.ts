import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { storageService, StorageService } from '@/lib/services/storage';
import { MediaAsset } from '@/lib/models/MediaAsset';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';
import type { StorageFolder } from '@/lib/services/storage/storage.interface';

export const runtime = 'nodejs';

const VALID_FOLDERS = new Set<StorageFolder>([
  'hero', 'courses', 'workshops', 'gallery', 'founder',
  'institute', 'videos', 'site-assets', 'student', 'general',
]);

function resolveFolder(raw?: string | null): StorageFolder {
  if (raw && VALID_FOLDERS.has(raw.toLowerCase() as StorageFolder)) {
    return raw.toLowerCase() as StorageFolder;
  }
  return 'general';
}

/**
 * POST /api/media/upload-multiple
 * Admin endpoint: Uploads up to 10 files in a single request.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const formData = await request.formData();
    const folder = resolveFolder(formData.get('folder') as string | null);

    // Extract all files from 'files' or 'file' fields
    const rawFiles = [
      ...formData.getAll('files'),
      ...formData.getAll('file'),
    ];

    const files = rawFiles.filter(
      (f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f && (f as File).size > 0
    );

    if (files.length === 0) {
      return ApiResponse.badRequest('No valid files uploaded. Attach files with field name "files".');
    }

    if (files.length > 10) {
      return ApiResponse.badRequest('A maximum of 10 files can be uploaded simultaneously.');
    }

    const uploadedAssets = await Promise.all(
      files.map(async (file) => {
        const storagePath = StorageService.buildStoragePath(file.name, folder);
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await storageService.upload(buffer, storagePath, {
          contentType: file.type,
          originalFilename: file.name,
          folder,
          upsert: true,
        });

        const asset = await MediaAsset.create({
          path: result.path,
          bucket: result.bucket,
          originalFilename: file.name,
          mimeType: file.type,
          size: file.size,
          publicUrl: result.publicUrl,
          folder,
          alt: file.name,
        });

        return {
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
        };
      })
    );

    return ApiResponse.created(
      uploadedAssets,
      `${uploadedAssets.length} media assets uploaded successfully to Supabase Storage`
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
