export enum TicketStatus {
    OPEN = 'OPEN',
    PROCESSING = 'PROCESSING',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}
export const TicketStatusLabel: Record<TicketStatus, string> = {
    [TicketStatus.OPEN]: 'Đang mở',
    [TicketStatus.PROCESSING]: 'Đang xử lý',
    [TicketStatus.RESOLVED]: 'Đã giải quyết',
    [TicketStatus.CLOSED]: 'Đã đóng'
};

export const TicketPriorityLabel: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: 'Thấp',
    [TicketPriority.MEDIUM]: 'Trung bình',
    [TicketPriority.HIGH]: 'Cao'
};

export interface ApiResponse<T> {
    code: number;
    message?: string;
    result: T;
}

export interface SupportTicketCreateRequest {
    bookingCode?: string | null;
    subject: string;
    description: string;
    priority?: TicketPriority; 
}

export interface SupportTicketProcessRequest {
    status: TicketStatus;
    priority?: TicketPriority;
    responseMessage: string;
}

export interface SupportTicketResponse {
    id: number;
    customerName: string | null;
    customerPhone: string | null;
    customerEmail: string | null;
    bookingCode: string | null;
    subject: string;
    description: string;
    adminResponse: string | null;
    priority: TicketPriority;
    status: TicketStatus;
    assignedStaffName: string;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}