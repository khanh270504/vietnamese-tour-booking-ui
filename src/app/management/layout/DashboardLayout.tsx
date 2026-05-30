import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar"; 
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Search, User, LogOut, Settings, Globe, ChevronDown, Menu } from "lucide-react";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50/30">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-500 lg:hidden"><Menu size={24} /></button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Tìm nhanh..." className="pl-12 pr-4 py-2.5 bg-slate-50 rounded-2xl text-xs font-bold w-64 lg:w-96 outline-none focus:bg-white border-transparent focus:border-blue-100 border transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="relative">
              <div onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 cursor-pointer p-1.5 rounded-2xl hover:bg-slate-50 transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-tight">ADMIN</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase">Quản trị hệ thống</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100"><User size={20}/></div>
              </div>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                  <button onClick={() => navigate("/")} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600"><Globe size={16}/> Trang chủ</button>
                  <button onClick={handleLogout} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-black text-rose-500 hover:bg-rose-50"><LogOut size={16}/> Đăng xuất</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto"><Outlet /></div>
        </div>
      </main>
    </div>
  );
}