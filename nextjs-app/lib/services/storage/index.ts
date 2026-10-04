import path from 'path';
import { env } from '../../config/env';
import {
  IStorageService,
  StorageFolder,
  StorageUploadOptions,
  StorageUploadResult,
} from './storage.interface';
import { SupabaseStorageService } from './supabase-storage.service';
import { generateSlug } from '../../utils/slugify';

/**
 * Reusable StorageService Abstraction
 * Wraps Supabase Storage as the sole object storage provider.
 * Cloudinary is strictly prohibited.
 */
export class StorageService implements IStorageService {
  private provider: IStorageService;

  constructor(provider?: IStorageService) {
    this.provider =
      provider ||
      new SupabaseStorageService(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        env.SUPABASE_STORAGE_BUCKET
      );
  }

  /**
   * Builds an organized, collision-resistant path in Supabase Storage
   * Format: {folder}/{sanitized-name}-{timestamp}-{randomSuffix}.{ext}
   */
  static buildStoragePath(
    originalName: string,
    folder: StorageFolder = 'general'
  ): string {
    const ext = path.extname(originalName).toLowerCase();
    const base = path.basename(originalName, ext);
    const sanitized = generateSlug(base) || 'asset';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'general';

    return `${cleanFolder}/${sanitized}-${timestamp}-${randomSuffix}${ext}`;
  }

  async upload(
    fileBuffer: Buffer,
    filePath: string,
    options?: StorageUploadOptions
  ): Promise<StorageUploadResult> {
    return this.provider.upload(fileBuffer, filePath, options);
  }

  async uploadFile(
    fileBuffer: Buffer,
    filePath: string,
    options?: StorageUploadOptions
  ): Promise<StorageUploadResult> {
    return this.provider.uploadFile(fileBuffer, filePath, options);
  }

  async delete(filePath: string): Promise<void> {
    return this.provider.delete(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    return this.provider.deleteFile(filePath);
  }

  getPublicUrl(filePath: string): string {
    return this.provider.getPublicUrl(filePath);
  }

  async createSignedUrl(filePath: string, expiresIn?: number): Promise<string> {
    return this.provider.createSignedUrl(filePath, expiresIn);
  }

  async getSignedUrl(filePath: string, expiresIn?: number): Promise<string> {
    return this.provider.getSignedUrl(filePath, expiresIn);
  }
}

/**
 * Default global singleton instance of StorageService
 */
export const storageService = new StorageService();

export * from './storage.interface';
export * from './supabase-storage.service';
