import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { cancelBookingSchema } from '@/lib/validators/booking.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// POST /api/bookings/[id]/cancel
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await requireSession();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const parsed = cancelBookingSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const booking = await BookingService.cancelBooking(
      id,
      { _id: session.id, role: session.role },
      (parsed.data as any).reason
    );
    return ApiResponse.success(booking, 'Booking cancelled successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
