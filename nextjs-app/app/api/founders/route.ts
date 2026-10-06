import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { FounderService } from '@/lib/services/founder.service';
import { createFounderSchema, getFoundersSchema } from '@/lib/validators/founder.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const query = getFoundersSchema.query.parse(rawQuery);

    const result = await FounderService.getFounders(query as any);
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
    const data = createFounderSchema.body.parse(body);

    const created = await FounderService.createFounder(data as any);
    return ApiResponse.created(created, 'Founder profile created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
