import { useState, useEffect } from "react";
import api from "../../../services/api"; 
import { toast } from "react-toastify";

export function usePayment(bookingId: string | undefined) {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed">("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // State lưu trữ thông tin đơn hàng thật từ DB
  const [orderInfo, setOrderInfo] = useState({
    orderId: "",
    tourName: "",
    departureDate: "",
    passengers: 0,
    totalAmount: 0,
  });

  // 🎯 1. LẤY THÔNG TIN CHI TIẾT ĐƠN HÀNG TỪ BACKEND
  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      try {
        setIsLoadingData(true);
        // Gọi API lấy Booking theo ID (Hãy chắc chắn BE của ông giáo đã có API này)
        const response = await api.get(`/api/v1/bookings/${bookingId}`);
        const data = response.data.result || response.data;

        setOrderInfo({
          orderId: data.bookingCode || `BK-${bookingId}`,
          tourName: data.tourNameSnapshot || "N/A",
          departureDate: data.departureDateSnapshot || "",
          passengers: data.passengers ? data.passengers.length : 0,
          totalAmount: data.totalFinalPrice || 0,
        });
      } catch (error: any) {
        console.error("Lỗi tải đơn hàng:", error);
        toast.error(error.response?.data?.message || "Không thể tải thông tin đơn hàng!");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // 🎯 2. XỬ LÝ THANH TOÁN
  const handleConfirmPayment = async () => {
    if (!bookingId) return;
    setIsProcessing(true);

    try {
      if (paymentMethod === "bank") {
        /**
         * KỊCH BẢN 1: CHUYỂN KHOẢN NGÂN HÀNG (Manual Payment)
         * Ở đây mình gọi API /api/v1/payments/manual mà anh em mình vừa viết ở Controller.
         * Khách bấm "Thanh toán ngay" sau khi đã chuyển khoản xong.
         */
        await api.post('/api/v1/payments/manual', {
          bookingId: Number(bookingId),
          amount: orderInfo.totalAmount,
          paymentMethod: 'BANK_TRANSFER',
          note: `Khách hàng xác nhận đã chuyển khoản cho đơn hàng ${orderInfo.orderId}`
        });

        setPaymentStatus("completed");
        toast.success("Hệ thống đã ghi nhận thông báo chuyển khoản của bạn!");
      } 
      
      else if (paymentMethod === "wallet") {
        /**
         * KỊCH BẢN 2: VÍ ĐIỆN TỬ (MOMO / ZALOPAY / VNPAY)
         * -----------------------------------------------------------
         * TODO: Sau này ông giáo chèn logic gọi API lấy Link Redirect vào đây.
         * Ví dụ:
         * const res = await api.post('/api/v1/payments/vnpay/create', { bookingId });
         * window.location.href = res.data.result.paymentUrl;
         * -----------------------------------------------------------
         */
        toast.info("Tính năng thanh toán qua Ví điện tử đang được tích hợp!");
        setIsProcessing(false);
      } 
      
      else if (paymentMethod === "card") {
        /**
         * KỊCH BẢN 3: THẺ TÍN DỤNG (STRIPE / PAYPAL)
         * -----------------------------------------------------------
         * TODO: Chèn logic tích hợp Stripe Elements hoặc SDK thanh toán vào đây.
         * -----------------------------------------------------------
         */
        toast.info("Tính năng thanh toán qua Thẻ quốc tế đang được tích hợp!");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Lỗi thanh toán:", error);
      toast.error(error.response?.data?.message || "Giao dịch thất bại, vui lòng thử lại!");
      setIsProcessing(false);
    }
  };

  return {
    orderInfo,
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    isProcessing,
    isLoadingData,
    handleConfirmPayment
  };
}