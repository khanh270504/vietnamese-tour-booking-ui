
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
export type InteractionType = 'CALL' | 'EMAIL' | 'MEETING' | 'ZALO' | 'OTHER';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type LeadPriority = 'HOT' | 'WARM' | 'COLD';
export type LeadSource = 'FACEBOOK' | 'GOOGLE' | 'TIKTOK' | 'WEBSITE' | 'REFERRAL' | 'ZALO';
export type InteractionResult = 'SUCCESS' | 'NO_RESPONSE' | 'INTERESTED' | 'NOT_INTERESTED' | 'CALL_BACK_LATER';
export type TaskType = 'CALL_CUSTOMER' | 'SEND_QUOTATION' | 'CONFIRM_BOOKING' | 'FOLLOW_UP' | 'CHECK_PAYMENT';


export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
    NEW: 'Khách mới',
    CONTACTED: 'Đã liên hệ',
    QUALIFIED: 'Tiềm năng cao',
    PROPOSAL: 'Đã gửi báo giá',
    WON: 'Đã chốt Tour',
    LOST: 'Mất khách '
};

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
    CALL: ' Gọi điện thoại',
    ZALO: ' Nhắn tin Zalo',
    EMAIL: 'Gửi Hộp thư Email',
    MEETING: 'Gặp mặt trực tiếp',
    OTHER: 'Kênh tương tác khác'
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
    LOW: 'Thấp',
    MEDIUM: 'Trung bình',
    HIGH: 'Cao ',
    URGENT: 'Khẩn cấp '
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'Cần làm',
    IN_PROGRESS: 'Đang xử lý',
    DONE: 'Đã hoàn thành ',
    CANCELLED: 'Đã hủy bỏ'
};

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
    HOT: 'Rất Tiềm Năng (HOT) ',
    WARM: 'Tiềm Năng Vừa (WARM) ',
    COLD: 'Ít Tiềm Năng (COLD) '
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
    FACEBOOK: 'Facebook Ads / Fanpage',
    GOOGLE: 'Tìm kiếm Google',
    TIKTOK: 'Mạng xã hội TikTok',
    WEBSITE: 'Form Đăng ký Website',
    REFERRAL: 'Khách cũ giới thiệu',
    ZALO: 'Kênh Zalo OA / Cá nhân'
};

export const INTERACTION_RESULT_LABELS: Record<InteractionResult, string> = {
    SUCCESS: 'Kết nối thành công',
    NO_RESPONSE: 'Không bắt máy / Sai số ',
    INTERESTED: 'Khách thích lịch trình',
    NOT_INTERESTED: 'Khách không có nhu cầu ',
    CALL_BACK_LATER: 'Hẹn gọi lại sau'
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
    CALL_CUSTOMER: 'Gọi điện chăm sóc',
    SEND_QUOTATION: 'Làm lịch trình & Báo giá',
    CONFIRM_BOOKING: 'Xác nhận Booking / Hợp đồng',
    FOLLOW_UP: 'Chăm sóc định kỳ',
    CHECK_PAYMENT: 'Kiểm tra tiền cọc / Kế toán'
};

export interface LeadCreateRequest {
    fullName: string;
    phone: string;
    email?: string;
    source?: LeadSource; 
    interestedTourId?: number;
    assignedStaffId?: number;
    notes?: string;
}

export interface LeadUpdateRequest {
    fullName?: string;
    phone?: string;              
    email?: string;
    source?: LeadSource;         
    status?: LeadStatus;
    priority?: LeadPriority; 
    interestedTourId?: number;   
    expectedTravelDate?: string; 
    estimatedPeople?: number;
    estimatedBudget?: number;
    notes?: string;
    assignedStaffId?: number;
    lostReason?: string;
}

export interface LeadResponse {
    id: number;
    leadCode: string;
    fullName: string;
    phone: string;
    email: string;
    source: LeadSource; 
    status: LeadStatus; 
    priority: LeadPriority; 
    interestedTourName: string;
    interestedTourId: number;
    assignedStaffName: string;
    estimatedPeople: number;
    estimatedBudget: number;
    
    expectedTravelDate?: string; 
    lastContactAt?: string;      
    converted?: boolean;         
    convertedBookingId?: number; 
    
    nextFollowUpAt: string;
    notes: string;
}


export interface InteractionCreateRequest {
    leadId: number;
    interactionType: InteractionType;
    result?: InteractionResult; 
    note?: string;
    nextActionDate?: string; 
}

export interface InteractionResponse {
    id: number;
    staffName: string;
    staffAvatar: string;
    interactionType: InteractionType;
    result: InteractionResult;
    note: string;
    nextActionDate: string;
    createdAt: string;
}

export interface TaskCreateRequest {
    title: string;
    description?: string;
    leadId: number;
    assignedStaffId?: number;
    taskType: TaskType;
    priority?: TaskPriority;
    dueDate?: string;
    note?: string;

}

export interface TaskStatusUpdateRequest {
    status: TaskStatus;
}

export interface TaskResponse {
    id: number;
    title: string;
    description: string;
    
    leadId: number; 
    leadName: string;
    staffName: string;

    status: TaskStatus;
    priority: TaskPriority;
    taskType: TaskType;
    
    dueDate: string;
    completedAt?: string; 
    note: string;
    createdAt: string;
}
export interface LeadConvertRequest {
    adultCount?: number;
    childCount?: number;
    infantCount?: number;
    voucherCode?: string;
}