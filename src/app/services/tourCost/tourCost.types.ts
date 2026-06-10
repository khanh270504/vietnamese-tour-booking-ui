// Trạng thái thanh toán của kế toán
export type TourCostStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';

export interface TourCostRequest {
    scheduleId: number;            
    providerId: number;             
    expenseName: string;             
    amount: number;                
    status: TourCostStatus;        
    note?: string;                  
    paidAt?: string;               
}

export interface TourCostResponse {
    id: number;
    
    scheduleId: number;
    tourName: string;               
    providerId: number;
    providerName: string;           
    providerCode: string;
    
    expenseName: string;
    amount: number;
    status: TourCostStatus;
    note: string;
    paidAt: string;                
    createdAt: string;              
}
export interface PageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: T[];
}