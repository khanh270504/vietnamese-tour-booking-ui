import api from '../api'; 
import { ApiResponse } from '../auth/auth.types';
import { 
  BookingCreateRequest, 
  BookingCancelRequest, 
  BookingResponse, 
  BookingStatus,
  PassengerResponse,
} from './booking.types';


export const bookingService = {
  
  createBooking: async (data: BookingCreateRequest): Promise<any> => { 
    const response = await api.post('/api/v1/bookings', data);
    return response.data;
  },

  getMyBookings: async (): Promise<any> => {
    const response = await api.get('/api/v1/bookings/me');
    return response.data;
  },

  getBookingById: async (bookingId: number): Promise<any> => {
    const response = await api.get(`/api/v1/bookings/${bookingId}`);
    return response.data;
  },

  lookupBooking: async (bookingCode: string, email: string): Promise<any> => {
    const response = await api.get('/api/v1/bookings/lookup', {
      params: { bookingCode, email } 
    });
    return response.data;
  },

  cancelBooking: async (bookingId: number, reason: string = "Người dùng yêu cầu hủy"): Promise<any> => {
    const requestData: BookingCancelRequest = { bookingId, reason };
    const response = await api.post('/api/v1/bookings/cancel', requestData);
    return response.data;
  },

  getAllBookingsForAdmin: async (): Promise<any> => {
    const response = await api.get('/api/v1/admin/bookings');
    return response.data;
  },

  updateBookingStatus: async (bookingId: number, status: BookingStatus, reason?: string): Promise<any> => {
    const response = await api.patch(`/api/v1/admin/bookings/${bookingId}/status`, { status, reason });
    return response.data;
  },
  getPassengersBySchedule: async (scheduleId: number): Promise<ApiResponse<PassengerResponse[]>> => {
    const response = await api.get(`/api/v1/bookings/schedule/${scheduleId}/passengers`);
    return response.data;
  },
};