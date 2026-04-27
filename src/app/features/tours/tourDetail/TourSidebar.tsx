import { useState, useMemo } from "react";
import { Calendar, PhoneCall, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScheduleResponse, PricingConfigResponse } from "../../../services/tour/tour.types";

export function TourSidebar({ tour }: { tour: any }) {
  const navigate = useNavigate();
  
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResponse | null>(null);

  if (!tour) return null;

  const schedules: ScheduleResponse[] = tour.schedules || [];

  // 🎯 Hàm lấy giá Người lớn (ADULT) từ mảng pricings của một Schedule
  const getAdultPrice = (sch: ScheduleResponse): number | null => {
    if (!sch.pricings) return null;
    const adultPricing = sch.pricings.find((p: PricingConfigResponse) => p.passengerType === "ADULT");
    return adultPricing ? adultPricing.price : null;
  };

  const displayPrice = useMemo(() => {
    // 1. Nếu khách đã chọn một ngày cụ thể -> Hiện giá của ngày đó
    if (selectedSchedule) {
      return getAdultPrice(selectedSchedule);
    }

    const allPrices = schedules
      .map(s => getAdultPrice(s))
      .filter((p): p is number => p !== null);

    if (allPrices.length > 0) {
      return Math.min(...allPrices);
    }

    return tour.minPrice || null;
  }, [selectedSchedule, schedules, tour.minPrice]);

  const handleBooking = () => {
    if (!selectedSchedule) return;
    navigate(`/booking/${tour.id}?scheduleId=${selectedSchedule.id}`);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sticky top-24 z-50">
      
      {/* 💰 KHỐI GIÁ ĐỘNG */}
      <div className="mb-8">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
          {selectedSchedule ? "Giá ngày bạn chọn" : "Giá chỉ từ"}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-blue-600">
            {displayPrice ? displayPrice.toLocaleString('vi-VN') : 'Liên hệ'}
            {displayPrice && <span className="text-2xl ml-1">₫</span>}
          </span>
          <span className="text-gray-400 font-bold text-sm">/ khách</span>
        </div>
      </div>

      {/* DANH SÁCH LỊCH TRÌNH */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Chọn ngày khởi hành</h3>
        
        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2 p-1">
          {schedules.length > 0 ? (
            schedules.map((schedule) => {
              const isFull = schedule.availableSlots <= 0;
              const isSelected = selectedSchedule?.id === schedule.id;
              const price = getAdultPrice(schedule);

              return (
                <div 
                  key={schedule.id}
                  onClick={() => !isFull && setSelectedSchedule(schedule)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    isFull 
                    ? 'bg-gray-50 border-gray-50 opacity-40 cursor-not-allowed' 
                    : isSelected 
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 ring-inset' 
                      : 'border-gray-100 hover:border-blue-300 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex flex-col">
                      <span className={`text-sm font-black ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                        {new Date(schedule.departureDate).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {schedule.departureLocation} {price ? `• ${price.toLocaleString('vi-VN')}đ` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${
                      isFull ? 'bg-gray-200 text-gray-400' : 
                      isSelected ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-600'
                    }`}>
                      {isFull ? 'HẾT CHỖ' : `CÒN ${schedule.availableSlots}`}
                    </span>
                    {isSelected && <CheckCircle2 size={14} className="text-blue-600 animate-in zoom-in" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <AlertCircle className="mx-auto text-gray-300 mb-2" size={24} />
              <p className="text-xs text-gray-400 font-black uppercase">Chưa có lịch khởi hành</p>
            </div>
          )}
        </div>
      </div>

      {/* NÚT ĐẶT TOUR */}
      <button 
        onClick={handleBooking}
        disabled={!selectedSchedule}
        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all mb-6 shadow-lg ${
          selectedSchedule 
          ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-95' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {selectedSchedule ? 'ĐẶT TOUR NGAY' : 'VUI LÒNG CHỌN NGÀY'}
      </button>

      {/* 📞 LIÊN HỆ */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <PhoneCall className="text-blue-600" size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Cần hỗ trợ gấp?</p>
          <p className="font-black text-gray-900 tracking-tight">1900 1234</p>
        </div>
      </div>
    </div>
  );
}