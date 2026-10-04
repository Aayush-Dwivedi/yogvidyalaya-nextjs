import { Types } from 'mongoose';
import { CorporateProgram, ICorporateProgram } from '../models/CorporateProgram';
import { AppError } from '../utils/appError';
import { generateSlug } from '../utils/slugify';
import {
  PaginationQuery,
  PaginationMeta,
  CorporateFormat,
} from '../types/content.types';

export interface CorporateFilterQuery extends PaginationQuery {
  format?: CorporateFormat;
}

export class CorporateService {
  static async getCorporatePrograms(
    query: CorporateFilterQuery
  ): Promise<{ items: ICorporateProgram[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.format) {
      filter.format = query.format;
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
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { shortDescription: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    const sortField = query.sort || 'order';

    const [items, total] = await Promise.all([
      CorporateProgram.find(filter).sort(sortField).skip(skip).limit(limit),
      CorporateProgram.countDocuments(filter),
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

  static async getCorporateProgramByIdOrSlug(idOrSlug: string): Promise<ICorporateProgram> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const item = await CorporateProgram.findOne(filter);
    if (!item) {
      throw AppError.notFound(`Corporate program not found with identifier: ${idOrSlug}`);
    }
    return item;
  }

  static async createCorporateProgram(data: Partial<ICorporateProgram>): Promise<ICorporateProgram> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || 'corporate-program');
    const existing = await CorporateProgram.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;

    return await CorporateProgram.create(data);
  }

  static async updateCorporateProgram(
    id: string,
    data: Partial<ICorporateProgram>
  ): Promise<ICorporateProgram> {
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await CorporateProgram.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw AppError.conflict(`Slug '${data.slug}' is already in use.`);
      }
    }

    const updated = await CorporateProgram.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw AppError.notFound(`Corporate program not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteCorporateProgram(id: string): Promise<void> {
    const deleted = await CorporateProgram.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Corporate program not found with ID: ${id}`);
    }
  }
}
