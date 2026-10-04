import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await requireSession();
    const { id } = await params;
    const booking = await BookingService.getBookingById(id, { _id: session.id, role: session.role });
    return ApiResponse.success(booking, 'Booking retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}
