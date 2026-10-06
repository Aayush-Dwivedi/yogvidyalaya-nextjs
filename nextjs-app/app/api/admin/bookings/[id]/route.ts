import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// GET /api/admin/bookings/[id] — admin single booking inspection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await requireAdminSession(request);
    const { id } = await params;
    const booking = await BookingService.getBookingById(id, { _id: session.id, role: session.role });
    return ApiResponse.success(booking, 'Booking details retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}
