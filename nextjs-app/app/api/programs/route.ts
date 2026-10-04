import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { ProgramService } from '@/lib/services/program.service';
import { createProgramSchema, getProgramsSchema } from '@/lib/validators/program.validator';
import { ApiResponse, handleRouteError } from '@/lib/utils/apiResponse';
import { requireAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const query = getProgramsSchema.query.parse(rawQuery);

    const result = await ProgramService.getPrograms(query as any);
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
    const data = createProgramSchema.body.parse(body);

    const created = await ProgramService.createProgram(data as any);
    return ApiResponse.created(created, 'Program created successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}
