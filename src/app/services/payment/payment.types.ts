
export interface ManualPaymentRequest {
    bookingId: number;
    amount: number; // Số tiền khách nộp
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'POS'; // Tùy BE quy định (Tiền mặt, Chuyển khoản, Quẹt thẻ...)
    referenceCode?: string; // Mã giao dịch ngân hàng (nếu khách chuyển khoản)
    note?: string; // Ghi chú (VD: Khách trả tiền mặt tại quầy)
}


export interface PaymentResponse {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
    transactionId: string; // Mã giao dịch của hệ thống
    referenceCode: string; // Mã tham chiếu ngân hàng
    paymentDate: string; // Thời gian thanh toán (ISO String)
    note: string;
    createdBy: string; // Người thu tiền (Tên nhân viên)
}