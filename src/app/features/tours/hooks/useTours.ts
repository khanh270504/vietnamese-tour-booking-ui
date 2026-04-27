import { useState, useEffect } from "react";
import { tourService } from "../../../services/tour/tour.service";
import { TourResponse, DestinationResponse } from "../../../services/tour/tour.types";

export function useTours(filters: any, sortBy: string, page: number) {
  const [tours, setTours] = useState<TourResponse[]>([]);
  const [destinations, setDestinations] = useState<DestinationResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    tourService.getDestinations().then(res => setDestinations(res.result || []));
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          ...filters,
          sortBy,
          page, 
          size: 6
        };

        const cleanFilters = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => {
            if (value === "" || value === null || value === undefined) return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
          })
        );

        console.log(" Gọi API Search với bộ lọc:", cleanFilters);

        const response = await tourService.searchTours(cleanFilters);
        
        if (response && response.result) {
          setTours(response.result.data || []);
          setTotalPages(response.result.totalPages || 1);
        }
      } catch (error) {
        console.error(" Lỗi khi fetch tours:", error);
        setTours([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [JSON.stringify(filters), sortBy, page]); 

  return { tours, destinations, totalPages, isLoading };
}