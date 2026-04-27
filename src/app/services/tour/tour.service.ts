import api from '../api';
import { ApiResponse } from '../auth/auth.types';
import {
    TourResponse,
    TourCreateRequest,
    ScheduleResponse,
    ScheduleCreateRequest,
    PricingConfigResponse,
    PricingConfigRequest,
    SurchargeResponse,
    SurchargeRequest,
    DestinationResponse,
    TourImageRequest,
    TourSearchRequest,
    PageResponse
} from './tour.types';

export const tourService = {
    // ================= TOUR (CLIENT & ADMIN) =================

    getAllToursForClient: async (): Promise<ApiResponse<TourResponse[]>> => {
        const response = await api.get<ApiResponse<TourResponse[]>>('/api/v1/tours');
        return response.data;
    },

    getTourByIdForClient: async (id: number): Promise<ApiResponse<TourResponse>> => {
        const response = await api.get<ApiResponse<TourResponse>>(`/api/v1/tours/${id}`);
        return response.data;
    },

    getAllToursForAdmin: async (): Promise<ApiResponse<TourResponse[]>> => {
        const response = await api.get<ApiResponse<TourResponse[]>>('/api/v1/admin/tours');
        return response.data;
    },

    createTour: async (data: TourCreateRequest): Promise<ApiResponse<TourResponse>> => {
        const response = await api.post<ApiResponse<TourResponse>>('/api/v1/admin/tours', data);
        return response.data;
    },

    updateTour: async (id: number, data: TourCreateRequest): Promise<ApiResponse<TourResponse>> => {
        const response = await api.put<ApiResponse<TourResponse>>(`/api/v1/admin/tours/${id}`, data);
        return response.data;
    },

    deleteTour: async (id: number): Promise<ApiResponse<string>> => {
        const response = await api.delete<ApiResponse<string>>(`/api/v1/admin/tours/${id}`);
        return response.data;
    },

    // ================= SCHEDULE (LỊCH TRÌNH) =================

    createSchedule: async (data: ScheduleCreateRequest): Promise<ApiResponse<ScheduleResponse>> => {
        const response = await api.post<ApiResponse<ScheduleResponse>>('/api/v1/admin/tours/schedules', data);
        return response.data;
    },

    // Lấy lịch trình (Client gọi để chọn ngày, Admin gọi để quản lý)
    getSchedulesByTour: async (tourId: number): Promise<ApiResponse<ScheduleResponse[]>> => {
        // Khớp với @GetMapping("/tours/{id}/schedules")
        const response = await api.get<ApiResponse<ScheduleResponse[]>>(`/api/v1/tours/${tourId}/schedules`);
        return response.data;
    },

    updateScheduleStatus: async (id: number, status: string): Promise<ApiResponse<ScheduleResponse>> => {
        // Khớp với @PatchMapping("/admin/schedules/{id}/status")
        const response = await api.patch<ApiResponse<ScheduleResponse>>(`/api/v1/admin/schedules/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    // ================= PRICING & SURCHARGE (GIÁ & PHỤ PHÍ) =================

    createPricing: async (data: PricingConfigRequest): Promise<ApiResponse<PricingConfigResponse>> => {
        const response = await api.post<ApiResponse<PricingConfigResponse>>('/api/v1/admin/tours/pricing', data);
        return response.data;
    },

    getPricingByTour: async (tourId: number): Promise<ApiResponse<PricingConfigResponse[]>> => {
        // Khớp với @GetMapping("/tours/{id}/pricing")
        const response = await api.get<ApiResponse<PricingConfigResponse[]>>(`/api/v1/tours/${tourId}/pricing`);
        return response.data;
    },

    createSurcharge: async (data: SurchargeRequest): Promise<ApiResponse<SurchargeResponse>> => {
        const response = await api.post<ApiResponse<SurchargeResponse>>('/api/v1/admin/tours/surcharges', data);
        return response.data;
    },

    getSurchargesByTour: async (tourId: number): Promise<ApiResponse<SurchargeResponse[]>> => {
        // Khớp với @GetMapping("/admin/tours/{id}/surcharges")
        const response = await api.get<ApiResponse<SurchargeResponse[]>>(`/api/v1/admin/tours/${tourId}/surcharges`);
        return response.data;
    },

    deleteSurcharge: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/api/v1/admin/tours/surcharges/${id}`);
        return response.data;
    },

    // ================= THÔNG TIN BỔ TRỢ =================

    getDestinations: async (): Promise<ApiResponse<DestinationResponse[]>> => {
        const response = await api.get<ApiResponse<DestinationResponse[]>>('/api/v1/destinations');
        return response.data;
    },
    searchTours: async (params: any): Promise<ApiResponse<PageResponse<TourResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<TourResponse>>>('/api/v1/tours/search', { 
      params: params 
    });
    return response.data;
  },
  createTourImage: async (data: TourImageRequest): Promise<ApiResponse<any>> => {
        const response = await api.post<ApiResponse<any>>('/api/v1/admin/tours/images', data);
        return response.data;
    },

    // Nếu Backend ông giáo hỗ trợ ném cả 1 mảng ảnh lên cùng lúc cho nhanh thì dùng hàm này
    createMultipleTourImages: async (data: TourImageRequest[]): Promise<ApiResponse<any>> => {
        const response = await api.post<ApiResponse<any>>('/api/v1/admin/tours/images/batch', data);
        return response.data;
    },

    deleteTourImage: async (imageId: number): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/api/v1/admin/tours/images/${imageId}`);
        return response.data;
    },
    searchTour: async (
        params: TourSearchRequest & { page?: number; size?: number; sortBy?: string }
    ): Promise<ApiResponse<PageResponse<TourResponse>>> => {
        const response = await api.get<ApiResponse<PageResponse<TourResponse>>>('/api/v1/tours/search', { 
            params: params 
        });
        return response.data;
    },
};