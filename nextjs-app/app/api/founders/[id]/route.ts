import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { FounderService } from '@/lib/services/founder.service';
import { updateFounderSchema } from '@/lib/validators/founder.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const founder = await FounderService.getFounderByIdOrSlug(id);
    return ApiResponse.success(founder);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    const body = await request.json();
    const data = updateFounderSchema.body.parse(body);

    const updated = await FounderService.updateFounder(id, data as any);
    return ApiResponse.success(updated, 'Founder profile updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await FounderService.deleteFounder(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
