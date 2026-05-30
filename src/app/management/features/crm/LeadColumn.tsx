import { useDrop } from "react-dnd";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { LeadCard } from "./LeadCard"; 
import { LEAD_COLUMNS } from "./crm.constants";
import { LeadResponse, LeadStatus } from "../../../services/crm/crm.types";

interface LeadColumnProps {
  column: { id: LeadStatus; title: string; color: string; order: number };
  leads: LeadResponse[];
  onDrop: (leadId: number, newStatus: LeadStatus) => void;
  onLeadClick: (lead: LeadResponse) => void;
}

// 🎯 BƯỚC 1: ĐỊNH NGHĨA KIỂU DỮ LIỆU KÉO THẢ ĐỂ LOẠI BỎ 'any'
interface DragItem {
  id: number;
  status: LeadStatus;
}

export function LeadColumn({ column, leads, onDrop, onLeadClick }: LeadColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "LEAD",
    canDrop: (item: DragItem) => {
      if (item.status === column.id) return false;

      const currentOrder = LEAD_COLUMNS.find(c => c.id === item.status)?.order || 0;
      
      return column.id === 'LOST' || column.order > currentOrder; 
    },
    drop: (item: DragItem) => onDrop(item.id, column.id),
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });

  return (
    <div className="flex-shrink-0 w-[340px] flex flex-col h-full bg-slate-50/50 rounded-[2.5rem] p-3 border border-slate-100">
      <div className="mb-4 flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full shadow-sm", column.color)} />
          <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">{column.title}</h3>
        </div>
        <span className="bg-white shadow-sm px-3 py-1 rounded-full text-xs font-black text-slate-500">{leads.length}</span>
      </div>

      <div 
        ref={(node) => { drop(node); }}
        className={cn(
          "flex-1 overflow-y-auto px-2 transition-colors duration-300 custom-scrollbar pb-6 rounded-[2rem]",
          isOver && canDrop ? "bg-blue-100/50" : "",
          isOver && !canDrop ? "bg-red-100/50" : "" // Báo đỏ nếu cố tình kéo ngược hoặc kéo sai
        )}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
        ))}
        
        
      </div>
    </div>
  );
}