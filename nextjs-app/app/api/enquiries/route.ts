import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { EnquiryService } from '@/lib/services/enquiry.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { checkRateLimit, getClientIp } from '@/lib/utils/rateLimiter';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// GET /api/enquiries — View all enquiries from database (staff/management only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 25;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await EnquiryService.getEnquiries({ page, limit, status, search });
    return ApiResponse.paginated(result.items, result.meta, 'Enquiries retrieved from database');
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/enquiries — Public General Visitor Enquiry (direct database submission)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(ip, 'enquiry', 10, 60 * 1000);
    if (!limit.allowed) {
      return ApiResponse.tooManyRequests('Too many requests. Please try again shortly.');
    }

    await connectDB();
    const body = await request.json();

    const { name, email, phone, programInterest, message } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return ApiResponse.badRequest('Your name is required.');
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return ApiResponse.badRequest('A valid email address is required.');
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return ApiResponse.badRequest('A message is required.');
    }

    const enquiry = await EnquiryService.createEnquiry({
      name,
      email,
      phone,
      programInterest,
      message,
    });

    return ApiResponse.created(
      { id: enquiry._id },
      'Thank you for reaching out. Your enquiry has been received and logged into our database.'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
