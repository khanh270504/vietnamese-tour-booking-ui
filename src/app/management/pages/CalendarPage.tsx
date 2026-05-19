import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin, Clock, User, Plus } from "lucide-react";

// --- CONFIG & MOCK DATA (Ông giáo giữ nguyên hoặc map API sau) ---
const tourSchedules = [
  { id: "TS001", date: "2026-05-15", tour: "Vịnh Hạ Long - Đảo Cát Bà", capacity: 30, booked: 28, status: "almost-full", guide: "Trần Mai" },
  { id: "TS002", date: "2026-05-16", tour: "Phú Quốc Resort 4N3Đ", capacity: 25, booked: 25, status: "full", guide: "Nguyễn An" },
  { id: "TS003", date: "2026-05-12", tour: "Đà Nẵng - Hội An", capacity: 35, booked: 15, status: "available", guide: "Phạm Linh" },
];

const statusColors: any = {
  available: "bg-emerald-50 text-emerald-600 border-emerald-100",
  "almost-full": "bg-orange-50 text-orange-600 border-orange-100",
  full: "bg-rose-50 text-rose-600 border-rose-100",
};

export function CalendarPage() {
  const [activeTab, setActiveTab] = useState<"tours" | "care">("tours");
  const currentMonth = "Tháng 05, 2026";
  
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const firstDayOffset = 4; // Offset cho tháng 5/2026 bắt đầu từ thứ 6

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Điều hành lịch trình</h1>
          <p className="text-slate-500 font-medium">Quản lý lịch khởi hành tour và nhân sự phụ trách</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
          <Plus size={16} strokeWidth={3} />
          Thêm lịch mới
        </button>
      </div>

      {/* CALENDAR MAIN CARD */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
        
        {/* Calendar Controller */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl">
            <button className="p-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-all">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{currentMonth}</h2>
            <button className="p-2 bg-white rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab("tours")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === "tours" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
              }`}
            >
              Lịch khởi hành
            </button>
            <button
              onClick={() => setActiveTab("care")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === "care" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
              }`}
            >
              Chăm sóc khách
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
            <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              {day}
            </div>
          ))}

          {/* Empty cells */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-slate-50/30 rounded-3xl border border-transparent" />
          ))}

          {/* Actual days */}
          {daysInMonth.map((day) => {
            const isToday = day === 12; // Giả sử hôm nay là ngày 12
            const dateStr = `2026-05-${day.toString().padStart(2, "0")}`;
            const schedules = tourSchedules.filter(s => s.date === dateStr);

            return (
              <div
                key={day}
                className={`group aspect-square border-2 rounded-[2rem] p-3 transition-all cursor-pointer flex flex-col ${
                  isToday ? "border-blue-500 bg-blue-50/20" : "border-slate-50 hover:border-blue-100 hover:bg-slate-50/50"
                }`}
              >
                <span className={`text-sm font-black mb-2 ${isToday ? "text-blue-600" : "text-slate-400"}`}>
                  {day}
                </span>
                
                <div className="flex-1 space-y-1.5 overflow-hidden">
                  {schedules.map((s) => (
                    <div key={s.id} className={`text-[9px] p-2 rounded-xl font-black uppercase tracking-tighter border truncate ${statusColors[s.status]}`}>
                      {s.tour}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Upcoming Tours */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Chi tiết lịch khởi hành</h3>
          <div className="space-y-4">
            {tourSchedules.map((s) => (
              <div key={s.id} className="p-5 border-2 border-slate-50 rounded-3xl hover:border-blue-100 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-slate-900 leading-tight mb-1">{s.tour}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase">
                       <span className="flex items-center gap-1"><CalendarIcon size={12}/> {s.date}</span>
                       <span className="flex items-center gap-1"><User size={12}/> {s.guide}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusColors[s.status]}`}>
                    {s.status === 'full' ? 'Hết chỗ' : s.booked + '/' + s.capacity}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${(s.booked / s.capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Customer Care Today */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">CRM Task hôm nay</h3>
          <div className="space-y-4">
             <div className="flex items-center gap-6 p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm shrink-0 border border-slate-100">
                   <span className="text-xs font-black text-blue-600">09:00</span>
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Follow-up khách hàng</p>
                   <h4 className="font-black text-slate-900">Nguyễn Văn Hoàng</h4>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl">Call</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}