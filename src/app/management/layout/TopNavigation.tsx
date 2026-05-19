import { Search, Plus, User, Bell } from "lucide-react";
// 🎯 Lưu ý: Đảm bảo đường dẫn NotificationDropdown này đúng với cấu trúc folder của ông giáo
// Nếu chưa có file này, ông giáo có thể tạm thời thay bằng một Icon Bell đơn giản
// import { NotificationDropdown } from "../features/notifications/NotificationDropdown"; 

export function TopNavigation() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
      
      {/* 1. THANH TÌM KIẾM TỔNG LỰC */}
      <div className="flex items-center gap-4 flex-1 max-w-xl group">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng, tour, mã booking..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-2xl text-sm font-bold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* 2. CỤM TIỆN ÍCH PHẢI */}
      <div className="flex items-center gap-4">
        
        {/* Nút Tạo mới nhanh */}
        <button className="hidden sm:flex px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all active:scale-95 items-center gap-2">
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Tạo mới</span>
        </button>

        {/* Thông báo (Tạm thời dùng Icon nếu chưa có Dropdown) */}
        <div className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </div>

        {/* PROFILE ADMIN */}
        <div className="flex items-center gap-4 pl-4 border-l border-slate-100 ml-2">
          <div className="text-right hidden md:block">
            <div className="text-[13px] font-black text-slate-900 leading-tight">Nguyễn Văn An</div>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Hệ thống Quản trị</div>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
              <User className="w-5 h-5 text-white" />
            </div>
            {/* Online Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white"></div>
          </div>
        </div>

      </div>
    </header>
  );
}