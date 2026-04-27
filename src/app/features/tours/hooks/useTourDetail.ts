import { useState, useEffect } from "react";
import { tourService } from "../../../services/tour/tour.service";
import { TourResponse } from "../../../services/tour/tour.types";

export function useTourDetail(id: string | undefined) {
  const [tour, setTour] = useState<TourResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTourDetail = async () => {
      setIsLoading(true);
      try {
        const response = await tourService.getTourByIdForClient(Number(id));
        
        if (response && response.result) {
          setTour(response.result);
        } else {
          setTour(null);
        }
      } catch (error) {
        console.error(" Lỗi khi lấy chi tiết tour:", error);
        setTour(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetail();
  }, [id]);

  return { tour, isLoading };
}