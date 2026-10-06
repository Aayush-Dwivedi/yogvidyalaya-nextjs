import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { updateBookingStatusSchema } from '@/lib/validators/booking.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// PATCH /api/bookings/[id]/status — admin only
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await params;
    const body = await request.json();

    const parsed = updateBookingStatusSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const booking = await BookingService.updateBookingStatus(id, parsed.data as any);
    return ApiResponse.success(booking, 'Booking status updated');
  } catch (error) {
    return handleRouteError(error);
  }
}
