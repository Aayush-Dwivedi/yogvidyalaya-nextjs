import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { createBookingSchema } from '@/lib/validators/booking.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// GET /api/bookings
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireSession();
    const { searchParams } = new URL(request.url);

    const query = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
      status: searchParams.get('status') || undefined,
      paymentStatus: searchParams.get('paymentStatus') || undefined,
      programType: searchParams.get('programType') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Admins see all bookings; students see only their own
    const studentId = ['admin', 'super_admin'].includes(session.role)
      ? undefined
      : session.id;

    const result = await BookingService.getBookings(query, studentId);
    return ApiResponse.paginated(result.items, result.meta, 'Bookings retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/bookings — authenticated student
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireSession();
    const body = await request.json();

    const parsed = createBookingSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const booking = await BookingService.createBooking(session.id, parsed.data as any);
    return ApiResponse.created(booking, 'Booking confirmed successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
