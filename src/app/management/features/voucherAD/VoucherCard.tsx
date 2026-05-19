import { Calendar, MoreHorizontal, Ticket, Percent, Tag } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Voucher } from "../../../services/voucher/voucher.types"; 

// 🎯 Map đúng với enum 'FIXED' | 'PERCENT' từ Backend
const typeConfig: Record<string, any> = {
  PERCENT: { label: "Giảm %", icon: Percent, color: "from-purple-500 to-indigo-600" },
  FIXED: { label: "Cố định", icon: Tag, color: "from-blue-500 to-cyan-600" },
};

const statusConfig: Record<string, string> = {
  active: "bg-emerald-500 text-white shadow-emerald-100",
  inactive: "bg-slate-400 text-white shadow-slate-100",
  expired: "bg-rose-500 text-white shadow-rose-100",
};

// Hàm format ngày tháng từ ISO String sang dạng dễ đọc dd/MM/yyyy
const formatDate = (isoString?: string) => {
  if (!isoString) return "KXĐ";
  return new Date(isoString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

interface Props {
  voucher: Voucher;
  onEdit: (voucher: Voucher) => void;
}

// 🎯 FIX 1: Thêm onEdit vào destructuring để hàm nhận được prop từ trang cha
export function VoucherCard({ voucher: v, onEdit }: Props) {
  const type = typeConfig[v.discountType] || typeConfig['FIXED'];
  const usageRate = v.maxUsage > 0 ? (v.usageCount / v.maxUsage) * 100 : 0;

  // 🎯 Format số tiền hiển thị theo chuẩn VNĐ
  const displayDiscount = v.discountType === 'PERCENT' 
    ? `${v.discountValue}%` 
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.discountValue);

  // 🎯 Tính toán trạng thái thực tế dựa trên thời gian và cờ isActive
  const now = new Date();
  const expDate = new Date(v.expiryDate);
  let currentStatus = 'active';
  if (!v.isActive) currentStatus = 'inactive';
  else if (expDate < now) currentStatus = 'expired';

  return (
    <div className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
      
      {/* VOUCHER TICKET TOP */}
      <div className={cn("p-8 text-white relative overflow-hidden bg-gradient-to-br", type.color)}>
        <div className="absolute top-6 right-6">
          <span className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg", statusConfig[currentStatus])}>
            {currentStatus === 'active' ? 'Đang chạy' : currentStatus === 'expired' ? 'Hết hạn' : 'Tạm ngưng'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
            <Ticket size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{type.label}</span>
        </div>

        <h3 className="text-3xl font-black mb-1 tracking-tighter leading-tight">{v.code}</h3>
        <p className="text-xs font-bold opacity-70 uppercase tracking-wide line-clamp-1">{v.title}</p>

        {/* Decoration Circles */}
        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white rounded-full" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white rounded-full" />
      </div>

      {/* VOUCHER DETAILS BOTTOM */}
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giá trị ưu đãi</p>
            <p className="text-3xl font-black text-blue-600">{displayDiscount}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đã dùng</p>
            <p className="text-sm font-black text-slate-900">{v.usageCount}{v.maxUsage > 0 ? `/${v.maxUsage}` : ' ∞'}</p>
          </div>
        </div>

        {v.maxUsage > 0 && (
          <div className="space-y-2">
            <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className={cn("h-full rounded-full transition-all duration-1000", usageRate > 80 ? "bg-rose-500" : "bg-blue-500")} style={{ width: `${Math.min(usageRate, 100)}%` }} />
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase text-right">Tỷ lệ lấp đầy: {usageRate.toFixed(0)}%</p>
          </div>
        )}

        <div className="pt-6 border-t border-slate-50 space-y-3">
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
            <Calendar size={14} className="text-blue-500" />
            <span>{formatDate(v.startDate)} — {formatDate(v.expiryDate)}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-transparent group-hover:border-blue-100 transition-all">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Đối tượng áp dụng</p>
            <p className="text-xs font-bold text-slate-700">{v.tourId ? `Dành riêng cho Tour ID: ${v.tourId}` : 'Áp dụng cho tất cả Tour'}</p>
          </div>
        </div>

        {/* 🎯 FIX 2: Xóa bỏ chữ "return (" bị lọt lưới thừa thãi ban nãy */}
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => onEdit(v)} 
            className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            Chỉnh sửa
          </button>
          
          <button type="button" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
            <MoreHorizontal size={20}/>
          </button>
        </div>
        
      </div>
    </div>
  );
}