import { Clock, MapPin, Users, Tag, CalendarCheck } from "lucide-react";
import { TourResponse } from "../../../services/tour/tour.types";

interface TourQuickInfoProps {
  tour: TourResponse;
}

export function TourQuickInfo({ tour }: TourQuickInfoProps) {
  const infoItems = [
    {
      icon: Tag,
      label: "Mã Tour",
      val: tour.tourcode || "Đang cập nhật",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: MapPin,
      label: "Điểm đến",
      val: tour.destinationName || "Nhiều điểm",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      icon: Users,
      label: "Tối thiểu",
      val: `${tour.minParticipants || 10} khách`,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: CalendarCheck,
      label: "Trạng thái",
      val: tour.status === "ACTIVE" ? "Đang mở bán" : "Tạm ngưng",
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {infoItems.map((item, i) => (
        <div 
          key={i} 
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
        >
          {/* Icon tròn có màu sắc riêng biệt */}
          <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>

          {/* Nhãn thông tin */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            {item.label}
          </p>

          {/* Giá trị thông tin */}
          <p className="font-black text-gray-900 line-clamp-1 text-sm">
            {item.val}
          </p>
        </div>
      ))}
    </div>
  );
}