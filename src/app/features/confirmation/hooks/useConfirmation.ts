import { useState, useEffect } from "react";
import api from "../../../services/api"; // 🎯 Đường dẫn Axios của ông giáo
import { toast } from "react-toastify";

export function useConfirmation(bookingId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingInfo, setBookingInfo] = useState<any>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        // 🎯 Gọi API lấy chi tiết Booking
        const response = await api.get(`/api/v1/bookings/${bookingId}`);
        const data = response.data.result || response.data;

        // 🎯 Format lại ngày tháng cho đẹp theo chuẩn Việt Nam
        const formatDate = (dateString: string) => {
          if (!dateString) return "Đang cập nhật";
          const date = new Date(dateString);
          return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };

        const formatDateTime = (dateString: string) => {
          if (!dateString) return "Đang cập nhật";
          const date = new Date(dateString);
          return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString('vi-VN');
        };

        setBookingInfo({
          orderId: data.bookingCode,
          status: data.status, 
          
          tourName: data.tourNameSnapshot  || "Đang cập nhật tên tour",
          departureDate: formatDate(data.departureDateSnapshot),
          pickupLocation: data.departureLocationSnapshot  || "Theo thông báo của HDV", 
          duration: "Theo lịch trình", 
          
          passengers: data.passengers ? data.passengers.map((p: any) => ({
            name: p.fullName,
            birthDate: formatDate(p.birthDate), 
            gender: p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'
          })) : [],
          
          payment: {
            amount: data.totalFinalPrice,
            method: data.payments && data.payments.length > 0 
                      ? data.payments[0].paymentMethod 
                      : "Chưa chọn phương thức",
            
            status: data.status === 'CONFIRMED' || data.status === 'COMPLETED' 
                      ? "Đã thanh toán" 
                      : "Chờ thanh toán",
            
            date: data.payments && data.payments.length > 0 
                    ? formatDateTime(data.payments[0].createdAt) 
                    : formatDateTime(data.createdAt)
          },
          createdAt: formatDateTime(data.createdAt)
        });
      } catch (error: any) {
        console.error("Lỗi khi tải thông tin đơn hàng:", error);
        toast.error("Không thể tải thông tin đơn hàng, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  return { bookingInfo, isLoading };
}