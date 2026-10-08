import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Testimonial } from '@/lib/models/Testimonial';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = Number(searchParams.get('limit')) || 50;

    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    } else if (!status) {
      filter.status = 'published';
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { quote: { $regex: search, $options: 'i' } },
        { roleOrTitle: { $regex: search, $options: 'i' } },
        { programOrCourse: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Testimonial.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return ApiResponse.success(items);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();

    if (!body.name || !body.quote) {
      return ApiResponse.badRequest('Name and quote are required');
    }

    const count = await Testimonial.countDocuments();
    const created = await Testimonial.create({
      ...body,
      order: body.order !== undefined ? body.order : count + 1,
      status: body.status || 'published',
      rating: body.rating || 5,
    });

    return ApiResponse.created(created, 'Testimonial created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
