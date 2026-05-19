

export interface Voucher {
    id: number;
    title: string;
    description: string;
    code: string;
    discountType: 'FIXED' | 'PERCENT';
    discountValue: number;
    maxDiscountAmount: number | null;
    minOrderValue: number;
    maxUsage: number;
    usageCount: number;
    maxUsagePerUser: number;
    startDate: string; // ISO String (VD: "2026-05-10T00:00:00Z")
    expiryDate: string; 
    isActive: boolean;
    tourId: number | null;
    userId: number | null;
    createdAt: string;
}

export interface VoucherCreateRequest {
    title: string;
    description: string;
    code: string;
    discountType: 'FIXED' | 'PERCENT';
    discountValue: number;
    maxDiscountAmount?: number | null;
    minOrderValue: number;
    maxUsage: number;
    maxUsagePerUser: number;
    startDate?: string | null;
    expiryDate: string;
    isActive: boolean;
    tourId?: number | null;
    userId?: number | null;
}



export interface VoucherApplyRequest {
    code: string;
    orderTotal: number;
    tourId?: number | null;
}

export interface VoucherApplyResponse {
    voucherId: number;
    voucherCode: string;
    title: string;
    description: string;
    originalTotal: number;
    discountAmount: number;
    finalTotal: number;
    success: boolean;
    message: string;
}