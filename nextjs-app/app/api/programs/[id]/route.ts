import { type NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { ProgramService } from '@/lib/services/program.service';
import { updateProgramSchema } from '@/lib/validators/program.validator';
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
    const program = await ProgramService.getProgramByIdOrSlug(id);
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
    const data = updateProgramSchema.body.parse(body);

    const updated = await ProgramService.updateProgram(id, data as any);
    return ApiResponse.success(updated, 'Program updated successfully');
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    await requireAdminSession(request);

    const { id } = await context.params;
    await ProgramService.deleteProgram(id);
    return ApiResponse.noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
