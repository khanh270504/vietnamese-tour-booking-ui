import axiosInstance from '../api'; // File cấu hình axios có sẵn interceptor nạp JWT của ông
import { 
    ApiResponse, 
    SupportTicketCreateRequest, 
    SupportTicketProcessRequest, 
    SupportTicketResponse, 
    TicketStatus 
} from './ticket.type';

const TICKET_API_URL = '/api/v1/support-tickets';

export const ticketService = {

    
    createTicket: async (data: SupportTicketCreateRequest): Promise<ApiResponse<SupportTicketResponse>> => {
        const response = await axiosInstance.post<ApiResponse<SupportTicketResponse>>(TICKET_API_URL, data);
        return response.data;
    },

    
    getMyTickets: async (): Promise<ApiResponse<SupportTicketResponse[]>> => {
        const response = await axiosInstance.get<ApiResponse<SupportTicketResponse[]>>(`${TICKET_API_URL}/my-tickets`);
        return response.data;
    },


    getAllTicketsForAdmin: async (status?: TicketStatus): Promise<ApiResponse<SupportTicketResponse[]>> => {
        const params = status ? { status } : {};
        const response = await axiosInstance.get<ApiResponse<SupportTicketResponse[]>>(`${TICKET_API_URL}/admin/all`, { params });
        return response.data;
    },

    createTicketByAdmin: async (data: SupportTicketCreateRequest): Promise<ApiResponse<SupportTicketResponse>> => {
        const response = await axiosInstance.post<ApiResponse<SupportTicketResponse>>(
            `${TICKET_API_URL}/admin/create-for-customer`, 
            data
        );
        return response.data;
    },

    processTicket: async (ticketId: number, data: SupportTicketProcessRequest): Promise<ApiResponse<SupportTicketResponse>> => {
        const response = await axiosInstance.put<ApiResponse<SupportTicketResponse>>(
            `${TICKET_API_URL}/admin/${ticketId}/process`, 
            data
        );
        return response.data;
    }
};