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

// POST /api/bookings — Decommissioned: Online visitor booking submission is decommissioned.
// Visitors contact Kalptaruu Yoga Vidhyalaya directly via Phone, Email, or WhatsApp.
export async function POST(_request: NextRequest) {
  return ApiResponse.badRequest(
    'Public online booking creation is decommissioned. Please contact Kalptaruu Yoga Vidhyalaya directly.'
  );
}

