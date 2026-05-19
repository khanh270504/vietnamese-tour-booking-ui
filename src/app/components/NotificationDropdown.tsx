import { useState } from "react";
import { Bell, AlertCircle, Calendar, CheckCircle, TrendingUp, Inbox } from "lucide-react";
import { cn } from "../lib/utils";

// --- MOCK DATA ---
const notifications = [
  { id: "N001", type: "error", title: "Quá hạn thanh toán", message: "Booking BK001235 (Trần Văn Minh) đã quá hạn 2 ngày", time: "5 phút trước", read: false, priority: "high" },
  { id: "N002", type: "warning", title: "Sắp khởi hành", message: "Tour Hà Nội - Hạ Long khởi hành trong 3 ngày tới", time: "15 phút trước", read: false, priority: "high" },
  { id: "N003", type: "info", title: "Tour sắp đầy", message: "Phú Quốc Resort còn đúng 3 chỗ trống", time: "1 giờ trước", read: false, priority: "medium" },
];

const typeConfig: any = {
  error: { icon: AlertCircle, color: "bg-rose-50 text-rose-600" },
  warning: { icon: Calendar, color: "bg-amber-50 text-amber-600" },
  info: { icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
  success: { icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState(notifications);

  const unreadCount = list.filter((n) => !n.read).length;

  const markAllRead = () => setList(list.map(n => ({ ...n, read: true })));

  return (
    <div className="relative">
      {/* BELL BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-3 rounded-2xl transition-all duration-300 group",
          isOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
        )}
      >
        <Bell size={20} strokeWidth={isOpen ? 3 : 2} className={cn(unreadCount > 0 && !isOpen && "animate-bounce")} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-4 w-[400px] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 z-50 overflow-hidden animate-in fade-in zoom-in duration-300 origin-top-right">
            
            {/* Header */}
            <div className="p-8 pb-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Thông báo</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                  {unreadCount > 0 ? `Bạn có ${unreadCount} tin mới` : "Không có tin mới"}
                </p>
              </div>
              <button 
                onClick={markAllRead}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
              >
                Đọc tất cả
              </button>
            </div>

            {/* List */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {list.length > 0 ? (
                list.map((n) => {
                  const Config = typeConfig[n.type];
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "p-6 flex gap-5 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50/80 relative group",
                        !n.read && "bg-blue-50/30"
                      )}
                    >
                      {!n.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                      )}
                      
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", Config.color)}>
                        <Config.icon size={20} strokeWidth={3} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                            {n.title}
                          </h4>
                          <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4 text-slate-200">
                    <Inbox size={40} />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Hộp thư trống</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 text-center">
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">
                Xem toàn bộ nhật ký hệ thống
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}