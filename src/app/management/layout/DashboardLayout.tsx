import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar"; 
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Search, User } from "lucide-react";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          
          {/* Bên trái: Thanh tìm kiếm nhanh */}
          <div className="relative group w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm nhanh mã đơn, khách hàng..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>

          {/* Bên phải: Chuông thông báo + User Profile */}
          <div className="flex items-center gap-6">
            
            {/* 🔔 ĐÂY NÈ ÔNG GIÁO! Nhét nó ở đây */}
            <NotificationDropdown />

            <div className="w-px h-8 bg-slate-100 mx-2" /> {/* Vạch ngăn cách */}

            {/* Avatar & Tên Admin */}
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-tight">Admin Quản trị</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Sếp Tổng</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-105 transition-all">
                <User size={20} strokeWidth={3} />
              </div>
            </div>
          </div>
        </header>

        {/* 3. NỘI DUNG TRANG CON (OVERVIEW, BOOKINGS,...) */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}