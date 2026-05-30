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
        restoreTour: async (id: number): Promise<ApiResponse<string>> => {
    const response = await api.patch<ApiResponse<string>>(`/api/v1/admin/tours/${id}/restore`);
    return response.data;
    },

    // ================= SCHEDULE (LỊCH TRÌNH) =================

    createSchedule: async (data: ScheduleCreateRequest): Promise<ApiResponse<ScheduleResponse>> => {
        const response = await api.post<ApiResponse<ScheduleResponse>>('/api/v1/admin/tours/schedules', data);
        return response.data;
    },

    getSchedulesByTour: async (tourId: number): Promise<ApiResponse<ScheduleResponse[]>> => {
        const response = await api.get<ApiResponse<ScheduleResponse[]>>(`/api/v1/tours/${tourId}/schedules`);
        return response.data;
    },

    updateScheduleStatus: async (id: number, status: string): Promise<ApiResponse<ScheduleResponse>> => {
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
        const response = await api.get<ApiResponse<PricingConfigResponse[]>>(`/api/v1/tours/${tourId}/pricing`);
        return response.data;
    },

    createSurcharge: async (data: SurchargeRequest): Promise<ApiResponse<SurchargeResponse>> => {
        const response = await api.post<ApiResponse<SurchargeResponse>>('/api/v1/admin/tours/surcharges', data);
        return response.data;
    },

    getSurchargesByTour: async (tourId: number): Promise<ApiResponse<SurchargeResponse[]>> => {
        const response = await api.get<ApiResponse<SurchargeResponse[]>>(`/api/v1/admin/tours/${tourId}/surcharges`);
        return response.data;
    },

    deleteSurcharge: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/api/v1/admin/tours/surcharges/${id}`);
        return response.data;
    },

    // ================= THÔNG TIN BỔ TRỢ & TÌM KIẾM =================

    getDestinations: async (): Promise<ApiResponse<DestinationResponse[]>> => {
        const response = await api.get<ApiResponse<DestinationResponse[]>>('/api/v1/destinations');
        return response.data;
    },

    // Đã gộp 2 hàm search lại thành 1 hàm chuẩn type nhất
    searchTours: async (
        params: TourSearchRequest & { page?: number; size?: number; sortBy?: string }
    ): Promise<ApiResponse<PageResponse<TourResponse>>> => {
        const response = await api.get<ApiResponse<PageResponse<TourResponse>>>('/api/v1/tours/search', { 
            params: params 
        });
        return response.data;
    },

    getTourSelectList: async (): Promise<any> => {
        const response = await api.get<any>('/api/v1/tours/select-list');
        return response.data;
    },

    // ================= XỬ LÝ HÌNH ẢNH (Đã fix FormData) =================

    createTourImage: async (data: TourImageRequest): Promise<ApiResponse<string>> => {
        const formData = new FormData();
        formData.append("tourId", data.tourId.toString());
        formData.append("file", data.file); // React phải truyền vào đối tượng File

        const response = await api.post<ApiResponse<string>>('/api/v1/admin/tours/images/upload', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    // Hàm dự phòng: Nếu API Backend của sếp nhận "List<MultipartFile> files"
    createMultipleTourImages: async (tourId: number, files: File[]): Promise<ApiResponse<string[]>> => {
        const formData = new FormData();
        formData.append("tourId", tourId.toString());
        
        // Ném nhiều file vào cùng 1 key "files"
        files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await api.post<ApiResponse<string[]>>('/api/v1/admin/tours/images/upload-multiple', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    uploadRawImage: async (file: File): Promise<ApiResponse<String>> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post<ApiResponse<String>>('/api/v1/admin/tours/images/upload-raw', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    deleteTourImage: async (imageId: number): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/api/v1/admin/tours/images/${imageId}`);
        return response.data;
    }
};