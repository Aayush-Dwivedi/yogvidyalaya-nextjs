import { Types } from 'mongoose';
import { Workshop, IWorkshop } from '../models/Workshop';
import { AppError } from '../utils/appError';
import { generateSlug } from '../utils/slugify';
import {
  PaginationQuery,
  PaginationMeta,
  DeliveryMode,
} from '../types/content.types';

export interface WorkshopFilterQuery extends PaginationQuery {
  mode?: DeliveryMode;
  upcomingOnly?: boolean;
}

export class WorkshopService {
  static async getWorkshops(
    query: WorkshopFilterQuery
  ): Promise<{ items: IWorkshop[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.mode) {
      filter.mode = query.mode;
    }

    if (query.upcomingOnly) {
      filter.date = { $gte: new Date() };
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

    const sortField = query.sort || 'date';

    const [items, total] = await Promise.all([
      Workshop.find(filter)
        .populate('instructor.founderRef')
        .sort(sortField)
        .skip(skip)
        .limit(limit),
      Workshop.countDocuments(filter),
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

  static async getWorkshopByIdOrSlug(idOrSlug: string): Promise<IWorkshop> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const workshop = await Workshop.findOne(filter).populate('instructor.founderRef');
    if (!workshop) {
      throw AppError.notFound(`Workshop not found with identifier: ${idOrSlug}`);
    }
    return workshop;
  }

  static async createWorkshop(data: Partial<IWorkshop>): Promise<IWorkshop> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || 'workshop');
    const existing = await Workshop.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;

    return await Workshop.create(data);
  }

  static async updateWorkshop(id: string, data: Partial<IWorkshop>): Promise<IWorkshop> {
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await Workshop.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw AppError.conflict(`Slug '${data.slug}' is already in use by another workshop.`);
      }
    }

    const updated = await Workshop.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'instructor.founderRef'
    );
    if (!updated) {
      throw AppError.notFound(`Workshop not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteWorkshop(id: string): Promise<void> {
    const deleted = await Workshop.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Workshop not found with ID: ${id}`);
    }
  }
}
