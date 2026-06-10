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

  useEffect(() => {
    if (!bookingId) return;

    const queryParams = new URLSearchParams(window.location.search);
    const hasVNPayCallback = queryParams.has("vnp_ResponseCode");

    const fetchBookingDetails = async () => {
      try {
        setIsLoadingData(true);
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

    const handleVNPayCallback = async () => {
      try {
        setIsLoadingData(true);
        const paramsObj = Object.fromEntries(queryParams.entries());

        const response = await api.get("/api/v1/payments/vnpay/callback", { params: paramsObj });
        const data = response.data;

        if ((data.code === 200 || response.status === 200) && queryParams.get("vnp_ResponseCode") === "00") {
          setPaymentStatus("completed");
          toast.success("Thanh toán hóa đơn qua VNPay thành công!");
        } else {
          toast.error("Thanh toán thất bại hoặc giao dịch đã bị hủy bỏ.");
        }
      } catch (error: any) {
        console.error("Lỗi xác thực kết quả VNPay:", error);
        toast.error(error.response?.data?.message || "Gặp sự cố khi xác thực giao dịch.");
      } finally {
        setIsLoadingData(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    if (hasVNPayCallback) {
      handleVNPayCallback();
    } else {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handleConfirmPayment = async () => {
    if (!bookingId) return;
    setIsProcessing(true);

    try {
      if (paymentMethod === "bank") {
        
        await api.post('/api/v1/payments/manual', {
          bookingId: Number(bookingId),
          amount: orderInfo.totalAmount,
          paymentMethod: 'BANK_TRANSFER',
          note: `Khách hàng xác nhận đã chuyển khoản cho đơn hàng ${orderInfo.orderId}`
        });

        setPaymentStatus("completed");
        toast.success("Hệ thống đã ghi nhận thông báo chuyển khoản của bạn!");
      } 
      
      else if (paymentMethod === "vnpay") {
        
        const response = await api.get('/api/v1/payments/vnpay/create-url', {
          params: {
            bookingId: Number(bookingId),
            amount: orderInfo.totalAmount
          }
        });

        const data = response.data.result || response.data;

        if (data && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          toast.error("Không thể khởi tạo đường dẫn kết nối với VNPay.");
          setIsProcessing(false);
        }
      } 
      
      else if (paymentMethod === "card") {
        
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