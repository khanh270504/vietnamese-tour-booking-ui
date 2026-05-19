import { Calendar, Users, MapPin, Clock } from "lucide-react";

interface TourDetailsProps {
  tourName: string;
  departureDate: string;
  pickupLocation: string;
  duration: string;
  passengersCount: number;
}

export function TourDetails({ tourName, departureDate, pickupLocation, duration, passengersCount }: TourDetailsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-black mb-6 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-[#2563eb] rounded-full"></div>
        Thông tin tour
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="font-black text-xl mb-2 text-gray-900">{tourName}</h3>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Ngày khởi hành</p>
            <p className="font-bold text-gray-900">{departureDate}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Điểm đón</p>
            <p className="font-bold text-gray-900">{pickupLocation}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Số hành khách</p>
            <p className="font-bold text-gray-900">{passengersCount} người</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Thời gian</p>
            <p className="font-bold text-gray-900">{duration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}