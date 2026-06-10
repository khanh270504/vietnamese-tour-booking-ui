import { MessageCircle, Eye, Edit3 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { 
    SupportTicketResponse, 
    TicketStatusLabel, 
    TicketPriorityLabel 
} from "../../../services/ticket/ticket.type";

interface TicketTableProps {
  tickets: SupportTicketResponse[];
  onProcess: (ticket: SupportTicketResponse) => void;
}

export function TicketTable({ tickets, onProcess }: TicketTableProps) {
  if (tickets.length === 0) {
    return <div className="p-12 text-center text-slate-400 font-medium">Không tìm thấy ticket nào</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Mã / Ưu tiên</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Khách hàng</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Tiêu đề</th>
            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      t.status === "OPEN" ? "bg-rose-100 text-rose-600" :
                      t.status === "PROCESSING" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">TKT-{t.id}</h4>
                    <span className={cn("text-[10px] font-black uppercase",
                        t.priority === 'HIGH' ? "text-rose-500" : 
                        t.priority === 'MEDIUM' ? "text-orange-500" : "text-blue-500"
                      )}>
                      {TicketPriorityLabel[t.priority]}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-slate-800">{t.customerName || "Khách vãng lai"}</p>
                <p className="text-xs text-slate-500">{t.customerEmail || t.customerPhone}</p>
              </td>
              <td className="px-6 py-4 max-w-[200px] truncate text-sm font-medium text-slate-700">
                {t.subject}
              </td>
              <td className="px-6 py-4">
                <span className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider",
                    t.status === "OPEN" ? "bg-rose-50 text-rose-600" :
                    t.status === "PROCESSING" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                  {TicketStatusLabel[t.status]}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onProcess(t)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-xs hover:bg-black transition-colors">
                    <Edit3 size={14}/> XỬ LÝ
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}