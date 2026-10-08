import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Testimonial } from '@/lib/models/Testimonial';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const item = await Testimonial.findById(id).lean();
    if (!item) {
      return ApiResponse.notFound('Testimonial not found');
    }
    return ApiResponse.success(item);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { id } = await params;
    const body = await request.json();

    const updated = await Testimonial.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return ApiResponse.notFound('Testimonial not found');
    }

    return ApiResponse.success(updated, 'Testimonial updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { id } = await params;

    const deleted = await Testimonial.findByIdAndDelete(id).lean();
    if (!deleted) {
      return ApiResponse.notFound('Testimonial not found');
    }

    return ApiResponse.success(deleted, 'Testimonial deleted successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
