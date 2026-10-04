import { Video, IVideo } from '../models/Video';
import { AppError } from '../utils/appError';
import { extractYoutubeId } from '../utils/youtube';
import { PaginationQuery, PaginationMeta } from '../types/content.types';

export interface VideoFilterQuery extends PaginationQuery {
  category?: string;
  speaker?: string;
}

export class VideoService {
  static async getVideos(
    query: VideoFilterQuery
  ): Promise<{ items: IVideo[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.speaker) {
      filter.speaker = { $regex: query.speaker, $options: 'i' };
    }

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    } else if (!query.status) {
      filter.status = 'published';
    }

    if (query.featured !== undefined) {
      filter.featured = query.featured;
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const sortField = query.sort || 'order -createdAt';

    const [items, total] = await Promise.all([
      Video.find(filter).sort(sortField).skip(skip).limit(limit),
      Video.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async getVideoById(id: string): Promise<IVideo> {
    const video = await Video.findById(id);
    if (!video) {
      throw AppError.notFound(`Video not found with ID: ${id}`);
    }
    return video;
  }

  static async createVideo(data: Partial<IVideo>): Promise<IVideo> {
    if (data.youtubeUrl && !data.youtubeVideoId) {
      const extracted = extractYoutubeId(data.youtubeUrl);
      if (extracted) {
        data.youtubeVideoId = extracted;
      } else {
        throw AppError.badRequest('Could not extract a valid YouTube video ID from the provided URL.');
      }
    }
    return await Video.create(data);
  }

  static async updateVideo(id: string, data: Partial<IVideo>): Promise<IVideo> {
    if (data.youtubeUrl && !data.youtubeVideoId) {
      const extracted = extractYoutubeId(data.youtubeUrl);
      if (extracted) {
        data.youtubeVideoId = extracted;
      }
    }

    const updated = await Video.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw AppError.notFound(`Video not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteVideo(id: string): Promise<void> {
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Video not found with ID: ${id}`);
    }
  }
}
