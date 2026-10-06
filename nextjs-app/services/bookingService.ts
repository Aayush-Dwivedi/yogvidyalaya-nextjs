import { apiClient } from '@/lib/api/axios';
import { ApiResponse } from '../types';
import {
  Booking,
  CreateBookingPayload,
  BookingFilterParams,
  UpdateBookingStatusPayload,
} from '../types/booking';

export class BookingService {
  /**
   * Create a new booking reservation (Course or Workshop)
   * Strict server-side capacity check and double booking prevention
   */
  static async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const res = (await apiClient.post('/bookings', payload)) as unknown as ApiResponse<Booking>;
    return res.data;
  }

  /**
   * Get student's personal bookings
   */
  static async getMyBookings(
    params?: BookingFilterParams
  ): Promise<{ items: Booking[]; meta: any }> {
    const res = (await apiClient.get('/bookings', { params })) as unknown as ApiResponse<Booking[]>;
    return {
      items: res.data || [],
      meta: (res as any).meta || { total: res.data?.length || 0, page: 1, limit: 10, totalPages: 1 },
    };
  }

  /**
   * Get all bookings (for Admin with search, filters, pagination)
   */
  static async getAllBookings(
    params?: BookingFilterParams
  ): Promise<{ items: Booking[]; meta: any }> {
    const res = (await apiClient.get('/admin/bookings', { params })) as unknown as ApiResponse<Booking[]>;
    return {
      items: res.data || [],
      meta: (res as any).meta || { total: res.data?.length || 0, page: 1, limit: 10, totalPages: 1 },
    };
  }

  /**
   * Get booking details by ID
   */
  static async getBookingById(id: string): Promise<Booking> {
    const res = (await apiClient.get(`/bookings/${id}`)) as unknown as ApiResponse<Booking>;
    return res.data;
  }

  /**
   * Update booking and/or payment status (Admin only)
   */
  static async updateBookingStatus(
    id: string,
    payload: UpdateBookingStatusPayload
  ): Promise<Booking> {
    const res = (await apiClient.patch(`/admin/bookings/${id}/status`, payload)) as unknown as ApiResponse<Booking>;
    return res.data;
  }

  /**
   * Cancel booking (Student or Admin) and release reserved cohort capacity
   */
  static async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const res = (await apiClient.post(`/bookings/${id}/cancel`, { reason })) as unknown as ApiResponse<Booking>;
    return res.data;
  }

  /**
   * Fetch authoritative schedules and real-time seat availability for course or workshop
   */
  static async getProgramSchedules(
    programType: 'course' | 'workshop',
    id: string
  ): Promise<{
    program: any;
    schedules: Array<{
      id: string;
      batch: string;
      date?: string;
      endDate?: string;
      startTime?: string;
      endTime?: string;
      time?: string;
      duration?: string;
      mode: string;
      venue: string;
      location?: string;
      totalCapacity: number;
      enrolled: number;
      availableSeats: number;
      status: string;
      isFull: boolean;
    }>;
  }> {
    const endpoint = programType === 'course' ? `/courses/${id}/schedules` : `/workshops/${id}/schedules`;
    const res = (await apiClient.get(endpoint)) as unknown as ApiResponse<any>;
    return res.data;
  }
}
