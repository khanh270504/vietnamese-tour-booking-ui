import { useState } from "react";
import { useParams, Link } from "react-router";
import { Calendar, Clock, MapPin, Users, Star, ChevronLeft, ChevronRight, CheckCircle2, PhoneCall } from "lucide-react";

export function TourDetailPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("intro"); // Tự quản lý State cho Tabs

  const tourImages = [
    "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?q=80&w=1080",
    "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?q=80&w=1080",
    "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?q=80&w=1080",
  ];

  const departureDates = [
    { date: "15/06/2026", seats: 5, status: "low" },
    { date: "22/06/2026", seats: 2, status: "low" },
    { date: "29/06/2026", seats: 12, status: "available" },
    { date: "06/07/2026", seats: 15, status: "available" },
    { date: "13/07/2026", seats: 0, status: "full" },
  ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % tourImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* GALLERY SECTION */}
        <div className="mb-10">
          <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
            <img 
              src={tourImages[currentImageIndex]} 
              alt="Tour" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            
            {/* Navigation Buttons */}
            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg">
              <ChevronRight size={24} />
            </button>

            {/* Counter Badge */}
            <div className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-black tracking-widest">
              {currentImageIndex + 1} / {tourImages.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2 no-scrollbar">
            {tourImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentImageIndex(i)}
                className={`relative flex-shrink-0 w-32 h-20 rounded-2xl overflow-hidden border-4 transition-all ${currentImageIndex === i ? 'border-blue-600 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Best Seller</span>
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                  <Star size={16} fill="currentColor" /> 4.8 <span className="text-gray-400 font-medium">(125 đánh giá)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1]">Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ</h1>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: "Thời gian", val: "3 Ngày 2 Đêm" },
                { icon: MapPin, label: "Khởi hành", val: "Hà Nội" },
                { icon: Users, label: "Quy mô", val: "Tối đa 30" },
                { icon: Calendar, label: "Tần suất", val: "Hàng tuần" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                  <item.icon className="w-6 h-6 text-blue-600 mb-3" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                  <p className="font-bold text-gray-900">{item.val}</p>
                </div>
              ))}
            </div>

            {/* TABS TỰ CHẾ */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-50 overflow-x-auto no-scrollbar">
                {[
                  { id: "intro", label: "Giới thiệu" },
                  { id: "itinerary", label: "Lịch trình" },
                  { id: "pricing", label: "Bảng giá" },
                  { id: "reviews", label: "Đánh giá" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                      activeTab === tab.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 animate-in fade-in" />}
                  </button>
                ))}
              </div>

              <div className="p-8 md:p-10">
                {activeTab === "intro" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-xl font-black mb-4">Trải nghiệm kỳ quan thiên nhiên</h3>
                    <p className="text-gray-500 leading-relaxed font-medium mb-6">
                      Hành trình đưa bạn len lỏi qua hàng nghìn đảo đá vôi kỳ thú trên vịnh Hạ Long, thư giãn trên du thuyền sang trọng và khám phá hệ sinh thái đa dạng tại đảo Ngọc Cát Bà. 
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Du thuyền 5 sao chuẩn quốc tế", "Tham quan Hang Sửng Sốt", "Chèo Kayak tại Làng Chài", "Nghỉ dưỡng tại Resort Cát Bà"].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl">
                          <CheckCircle2 className="text-blue-600 w-5 h-5" />
                          <span className="font-bold text-sm text-gray-700">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {[
                      { day: "Ngày 1", title: "Hà Nội - Hạ Long - Bữa tối lãng mạn", desc: "Đón khách tại điểm hẹn, khởi hành đi Hạ Long. Check-in tàu và tham quan Hang Sửng Sốt." },
                      { day: "Ngày 2", title: "Khám phá Cát Bà", desc: "Tự do tắm biển, tham quan Vườn quốc gia Cát Bà và rừng Kim Giao." },
                      { day: "Ngày 3", title: "Tạm biệt Vịnh Ngọc", desc: "Mua sắm đặc sản, thưởng thức bữa trưa cuối cùng và về lại Hà Nội." },
                    ].map((item, i) => (
                      <div key={i} className="relative pl-10 border-l-2 border-dashed border-gray-100 last:border-0">
                        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.day}</span>
                        <h4 className="text-lg font-black text-gray-900 mt-1 mb-2">{item.title}</h4>
                        <p className="text-gray-500 font-medium text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="animate-in fade-in duration-500">
                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <tr>
                            <th className="px-6 py-4">Đối tượng</th>
                            <th className="px-6 py-4 text-right">Đơn giá</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          <tr className="font-bold">
                            <td className="px-6 py-5">Người lớn</td>
                            <td className="px-6 py-5 text-right text-blue-600">5.990.000₫</td>
                          </tr>
                          <tr className="font-bold">
                            <td className="px-6 py-5">Trẻ em (5-11 tuổi)</td>
                            <td className="px-6 py-5 text-right text-blue-600">4.490.000₫</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR BOOKING CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sticky top-24">
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Giá trọn gói từ</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900">5.990k</span>
                  <span className="text-gray-400 font-bold text-sm">/ khách</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Lịch khởi hành</h3>
                <div className="space-y-3">
                  {departureDates.map((date, i) => (
                    <button 
                      key={i}
                      disabled={date.status === 'full'}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        date.status === 'full' 
                        ? 'bg-gray-50 border-gray-50 opacity-50 cursor-not-allowed' 
                        : 'border-gray-50 hover:border-blue-200 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">{date.date}</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${
                        date.status === 'full' ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-600'
                      }`}>
                        {date.status === 'full' ? 'Hết chỗ' : `Còn ${date.seats} chỗ`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Link to={`/booking/${id}`}>
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 mb-6">
                  Đặt Tour Ngay
                </button>
              </Link>

              <div className="pt-6 border-t border-gray-50">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hỗ trợ 24/7</p>
                    <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">1900 1234</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}