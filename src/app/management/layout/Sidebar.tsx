import { Link, useLocation } from "react-router-dom"; // Sửa lại từ "react-router" cho chuẩn bản mới
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  UserCircle,
  CreditCard,
  Briefcase,
  BarChart3,
  Settings,
  ChevronLeft,
  Palmtree,
  CalendarDays,
  Tag,
  Star,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils"; // Nhớ check file utils này nhé ông giáo

// 🎯 SỬA PATH: Thêm tiền tố /admin vào trước để khớp với Nested Routes
const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Tổng quan" },
  { path: "/admin/bookings", icon: Calendar, label: "Đặt tour" },
  { path: "/admin/tours", icon: MapPin, label: "Tour du lịch" },
  { path: "/admin/calendar", icon: CalendarDays, label: "Lịch khởi hành" },
  { path: "/admin/customers", icon: Users, label: "Khách hàng" },
  { path: "/admin/crm", icon: UserCircle, label: "CRM khách hàng" },
  { path: "/admin/payments", icon: CreditCard, label: "Thanh toán" },
  { path: "/admin/vouchers", icon: Tag, label: "Voucher & Khuyến mãi" },
  { path: "/admin/reviews", icon: Star, label: "Đánh giá" },
  { path: "/admin/employees", icon: Briefcase, label: "Nhân viên" },
  { path: "/admin/permissions", icon: Shield, label: "Phân quyền" },
  { path: "/admin/reports", icon: BarChart3, label: "Báo cáo" },
  { path: "/admin/analytics", icon: TrendingUp, label: "Phân tích nâng cao" },
  { path: "/admin/automation", icon: Zap, label: "Tự động hóa" },
  { path: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col h-screen",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Sidebar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
              <Palmtree className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-slate-900 tracking-tighter uppercase text-sm">TravelVN Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center mx-auto">
            <Palmtree className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform", isActive && "scale-110")} />
                  {!collapsed && <span className="text-[13px] font-bold tracking-tight">{item.label}</span>}
                  
                  {/* Tooltip khi bị collapsed */}
                  {collapsed && (
                    <div className="absolute left-16 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap shadow-xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Toggle Button */}
      <button
        onClick={onToggle}
        className="h-14 flex items-center justify-center border-t border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all shrink-0"
      >
        <ChevronLeft className={cn("w-6 h-6 transition-transform duration-500", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
}