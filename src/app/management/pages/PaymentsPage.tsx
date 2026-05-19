import { Search, Filter, Download, CreditCard, Banknote, Wallet, MoreHorizontal, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

// --- MOCK DATA (Ông giáo giữ nguyên để sau này map API Payment từ Java) ---
const payments = [
  { id: "PAY-99123", bookingId: "BK-00123", customer: "Nguyễn Thị Lan", tour: "Hà Nội - Hạ Long 5N4Đ", amount: "5,000,000", method: "Chuyển khoản", type: "Đặt cọc", status: "success", date: "12/05/2026 10:30" },
  { id: "PAY-99124", bookingId: "BK-00125", customer: "Lê Hoàng Nam", tour: "Đà Nẵng - Hội An 3N2Đ", amount: "6,750,000", method: "Tiền mặt", type: "Toàn bộ", status: "success", date: "11/05/2026 15:20" },
  { id: "PAY-99125", bookingId: "BK-00126", customer: "Phạm Thu Hà", tour: "Nha Trang Vinpearl", amount: "3,000,000", method: "Chuyển khoản", type: "Đặt cọc", status: "pending", date: "10/05/2026 09:15" },
];

const paymentStats = [
  { title: "Tổng thu tháng này", value: "156.8M", change: "+18.2% tăng", icon: Wallet, color: "from-emerald-500 to-teal-600" },
  { title: "Chờ xác nhận", value: "23 Giao dịch", change: "10.5M đang treo", icon: CreditCard, color: "from-orange-500 to-amber-600" },
  { title: "Tổng công nợ", value: "45.2M", change: "18 Khách hàng", icon: Banknote, color: "from-rose-500 to-red-600" },
];

const statusConfig: any = {
  success: { label: "Thành công", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  pending: { label: "Chờ duyệt", icon: Clock3, color: "bg-orange-50 text-orange-600 border-orange-100" },
  failed: { label: "Thất bại", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-100" },
};

const methodColors: any = {
  "Chuyển khoản": "bg-blue-50 text-blue-600",
  "Tiền mặt": "bg-emerald-50 text-emerald-600",
  "Thẻ tín dụng": "bg-purple-50 text-purple-600",
};

export function PaymentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quản lý tài chính</h1>
          <p className="text-slate-500 font-medium">Theo dõi luồng tiền, ghi nhận giao dịch và quản lý công nợ khách hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={16} strokeWidth={3} />
            <span>Báo cáo thuế</span>
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
            + Ghi nhận thu tiền
          </button>
        </div>
      </div>

      {/* TOP ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={cn("w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
              <stat.icon size={24} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm mã giao dịch, tên khách hoặc mã đơn hàng..."
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
        <button className="px-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-tight">
          <Filter size={16} strokeWidth={3} />
          Lọc giao dịch
        </button>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã Giao dịch</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khách hàng & Đơn</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Số tiền</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Phương thức</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Ngày thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((payment) => {
                const status = statusConfig[payment.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-6 px-8">
                      <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">{payment.id}</span>
                    </td>
                    <td className="py-6 px-8">
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight">{payment.customer}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide">ĐƠN: {payment.bookingId}</p>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                       <p className="text-sm font-black text-emerald-600">{payment.amount}₫</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">{payment.type}</p>
                    </td>
                    <td className="py-6 px-8 text-center">
                       <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter", methodColors[payment.method])}>
                          {payment.method}
                       </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex justify-center">
                        <span className={cn("flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest", status.color)}>
                          <StatusIcon size={12} strokeWidth={3} />
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                       <p className="text-[11px] font-black text-slate-500 uppercase">{payment.date}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}