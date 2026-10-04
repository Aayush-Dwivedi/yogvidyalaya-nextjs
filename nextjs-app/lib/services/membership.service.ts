import { Types } from 'mongoose';
import { MembershipPlan, IMembershipPlan } from '../models/MembershipPlan';
import { AppError } from '../utils/appError';
import { generateSlug } from '../utils/slugify';
import {
  PaginationQuery,
  PaginationMeta,
  BillingCycle,
} from '../types/content.types';

export interface MembershipFilterQuery extends PaginationQuery {
  billingCycle?: BillingCycle;
}

export class MembershipService {
  static async getMembershipPlans(
    query: MembershipFilterQuery
  ): Promise<{ items: IMembershipPlan[]; meta: PaginationMeta }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (query.billingCycle) {
      filter.billingCycle = query.billingCycle;
    }

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    } else if (!query.status) {
      filter.status = 'published';
    }

    const sortField = query.sort || 'order';

    const [items, total] = await Promise.all([
      MembershipPlan.find(filter).sort(sortField).skip(skip).limit(limit),
      MembershipPlan.countDocuments(filter),
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

  static async getMembershipPlanByIdOrSlug(idOrSlug: string): Promise<IMembershipPlan> {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const plan = await MembershipPlan.findOne(filter);
    if (!plan) {
      throw AppError.notFound(`Membership plan not found with identifier: ${idOrSlug}`);
    }
    return plan;
  }

  static async createMembershipPlan(data: Partial<IMembershipPlan>): Promise<IMembershipPlan> {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || 'membership-plan');
    const existing = await MembershipPlan.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;

    return await MembershipPlan.create(data);
  }

  static async updateMembershipPlan(
    id: string,
    data: Partial<IMembershipPlan>
  ): Promise<IMembershipPlan> {
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await MembershipPlan.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        throw AppError.conflict(`Slug '${data.slug}' is already in use.`);
      }
    }

    const updated = await MembershipPlan.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw AppError.notFound(`Membership plan not found with ID: ${id}`);
    }
    return updated;
  }

  static async deleteMembershipPlan(id: string): Promise<void> {
    const deleted = await MembershipPlan.findByIdAndDelete(id);
    if (!deleted) {
      throw AppError.notFound(`Membership plan not found with ID: ${id}`);
    }
  }
}
