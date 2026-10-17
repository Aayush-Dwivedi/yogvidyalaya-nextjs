import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { EnquiryService } from '@/lib/services/enquiry.service';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

// PATCH /api/enquiries/[id] — Update enquiry status or notes in database
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { id } = await params;

    const body = await request.json();
    const { status, notes } = body;

    const updated = await EnquiryService.updateEnquiry(id, { status, notes });
    if (!updated) {
      return ApiResponse.notFound('Enquiry not found');
    }

    return ApiResponse.success(updated, 'Enquiry updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/enquiries/[id] — Remove an enquiry from database
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession(request);
    const { id } = await params;

    const deleted = await EnquiryService.deleteEnquiry(id);
    if (!deleted) {
      return ApiResponse.notFound('Enquiry not found');
    }

    return ApiResponse.success(null, 'Enquiry removed from database');
  } catch (error) {
    return handleRouteError(error);
  }
}
