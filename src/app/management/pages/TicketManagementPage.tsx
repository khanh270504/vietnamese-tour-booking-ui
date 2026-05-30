import { LifeBuoy, Clock, CheckCircle2, AlertCircle, Search, MessageCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const tickets = [
  { id: "TKT-8291", customer: "Trần Văn B", issue: "Yêu cầu hoàn tiền tour Hạ Long do sự cố thời tiết", priority: "High", status: "Open", date: "15/05/2026" },
  { id: "TKT-8295", customer: "Lê Thị C", issue: "Muốn đổi ngày khởi hành tour Phú Quốc", priority: "Medium", status: "In Progress", date: "16/05/2026" },
  { id: "TKT-8302", customer: "Nguyễn Văn D", issue: "Hướng dẫn viên không nhiệt tình", priority: "Low", status: "Closed", date: "14/05/2026" },
];

export function TicketManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trung tâm Hỗ trợ</h1>
        <p className="text-slate-500 font-medium">Xử lý khiếu nại và yêu cầu hoàn tiền từ khách hàng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Đang mở", val: "12", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Đang xử lý", val: "08", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Đã đóng", val: "145", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", s.bg)}><s.icon className={s.color} size={28}/></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Tìm mã ticket, khách hàng..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:bg-white border-transparent focus:border-blue-200 border transition-all" />
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {tickets.map((t) => (
            <div key={t.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  t.priority === 'High' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                )}><MessageCircle size={24}/></div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-black text-slate-900">{t.id}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border",
                      t.priority === 'High' ? "border-rose-100 text-rose-600" : "border-blue-100 text-blue-600"
                    )}>{t.priority} Priority</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 mt-1">{t.issue}</p>
                  <p className="text-xs font-medium text-slate-400 mt-1">Gửi bởi <span className="text-blue-500">{t.customer}</span> • {t.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                  t.status === 'Open' ? "bg-rose-50 text-rose-600" : t.status === 'Closed' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>{t.status}</span>
                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-black transition-colors">XỬ LÝ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}