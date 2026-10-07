import { getDBStatus } from '@/lib/db/mongoose';
import { ApiResponse } from '@/lib/utils/apiResponse';

export const runtime = 'nodejs';

export async function GET() {
  const db = getDBStatus();
  return ApiResponse.success(
    {
      status: 'operational',
      database: db,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    'Kalptaruu Yoga Vidhyalaya API — healthy'
  );
}
