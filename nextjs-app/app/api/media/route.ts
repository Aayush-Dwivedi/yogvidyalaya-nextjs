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

// GET /api/media — admin: list all media assets
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (searchParams.get('folder')) filter.folder = searchParams.get('folder');

    const [items, total] = await Promise.all([
      MediaAsset.find(filter).sort('-createdAt').skip(skip).limit(limit),
      MediaAsset.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit) || 1;

    return ApiResponse.success(items, 'Media assets retrieved', 200, {
      page, limit, total, totalPages,
      hasNextPage: page < totalPages, hasPrevPage: page > 1,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/media — admin: upload file to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return ApiResponse.badRequest('No file uploaded. Provide a file with field name "file".');
    }

    const folder = resolveFolder(formData.get('folder') as string | null);
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
      alt: (formData.get('alt') as string) || file.name,
    });

    return ApiResponse.created(asset, 'Media uploaded to Supabase Storage');
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/media — admin: delete file from Supabase Storage
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    if (!body.path) {
      return ApiResponse.badRequest('Storage path is required for deletion');
    }

    await storageService.delete(body.path);
    await MediaAsset.findOneAndDelete({ path: body.path });

    return ApiResponse.success(null, `Asset '${body.path}' deleted from Supabase Storage`);
  } catch (error) {
    return handleRouteError(error);
  }
}
