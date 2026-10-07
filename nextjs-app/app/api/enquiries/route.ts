import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Enquiry } from '@/lib/models/Enquiry';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { checkRateLimit, getClientIp } from '@/lib/utils/rateLimiter';

export const runtime = 'nodejs';

// POST /api/enquiries — Public General Visitor Enquiry
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

    const validInterests = ['course', 'workshop', 'corporate', 'membership', 'general'];
    const interest = validInterests.includes(programInterest) ? programInterest : 'general';

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      programInterest: interest,
      message: message.trim(),
      status: 'new',
    });

    return ApiResponse.created(
      { id: enquiry._id },
      'Thank you for reaching out. We will get back to you shortly.'
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
