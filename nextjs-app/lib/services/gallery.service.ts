import { Types } from 'mongoose';
import { GalleryImage, IGalleryImage } from '../models/GalleryImage';
import { GalleryCategory, IGalleryCategory } from '../models/GalleryCategory';
import { AppError } from '../utils/appError';
import { generateSlug } from '../utils/slugify';
import { PaginationQuery, PaginationMeta } from '../types/content.types';

export interface GalleryFilterQuery extends PaginationQuery {
  category?: string;
  categorySlug?: string;
  event?: string;
}

export class GalleryService {
  // --- Category Methods ---
  static async getCategories(): Promise<IGalleryCategory[]> {
    return await GalleryCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
  }

  static async getCategoryByIdOrSlug(idOrSlug: string): Promise<IGalleryCategory> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const category = await GalleryCategory.findOne(filter);
    if (!category) {
      throw AppError.notFound(`Gallery category not found with identifier: ${idOrSlug}`);
    }
    return category;
  }

  static async createCategory(data: Partial<IGalleryCategory>): Promise<IGalleryCategory> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name || 'category');
    const existing = await GalleryCategory.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;
    return await GalleryCategory.create(data);
  }

  static async updateCategory(id: string, data: Partial<IGalleryCategory>): Promise<IGalleryCategory> {
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await GalleryCategory.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw AppError.conflict(`Slug '${data.slug}' is already in use.`);
      }
    }
    const updated = await GalleryCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw AppError.notFound(`Gallery category not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteCategory(id: string): Promise<void> {
    const deleted = await GalleryCategory.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Gallery category not found with ID: ${id}`);
    }
  }

  // --- Gallery Image Methods ---
  static async getGalleryImages(
    query: GalleryFilterQuery
  ): Promise<{ items: IGalleryImage[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.category) {
      if (Types.ObjectId.isValid(query.category)) {
        filter.category = query.category;
      } else {
        filter.categorySlug = query.category.toLowerCase();
      }
    }

    if (query.categorySlug) {
      filter.categorySlug = query.categorySlug.toLowerCase();
    }

    if (query.event) {
      filter.event = { $regex: query.event, $options: 'i' };
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
      GalleryImage.find(filter)
        .populate('category', 'name slug')
        .sort(sortField)
        .skip(skip)
        .limit(limit),
      GalleryImage.countDocuments(filter),
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

  static async getGalleryImageById(id: string): Promise<IGalleryImage> {
    const image = await GalleryImage.findById(id).populate('category', 'name slug');
    if (!image) {
      throw AppError.notFound(`Gallery image not found with ID: ${id}`);
    }
    return image;
  }

  static async createGalleryImage(data: Partial<IGalleryImage>): Promise<IGalleryImage> {
    // If category is provided, also set categorySlug for performant filtering
    if (data.category && Types.ObjectId.isValid(data.category as any)) {
      const cat = await GalleryCategory.findById(data.category);
      if (cat) {
        data.categorySlug = cat.slug;
      }
    }
    return await GalleryImage.create(data);
  }

  static async updateGalleryImage(id: string, data: Partial<IGalleryImage>): Promise<IGalleryImage> {
    if (data.category && Types.ObjectId.isValid(data.category as any)) {
      const cat = await GalleryCategory.findById(data.category);
      if (cat) {
        data.categorySlug = cat.slug;
      }
    }
    const updated = await GalleryImage.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');
    if (!updated) {
      throw AppError.notFound(`Gallery image not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteGalleryImage(id: string): Promise<void> {
    const deleted = await GalleryImage.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Gallery image not found with ID: ${id}`);
    }
  }
}
