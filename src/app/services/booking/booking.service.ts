import api from '../api'; 
import { 
  BookingCreateRequest, 
  BookingCancelRequest, 
  BookingResponse 
} from './booking.types';

export const bookingService = {
  
  createBooking: async (data: BookingCreateRequest): Promise<BookingResponse> => {
    const response = await api.post<BookingResponse>('/api/v1/bookings', data);
    return response.data;
  },

  getMyBookings: async (): Promise<BookingResponse[]> => {
    const response = await api.get<BookingResponse[]>('/api/v1/bookings/me');
    return response.data;
  },

  getBookingById: async (bookingId: number): Promise<BookingResponse> => {
    const response = await api.get<BookingResponse>(`/api/v1/bookings/${bookingId}`);
    return response.data;
  },
  lookupBooking: async (bookingCode: string, email: string): Promise<BookingResponse> => {
    const response = await api.get<BookingResponse>('/api/v1/bookings/lookup', {
      params: { bookingCode, email } 
    });
    return response.data;
  },

  cancelBooking: async (bookingId: number, reason: string = "Người dùng yêu cầu hủy"): Promise<BookingResponse> => {
    const requestData: BookingCancelRequest = { bookingId, reason };
    const response = await api.post<BookingResponse>('/api/v1/bookings/cancel', requestData);
    return response.data;
  }
};