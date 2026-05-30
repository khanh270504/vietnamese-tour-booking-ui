import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { tourService } from "../../../../services/tour/tour.service"; 
import { TourResponse, TourCreateRequest } from "../../../../services/tour/tour.types";

export function useTours() {
  const [tours, setTours] = useState<TourResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm fetch danh sách Tour gốc của Admin - KHÔNG LỌC CỨNG NỮA
  const fetchTours = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await tourService.getAllToursForAdmin();
      const data = res.result || [];
      
      // 🎯 SỬA TẠI ĐÂY: Trả về toàn bộ danh sách thô dưới DB (gồm cả ACTIVE và INACTIVE)
      // Để file giao diện tự chia bài theo Tab, tránh việc chặn dữ liệu ở đây.
      setTours(data); 
    } catch (error) {
      toast.error("Không tải được danh sách tour");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Hàm xóa mềm (Backend xử lý setStatus thành INACTIVE)
  const deleteTour = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tour này không? (Hệ thống sẽ chuyển vào kho lưu trữ)")) return false;
    try {
      await tourService.deleteTour(id);
      toast.success("Đã xóa mềm tour thành công!");
      await fetchTours(); // Cập nhật lại kho thô mới nhất
      return true;
    } catch (error) {
      toast.error("Lỗi khi xóa tour");
      return false;
    }
  };
  const restoreTour = async (id: number) => {
  try {
    await tourService.restoreTour(id);
    toast.success("Khôi phục tour thành công! Tour đã quay trở lại danh sách hoạt động.");
    await fetchTours(); // Làm mới lại kho dữ liệu thô
    return true;
  } catch (error) {
    toast.error("Lỗi khi khôi phục tour");
    return false;
  }
};

  // Hàm lưu (Thêm mới / Sửa) Tour
  const saveTour = async (id: number | undefined, data: TourCreateRequest) => {
    try {
      if (id) {
        await tourService.updateTour(id, data);
        toast.success("Cập nhật tour thành công");
      } else {
        await tourService.createTour(data);
        toast.success("Thêm tour mới thành công");
      }
      await fetchTours();
      return true;
    } catch (error) {
      toast.error("Lỗi khi lưu dữ liệu tour");
      return false;
    }
  };

  return { tours, isLoading, fetchTours, deleteTour, saveTour,restoreTour };
}