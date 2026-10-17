import { Types } from 'mongoose';
import { Video, IVideo } from '../models/Video';
import { VideoCategory, IVideoCategory } from '../models/VideoCategory';
import { AppError } from '../utils/appError';
import { extractYoutubeId } from '../utils/youtube';
import { generateSlug } from '../utils/slugify';
import { PaginationQuery, PaginationMeta } from '../types/content.types';

const DEFAULT_VIDEO_CATEGORIES = [
  { name: 'Philosophy Discourse', slug: 'discourse', order: 1 },
  { name: 'Guided Practice', slug: 'guided-practice', order: 2 },
  { name: 'Campus Overview', slug: 'campus-overview', order: 3 },
  { name: 'Masterclass', slug: 'masterclass', order: 4 },
  { name: 'Chanting & Dhyana', slug: 'chanting-dhyana', order: 5 },
];

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

  // --- Category Methods ---
  static async getCategories(): Promise<IVideoCategory[]> {
    const count = await VideoCategory.countDocuments();
    if (count === 0) {
      // Seed default categories
      for (const item of DEFAULT_VIDEO_CATEGORIES) {
        await VideoCategory.create(item);
      }
      // Also ensure any categories from existing videos are preserved
      try {
        const distinctCategories: string[] = await Video.distinct('category');
        for (const cat of distinctCategories) {
          if (
            cat &&
            typeof cat === 'string' &&
            !DEFAULT_VIDEO_CATEGORIES.some(
              (d) => d.name.toLowerCase() === cat.toLowerCase() || d.slug === cat.toLowerCase()
            )
          ) {
            await VideoCategory.create({
              name: cat,
              slug: generateSlug(cat),
              order: 10,
            });
          }
        }
      } catch (err) {
        console.warn('Could not scan distinct video categories for seeding:', err);
      }
    }
    return await VideoCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
  }

  static async getCategoryByIdOrSlug(idOrSlug: string): Promise<IVideoCategory> {
    const filter = Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const category = await VideoCategory.findOne(filter);
    if (!category) {
      throw AppError.notFound(`Video category not found with identifier: ${idOrSlug}`);
    }
    return category;
  }

  static async createCategory(data: Partial<IVideoCategory>): Promise<IVideoCategory> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name || 'category');
    const existing = await VideoCategory.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }
    data.slug = slug;
    return await VideoCategory.create(data);
  }

  static async updateCategory(id: string, data: Partial<IVideoCategory>): Promise<IVideoCategory> {
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await VideoCategory.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw AppError.conflict(`A video category with slug "${data.slug}" already exists`);
      }
    }

    const updated = await VideoCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw AppError.notFound(`Video category not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteCategory(id: string): Promise<void> {
    const deleted = await VideoCategory.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Video category not found with ID: ${id}`);
    }
  }
}
