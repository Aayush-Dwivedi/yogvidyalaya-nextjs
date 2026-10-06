import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BookingService } from '@/lib/services/booking.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// GET /api/admin/bookings — admin-only booking list with filtering, searching, and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { searchParams } = new URL(request.url);

    const query = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
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
    return ApiResponse.paginated(result.items, result.meta, 'Admin bookings retrieved successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
