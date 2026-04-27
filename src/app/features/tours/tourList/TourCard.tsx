import { Link } from "react-router-dom";
import { Clock, MapPin, Users, CalendarDays, Ticket, Star, PlaneTakeoff } from "lucide-react";
import { 
  TourResponse, 
  PassengerType 
} from "../../../services/tour/tour.types";

interface TourCardProps {
  tour: TourResponse; 
}

export function TourCard({ tour }: TourCardProps) {
  
  if (!tour) return null;

  const schedules = tour.schedules || [];

  const nextSchedule = schedules
    .filter(s => s.status === "OPENING")
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())[0];

  const adultPricing = nextSchedule?.pricings?.find(
    p => p.passengerType === PassengerType.ADULT
  );
  const minAdultPrice = adultPricing ? adultPricing.price : null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full overflow-hidden">
      
      {/* --- PHẦN HÌNH ẢNH --- */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={tour.thumbnail || "https://placehold.co/600x400?text=No+Image"} 
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Badge Nơi khởi hành - Show ngay trên ảnh cho xịn */}
        {nextSchedule?.departureLocation && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <PlaneTakeoff size={12} className="text-blue-600" />
            <span className="text-[10px] font-bold text-gray-700">Từ {nextSchedule.departureLocation}</span>
          </div>
        )}
      </div>

      {/* --- PHẦN NỘI DUNG --- */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Địa điểm & Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-gray-400 font-bold text-[10px] uppercase">
            <MapPin size={12} className="text-blue-500" />
            <span className="line-clamp-1">{tour.destinationName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-gray-800">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>4.9</span> 
          </div>
        </div>

        {/* Tên Tour */}
        <h3 className="font-extrabold text-gray-800 text-base leading-tight mb-4 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          {tour.name}
        </h3>

        {/* THÔNG TIN CHI TIẾT */}
        <div className="space-y-3 mb-6">
          {/* Nơi khởi hành (Cắm ở Schedule) */}
          <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <PlaneTakeoff size={14} className="text-blue-600" />
            </div>
            <span>Khởi hành từ: <strong className="text-gray-900">{nextSchedule?.departureLocation || "Liên hệ"}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <CalendarDays size={14} className="text-blue-600" />
            </div>
            <span>
              Ngày đi: <strong className="text-gray-900">
                {nextSchedule ? new Date(nextSchedule.departureDate).toLocaleDateString("vi-VN") : "Liên hệ"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock size={14} className="text-blue-600" />
            </div>
            <span>Thời gian: <strong className="text-gray-900">{tour.duration || "Theo lịch"}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
              <Users size={14} className="text-orange-600" />
            </div>
            <span>Chỗ trống: <strong className="text-gray-900">{nextSchedule?.availableSlots ?? "Hết chỗ"}</strong></span>
          </div>
        </div>

        {/* --- GIÁ NGƯỜI LỚN & NÚT CHI TIẾT --- */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <Ticket size={10} />
              <span>Giá từ (Lịch gần nhất)</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-blue-600">
                {minAdultPrice 
                  ? (minAdultPrice / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) 
                  : "Liên hệ"}
              </span>
              {minAdultPrice && <span className="text-[10px] font-black text-blue-600 uppercase ml-1">Triệu</span>}
            </div>
          </div>

          <Link 
            to={`/tours/${tour.id}`}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}