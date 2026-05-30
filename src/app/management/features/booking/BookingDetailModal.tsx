import { X, User, MapPin, Calendar, CreditCard, Activity, Clock } from "lucide-react";
import { BookingResponse } from "../../../services/booking/booking.types";

interface BookingDetailModalProps {
  booking: any; // Chuyển any tạm thời để tránh ép kiểu sai thuộc tính cũ
  onClose: () => void;
}

export function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  // Hàm định dạng hiển thị tiền tệ cho đồng bộ toàn hệ thống admin
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  // Xác định badge màu sắc cho từng trạng thái đơn hàng hiện tại
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Chi tiết Đơn hàng <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-lg text-sm">{booking.bookingCode || `#${booking.id}`}</span>
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${getStatusBadgeClass(booking.status)}`}>
                {booking.status === "CONFIRMED" ? "Đã xác nhận" : booking.status === "PENDING" ? "Chờ xử lý" : booking.status === "CANCELLED" ? "Đã hủy" : booking.status}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500 mt-1">
              Ngày tạo đơn: {booking.createdAt ? new Date(booking.createdAt).toLocaleString("vi-VN") : "N/A"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors shadow-sm">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* BODY TỰ ĐỘNG CUỘN KHI QUÁ DÀI */}
        <div className="p-6 overflow-y-auto space-y-8 hide-scrollbar flex-1">
          
          {/* LƯỚI THÔNG TIN CƠ BẢN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KHỐI THÔNG TIN NGƯỜI ĐẶT */}
            <div className="p-5 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                <User size={14} /> Thông tin liên hệ
              </h3>
              <p className="text-base font-black text-slate-900">{booking.contactName || booking.contactInfo?.fullName || "Chưa có tên"}</p>
              <div className="text-sm font-bold text-slate-600 space-y-1">
                <p>SĐT: {booking.contactPhone || booking.contactInfo?.phone || "N/A"}</p>
                <p>Email: {booking.contactEmail || booking.contactInfo?.email || "N/A"}</p>
              </div>
              {booking.note && (
                <div className="text-xs text-slate-500 italic border-t border-blue-100 pt-2.5 mt-2">
                  <span className="font-bold text-blue-700 not-italic block mb-0.5">Ghi chú điều hành:</span>
                  "{booking.note}"
                </div>
              )}
            </div>

            {/* FIX LỖI 1: THÔNG TIN TOUR SỬ DỤNG TRƯỜNG THỰC TẾ TRÊN BACKEND */}
            <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-3">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={14} /> Chi tiết dịch vụ tour
              </h3>
              <p className="text-base font-black text-slate-900" title={booking.tourName || booking.schedule?.tourName}>
                {booking.tourName || booking.schedule?.tourName || "Tên Tour hệ thống"}
              </p>
              <div className="text-sm font-bold text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5 text-blue-700 font-black">
                  Mã chuyến đi: {booking.scheduleCode || booking.schedule?.scheduleCode || "N/A"}
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" /> 
                  Khởi hành: <span className="text-slate-900">{booking.departureDateSnapshot || booking.departureDate || booking.schedule?.departureDate || "N/A"}</span>
                </p>
                {booking.schedule?.departureLocation && (
                  <p className="text-xs text-slate-500">
                    Nơi khởi hành: {booking.schedule.departureLocation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DANH SÁCH HÀNH KHÁCH */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-slate-400" /> Danh sách Hành khách ({booking.passengers?.length || 0})
            </h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[500px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Họ và tên</th>
                      <th className="py-3 px-4">Ngày sinh</th>
                      <th className="py-3 px-4">Giới tính</th>
                      <th className="py-3 px-4">Phân loại vé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {(booking.passengers || []).map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 text-slate-900">{p.fullName || p.name}</td>
                        <td className="py-3 px-4">{p.birthDate || "N/A"}</td>
                        <td className="py-3 px-4">
                          {p.gender === "MALE" ? "Nam" : p.gender === "FEMALE" ? "Nữ" : "Khác"}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide ${p.passengerType === "ADULT" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-pink-50 text-pink-700 border border-pink-200"}`}>
                            {p.passengerType === "ADULT" ? "NGƯỜI LỚN" : "TRẺ EM"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* DÒNG TIỀN VÀ THANH TOÁN */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} className="text-slate-400" /> Lịch sử Giao dịch thanh toán
            </h3>
            {(!booking.payments || booking.payments.length === 0) ? (
              <div className="text-sm font-bold text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 p-5 rounded-2xl text-center">
                Hệ thống chưa ghi nhận giao dịch thanh toán nào cho đơn này.
              </div>
            ) : (
              <div className="space-y-2">
                {booking.payments.map((pay: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {pay.paymentMethod || "Chuyển khoản"} 
                        <span className="text-slate-400 font-medium text-xs ml-2">
                          {pay.createdAt ? new Date(pay.createdAt).toLocaleString("vi-VN") : ""}
                        </span>
                      </p>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">Mã giao dịch: {pay.transactionCode || pay.id || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">+{formatCurrency(pay.amount)}</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${pay.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                        {pay.status === "SUCCESS" ? "Thành công" : pay.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center shadow-lg">
              <span className="font-bold text-xs text-slate-400 tracking-wider">TỔNG CUỐI (SAU GIẢM GIÁ):</span>
              <span className="text-xl font-black text-amber-400">
                {formatCurrency(booking.totalFinalPrice || booking.finalPrice || booking.totalPrice || 0)}
              </span>
            </div>
          </div>

          {/* FIX LỖI 2: TIMELINE LỊCH SỬ HỆ THỐNG CHẠY HOÀN HẢO */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-slate-400" /> Vết hệ thống (Timeline lịch sử)
            </h3>
            
            {(!booking.statusHistories || booking.statusHistories.length === 0) ? (
              // Fallback trường hợp đơn mới tạo chưa sinh mảng lịch sử thay đổi trạng thái
              <div className="border-l-2 border-blue-500 ml-3 pl-6 relative">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <p className="text-xs font-bold text-slate-400">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleString("vi-VN") : "N/A"}
                </p>
                <p className="text-sm font-black text-slate-800 mt-0.5">Đơn hàng được khởi tạo trên hệ thống</p>
                <p className="text-xs font-bold text-slate-500">Trạng thái ban đầu: <span className="text-blue-600 font-black">{booking.status}</span></p>
              </div>
            ) : (
              <div className="border-l-2 border-slate-200 ml-3 space-y-5">
                {booking.statusHistories.map((hist: any, i: number) => (
                  <div key={i} className="relative pl-6 group">
                    {/* Điểm nút Timeline sáng lên */}
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white group-last:bg-emerald-500"></div>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {hist.createdAt ? new Date(hist.createdAt).toLocaleString("vi-VN") : "N/A"}
                    </p>
                    <p className="text-sm font-black text-slate-800 mt-0.5">
                      Cập nhật trạng thái sang: <span className="text-blue-600">{hist.toStatus || hist.status}</span>
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      Người thực hiện: <span className="text-slate-700">{hist.changedBy || hist.operatorName || "Hệ thống"}</span> 
                      {hist.reason && ` • Lý do: ${hist.reason}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}