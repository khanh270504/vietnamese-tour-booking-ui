import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Phone, Mail, User, Calendar, ChevronRight, Plus, Filter, Search } from "lucide-react";
import { cn } from "../../lib/utils";

// --- MOCK DATA (Giữ nguyên để sau này ông giáo map API Java) ---
const initialLeads = [
  { id: "L001", customerName: "Nguyễn Văn Hoàng", phone: "0901234567", email: "hoang@email.com", tour: "Hà Nội - Hạ Long 3N2Đ", assignedTo: "Trần Mai", nextFollowUp: "10/05/2026", customerType: "Mới", status: "new" },
  { id: "L002", customerName: "Lê Thị Hương", phone: "0912345678", email: "huong@email.com", tour: "Phú Quốc Resort 4N3Đ", assignedTo: "Nguyễn An", nextFollowUp: "11/05/2026", customerType: "VIP", status: "contacted" },
];

const columns = [
  { id: "new", title: "Khách mới", color: "bg-slate-500" },
  { id: "contacted", title: "Đã liên hệ", color: "bg-blue-500" },
  { id: "consulting", title: "Đang tư vấn", color: "bg-purple-500" },
  { id: "negotiating", title: "Thương lượng", color: "bg-orange-500" },
  { id: "closed", title: "Đã chốt", color: "bg-emerald-500" },
  { id: "failed", title: "Thất bại", color: "bg-rose-500" },
];

const customerTypeColors: any = {
  "Mới": "bg-blue-50 text-blue-600 border-blue-100",
  "VIP": "bg-purple-50 text-purple-600 border-purple-100",
  "Khách cũ": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Gia đình": "bg-orange-50 text-orange-600 border-orange-100",
};

// --- COMPONENT CON: THẺ KHÁCH HÀNG ---
function LeadCard({ lead }: { lead: any }) {
  const [{ isDragging }, drag] = useDrag({
    type: "LEAD",
    item: { id: lead.id, status: lead.status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={(node) => { drag(node); }}
      className={cn(
        "bg-white rounded-3xl border border-slate-100 p-5 mb-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300",
        isDragging ? "opacity-20 scale-95" : "opacity-100"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-black text-slate-900 leading-tight">{lead.customerName}</h4>
          <p className="text-[10px] font-black text-blue-500 uppercase mt-1 tracking-wider">{lead.tour}</p>
        </div>
        <span className={cn("px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border", customerTypeColors[lead.customerType])}>
          {lead.customerType}
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <Phone size={14} className="text-slate-300" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <User size={14} className="text-slate-300" />
          <span>Sale: {lead.assignedTo}</span>
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
          <Calendar size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Hẹn: {lead.nextFollowUp}</span>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT CON: CỘT PIPELINE ---
function Column({ column, leads, onDrop }: { column: any; leads: any[]; onDrop: any }) {
  const [{ isOver }, drop] = useDrop({
    accept: "LEAD",
    drop: (item: any) => onDrop(item.id, column.id),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div className="flex-shrink-0 w-[320px] flex flex-col h-full">
      {/* Header Cột */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-6 rounded-full", column.color)} />
          <h3 className="font-black text-slate-900 uppercase tracking-tighter text-sm">{column.title}</h3>
        </div>
        <span className="bg-white border border-slate-100 px-3 py-1 rounded-full text-xs font-black text-slate-400">
          {leads.length}
        </span>
      </div>

      {/* Vùng thả (Drop Zone) */}
      <div 
        ref={(node) => { drop(node); }}
        className={cn(
          "flex-1 overflow-y-auto px-1 rounded-[2rem] transition-colors duration-300 custom-scrollbar pb-10",
          isOver ? "bg-blue-50/50" : "bg-transparent"
        )}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        
        {/* Nút thêm nhanh cuối mỗi cột */}
        <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
           <Plus size={16} />
           <span className="text-xs font-black uppercase tracking-widest">Add Lead</span>
        </button>
      </div>
    </div>
  );
}

// --- TRANG CHÍNH ---
export function CRMLeadsPage() {
  const [leads, setLeads] = useState(initialLeads);

  const handleDrop = (leadId: string, newStatus: string) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">CRM Pipeline</h1>
            <p className="text-slate-500 font-medium">Theo dõi hành trình khách hàng từ lúc quan tâm đến khi chốt tour</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input placeholder="Tìm nhanh khách..." className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all w-64" />
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
              + New Lead
            </button>
          </div>
        </div>

        {/* PIPELINE CONTAINER */}
        <div className="flex-1 overflow-x-auto custom-scrollbar-horizontal pb-4">
          <div className="flex gap-8 h-full min-h-[700px] px-2">
            {columns.map((column) => {
              const columnLeads = leads.filter((l) => l.status === column.id);
              return (
                <Column 
                  key={column.id} 
                  column={column} 
                  leads={columnLeads} 
                  onDrop={handleDrop} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}