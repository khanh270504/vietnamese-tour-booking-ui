import { useState } from "react";
import { CheckCircle2, Map, DollarSign, MessageCircle } from "lucide-react";
import { TourResponse } from "../../../services/tour/tour.types"; 

export function TourTabs({ tour }: { tour: TourResponse | any }) {
  const [activeTab, setActiveTab] = useState("intro");

  const tabs = [
    { id: "intro", label: "Giới thiệu", icon: CheckCircle2 },
    { id: "itinerary", label: "Lịch trình", icon: Map },
    { id: "pricing", label: "Bảng giá", icon: DollarSign },
    { id: "reviews", label: "Đánh giá", icon: MessageCircle },
  ];

  // Lấy list giá của Lịch trình gần nhất (nếu có) để show ở Tab Bảng giá
  const samplePricings = tour.schedules && tour.schedules.length > 0 ? tour.schedules[0].pricings : [];

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      
      {/* 🎯 HEADER TABS */}
      <div className="flex border-b border-gray-50 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 animate-in fade-in" />}
          </button>
        ))}
      </div>

      {/* 🎯 CONTENT TABS */}
      <div className="p-8 md:p-10">
        
        {/* --- TAB 1: GIỚI THIỆU --- */}
        {activeTab === "intro" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-xl font-black mb-4">Tổng quan hành trình</h3>
            {/* Dùng whitespace-pre-line để giữ nguyên dấu xuống dòng của DB */}
            <p className="text-gray-600 leading-relaxed font-medium mb-8 whitespace-pre-line">
              {tour.description || "Đang cập nhật thông tin giới thiệu cho tour này..."}
            </p>
            
            <h4 className="font-black text-gray-900 mb-4 uppercase text-sm tracking-widest">Dịch vụ nổi bật</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chỗ này nếu có data thật dạng mảng thì map, không thì để tạm vài cái tượng trưng */}
              {["Xe đưa đón đời mới", "Khách sạn tiêu chuẩn", "Hướng dẫn viên nhiệt tình", "Bảo hiểm du lịch"].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl">
                  <CheckCircle2 className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm text-gray-700">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: LỊCH TRÌNH (PARSE JSON) --- */}
        {activeTab === "itinerary" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {tour.itinerary && tour.itinerary.length > 0 ? (
              tour.itinerary.map((item: any, i: number) => (
                <div key={i} className="relative pl-10 border-l-2 border-dashed border-gray-100 last:border-0 pb-8 last:pb-0">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                  
                  {/* Bắt cả trường hợp JSON ghi là 'day', 'ngay', hoặc dùng index */}
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Ngày {item.day || item.dayNumber || (i + 1)}
                  </span>
                  
                  {/* Tiêu đề ngày */}
                  <h4 className="text-lg font-black text-gray-900 mt-1 mb-3">
                    {item.title || "Khám phá các điểm đến"}
                  </h4>
                  
                  {/* Mô tả chi tiết ngày */}
                  <div className="text-gray-600 font-medium text-sm leading-relaxed whitespace-pre-line bg-gray-50/50 p-5 rounded-2xl border border-gray-50">
                    {item.description || item.content || item.activities || "Đang cập nhật hoạt động..."}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <Map className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-bold">Chưa có thông tin lịch trình chi tiết.</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: BẢNG GIÁ --- */}
        {activeTab === "pricing" && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-black mb-6">Bảng giá tham khảo</h3>
            {samplePricings && samplePricings.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Đối tượng</th>
                      <th className="px-6 py-4 text-right">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {samplePricings.map((priceItem: any) => (
                      <tr key={priceItem.id} className="font-bold hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          {priceItem.passengerType === 'ADULT' ? 'Người lớn' : 
                           priceItem.passengerType === 'CHILD' ? 'Trẻ em' : 
                           priceItem.passengerType === 'INFANT' ? 'Em bé' : priceItem.passengerType}
                        </td>
                        <td className="px-6 py-5 text-right text-blue-600">
                          {priceItem.price.toLocaleString('vi-VN')} {priceItem.currency || 'VNĐ'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 font-medium bg-blue-50/50 p-4 rounded-xl text-center">
                Vui lòng chọn ngày khởi hành để xem giá chi tiết.
              </p>
            )}
          </div>
        )}

        {/* --- TAB 4: ĐÁNH GIÁ (Placeholder) --- */}
        {activeTab === "reviews" && (
          <div className="animate-in fade-in duration-500 text-center py-10">
            <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-400 mb-2">Chưa có đánh giá nào</h3>
            <p className="text-sm font-medium text-gray-400">Hãy là người đầu tiên trải nghiệm và đánh giá tour này nhé!</p>
          </div>
        )}

      </div>
    </div>
  );
}