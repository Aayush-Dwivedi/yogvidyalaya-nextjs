import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { CorporateService } from '@/lib/services/corporate.service';
import { createCorporateProgramSchema, getCorporateProgramsSchema } from '@/lib/validators/corporate.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const query = getCorporateProgramsSchema.query.parse(rawQuery);

    const result = await CorporateService.getCorporatePrograms(query as any);
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
    const data = createCorporateProgramSchema.body.parse(body);

    const created = await CorporateService.createCorporateProgram(data as any);
    return ApiResponse.created(created, 'Corporate program created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
