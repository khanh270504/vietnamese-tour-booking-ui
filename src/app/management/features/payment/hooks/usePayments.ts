import { useState, useCallback } from "react";
import { toast } from "sonner";
import { paymentService } from "../../../../services/payment/payment.service";
import { PaymentResponse, ManualPaymentRequest } from "../../../../services/payment/payment.types";

export function usePayments() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy toàn bộ giao dịch (Dành cho trang chủ)
  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await paymentService.getAllPayments();
      setPayments(data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách giao dịch!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lấy lịch sử theo ID đơn hàng
  const fetchPaymentsByBooking = async (bookingId: number) => {
    try {
      const data = await paymentService.getPaymentHistoryByBookingId(bookingId);
      setPayments(data || []);
    } catch (error) {
      toast.error("Lỗi khi tải lịch sử thanh toán của đơn hàng!");
    }
  };

  // 1. processManualPayment
  const processManualPayment = async (data: ManualPaymentRequest) => {
    try {
      await paymentService.processManualPayment(data);
      toast.success("Ghi nhận thu tiền thành công!");
      await fetchPayments(); // Refresh bảng
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi ghi nhận thanh toán!");
      return false;
    }
  };

  // 4. cancelPayment
  const cancelPayment = async (paymentId: number) => {
    try {
      await paymentService.cancelPayment(paymentId);
      toast.success("Hủy giao dịch thành công!");
      await fetchPayments(); // Refresh bảng
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi hủy giao dịch!");
      return false;
    }
  };

  return { payments, isLoading, fetchPayments, fetchPaymentsByBooking, processManualPayment, cancelPayment };
}