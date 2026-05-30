import { Link, useLocation } from "react-router-dom";
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
  MessageSquare,
  Image,
  Building2,
  X,
  LifeBuoy,
  PlaneTakeoff,
  Bell,
} from "lucide-react";

import { cn } from "../../lib/utils";

const menuSections = [
  {
    title: "TỔNG QUAN",
    items: [
      {
        path: "/admin",
        icon: LayoutDashboard,
        label: "Tổng quan",
      },
    ],
  },

  // =========================
  // SALES / CRM
  // =========================
  {
    title: "KINH DOANH & CRM",
    items: [
      {
        path: "/admin/customers",
        icon: Users,
        label: "Khách hàng",
      },
      {
        path: "/admin/crm",
        icon: UserCircle,
        label: "CRM Pipeline",
      },
      {
        path: "/admin/chat",
        icon: MessageSquare,
        label: "CSKH Chat",
      },
      {
        path: "/admin/tickets",
        icon: LifeBuoy,
        label: "Hỗ trợ (Ticket)",
      },
    ],
  },

  // =========================
  // TOUR OPERATION
  // =========================
  {
    title: "ĐIỀU HÀNH TOUR",
    items: [
      {
        path: "/admin/tours",
        icon: MapPin,
        label: "Tour du lịch",
      },
      {
        path: "/admin/calendar",
        icon: CalendarDays,
        label: "Lịch khởi hành",
      },
      {
        path: "/admin/suppliers",
        icon: Building2,
        label: "Nhà cung cấp",
      },
    ],
  },

  // =========================
  // BOOKING & PAYMENT
  // =========================
  {
    title: "ĐẶT TOUR & TÀI CHÍNH",
    items: [
      {
        path: "/admin/bookings",
        icon: Calendar,
        label: "Đặt tour",
      },
      {
        path: "/admin/payments",
        icon: CreditCard,
        label: "Thanh toán",
      },
      {
        path: "/admin/vouchers",
        icon: Tag,
        label: "Khuyến mãi",
      },
    ],
  },

  // =========================
  // CONTENT / MEDIA
  // =========================
  {
    title: "NỘI DUNG",
    items: [
      {
        path: "/admin/media",
        icon: Image,
        label: "Thư viện ảnh",
      },
      {
        path: "/admin/reviews",
        icon: Star,
        label: "Đánh giá",
      },
    ],
  },

  // =========================
  // SYSTEM
  // =========================
  {
    title: "QUẢN TRỊ HỆ THỐNG",
    items: [
      {
        path: "/admin/employees",
        icon: Briefcase,
        label: "Nhân viên",
      },
      {
        path: "/admin/reports",
        icon: BarChart3,
        label: "Báo cáo",
      },
      {
        path: "/admin/notifications",
        icon: Bell,
        label: "Thông báo",
      },
      {
        path: "/admin/settings",
        icon: Settings,
        label: "Cài đặt",
      },
    ],
  },
];

export function Sidebar({
  collapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: any) {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[40] lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-[50] h-screen bg-white border-r border-slate-100 transition-all duration-300 flex flex-col",
          collapsed ? "lg:w-20" : "lg:w-72",
          isMobileOpen
            ? "translate-x-0 w-72 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* HEADER */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div
            className={cn(
              "flex items-center gap-3",
              collapsed && "lg:hidden"
            )}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Palmtree size={22} />
            </div>

            <div className="leading-tight">
              <p className="font-black text-slate-900 uppercase text-sm tracking-tight">
                Travel Admin
              </p>

              <p className="text-[11px] text-slate-400 font-medium">
                Booking & CRM System
              </p>
            </div>
          </div>

          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                {/* SECTION TITLE */}
                {!collapsed && (
                  <p className="px-3 mb-2 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                    {section.title}
                  </p>
                )}

                {/* ITEMS */}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = isActiveRoute(item.path);

                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={onMobileClose}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative",
                            isActive
                              ? "bg-blue-50 text-blue-600 shadow-sm"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          {/* ACTIVE BAR */}
                          {isActive && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-600" />
                          )}

                          <item.icon
                            size={20}
                            className={cn(
                              "shrink-0 transition-transform",
                              isActive && "scale-110"
                            )}
                          />

                          <span
                            className={cn(
                              "text-[13px] font-bold",
                              collapsed && "lg:hidden"
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* FOOTER */}
        <button
          onClick={onToggle}
          className="hidden lg:flex h-14 items-center justify-center border-t border-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft
            className={cn(
              "transition-transform duration-500",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </aside>
    </>
  );
}