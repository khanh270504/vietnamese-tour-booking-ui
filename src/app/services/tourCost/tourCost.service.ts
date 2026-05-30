import api from '../api';
import { TourCostRequest, TourCostResponse, TourCostStatus } from './tourCost.types';

const COST_API_URL = '/api/v1/tour-costs';

export const tourCostService = {
    // 1. Lấy toàn bộ chi phí CỦA 1 LỊCH TRÌNH (Để vẽ bảng trong màn hình Chi tiết Schedule)
    getByScheduleId: async (scheduleId: number): Promise<TourCostResponse[]> => {
        const response = await api.get(`${COST_API_URL}/schedule/${scheduleId}`);
        return response.data.result;
    },

    // 2. Lấy chi tiết 1 phiếu chi (Để hiển thị vào form khi bấm Sửa)
    getById: async (id: number): Promise<TourCostResponse> => {
        const response = await api.get(`${COST_API_URL}/${id}`);
        return response.data.result;
    },

    // 3. Thêm khoản chi phí mới (Khi nhân viên điều hành chốt xong dịch vụ)
    create: async (data: TourCostRequest): Promise<TourCostResponse> => {
        const response = await api.post(COST_API_URL, data);
        return response.data.result;
    },

    // 4. Sửa thông tin phiếu chi
    update: async (id: number, data: TourCostRequest): Promise<TourCostResponse> => {
        const response = await api.put(`${COST_API_URL}/${id}`, data);
        return response.data.result;
    },

    // 5. Kế toán cập nhật trạng thái (VD: Bấm nút "Đã thanh toán" UNPAID -> PAID)
    updateStatus: async (id: number, status: TourCostStatus, note?: string): Promise<TourCostResponse> => {
        const response = await api.patch(`${COST_API_URL}/${id}/status`, { status, note });
        return response.data.result;
    },

    // 6. Xóa khoản chi (Nếu nhập sai hoàn toàn)
    delete: async (id: number): Promise<void> => {
        await api.delete(`${COST_API_URL}/${id}`);
    }
};