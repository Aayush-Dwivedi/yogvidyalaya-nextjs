import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { MembershipService } from '@/lib/services/membership.service';
import { updateMembershipPlanSchema } from '@/lib/validators/membership.validator';
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
    const plan = await MembershipService.getMembershipPlanByIdOrSlug(id);
    return ApiResponse.success(plan);
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
    const parsed = updateMembershipPlanSchema.body.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const details = Object.entries(fieldErrors)
        .map(([k, v]) => `${k}: ${v?.join(', ')}`)
        .join('; ');
      return ApiResponse.badRequest(`Validation failed: ${details}`, fieldErrors);
    }

    const updated = await MembershipService.updateMembershipPlan(id, parsed.data as any);
    return ApiResponse.success(updated, 'Membership plan updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await MembershipService.deleteMembershipPlan(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
