import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';

export const runtime = 'nodejs';

// GET /api/workshops/[id]/schedules — public schedule retrieval with real-time capacity
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await BookingService.getProgramSchedules('workshop', id);
    return ApiResponse.success(data, 'Workshop schedules retrieved successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
