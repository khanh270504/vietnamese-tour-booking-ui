import { MessageSquare, Phone, Mail, Video, Calendar } from "lucide-react";
import { cn } from "../../../lib/utils";
import { InteractionResponse, INTERACTION_TYPE_LABELS, INTERACTION_RESULT_LABELS } from "../../../services/crm/crm.types";

interface InteractionSectionProps {
  interactions: InteractionResponse[];
}

// 🌟 GOM CẤU HÌNH CONFIG RA NGOÀI: Sạch sẽ, dễ bảo trì, tăng hiệu năng
const INTERACTION_UI_CONFIG: Record<string, { icon: any; colorClass: string }> = {
  CALL: { icon: Phone, colorClass: "text-blue-500 border-blue-100 bg-blue-50" },
  ZALO: { icon: MessageSquare, colorClass: "text-teal-500 border-teal-100 bg-teal-50" },
  EMAIL: { icon: Mail, colorClass: "text-purple-500 border-purple-100 bg-purple-50" },
  MEETING: { icon: Video, colorClass: "text-amber-500 border-amber-100 bg-amber-50" },
};

export function InteractionSection({ interactions }: InteractionSectionProps) {
  
  if (interactions.length === 0) {
    return (
      <div className="text-center text-slate-400 text-xs font-bold mt-10 p-6 border-2 border-dashed border-slate-100 rounded-2xl">
        Chưa có ghi chú tương tác nào với khách hàng này.
      </div>
    );
  }

  return (
    /* Fix lỗi rụt 2 đầu đường line: before:top-6 before:bottom-6 giúp line dừng đúng tâm icon đầu và cuối */
    <div className="space-y-6 relative before:absolute before:top-6 before:bottom-6 before:left-[19px] before:w-0.5 before:bg-slate-200/60 mt-2">
      {interactions.map((interact) => {
        // Chuẩn hóa loại tương tác sang chữ hoa để tránh lỗi lệch data chữ thường
        const typeKey = interact.interactionType?.toUpperCase() || "DEFAULT";
        const config = INTERACTION_UI_CONFIG[typeKey] || { icon: MessageSquare, colorClass: "text-slate-500 border-slate-100 bg-slate-50" };
        const IconComponent = config.icon;

        return (
          <div key={interact.id} className="relative pl-12 sm:pl-14 animate-in fade-in duration-300">
            
            {/* ICON ĐỒNG BỘ KÍCH THƯỚC (w-10 h-10 cố định để thẳng hàng line tuyệt đối) */}
            <div className={cn("absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border-[3px] shadow-sm z-10", config.colorClass)}>
              <IconComponent size={14} strokeWidth={2.5} />
            </div>
            
            {/* CARD NỘI DUNG */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-bold text-xs text-slate-800">{interact.staffName}</span>
                {/* Dùng totoLocaleString để hiển thị cả Ngày và Giờ an toàn */}
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                  {new Date(interact.createdAt).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              
              {/* BADGES TAGS */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase border border-slate-200 tracking-wider">
                  {INTERACTION_TYPE_LABELS[interact.interactionType] || interact.interactionType}
                </span>
                
                {interact.result && (
                  <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded uppercase border tracking-wider", 
                    interact.result === "SUCCESS" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                  )}>
                    {INTERACTION_RESULT_LABELS[interact.result] || interact.result}
                  </span>
                )}
              </div>

              {/* NỘI DUNG GHI CHÚ */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line mb-3">
                {interact.note}
              </p>

              {/* LỊCH HẸN TIẾP THEO */}
              {interact.nextActionDate && (
                <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg w-fit border border-amber-100 uppercase tracking-wide">
                  <Calendar size={12} strokeWidth={2.5} />
                  Hẹn kế tiếp: {new Date(interact.nextActionDate).toLocaleDateString("vi-VN")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}