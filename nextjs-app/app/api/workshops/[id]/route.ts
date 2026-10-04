import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { WorkshopService } from '@/lib/services/workshop.service';
import { updateWorkshopSchema } from '@/lib/validators/workshop.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const workshop = await WorkshopService.getWorkshopByIdOrSlug(id);
    return ApiResponse.success(workshop, 'Workshop retrieved');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateWorkshopSchema.body.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest('Validation failed', parsed.error.flatten().fieldErrors);
    }
    const workshop = await WorkshopService.updateWorkshop(id, parsed.data as any);
    return ApiResponse.success(workshop, 'Workshop updated');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdminSession();
    const { id } = await params;
    await WorkshopService.deleteWorkshop(id);
    return ApiResponse.success(null, 'Workshop deleted');
  } catch (error) {
    return handleRouteError(error);
  }
}
