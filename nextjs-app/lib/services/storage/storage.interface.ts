/**
 * Storage Service Abstraction Layer
 * Standard interface for object storage providers (Supabase Storage).
 * Cloudinary is strictly prohibited. All media operations must go through this abstraction.
 */

export type StorageFolder =
  | 'hero'
  | 'courses'
  | 'workshops'
  | 'gallery'
  | 'founder'
  | 'institute'
  | 'videos'
  | 'site-assets'
  | 'student'
  | 'general';

export interface StorageUploadOptions {
  contentType?: string;
  upsert?: boolean;
  metadata?: Record<string, string>;
  folder?: StorageFolder;
  originalFilename?: string;
}

export interface StorageUploadResult {
  path: string;
  publicUrl: string;
  bucket: string;
  originalFilename?: string;
  size?: number;
  contentType?: string;
  createdAt: string;
}

export interface MediaMetadata {
  path: string;
  bucket: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  publicUrl: string;
  createdAt: string;
  folder?: StorageFolder;
  alt?: string;
}

export interface IStorageService {
  /**
   * Uploads a file buffer to object storage
   * @param fileBuffer Binary content of the file
   * @param filePath Target path inside the bucket (e.g. "gallery/photo-123.webp")
   * @param options Additional upload options (MIME type, upsert, metadata)
   */
  upload(
    fileBuffer: Buffer,
    filePath: string,
    options?: StorageUploadOptions
  ): Promise<StorageUploadResult>;

  /**
   * Alias for upload()
   */
  uploadFile(
    fileBuffer: Buffer,
    filePath: string,
    options?: StorageUploadOptions
  ): Promise<StorageUploadResult>;

  /**
   * Deletes a file at the specified storage path
   * @param filePath Relative path of the file inside the bucket
   */
  delete(filePath: string): Promise<void>;

  /**
   * Alias for delete()
   */
  deleteFile(filePath: string): Promise<void>;

  /**
   * Retrieves the publicly accessible URL for an asset
   * @param filePath Relative path of the file inside the bucket
   */
  getPublicUrl(filePath: string): string;

  /**
   * Creates a time-limited signed URL for private or protected assets
   * @param filePath Relative path of the file inside the bucket
   * @param expiresIn Expiration time in seconds (defaults to 3600)
   */
  createSignedUrl(filePath: string, expiresIn?: number): Promise<string>;

  /**
   * Alias for createSignedUrl()
   */
  getSignedUrl(filePath: string, expiresIn?: number): Promise<string>;
}
