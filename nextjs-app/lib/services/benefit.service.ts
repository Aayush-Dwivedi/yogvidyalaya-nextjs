import { Benefit, IBenefit } from '../models/Benefit';
import { AppError } from '../utils/appError';
import { PaginationQuery, PaginationMeta, BenefitCategory } from '../types/content.types';

export interface BenefitFilterQuery extends PaginationQuery {
  category?: BenefitCategory;
}

export class BenefitService {
  static async getBenefits(
    query: BenefitFilterQuery
  ): Promise<{ items: IBenefit[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.category) {
      filter.category = query.category;
    }

    if ((query as any).active !== undefined) {
      filter.active = (query as any).active;
    } else if (query.status && query.status !== 'all') {
      filter.status = query.status;
    } else if (!query.status) {
      filter.status = 'published';
    }

    const sortField = query.sort || 'order';

    const [items, total] = await Promise.all([
      Benefit.find(filter).sort(sortField).skip(skip).limit(limit),
      Benefit.countDocuments(filter),
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

  static async getBenefitById(id: string): Promise<IBenefit> {
    const benefit = await Benefit.findById(id);
    if (!benefit) {
      throw AppError.notFound(`Benefit not found with ID: ${id}`);
    }
    return benefit;
  }

  static async createBenefit(data: Partial<IBenefit>): Promise<IBenefit> {
    if (data.active !== undefined && !data.status) {
      data.status = data.active ? 'published' : 'draft';
    }
    if (data.order === undefined) {
      const count = await Benefit.countDocuments();
      data.order = count;
    }
    return await Benefit.create(data);
  }

  static async updateBenefit(id: string, data: Partial<IBenefit>): Promise<IBenefit> {
    if (data.active !== undefined && !data.status) {
      data.status = data.active ? 'published' : 'draft';
    }
    const updated = await Benefit.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw AppError.notFound(`Benefit not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteBenefit(id: string): Promise<void> {
    const deleted = await Benefit.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Benefit not found with ID: ${id}`);
    }
  }
}
