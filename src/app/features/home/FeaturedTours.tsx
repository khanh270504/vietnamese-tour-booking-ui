import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { tourService } from "../../services/tour/tour.service";
import { TourResponse } from "../../services/tour/tour.types";
import { TourCard } from "../tours/tourList/TourCard";

interface TourWithPrice extends TourResponse {
  minPrice?: number;
}

export function FeaturedTours() {
  const [tours, setTours] = useState<TourWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToursAndPrices = async () => {
      try {
        setLoading(true);
        // 1. Lấy danh sách Tour Active
        const tourRes = await tourService.getAllToursForClient();
        const tourList = tourRes.result.slice(0, 6);

        // 2. Map để lấy giá cho từng Tour
        const toursWithPrice = await Promise.all(
          tourList.map(async (tour) => {
            try {
              // Gọi hàm mình vừa thêm vào service đây ông giáo ơi
              const pricingRes = await tourService.getPricingByTour(tour.id);
              
              const adultPrices = pricingRes.result
                .filter(p => p.passengerType === "ADULT")
                .map(p => p.price);
              
              const minPrice = adultPrices.length > 0 ? Math.min(...adultPrices) : undefined;

              return { ...tour, minPrice };
            } catch (err) {
              return { ...tour };
            }
          })
        );

        setTours(toursWithPrice);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToursAndPrices();
  }, []);

  if (loading) return <div className="text-center py-20">Đang tải tour nổi bật...</div>;

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Tour nổi bật</h2>
          <p className="text-gray-500">Những hành trình được yêu thích nhất</p>
        </div>
        <Link to="/tours" className="flex items-center text-blue-600 font-bold hover:underline">
          Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}