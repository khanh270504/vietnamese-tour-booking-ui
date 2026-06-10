import api from '../api';
import { ProviderRequest, ProviderResponse, ProviderStatus  } from './provider.types';

const PROVIDER_API_URL = '/api/v1/providers';

export const providerService = {
    // 1. Lấy danh sách toàn bộ nhà cung cấp
    getAll: async (): Promise<ProviderResponse[]> => {
        const response = await api.get(PROVIDER_API_URL);
        return response.data.result;
    },

    // 2. Lấy chi tiết 1 nhà cung cấp
    getById: async (id: number): Promise<ProviderResponse> => {
        const response = await api.get(`${PROVIDER_API_URL}/${id}`);
        return response.data.result;
    },

    // 3. Tạo mới nhà cung cấp
    create: async (data: ProviderRequest): Promise<ProviderResponse> => {
        const response = await api.post(PROVIDER_API_URL, data);
        return response.data.result;
    },

    // 4. Cập nhật thông tin
    update: async (id: number, data: ProviderRequest): Promise<ProviderResponse> => {
        const response = await api.put(`${PROVIDER_API_URL}/${id}`, data);
        return response.data.result;
    },

    // 5. Cập nhật nhanh trạng thái (VD: Duyệt hợp tác)
    changeStatus: async (id: number, status: ProviderStatus): Promise<ProviderResponse> => {
        const response = await api.patch(`${PROVIDER_API_URL}/${id}/status`, { status });
        return response.data.result;
    },

    // 6. Xóa / Ngừng hợp tác
    delete: async (id: number): Promise<void> => {
        await api.delete(`${PROVIDER_API_URL}/${id}`);
    }
};