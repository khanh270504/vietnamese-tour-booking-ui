import { useState, useEffect } from "react";
import { Phone, Mail, X, Calendar, Edit3, User, MapPin, Loader2 } from "lucide-react"; 
import { toast } from "sonner"; 
import { cn } from "../../../lib/utils";
import { 
  LeadResponse, InteractionResponse, TaskResponse, 
  InteractionType, InteractionResult,
  LEAD_STATUS_LABELS, INTERACTION_RESULT_LABELS, INTERACTION_TYPE_LABELS, LEAD_PRIORITY_LABELS
} from "../../../services/crm/crm.types";
import { crmService } from "../../../services/crm/crm.service";

import { InteractionSection } from "./InteractionSection"; 
import { TaskSection } from "./TaskSection";
import { TaskForm } from "./TaskForm";

interface LeadDetailPanelProps {
  lead: LeadResponse | null;
  onClose: () => void;
  onEdit: () => void;
}

export function LeadDetailPanel({ lead, onClose, onEdit }: LeadDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("interactions");
  
  const [interactions, setInteractions] = useState<InteractionResponse[]>([]);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State quản lý việc hiển thị Form Task
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);

  // State Tương tác
  const [newNote, setNewNote] = useState("");
  const [interactType, setInteractType] = useState<InteractionType>("CALL");
  const [interactResult, setInteractResult] = useState<InteractionResult>("SUCCESS");
  const [isSavingInteract, setIsSavingInteract] = useState(false);

  const fetchDetails = async () => {
    if (!lead) return;
    setIsLoading(true);
    try {
      const interactRes = await crmService.getInteractionsByLead(lead.id);
      setInteractions(interactRes.result || (interactRes as any).data || []);

      const taskRes = await crmService.getAllTasks();
      const allTasks = taskRes.result || (taskRes as any).data || [];
      const leadTasks = allTasks.filter((t: any) => t.leadName === lead.fullName);
      setTasks(leadTasks);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    closeTaskForm(); // Reset form khi đổi Lead
  }, [lead]);

  // HÀM ĐÓNG FORM
  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // LƯU TƯƠNG TÁC
  const handleSaveInteraction = async () => {
    if (!newNote.trim() || !lead) return;
    setIsSavingInteract(true);
    try {
      await crmService.createInteraction({ leadId: lead.id, interactionType: interactType, result: interactResult, note: newNote });
      toast.success("Đã ghi lại lịch sử tương tác!");
      setNewNote(""); 
      fetchDetails(); 
    } catch (error) {
      toast.error("Có lỗi khi lưu tương tác!");
    } finally {
      setIsSavingInteract(false);
    }
  };

  // TASK: Bấm nút Sửa ở danh sách
  const handleEditTask = (task: TaskResponse) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setActiveTab("tasks");
  };

  // TASK: Xóa & Hoàn thành (Vẫn giữ Optimistic UI ở đây vì nó sửa mảng `tasks`)
  const handleCompleteTask = async (taskId: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "DONE" } : t));
    toast.success("Đã hoàn thành công việc!");
    try { await crmService.completeTask(taskId); } catch (e) { fetchDetails(); }
  };

  const handleDeleteTask = async (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success("Đã xóa công việc!");
    try { await crmService.deleteTask(taskId); } catch (e) { fetchDetails(); }
  };

  if (!lead) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-lg bg-white shadow-2xl z-[90] animate-in slide-in-from-right flex flex-col border-l border-slate-100">
        
        {/* HEADER PANEL (Giữ nguyên) */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col bg-slate-50/60 gap-4">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/60 px-2 py-0.5 rounded-md">{lead.leadCode || "CRM LEAD"}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 truncate break-words">{lead.fullName}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onEdit} className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wide">
                <Edit3 size={13} strokeWidth={2.5} /><span>Sửa</span>
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 bg-slate-100 text-slate-500 rounded-full transition-colors"><X size={18}/></button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md uppercase">{LEAD_STATUS_LABELS[lead.status] || lead.status}</span>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-md uppercase">Ưu tiên: {LEAD_PRIORITY_LABELS[lead.priority] || lead.priority}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-100/80 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2 truncate"><Phone size={14} className="text-slate-400 shrink-0"/><span className="text-slate-700">{lead.phone}</span></div>
            <div className="flex items-center gap-2 truncate"><Mail size={14} className="text-slate-400 shrink-0"/><span className="text-slate-700 truncate">{lead.email || "Chưa có email"}</span></div>
            <div className="flex items-center gap-2 truncate col-span-1 sm:col-span-2 text-blue-600"><MapPin size={14} className="text-blue-400 shrink-0"/><span className="truncate">Tour: {lead.interestedTourName || "Chưa đăng ký"}</span></div>
            <div className="flex items-center gap-2 truncate col-span-1 sm:col-span-2 text-slate-600"><User size={14} className="text-slate-400 shrink-0"/><span className="truncate">Phụ trách: <span className="text-slate-800">{lead.assignedStaffName || "Chưa phân công"}</span></span></div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-100 px-6 sm:px-8 bg-white shrink-0">
          <button onClick={() => setActiveTab("interactions")} className={cn("px-4 py-4 font-black text-xs sm:text-sm uppercase tracking-wider border-b-[3px] transition-colors", activeTab === "interactions" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600")}>
            Lịch sử tương tác ({interactions.length})
          </button>
          <button onClick={() => setActiveTab("tasks")} className={cn("px-4 py-4 font-black text-xs sm:text-sm uppercase tracking-wider border-b-[3px] transition-colors ml-4", activeTab === "tasks" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600")}>
            Nhắc lịch việc ({tasks.length})
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-50/40 custom-scrollbar">
          
          {/* FORM NHẬP TƯƠNG TÁC */}
          {!showTaskForm && activeTab === "interactions" && (
            <div className="bg-white p-4 sm:p-5 rounded-[2rem] border border-slate-200/80 shadow-sm mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <select value={interactType} onChange={(e) => setInteractType(e.target.value as InteractionType)} className="text-[11px] sm:text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl outline-none cursor-pointer uppercase tracking-tight">
                  {Object.entries(INTERACTION_TYPE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
                <select value={interactResult} onChange={(e) => setInteractResult(e.target.value as InteractionResult)} className={cn("text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-xl outline-none cursor-pointer uppercase tracking-tight", interactResult === "SUCCESS" || interactResult === "INTERESTED" ? "bg-emerald-50 text-emerald-600" : interactResult === "NO_RESPONSE" ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600")}>
                  {Object.entries(INTERACTION_RESULT_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
              <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Nhập chi tiết nội dung cuộc trao đổi..." className="w-full bg-transparent outline-none resize-none text-xs sm:text-sm font-semibold text-slate-700 h-20 placeholder:text-slate-300" />
              <div className="flex justify-between items-center mt-2 border-t border-slate-100/80 pt-3">
                <button type="button" onClick={() => setShowTaskForm(true)} className="text-[11px] font-black text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 uppercase">
                  <Calendar size={13}/> Lên lịch nhắc
                </button>
                <button onClick={handleSaveInteraction} disabled={!newNote.trim() || isSavingInteract} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-black shadow-md disabled:opacity-50 transition-all">
                  {isSavingInteract ? "ĐANG LƯU..." : "LƯU GHI CHÚ"}
                </button>
              </div>
            </div>
          )}

          {/* 🌟 GỌI COMPONENT TASK FORM VỪA TÁCH */}
          {showTaskForm && (
            <TaskForm 
              leadId={lead.id} 
              editingTask={editingTask} 
              onCancel={closeTaskForm}
              onSuccess={() => {
                closeTaskForm();
                fetchDetails(); // Load lại data
                setActiveTab("tasks"); // Nhảy sang tab task xem cho sướng
              }} 
            />
          )}

          {/* HIỂN THỊ DANH SÁCH */}
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
          ) : (
            <>
              {activeTab === "interactions" && <InteractionSection interactions={interactions} />}
              {activeTab === "tasks" && <TaskSection tasks={tasks} onComplete={handleCompleteTask} onEdit={handleEditTask} onDelete={handleDeleteTask} />}
            </>
          )}

        </div>
      </div>
    </>
  );
}