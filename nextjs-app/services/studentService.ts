import { apiClient } from '@/lib/api/axios';
import { ApiResponse } from '../types';
import { StudentDashboardData } from '../types/student';

export class StudentService {
  /**
   * Fetch complete student dashboard data from backend
   */
  static async getDashboard(): Promise<StudentDashboardData> {
    const res = (await apiClient.get('/student/dashboard')) as unknown as ApiResponse<StudentDashboardData>;
    return res.data;
  }
}
