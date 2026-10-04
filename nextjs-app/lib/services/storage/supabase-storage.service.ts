import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  IStorageService,
  StorageUploadOptions,
  StorageUploadResult,
} from './storage.interface';
import { AppError } from '../../utils/appError';
import { logger } from '../../utils/logger';

/**
 * Supabase Storage implementation of IStorageService.
 * Connects securely using server-side service role key.
 * Cloudinary is strictly prohibited.
 */
export class SupabaseStorageService implements IStorageService {
  private client: SupabaseClient;
  private bucket: string;
  private isPlaceholder: boolean;

  constructor(supabaseUrl: string, serviceRoleKey: string, bucket: string) {
    this.bucket = bucket;
    this.isPlaceholder =
      !supabaseUrl ||
      supabaseUrl.includes('placeholder') ||
      !serviceRoleKey ||
      serviceRoleKey.includes('placeholder');

    if (this.isPlaceholder) {
      logger.warn(
        '[SupabaseStorageService] Running with placeholder Supabase credentials. Emulation mode active for local dev/testing.'
      );
    }

    this.client = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      serviceRoleKey || 'placeholder-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  /**
   * Upload file to Supabase Storage bucket
   */
  async upload(
    fileBuffer: Buffer,
    filePath: string,
    options?: StorageUploadOptions
  ): Promise<StorageUploadResult> {
    const contentType = options?.contentType || 'application/octet-stream';
    const createdAt = new Date().toISOString();

    try {
      // In local dev with placeholder credentials, return emulated storage metadata
      if (this.isPlaceholder) {
        logger.info(
          `[SupabaseStorageService (Dev Emulation)] Uploaded ${filePath} (${fileBuffer.length} bytes, type: ${contentType})`
        );
        const publicUrl = this.getPublicUrl(filePath);
        return {
          path: filePath,
          publicUrl,
          bucket: this.bucket,
          originalFilename: options?.originalFilename,
          size: fileBuffer.length,
          contentType,
          createdAt,
        };
      }

      const { data, error } = await this.client.storage
        .from(this.bucket)
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: options?.upsert ?? true,
          metadata: options?.metadata,
        });

      if (error) {
        logger.error(`Supabase Storage upload error for ${filePath}:`, error);
        throw AppError.internal(`File upload to Supabase Storage failed: ${error.message}`);
      }

      const publicUrl = this.getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl,
        bucket: this.bucket,
        originalFilename: options?.originalFilename,
        size: fileBuffer.length,
        contentType,
        createdAt,
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Unexpected error during Supabase file upload:', err);
      throw AppError.internal('Failed to process file upload via Supabase Storage');
    }
  }

  /**
   * Alias for upload()
   */
  async uploadFile(
    fileBuffer: Buffer,
    filePath: string,
    options?: StorageUploadOptions
  ): Promise<StorageUploadResult> {
    return this.upload(fileBuffer, filePath, options);
  }

  /**
   * Delete file from Supabase Storage bucket
   */
  async delete(filePath: string): Promise<void> {
    try {
      if (this.isPlaceholder) {
        logger.info(`[SupabaseStorageService (Dev Emulation)] Deleted ${filePath}`);
        return;
      }

      const { error } = await this.client.storage.from(this.bucket).remove([filePath]);
      if (error) {
        logger.error(`Supabase Storage delete error for ${filePath}:`, error);
        throw AppError.internal(`File deletion from Supabase Storage failed: ${error.message}`);
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Unexpected error during Supabase file deletion:', err);
      throw AppError.internal('Failed to delete file from Supabase Storage');
    }
  }

  /**
   * Alias for delete()
   */
  async deleteFile(filePath: string): Promise<void> {
    return this.delete(filePath);
  }

  /**
   * Retrieve publicly accessible URL for an asset
   */
  getPublicUrl(filePath: string): string {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  /**
   * Create a time-limited signed URL for private or protected assets
   */
  async createSignedUrl(filePath: string, expiresIn = 3600): Promise<string> {
    try {
      if (this.isPlaceholder) {
        const publicUrl = this.getPublicUrl(filePath);
        return `${publicUrl}?token=dev-placeholder-token&expires=${Date.now() + expiresIn * 1000}`;
      }

      const { data, error } = await this.client.storage
        .from(this.bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error || !data) {
        logger.error(`Supabase Storage signed URL error for ${filePath}:`, error);
        throw AppError.internal(
          `Failed to generate signed URL from Supabase Storage: ${error?.message}`
        );
      }

      return data.signedUrl;
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Unexpected error during Supabase signed URL generation:', err);
      throw AppError.internal('Failed to generate secure signed URL');
    }
  }

  /**
   * Alias for createSignedUrl()
   */
  async getSignedUrl(filePath: string, expiresIn?: number): Promise<string> {
    return this.createSignedUrl(filePath, expiresIn);
  }
}
