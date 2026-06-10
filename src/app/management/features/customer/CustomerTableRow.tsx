import { Phone, Mail, MapPin, MoreHorizontal } from "lucide-react";

// Bổ sung thêm onViewProfile vào Type của tham số
export function CustomerTableRow({ 
  customer, 
  onViewProfile 
}: { 
  customer: any; 
  onViewProfile: () => void; 
}) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      {/* Cột ID */}
      <td className="py-6 px-8">
        <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
          {customer.id}
        </span>
      </td>

      {/* Cột Thông tin khách hàng */}
      <td className="py-6 px-8">
        <p className="text-sm font-black text-slate-900">{customer.fullName}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Phone size={10} /> {customer.phone || "Chưa cập nhật"}
          </span>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Mail size={10} /> {customer.email || "Chưa cập nhật"}
          </span>
        </div>
      </td>

      {/* Cột Địa chỉ */}
      <td className="py-6 px-8">
        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin size={14} className="text-rose-500" /> {customer.address || "Chưa cập nhật"}
        </span>
      </td>

      {/* Cột Tổng số đơn */}
      <td className="py-6 px-8 text-center font-black text-slate-900">
        {customer.totalBookings || 0}
      </td>

      {/* Cột Chi tiêu (Có bảo vệ null để tránh lỗi toLocaleString) */}
      <td className="py-6 px-8 text-right font-black text-blue-600">
        {(customer.totalSpent || 0).toLocaleString()}₫
      </td>

      {/* Cột Điểm Loyalty */}
      <td className="py-6 px-8 text-center text-amber-500 font-black text-xs">
        <span className="bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
          ✨ {customer.loyaltyPoints || 0} pts
        </span>
      </td>

      <td className="py-6 px-8">
        <div className="flex items-center justify-center gap-2">
           <button 
             onClick={onViewProfile}
             className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 shadow-blue-500/20"
           >
             Hồ sơ
           </button>
        </div>
      </td>
    </tr>
  );
}