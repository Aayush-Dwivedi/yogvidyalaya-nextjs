import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { BenefitService } from '@/lib/services/benefit.service';
import { createBenefitSchema, getBenefitsSchema } from '@/lib/validators/benefit.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const query = getBenefitsSchema.query.parse(rawQuery);

    const result = await BenefitService.getBenefits(query as any);
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
    const data = createBenefitSchema.body.parse(body);

    const created = await BenefitService.createBenefit(data as any);
    return ApiResponse.created(created, 'Benefit created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
