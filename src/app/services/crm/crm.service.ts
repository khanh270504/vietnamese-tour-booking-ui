import api from '../api'; 
import { ApiResponse } from '../auth/auth.types'; 
import { 
    LeadCreateRequest, LeadUpdateRequest, LeadResponse,
    InteractionCreateRequest, InteractionResponse,
    TaskCreateRequest, TaskResponse, 
} from './crm.types';

const CRM_API_URL = '/api/v1/crm';

export const crmService = {
    // ================= LEADS =================

    getAllLeads: async (): Promise<ApiResponse<LeadResponse[]>> => {
        const response = await api.get<ApiResponse<LeadResponse[]>>(`${CRM_API_URL}/leads`);
        return response.data;
    },
    
    getLeadById: async (id: number): Promise<ApiResponse<LeadResponse>> => {
        const response = await api.get<ApiResponse<LeadResponse>>(`${CRM_API_URL}/leads/${id}`);
        return response.data;
    },
    

    createLead: async (data: LeadCreateRequest): Promise<ApiResponse<LeadResponse>> => {
        const response = await api.post<ApiResponse<LeadResponse>>(`${CRM_API_URL}/leads`, data);
        return response.data;
    },

    updateLead: async (id: number, data: LeadUpdateRequest): Promise<ApiResponse<LeadResponse>> => {
        const response = await api.put<ApiResponse<LeadResponse>>(`${CRM_API_URL}/leads/${id}`, data);
        return response.data;
    },

    updateLeadStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
        const response = await api.patch<ApiResponse<any>>(`${CRM_API_URL}/leads/${id}/status?status=${status}`);
        return response.data;
    },

    deleteLead: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`${CRM_API_URL}/leads/${id}`);
        return response.data;
    },

    // ================= INTERACTIONS =================

    createInteraction: async (data: InteractionCreateRequest): Promise<ApiResponse<InteractionResponse>> => {
        const response = await api.post<ApiResponse<InteractionResponse>>(`${CRM_API_URL}/interactions`, data);
        return response.data;
    },

    getInteractionsByLead: async (leadId: number): Promise<ApiResponse<InteractionResponse[]>> => {
        const response = await api.get<ApiResponse<InteractionResponse[]>>(`${CRM_API_URL}/interactions/lead/${leadId}`);
        return response.data;
    },

    // ================= TASKS =================

    //  Lấy tất cả task (dùng cho LeadDetailPanel)
    getAllTasks: async (): Promise<ApiResponse<TaskResponse[]>> => {
        const response = await api.get<ApiResponse<TaskResponse[]>>(`${CRM_API_URL}/tasks`);
        return response.data;
    },

    //  Lấy task của riêng mình (dùng cho Dashboard)
    getMyTasks: async (): Promise<ApiResponse<TaskResponse[]>> => {
        const response = await api.get<ApiResponse<TaskResponse[]>>(`${CRM_API_URL}/tasks/me`);
        return response.data;
    },

    createTask: async (data: TaskCreateRequest): Promise<ApiResponse<TaskResponse>> => {
        const response = await api.post<ApiResponse<TaskResponse>>(`${CRM_API_URL}/tasks`, data);
        return response.data;
    },

    completeTask: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.post<ApiResponse<void>>(`${CRM_API_URL}/tasks/${id}/complete`);
        return response.data;
    },

    deleteTask: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`${CRM_API_URL}/tasks/${id}`);
        return response.data;
    },
    updateTask: async (id: number, data: TaskCreateRequest): Promise<ApiResponse<TaskResponse>> => {
        const response = await api.put<ApiResponse<TaskResponse>>(`${CRM_API_URL}/tasks/${id}`, data);
        return response.data;
}
};