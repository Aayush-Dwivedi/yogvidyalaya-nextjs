import { Types } from 'mongoose';
import { Course, ICourse } from '../models/Course';
import { AppError } from '../utils/appError';
import { generateSlug } from '../utils/slugify';
import {
  PaginationQuery,
  PaginationMeta,
  CourseLevel,
  DeliveryMode,
} from '../types/content.types';

export interface CourseFilterQuery extends PaginationQuery {
  level?: CourseLevel;
  mode?: DeliveryMode;
}

export class CourseService {
  static async getCourses(
    query: CourseFilterQuery
  ): Promise<{ items: ICourse[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.level) {
      filter.level = query.level;
    }

    if (query.mode) {
      filter.mode = query.mode;
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

    const sortOption: any = query.sort || { order: 1, createdAt: -1 };

    const [items, total] = await Promise.all([
      Course.find(filter)
        .populate('instructor.founderRef')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Course.countDocuments(filter),
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

  static async getCourseByIdOrSlug(idOrSlug: string): Promise<ICourse> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const course = await Course.findOne(filter).populate('instructor.founderRef');
    if (!course) {
      throw AppError.notFound(`Course not found with identifier: ${idOrSlug}`);
    }
    return course;
  }

  static async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || 'course');
    const existing = await Course.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;

    // Set order if not set
    if (data.order === undefined || data.order === 0) {
      const highest = await Course.findOne().sort('-order');
      data.order = (highest?.order || 0) + 1;
    }

    return await Course.create(data);
  }

  static async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse> {
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await Course.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw AppError.conflict(`Slug '${data.slug}' is already in use by another course.`);
      }
    }

    const updated = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'instructor.founderRef'
    );
    if (!updated) {
      throw AppError.notFound(`Course not found with ID: ${id}`);
    }
    return updated;
  }

  static async reorderCourses(data: {
    courses?: { id: string; order: number }[];
    courseIds?: string[];
  }): Promise<void> {
    if (data.courses && Array.isArray(data.courses)) {
      await Promise.all(
        data.courses.map((item) =>
          Course.findByIdAndUpdate(item.id, { order: item.order })
        )
      );
    } else if (data.courseIds && Array.isArray(data.courseIds)) {
      await Promise.all(
        data.courseIds.map((id, index) =>
          Course.findByIdAndUpdate(id, { order: index + 1 })
        )
      );
    }
  }

  static async deleteCourse(id: string): Promise<void> {
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Course not found with ID: ${id}`);
    }
  }
}
