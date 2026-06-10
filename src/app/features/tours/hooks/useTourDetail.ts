import { useState, useEffect } from "react";
import { tourService } from "../../../services/tour/tour.service";
import { TourResponse, ScheduleResponse } from "../../../services/tour/tour.types";

export function useTourDetail(id: string | undefined) {
  const [tour, setTour] = useState<TourResponse | null>(null);
  // 🎯 Thêm state lưu lịch trình "sạch" đã lọc từ Backend ở đây luôn
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTourAndSchedules = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [tourResponse, schedulesResponse] = await Promise.all([
          tourService.getTourByIdForClient(Number(id)),
          tourService.getSchedulesByTour(Number(id))
        ]);

        // Xử lý kết quả Tour Chi Tiết
        if (tourResponse && tourResponse.result) {
          setTour(tourResponse.result);
        } else {
          setTour(null);
        }

        // Xử lý kết quả Lịch Trình Sạch (Đã lọc ngày >= hôm nay và trạng thái OPENING/FULL ở BE)
        if (schedulesResponse && schedulesResponse.result) {
          setSchedules(schedulesResponse.result);
        } else {
          setSchedules([]);
        }

      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết tour và lịch trình:", err);
        setError("Đã có lỗi xảy ra khi tải thông tin tour.");
        setTour(null);
        setSchedules([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourAndSchedules();
  }, [id]);

  // Trả ra đầy đủ "vũ khí" cho Component dùng
  return { tour, schedules, isLoading, error };
}