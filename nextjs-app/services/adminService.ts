import { apiClient } from '../api/axios';
import { ApiResponse } from '../types';
import { AdminDashboardData } from '../types/admin';

export class AdminService {
  /**
   * Fetch complete administrator dashboard overview and real-time feeds
   */
  static async getDashboard(): Promise<AdminDashboardData> {
    const res = (await apiClient.get('/admin/dashboard')) as unknown as ApiResponse<AdminDashboardData>;
    return res.data;
  }
}
