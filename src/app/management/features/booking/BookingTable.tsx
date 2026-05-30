import { CheckCircle, Clock, XCircle, AlertCircle, Eye, MoreHorizontal, Check, CheckSquare } from "lucide-react";

// Cấu hình trạng thái Đơn hàng
const bookingStatusConfig: Record<string, { label: string; icon: any; color: string }> = {
  CONFIRMED: { label: "Đã xác nhận", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  PENDING: { label: "Chờ duyệt", icon: Clock, color: "bg-orange-50 text-orange-600 border-orange-100" },
  COMPLETED: { label: "Hoàn tất", icon: CheckCircle, color: "bg-blue-50 text-blue-600 border-blue-100" },
  CANCELLED: { label: "Đã hủy", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-100" },
};

// Cấu hình nhãn tài chính tổng quát
const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  PAID: { label: "Đã thanh toán", color: "bg-emerald-500 text-white" },
  PARTIAL: { label: "Trả một phần", color: "bg-orange-500 text-white" },
  UNPAID: { label: "Chưa trả tiền", color: "bg-rose-500 text-white" },
};

// Bổ sung interface nhận hàm Update từ Page tổng
interface BookingTableProps {
  bookings: any[];
  onViewDetail: (booking: any) => void;
  onUpdateStatus: (id: number, status: string) => void; 
}

export function BookingTable({ bookings, onViewDetail, onUpdateStatus }: BookingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
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
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-16 text-slate-400 font-bold">
                Không tìm thấy đơn hàng nào phù hợp.
              </td>
            </tr>
          ) : (
            bookings.map((booking: any) => {
              
              // 1. Trạng thái Booking
              const statusKey = String(booking.status || "PENDING").toUpperCase();
              const bStatus = bookingStatusConfig[statusKey] || bookingStatusConfig.PENDING;
              const StatusIcon = bStatus.icon;

              // 2. Tính tiền nợ
              const totalFinal = booking.totalFinalPrice || 0;
              const totalPaid = (booking.payments || []).reduce((sum: number, payment: any) => {
                if (payment.status === "SUCCESS") {
                  return sum + (payment.amount || 0);
                }
                return sum;
              }, 0);
              const remaining = Math.max(0, totalFinal - totalPaid);

              // 3. Trạng thái Tài chính
              let payKey = "UNPAID";
              if (totalPaid > 0 && totalPaid < totalFinal) payKey = "PARTIAL";
              else if (totalPaid >= totalFinal && totalFinal > 0) payKey = "PAID";
              const pStatus = paymentStatusConfig[payKey];

              return (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-6 px-8">
                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                      {booking.bookingCode}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <div>
                      <p className="text-sm font-black text-slate-900">{booking.contactName}</p>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">{booking.contactPhone}</p>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="max-w-[250px]">
                      <p className="text-sm font-bold text-slate-700 truncate" title={booking.tourNameSnapshot}>
                        {booking.tourNameSnapshot}
                      </p>
                      <p className="text-[11px] font-black text-blue-500 uppercase mt-1">
                        {booking.departureDateSnapshot} &bull; {booking.passengers?.length || 0} Khách
                      </p>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {totalFinal.toLocaleString()}₫
                      </p>
                      <p className={`text-[11px] font-black mt-1 ${remaining === 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        CÒN: {remaining.toLocaleString()}₫
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
                      
                      {/* Nút Xem Chi Tiết */}
                      <button 
                        onClick={() => onViewDetail(booking)} // 🎯 Truyền cả object booking lên để Modal dùng
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Menu Thao Tác (Nút 3 chấm) */}
                      <div className="group relative">
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all cursor-pointer focus:ring-2 focus:ring-slate-200 outline-none">
                          <MoreHorizontal size={18} />
                        </button>
                        
                        {/* Dropdown Menu - Hiện khi hover */}
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col p-1 overflow-hidden">
                          <button 
                            onClick={() => onUpdateStatus(booking.id, "CONFIRMED")}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl w-full text-left"
                          >
                            <Check size={14} /> Xác nhận
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(booking.id, "COMPLETED")}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl w-full text-left"
                          >
                            <CheckSquare size={14} /> Hoàn tất
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2"></div>
                          <button 
                            onClick={() => onUpdateStatus(booking.id, "CANCELLED")}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl w-full text-left"
                          >
                            <XCircle size={14} /> Hủy đơn
                          </button>
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}