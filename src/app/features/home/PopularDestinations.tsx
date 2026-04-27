import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tourService } from "../../services/tour/tour.service";
import { DestinationResponse } from "../../services/tour/tour.types";

export function PopularDestinations() {
  const [destinations, setDestinations] = useState<DestinationResponse[]>([]);

  useEffect(() => {
    tourService.getDestinations().then((res) => {
      setDestinations(res.result.slice(0, 5)); // Lấy 5 địa điểm tiêu biểu
    });
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Điểm đến phổ biến</h2>
          <p className="text-gray-600">Khám phá những nơi khách hàng của chúng tôi yêu thích nhất</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {destinations.map((dest) => (
            <Link key={dest.id} to={`/tours?destinationId=${dest.id}`}>
              <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all">
                {/* Lớp phủ màu gradient để nổi chữ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                
                {/* Ảnh địa điểm - Nếu SQL chưa có ảnh, dùng tạm ảnh placeholder theo tên */}
                <img 
                  src={`https://source.unsplash.com/featured/?${dest.name},travel`} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute bottom-4 left-4 text-white z-20">
                  <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
                  <p className="text-xs text-blue-300 font-medium">Xem các tour ngay →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}