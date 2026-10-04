import { Types } from 'mongoose';
import { Program, IProgram } from '../models/Program';
import { AppError } from '../utils/appError';
import { generateSlug } from '../utils/slugify';
import { PaginationQuery, PaginationMeta, ProgramType } from '../types/content.types';

export interface ProgramFilterQuery extends PaginationQuery {
  programType?: ProgramType;
}

export class ProgramService {
  static async getPrograms(
    query: ProgramFilterQuery
  ): Promise<{ items: IProgram[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.programType) {
      filter.programType = query.programType;
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
      Program.find(filter)
        .populate('referenceId')
        .sort(sortField)
        .skip(skip)
        .limit(limit),
      Program.countDocuments(filter),
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

  static async getProgramByIdOrSlug(idOrSlug: string): Promise<IProgram> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const program = await Program.findOne(filter).populate('referenceId');
    if (!program) {
      throw AppError.notFound(`Program pathway not found with identifier: ${idOrSlug}`);
    }
    return program;
  }

  static async createProgram(data: Partial<IProgram>): Promise<IProgram> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || 'program');
    const existing = await Program.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;

    return await Program.create(data);
  }

  static async updateProgram(id: string, data: Partial<IProgram>): Promise<IProgram> {
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await Program.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw AppError.conflict(`Slug '${data.slug}' is already in use by another program.`);
      }
    }

    const updated = await Program.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('referenceId');
    if (!updated) {
      throw AppError.notFound(`Program not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteProgram(id: string): Promise<void> {
    const deleted = await Program.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Program not found with ID: ${id}`);
    }
  }
}
