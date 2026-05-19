import api from '../api'; // 🎯 Import Axios instance của ông giáo
import { ManualPaymentRequest, PaymentResponse } from './payment.types';

const PAYMENT_API_URL = '/api/v1/payments';

export const paymentService = {
    /**
     * Xác nhận thanh toán thủ công (Nhân viên thu tiền mặt / Check biến động số dư)
     */
    createManualPayment: async (data: ManualPaymentRequest): Promise<PaymentResponse> => {
        const response = await api.post(`${PAYMENT_API_URL}/manual`, data);
        return response.data.result || response.data;
    },

    getPaymentHistory: async (bookingId: number): Promise<PaymentResponse[]> => {
        const response = await api.get(`${PAYMENT_API_URL}/booking/${bookingId}`);
        return response.data.result || response.data;
    }
};