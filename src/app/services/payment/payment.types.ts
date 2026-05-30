export interface ManualPaymentRequest {
    bookingId: number;
    amount: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'POS';
    referenceCode?: string;
    note?: string;
}

export interface PaymentResponse {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'POS';
    status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
    transactionId: string;
    referenceCode: string;
    paymentDate: string;
    note: string;
    createdBy: string;
}