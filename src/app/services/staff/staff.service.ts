import api from '../api'; 
import { ApiResponse } from '../auth/auth.types'; 
import { 
    DepartmentRequest, DepartmentResponse,
    StaffCreateRequest, StaffUpdateRequest, StaffProfileResponse 
} from './staff.types';

const ADMIN_API_URL = '/api/v1/admin';

export const staffService = {
    // ================= QUẢN LÝ NHÂN VIÊN (STAFF) =================

    // 1. Lấy toàn bộ nhân viên hệ thống
    getAllStaffs: async (): Promise<ApiResponse<StaffProfileResponse[]>> => {
        const response = await api.get<ApiResponse<StaffProfileResponse[]>>(`${ADMIN_API_URL}/staffs`);
        return response.data;
    },

    // 2. Lấy chi tiết 1 nhân viên theo mã (employeeCode)
    getStaffByCode: async (employeeCode: string): Promise<ApiResponse<StaffProfileResponse>> => {
        const response = await api.get<ApiResponse<StaffProfileResponse>>(`${ADMIN_API_URL}/staffs/${employeeCode}`);
        return response.data;
    },

    // 3. Tạo mới nhân viên -> Trả về thẳng StaffProfileResponse
    createStaff: async (data: StaffCreateRequest): Promise<ApiResponse<StaffProfileResponse>> => {
        const response = await api.post<ApiResponse<StaffProfileResponse>>(`${ADMIN_API_URL}/staffs`, data);
        return response.data;
    },

    // 4. Cập nhật thông tin nhân viên -> Trả về thẳng StaffProfileResponse
    updateStaff: async (userId: number, data: StaffUpdateRequest): Promise<ApiResponse<StaffProfileResponse>> => {
        const response = await api.put<ApiResponse<StaffProfileResponse>>(`${ADMIN_API_URL}/staffs/${userId}`, data);
        return response.data;
    },

    // 5. Bật/Tắt trạng thái tài khoản nhân viên (Khóa/Mở khóa)
    toggleStaffStatus: async (employeeCode: string): Promise<ApiResponse<string>> => {
        const response = await api.patch<ApiResponse<string>>(`${ADMIN_API_URL}/staffs/${employeeCode}/toggle-status`);
        return response.data;
    },

    // ================= QUẢN LÝ PHÒNG BAN (DEPARTMENT) =================

    getAllDepartments: async (): Promise<ApiResponse<DepartmentResponse[]>> => {
        const response = await api.get<ApiResponse<DepartmentResponse[]>>(`${ADMIN_API_URL}/departments`);
        return response.data;
    },

    createDepartment: async (data: DepartmentRequest): Promise<ApiResponse<DepartmentResponse>> => {
        const response = await api.post<ApiResponse<DepartmentResponse>>(`${ADMIN_API_URL}/departments`, data);
        return response.data;
    },

    updateDepartment: async (id: string, data: DepartmentRequest): Promise<ApiResponse<DepartmentResponse>> => {
        const response = await api.put<ApiResponse<DepartmentResponse>>(`${ADMIN_API_URL}/departments/${id}`, data);
        return response.data;
    },

    deleteDepartment: async (id: string): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`${ADMIN_API_URL}/departments/${id}`);
        return response.data;
    }
};