import { LeadStatus, LeadPriority } from "../../../services/crm/crm.types"; 

export const LEAD_COLUMNS: { id: LeadStatus; title: string; color: string; order: number }[] = [
  { id: "NEW", title: "Khách mới", color: "bg-slate-500", order: 1 },
  { id: "CONTACTED", title: "Đã liên hệ", color: "bg-blue-500", order: 2 },
  { id: "QUALIFIED", title: "Tiềm năng cao", color: "bg-purple-500", order: 3 },
  { id: "PROPOSAL", title: "Thương lượng", color: "bg-orange-500", order: 4 },
  { id: "WON", title: "Đã chốt (Win)", color: "bg-emerald-500", order: 5 },
  { id: "LOST", title: "Thất bại (Lost)", color: "bg-rose-500", order: 6 },
];


export const priorityColors: Record<LeadPriority, string> = {
  HOT: "bg-rose-50 text-rose-600 border-rose-200",     
  WARM: "bg-orange-50 text-orange-600 border-orange-200", 
  COLD: "bg-slate-50 text-slate-500 border-slate-200",   
};