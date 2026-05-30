import { useDrag } from "react-dnd";
import { Phone, User, MapPin, Share2 } from "lucide-react"; 
import { cn } from "../../../lib/utils"; 
import { priorityColors } from "./crm.constants";
// 🎯 BƯỚC 1: IMPORT TỪ ĐIỂN TỪ FILE TYPES VÀO ĐÂY
import { LeadResponse, LEAD_PRIORITY_LABELS, LEAD_SOURCE_LABELS, LeadSource } from "./../../../services/crm/crm.types";

export function LeadCard({ lead, onClick }: { lead: LeadResponse; onClick: () => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: "LEAD",
    item: { id: lead.id, status: lead.status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // 🎯 Vẫn giữ lại hàm render màu Nguồn khách (Vì màu mè thì UI tự quản lý, không nên nhét vào Types)
  // Bổ sung thêm Tiktok, Google cho đủ bộ
  const getSourceBadgeColor = (source: string) => {
    switch (source?.toUpperCase()) {
      case "FACEBOOK": return "bg-blue-50 text-blue-600 border-blue-100";
      case "ZALO": return "bg-teal-50 text-teal-600 border-teal-100";
      case "WEBSITE": return "bg-purple-50 text-purple-600 border-purple-100";
      case "GOOGLE": return "bg-red-50 text-red-600 border-red-100";
      case "TIKTOK": return "bg-black text-white border-gray-800";
      case "REFERRAL": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div
      ref={(node) => { drag(node); }} 
      onClick={onClick}
      className={cn(
        "bg-white rounded-3xl border border-slate-100 p-5 mb-4 cursor-grab active:cursor-grabbing shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300",
        isDragging ? "opacity-40 scale-95 ring-2 ring-blue-500" : "opacity-100"
      )}
    >
      {/* PHẦN TRÊN: TÊN KHÁCH HÀNG & BADGE ĐỘ ƯU TIÊN */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-800 leading-tight truncate text-sm hover:text-blue-600 transition-colors">
            {lead.fullName}
          </h4>
          <p className="text-[10px] font-bold text-blue-600 uppercase mt-1 tracking-wider truncate flex items-center gap-1">
            <MapPin size={10} /> {lead.interestedTourName || "Chưa chọn tour"}
          </p>
        </div>
        
        {/* 🎯 BƯỚC 2: RÚT GỌN TỐI ĐA! Lấy thẳng tên Tiếng Việt từ LEAD_PRIORITY_LABELS ra hiển thị */}
        <span className={cn(
          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight border whitespace-nowrap", 
          priorityColors[lead.priority] || "bg-slate-50 text-slate-500"
        )}>
          {LEAD_PRIORITY_LABELS[lead.priority] || lead.priority}
        </span>
      </div>

      {/* PHẦN GIỮA: BADGE NGUỒN KHÁCH */}
      {lead.source && (
        <div className="mb-3">
          <span className={cn(
            "px-2 py-0.5 rounded-md text-[9px] font-bold border inline-flex items-center gap-1 tracking-tight", 
            getSourceBadgeColor(lead.source)
          )}>
            <Share2 size={8} /> 
            {LEAD_SOURCE_LABELS[lead.source] || lead.source || "Chưa rõ nguồn"}
          </span>
        </div>
      )}

      {/* PHẦN DƯỚI: SỐ ĐIỆN THOẠI & SALE PHỤ TRÁCH */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
          <Phone size={13} className="text-slate-300" /> 
          <span className="font-semibold text-slate-600">{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
          <User size={13} className="text-slate-300" /> 
          <span className="font-semibold text-slate-600 truncate">
            {lead.assignedStaffName || "Chưa phân công"}
          </span>
        </div>
      </div>
    </div>
  );
}