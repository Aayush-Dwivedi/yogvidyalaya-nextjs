import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BenefitService } from '@/lib/services/benefit.service';
import { updateBenefitSchema } from '@/lib/validators/benefit.validator';
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
    const benefit = await BenefitService.getBenefitById(id);
    return ApiResponse.success(benefit);
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
    const data = updateBenefitSchema.body.parse(body);

    const updated = await BenefitService.updateBenefit(id, data as any);
    return ApiResponse.success(updated, 'Benefit updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await BenefitService.deleteBenefit(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
