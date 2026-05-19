import { Search, Filter, Download, CheckCircle, Clock, XCircle, AlertCircle, MoreHorizontal, Eye } from "lucide-react";

// Mock data (Giữ nguyên để ông giáo sau này map với API từ Java)
const bookings = [
  {
    id: "BK001234",
    customer: "Nguyễn Thị Lan",
    phone: "0901234567",
    tour: "Hà Nội - Hạ Long - Sapa 5N4Đ",
    departureDate: "15/06/2026",
    guests: 4,
    totalAmount: "12,500,000",
    paid: "5,000,000",
    remaining: "7,500,000",
    bookingStatus: "confirmed",
    paymentStatus: "partial",
  },
  {
    id: "BK001235",
    customer: "Trần Văn Minh",
    phone: "0912345678",
    tour: "TP.HCM - Phú Quốc Resort 4N3Đ",
    departureDate: "18/06/2026",
    guests: 2,
    totalAmount: "8,900,000",
    paid: "0",
    remaining: "8,900,000",
    bookingStatus: "pending",
    paymentStatus: "unpaid",
  },
  {
    id: "BK001236",
    customer: "Lê Hoàng Nam",
    phone: "0923456789",
    tour: "Đà Nẵng - Hội An - Huế 3N2Đ",
    departureDate: "20/06/2026",
    guests: 6,
    totalAmount: "6,750,000",
    paid: "6,750,000",
    remaining: "0",
    bookingStatus: "confirmed",
    paymentStatus: "paid",
  },
];

const bookingStatusConfig: Record<string, { label: string; icon: any; color: string }> = {
  confirmed: { label: "Đã xác nhận", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  pending: { label: "Chờ duyệt", icon: Clock, color: "bg-orange-50 text-orange-600 border-orange-100" },
  processing: { label: "Đang xử lý", icon: AlertCircle, color: "bg-blue-50 text-blue-600 border-blue-100" },
  cancelled: { label: "Đã hủy", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-100" },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Đã thanh toán", color: "bg-emerald-500 text-white" },
  partial: { label: "Trả một phần", color: "bg-orange-500 text-white" },
  unpaid: { label: "Chưa trả tiền", color: "bg-rose-500 text-white" },
};

export function BookingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quản lý đặt tour</h1>
          <p className="text-slate-500 font-medium">Hệ thống ghi nhận và điều phối đơn hàng TravelVN</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={16} strokeWidth={3} />
            <span>Xuất Excel</span>
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
            + Tạo đơn mới
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách, tour..."
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
        <button className="px-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-tight">
          <Filter size={16} strokeWidth={3} />
          Lọc nâng cao
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã Booking</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khách hàng</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tour & Khởi hành</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Tài chính</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => {
                const bStatus = bookingStatusConfig[booking.bookingStatus];
                const pStatus = paymentStatusConfig[booking.paymentStatus];
                const StatusIcon = bStatus.icon;

                return (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-6 px-8">
                      <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">{booking.id}</span>
                    </td>
                    <td className="py-6 px-8">
                      <div>
                        <p className="text-sm font-black text-slate-900">{booking.customer}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="max-w-[200px]">
                        <p className="text-sm font-bold text-slate-700 truncate">{booking.tour}</p>
                        <p className="text-[11px] font-black text-blue-500 uppercase mt-1">{booking.departureDate}</p>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div>
                        <p className="text-sm font-black text-slate-900">{booking.totalAmount}₫</p>
                        <p className={`text-[11px] font-black mt-1 ${booking.remaining === "0" ? "text-emerald-500" : "text-rose-500"}`}>
                           CÒN: {booking.remaining}₫
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-3 py-1 border-2 rounded-xl text-[10px] font-black uppercase tracking-tighter ${bStatus.color}`}>
                          <StatusIcon size={12} strokeWidth={3} />
                          {bStatus.label}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm ${pStatus.color}`}>
                          {pStatus.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center justify-center gap-2">
                         <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <Eye size={18} />
                         </button>
                         <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                            <MoreHorizontal size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
             Hiển thị <span className="text-slate-900">06</span> trên <span className="text-slate-900">120</span> đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 hover:text-blue-600 transition-all">Trước</button>
            <button className="w-10 h-10 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100">1</button>
            <button className="w-10 h-10 bg-white border-2 border-slate-100 text-slate-900 rounded-xl text-xs font-black hover:border-blue-200 transition-all">2</button>
            <button className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 hover:text-blue-600 transition-all">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}