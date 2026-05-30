import api from '../api';
import { ManualPaymentRequest, PaymentResponse } from './payment.types';

const PAYMENT_API_URL = '/api/v1/payments';

export const paymentService = {
    // 0. Hàm này tôi thêm cho sếp để đổ data ra bảng (BE sếp nhớ viết thêm nhé)
    getAllPayments: async (): Promise<PaymentResponse[]> => {
        const response = await api.get(PAYMENT_API_URL);
        return response.data.result || response.data;
    },

    // 1. processManualPayment: Tạo thanh toán thủ công
    processManualPayment: async (data: ManualPaymentRequest): Promise<PaymentResponse> => {
        const response = await api.post(`${PAYMENT_API_URL}/manual`, data);
        return response.data.result || response.data;
    },

    // 2. getPaymentHistoryByBookingId: Lấy toàn bộ lịch sử thanh toán của 1 đơn hàng
    getPaymentHistoryByBookingId: async (bookingId: number): Promise<PaymentResponse[]> => {
        const response = await api.get(`${PAYMENT_API_URL}/booking/${bookingId}`);
        return response.data.result || response.data;
    },

    // 3. getPaymentById: Lấy chi tiết 1 giao dịch
    getPaymentById: async (paymentId: number): Promise<PaymentResponse> => {
        const response = await api.get(`${PAYMENT_API_URL}/${paymentId}`);
        return response.data.result || response.data;
    },

    // 4. cancelPayment: Hủy hoặc hoàn tiền giao dịch
    cancelPayment: async (paymentId: number): Promise<PaymentResponse> => {
        const response = await api.patch(`${PAYMENT_API_URL}/${paymentId}/cancel`);
        return response.data.result || response.data;
    }
};