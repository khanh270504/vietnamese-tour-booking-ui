import { MapPin, Calendar, Users, DollarSign, Search, Filter, Plus, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

// --- MOCK DATA (Ông giáo giữ nguyên để sau này map API Tour từ Java) ---
const tours = [
  { id: "T001", name: "Hà Nội - Hạ Long - Sapa 5N4Đ", destination: "Miền Bắc", duration: "5 ngày 4 đêm", price: "3,125,000", capacity: 30, status: "active", totalBookings: 145 },
  { id: "T002", name: "TP.HCM - Phú Quốc Resort 4N3Đ", destination: "Miền Nam", duration: "4 ngày 3 đêm", price: "2,975,000", capacity: 25, status: "active", totalBookings: 128 },
  { id: "T005", name: "Đà Lạt - Lâm Đồng 2N1Đ", destination: "Tây Nguyên", duration: "2 ngày 1 đêm", price: "2,000,000", capacity: 40, status: "inactive", totalBookings: 87 },
];

export function TourManagerPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kho Tour Du Lịch</h1>
          <p className="text-slate-500 font-medium">Quản lý danh mục sản phẩm, lịch trình và biểu phí</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
          <Plus size={16} strokeWidth={3} />
          Thêm Tour mới
        </button>
      </div>

      {/* TOP ANALYTICS MINI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <TourStatCard label="Tổng Tour" value="87" trend="+5 mới" icon={MapPin} color="from-blue-500 to-blue-600" />
        <TourStatCard label="Đang bán" value="72" trend="82.8%" icon={Calendar} color="from-emerald-500 to-emerald-600" />
        <TourStatCard label="Lượt đặt" value="1,234" trend="+18.2%" icon={Users} color="from-purple-500 to-purple-600" />
        <TourStatCard label="Giá TB" value="2.6M" trend="VNĐ/Khách" icon={DollarSign} color="from-orange-500 to-orange-600" />
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm tên tour, điểm đến hoặc mã tour..."
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
        <button className="px-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-tight">
          <Filter size={16} strokeWidth={3} />
          Lọc nâng cao
        </button>
      </div>

      {/* TOURS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div key={tour.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500">
            {/* Tour Image Placeholder with Gradient */}
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
               <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                    {tour.id}
                  </span>
               </div>
               <div className="absolute top-6 right-6">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                    tour.status === 'active' ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                  )}>
                    {tour.status === 'active' ? "Đang chạy" : "Tạm ngưng"}
                  </span>
               </div>
               {/* Sức chứa nổi lên trên ảnh */}
               <div className="absolute -bottom-2 -right-2 bg-white p-4 rounded-tl-[2rem] shadow-sm flex items-center gap-2">
                  <Users size={14} className="text-blue-500" />
                  <span className="text-xs font-black text-slate-900">{tour.capacity} khách</span>
               </div>
            </div>

            <div className="p-8">
              <h3 className="text-lg font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                {tour.name}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Điểm đến</p>
                   <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <MapPin size={14} className="text-rose-500" /> {tour.destination}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời lượng</p>
                   <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" /> {tour.duration}
                   </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giá khởi điểm</p>
                  <p className="text-xl font-black text-blue-600">{tour.price}₫</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đã bán</p>
                  <p className="text-sm font-black text-slate-900">{tour.totalBookings} đơn</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                 <button className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                    <Edit3 size={14} /> Sửa Tour
                 </button>
                 <button className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// COMPONENT CON: StatCard (Dùng chung chuẩn sếp tổng)
function TourStatCard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={cn("w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
        <Icon size={24} strokeWidth={3} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">{value}</p>
        <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">{trend}</p>
      </div>
    </div>
  );
}