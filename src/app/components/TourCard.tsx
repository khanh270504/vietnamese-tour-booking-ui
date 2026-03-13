import { Link } from "react-router";
import { Calendar, Clock, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TourCardProps {
  id: string;
  image: string;
  title: string;
  duration: string;
  price: number;
  seatsLeft: number;
  departureDate?: string;
}

export function TourCard({ id, image, title, duration, price, seatsLeft, departureDate }: TourCardProps) {
  const getStatusBadge = () => {
    if (seatsLeft === 0) {
      return <Badge variant="destructive">Hết chỗ</Badge>;
    } else if (seatsLeft <= 5) {
      return <Badge className="bg-orange-500">Sắp hết chỗ</Badge>;
    } else {
      return <Badge className="bg-green-500">Còn chỗ</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <button className="absolute top-2 right-2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          {departureDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Khởi hành: {departureDate}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Số chỗ còn lại:</span>
            <span className="font-semibold" style={{ color: '#2563eb' }}>
              {seatsLeft} chỗ
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500">Giá từ</p>
            <p className="text-xl font-bold" style={{ color: '#2563eb' }}>
              {formatPrice(price)}
            </p>
          </div>
          <Link to={`/tours/${id}`}>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
