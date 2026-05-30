import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ScheduleResponse } from "../../../services/tour/tour.types";
import { statusUI } from "./constants";

interface CalendarSidebarProps {
  schedules: ScheduleResponse[];
  loading: boolean;
  selected: ScheduleResponse | null; 
  setSelected: (schedule: ScheduleResponse) => void;
  onOpenCreate: () => void;
}

// Định nghĩa mảng filter để dễ quản lý value
const FILTER_TABS = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đang mở", value: "OPENING" },
  { label: "Đã đầy", value: "FULL" },
  { label: "Đã hoàn tất", value: "COMPLETED" },
];

export function CalendarSidebar({
  schedules,
  loading,
  selected,
  setSelected,
  onOpenCreate,
}: CalendarSidebarProps) {
  // States cho việc lọc dữ liệu
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic lọc (Filter) và Tìm kiếm (Search)
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // 1. Lọc theo trạng thái
      const matchFilter =
        activeFilter === "ALL" || schedule.status === activeFilter;

      // 2. Lọc theo từ khóa (Tên tour hoặc Mã/ID)
      const keyword = searchQuery.toLowerCase();
      const matchSearch =
        schedule.tourName?.toLowerCase().includes(keyword) ||
        schedule.id?.toString().toLowerCase().includes(keyword);

      return matchFilter && matchSearch;
    });
  }, [schedules, activeFilter, searchQuery]);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 flex flex-col gap-5 h-full max-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black tracking-tight">Điều hành Tour</h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý lịch khởi hành & vận hành tour
        </p>
      </div>

      <button
        onClick={onOpenCreate}
        className="w-full bg-black text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-sm"
      >
        <Plus size={18} />
        Tạo lịch mới
      </button>

      {/* Thanh tìm kiếm (Mới) */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Tìm tên tour hoặc mã..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none transition"
        />
      </div>

      {/* Tabs lọc trạng thái */}
      <div className="flex flex-col gap-1">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                isActive
                  ? "bg-slate-100 font-bold text-black"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Danh sách Tour */}
      <div className="space-y-3 pt-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-slate-400 animate-pulse">
              Đang tải lịch trình...
            </p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Không tìm thấy tour nào
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          filteredSchedules.map((schedule) => {
            // Kiểm tra xem tour này có đang được chọn không
            const isSelected = selected?.id === schedule.id;

            return (
              <div
                key={schedule.id}
                onClick={() => setSelected(schedule)}
                className={cn(
                  "p-3 rounded-2xl border transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-black bg-slate-50 shadow-md ring-1 ring-black" // 👈 Active state (Viền đen, đổ bóng)
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                )}
              >
                <p
                  className={cn(
                    "font-semibold text-sm truncate",
                    isSelected ? "text-black" : "text-slate-700"
                  )}
                >
                  {schedule.tourName}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {schedule.departureDate} • {schedule.departureLocation}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-lg text-white font-bold bg-gradient-to-r",
                      statusUI[schedule.status] || "from-slate-500 to-slate-400"
                    )}
                  >
                    {schedule.status}
                  </span>

                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                    {schedule.availableSlots}/{schedule.maxSlots} chỗ
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}