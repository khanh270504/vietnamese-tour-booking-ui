import { useState, useCallback } from "react";
import { toast } from "sonner";
import { bookingService } from "../../../../services/booking/booking.service";
import { BookingResponse, BookingStatus } from "../../../../services/booking/booking.types";

export function useBookings() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await bookingService.getAllBookingsForAdmin();
      // Handle linh hoạt giữa .result và .data
      const data = res.result || (res as any).data || []; 
      setBookings(data);
    } catch (error) {
      toast.error("Không thể tải danh sách Đơn hàng");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeBookingStatus = useCallback(async (id: number, newStatus: BookingStatus, reason?: string) => {
    try {
      await bookingService.updateBookingStatus(id, newStatus, reason);
      toast.success(`Đã cập nhật trạng thái đơn #${id} thành ${newStatus}`);
      await fetchBookings(); // Tải lại danh sách
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Lỗi cập nhật trạng thái";
      toast.error(message);
      return false;
    }
  }, [fetchBookings]);

  // // Sếp nên thêm hàm xóa đơn nếu cần (Admin thường hay phải xóa đơn test)
  // const deleteBooking = useCallback(async (id: number) => {
  //   try {
  //     await bookingService.deleteBooking(id); // Giả sử sếp có hàm này
  //     toast.success("Đã xóa đơn hàng");
  //     await fetchBookings();
  //     return true;
  //   } catch (error) {
  //     toast.error("Không thể xóa đơn hàng");
  //     return false;
  //   }
  // }, [fetchBookings]);

  return { 
    bookings, 
    isLoading, 
    fetchBookings, 
    changeBookingStatus,
   // deleteBooking // Expose thêm hàm xóa
  };
}