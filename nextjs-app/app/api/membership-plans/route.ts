import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { MembershipService } from '@/lib/services/membership.service';
import { createMembershipPlanSchema, getMembershipPlansSchema } from '@/lib/validators/membership.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const query = getMembershipPlansSchema.query.parse(rawQuery);

    const result = await MembershipService.getMembershipPlans(query as any);
    return ApiResponse.paginated(result.items, result.meta);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const body = await request.json();
    const data = createMembershipPlanSchema.body.parse(body);

    const created = await MembershipService.createMembershipPlan(data as any);
    return ApiResponse.created(created, 'Membership plan created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
