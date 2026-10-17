import { Enquiry, IEnquiry } from '../models/Enquiry';

export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  programInterest?: 'course' | 'workshop' | 'corporate' | 'membership' | 'general';
  message: string;
}

export interface GetEnquiriesQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export class EnquiryService {
  /**
   * Directly record a visitor inquiry in MongoDB database
   */
  static async createEnquiry(input: CreateEnquiryInput): Promise<IEnquiry> {
    const validInterests = ['course', 'workshop', 'corporate', 'membership', 'general'];
    const interest = input.programInterest && validInterests.includes(input.programInterest)
      ? input.programInterest
      : 'general';

    const enquiry = await Enquiry.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone ? String(input.phone).trim() : undefined,
      programInterest: interest,
      message: input.message.trim(),
      status: 'new',
    });

    return enquiry;
  }

  /**
   * Fetch paginated list of inquiries from database with optional status filter & search
   */
  static async getEnquiries(query: GetEnquiriesQuery = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (query.status && ['new', 'in_progress', 'contacted', 'resolved'].includes(query.status)) {
      filter.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex },
      ];
    }

    const [items, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single inquiry by id
   */
  static async getEnquiryById(id: string): Promise<IEnquiry | null> {
    return Enquiry.findById(id);
  }

  /**
   * Update inquiry status or administrative notes
   */
  static async updateEnquiry(id: string, updates: { status?: string; notes?: string }): Promise<IEnquiry | null> {
    const updateData: Record<string, any> = {};
    if (updates.status && ['new', 'in_progress', 'contacted', 'resolved'].includes(updates.status)) {
      updateData.status = updates.status;
    }
    if (typeof updates.notes === 'string') {
      updateData.notes = updates.notes;
    }

    return Enquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
  }

  /**
   * Remove an inquiry
   */
  static async deleteEnquiry(id: string): Promise<boolean> {
    const res = await Enquiry.findByIdAndDelete(id);
    return !!res;
  }
}
