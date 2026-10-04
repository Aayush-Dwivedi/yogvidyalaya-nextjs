import { apiClient } from '../api/axios';
import { ApiResponse } from '../types';
import { ProfileImage } from '../types/auth';

export interface UploadMediaResult {
  publicUrl: string;
  path: string;
  bucket: string;
  size: number;
  mimeType: string;
  alt: string;
  folder?: string;
}

export class MediaService {
  /**
   * Upload an image to Supabase Storage via backend storage service
   */
  static async uploadImage(file: File, folder: string = 'general', alt?: string): Promise<ProfileImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (alt) {
      formData.append('alt', alt);
    }

    const res = (await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })) as unknown as ApiResponse<UploadMediaResult>;

    return {
      url: res.data.publicUrl,
      path: res.data.path,
      bucket: res.data.bucket,
      size: res.data.size,
      mimeType: res.data.mimeType,
      alt: res.data.alt || file.name,
    };
  }
}
