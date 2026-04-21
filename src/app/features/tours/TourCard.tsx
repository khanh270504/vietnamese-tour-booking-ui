import { Link } from "react-router";
import { Calendar, Clock, Heart } from "lucide-react";

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
  
  // Tự viết Badge bằng thẻ span + Tailwind
  const renderStatusBadge = () => {
    let bgColor = "bg-green-500";
    let text = "Còn chỗ";

    if (seatsLeft === 0) {
      bgColor = "bg-red-500";
      text = "Hết chỗ";
    } else if (seatsLeft <= 5) {
      bgColor = "bg-orange-500";
      text = "Sắp hết chỗ";
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-bold text-white shadow-sm ${bgColor}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Phần hình ảnh */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Nút yêu thích tự chế */}
        <button 
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-md text-gray-600 hover:text-red-500 active:scale-90"
        >
          <Heart className="w-5 h-5 transition-colors" />
        </button>

        {/* Badge trạng thái */}
        <div className="absolute top-3 left-3">
          {renderStatusBadge()}
        </div>
      </div>

      {/* Phần nội dung */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem] text-gray-800 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{duration}</span>
          </div>
          
          {departureDate && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Khởi hành: {departureDate}</span>
            </div>
          )}

          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-bold">Còn lại:</span>
            <span className="font-bold text-blue-600">
              {seatsLeft} chỗ
            </span>
          </div>
        </div>

        {/* Phần giá và Nút xem chi tiết (Tất cả là HTML thuần) */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Giá chỉ từ</p>
            <p className="text-xl font-black text-blue-600">
              {price.toLocaleString("vi-VN")}₫
            </p>
          </div>
          
          <Link 
            to={`/tours/${id}`}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}