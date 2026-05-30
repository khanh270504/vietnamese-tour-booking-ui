import { useState, useEffect } from "react";
import { Calendar, Loader2, Plus, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { 
  TaskResponse, TaskType, TaskPriority, 
  TASK_TYPE_LABELS, TASK_PRIORITY_LABELS 
} from "../../../services/crm/crm.types";
import { crmService } from "../../../services/crm/crm.service";

interface TaskFormProps {
  leadId: number;
  editingTask?: TaskResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ leadId, editingTask, onSuccess, onCancel }: TaskFormProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [taskType, setTaskType] = useState<TaskType>("CALL_CUSTOMER");
  
  // 🌟 THÊM 2 STATE MỚI ĐỂ HỨNG ĐÚNG DTO BACKEND
  const [taskDescription, setTaskDescription] = useState("");
  const [taskNote, setTaskNote] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);

  // Bơm dữ liệu cũ vào form nếu đang ở chế độ Sửa
  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title);
      setTaskType(editingTask.taskType);
      setTaskPriority(editingTask.priority);
      setTaskDescription(editingTask.description || "");
      setTaskNote(editingTask.note || ""); // Sửa task thì mới cần hiện note cũ ra
      
      if (editingTask.dueDate) {
        const date = new Date(editingTask.dueDate);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
        setTaskDueDate(localISOTime);
      }
    } else {
      // Nếu là tạo mới, clear trắng hết
      setTaskTitle("");
      setTaskDescription("");
      setTaskNote("");
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) {
      toast.error("Vui lòng điền đầy đủ tiêu đề và hạn xử lý!");
      return;
    }
    
    setIsSaving(true);
    try {
      const taskData = {
        title: taskTitle,
        leadId: leadId,
        taskType: taskType,
        dueDate: new Date(taskDueDate).toISOString(),
        priority: taskPriority,
        description: taskDescription.trim() || undefined, 
        note: taskNote.trim() || undefined,               
      };

      if (editingTask) {
        await crmService.updateTask(editingTask.id, taskData);
        toast.success("Đã cập nhật công việc!");
      } else {
        await crmService.createTask(taskData);
        toast.success("Đã lên lịch nhắc việc mới!");
      }
      
      onSuccess();
    } catch (error) {
      toast.error(editingTask ? "Lỗi cập nhật!" : "Lỗi tạo mới!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50/40 p-4 sm:p-5 rounded-[2rem] border border-amber-200/60 shadow-sm mb-6 sm:mb-8 animate-in slide-in-from-top-3 duration-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar size={14}/> {editingTask ? "Cập nhật công việc" : "Tạo lịch hẹn / Nhắc việc mới"}
        </h4>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-xs font-bold bg-white px-2 py-1 rounded-md shadow-sm">Đóng</button>
      </div>
      
      <div className="space-y-3">
        {/* Hàng 1: Loại công việc */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Loại công việc</label>
          <select value={taskType} onChange={e => setTaskType(e.target.value as TaskType)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none cursor-pointer uppercase">
            {Object.entries(TASK_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Hàng 2: Tiêu đề */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Tiêu đề nhắc việc</label>
          <input required type="text" placeholder="VD: Nhắc khách chốt cọc..." value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500" />
        </div>

        {/* 🌟 Hàng 3 (MỚI): Mô tả nội dung công việc (Dùng lúc Giao việc/Tạo việc) */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
            <FileText size={10}/> Mô tả chi tiết yêu cầu (Nếu có)
          </label>
          <textarea placeholder="Ghi chú chi tiết những gì cần làm..." value={taskDescription} onChange={e => setTaskDescription(e.target.value)} className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 h-16 resize-none pt-2" />
        </div>

        {/* 🌟 Hàng 4 (MỚI): Ghi chú nội bộ / Kết quả xử lý (HIỆN KHI SỬA HOẶC KHI CẦN NOTE) */}
        {editingTask && (
          <div className="animate-in fade-in duration-300">
            <label className="text-[9px] font-bold text-amber-700 uppercase mb-1.5 flex items-center gap-1">
              <MessageSquare size={10}/> Kết quả xử lý / Ghi chú nội bộ
            </label>
            <textarea placeholder="VD: Đã gọi điện nhưng khách bận hẹn chiều gọi lại..." value={taskNote} onChange={e => setTaskNote(e.target.value)} className="w-full px-3.5 py-2 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500 h-16 resize-none pt-2" />
          </div>
        )}
        
        {/* Hàng 5: Hạn xử lý & Mức khẩn cấp */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Thời hạn xử lý</label>
            <input required type="datetime-local" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none" />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mức khẩn cấp</label>
            <select value={taskPriority} onChange={e => setTaskPriority(e.target.value as TaskPriority)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 outline-none cursor-pointer">
              {Object.entries(TASK_PRIORITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Nút Submit */}
        <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5">
          {isSaving ? <Loader2 size={14} className="animate-spin"/> : <Plus size={16}/>}
          <span>{editingTask ? "CẬP NHẬT LỊCH" : "XÁC NHẬN LÊN LỊCH"}</span>
        </button>
      </div>
    </form>
  );
}