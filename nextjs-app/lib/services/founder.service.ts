import { Types } from 'mongoose';
import { Founder, IFounder } from '../models/Founder';
import { AppError } from '../utils/appError';
import { generateSlug } from '../utils/slugify';
import { PaginationQuery, PaginationMeta } from '../types/content.types';

export class FounderService {
  static async getFounders(query: PaginationQuery): Promise<{ items: IFounder[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    } else if (!query.status) {
      filter.status = 'published';
    }

    if (query.featured !== undefined) {
      filter.featured = query.featured;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { title: { $regex: query.search, $options: 'i' } },
        { bio: { $regex: query.search, $options: 'i' } },
      ];
    }

    const sortField = query.sort || 'order';

    const [items, total] = await Promise.all([
      Founder.find(filter).sort(sortField).skip(skip).limit(limit),
      Founder.countDocuments(filter),
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

  static async getFounderByIdOrSlug(idOrSlug: string): Promise<IFounder> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const founder = await Founder.findOne(filter);
    if (!founder) {
      throw AppError.notFound(`Founder not found with identifier: ${idOrSlug}`);
    }
    return founder;
  }

  static async createFounder(data: Partial<IFounder>): Promise<IFounder> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name || 'acharya');
    const existing = await Founder.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;

    if (data.designation && !data.title) {
      data.title = data.designation;
    } else if (data.title && !data.designation) {
      data.designation = data.title;
    }
    if (data.biography && !data.bio) {
      data.bio = data.biography;
    } else if (data.bio && !data.biography) {
      data.biography = data.bio;
    }
    if (data.message && !data.quote) {
      data.quote = data.message;
    } else if (data.quote && !data.message) {
      data.message = data.quote;
    }

    return await Founder.create(data);
  }

  static async updateFounder(id: string, data: Partial<IFounder>): Promise<IFounder> {
    const queryId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;

    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await Founder.findOne({ slug: data.slug, _id: { $ne: queryId } });
      if (existing) {
        throw AppError.conflict(`Slug '${data.slug}' is already in use by another profile.`);
      }
    }

    if (data.designation) {
      data.title = data.designation;
    } else if (data.title && !data.designation) {
      data.designation = data.title;
    }

    if (data.biography) {
      data.bio = data.biography;
    } else if (data.bio && !data.biography) {
      data.biography = data.bio;
    }

    if (data.message) {
      data.quote = data.message;
    } else if (data.quote && !data.message) {
      data.message = data.quote;
    }

    // Ensure image object is complete if provided
    if (data.image) {
      if (typeof data.image === 'string') {
        data.image = {
          url: data.image,
          path: 'trainers/profile.jpg',
          bucket: 'kalptaru-media',
          alt: data.name || 'Trainer Profile',
        } as any;
      } else if (typeof data.image === 'object') {
        data.image = {
          ...data.image,
          path: data.image.path && data.image.path.trim().length > 0 ? data.image.path.trim() : 'trainers/profile.jpg',
          bucket: data.image.bucket || 'kalptaru-media',
          alt: data.image.alt || data.name || 'Trainer Profile',
        } as any;
      }
    }

    const updated = await Founder.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      throw AppError.notFound(`Founder not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteFounder(id: string): Promise<void> {
    const deleted = await Founder.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Founder not found with ID: ${id}`);
    }
  }
}
