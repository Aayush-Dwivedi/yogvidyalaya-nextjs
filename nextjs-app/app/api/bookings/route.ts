import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { createBookingSchema } from '@/lib/validators/booking.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/utils/rateLimiter';

export const runtime = 'nodejs';

// GET /api/bookings — Protected for Admin only
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { searchParams } = new URL(request.url);

    const query = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
      status: searchParams.get('status') || undefined,
      paymentStatus: searchParams.get('paymentStatus') || undefined,
      programType: searchParams.get('programType') || undefined,
      programId: searchParams.get('programId') || undefined,
      program: searchParams.get('program') || undefined,
      date: searchParams.get('date') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      search: searchParams.get('search') || undefined,
    };

    const result = await BookingService.getBookings(query);
    return ApiResponse.paginated(result.items, result.meta, 'Bookings retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/bookings — Public visitor booking request creation
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(ip, 'booking', 20, 60 * 1000);
    if (!limit.allowed) {
      return ApiResponse.tooManyRequests('Too many booking requests. Please try again shortly.');
    }

    await connectDB();
    const body = await request.json();

    const parsed = createBookingSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }

    const booking = await BookingService.createBooking(parsed.data as any);
    return ApiResponse.created(booking, 'Booking request submitted successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

