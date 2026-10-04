import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { CorporateService } from '@/lib/services/corporate.service';
import { updateCorporateProgramSchema } from '@/lib/validators/corporate.validator';
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
    const program = await CorporateService.getCorporateProgramByIdOrSlug(id);
    return ApiResponse.success(program);
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
    const data = updateCorporateProgramSchema.body.parse(body);

    const updated = await CorporateService.updateCorporateProgram(id, data as any);
    return ApiResponse.success(updated, 'Corporate program updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await CorporateService.deleteCorporateProgram(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
