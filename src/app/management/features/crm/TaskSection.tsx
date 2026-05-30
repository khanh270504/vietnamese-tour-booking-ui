import { CheckCircle, Clock, Edit3, Trash2, Phone, Mail, MessageSquare, Video } from "lucide-react";
import { cn } from "../../../lib/utils";
import { TaskResponse, TASK_PRIORITY_LABELS, TASK_TYPE_LABELS } from "../../../services/crm/crm.types";

interface TaskSectionProps {
  tasks: TaskResponse[];
  onComplete: (id: number) => void;
  onEdit: (task: TaskResponse) => void;
  onDelete: (id: number) => void;
}

export function TaskSection({ tasks, onComplete, onEdit, onDelete }: TaskSectionProps) {
  
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "CALL_CUSTOMER": return <Phone size={14}/>;
      case "EMAIL": return <Mail size={14}/>;
      case "MEETING": return <Video size={14}/>;
      default: return <MessageSquare size={14}/>;
    }
  };

  if (tasks.length === 0) return (
    <div className="text-center text-slate-400 text-xs font-bold mt-10 p-6 border-2 border-dashed border-slate-100 rounded-2xl">
      Tuyệt vời! Bạn không còn công việc nào tồn đọng.
    </div>
  );

  return (
    <div className="space-y-3 mt-4">
      {tasks.map((task) => {
        // Cẩn thận với new Date() nếu chuỗi ngày không chuẩn ISO
        const dueDate = new Date(task.dueDate);
        const isOverdue = task.dueDate && dueDate < new Date() && task.status !== "DONE";
        const isHighPriority = task.priority === "HIGH" || task.priority === "URGENT";
        
        // 🌟 Thêm check trạng thái Done (Giả sử model của sếp có trường status)
        const isDone = task.status === "DONE"; 

        return (
          <div key={task.id} className={cn("p-4 rounded-2xl border transition-all shadow-sm flex gap-4 items-start group relative", 
            isDone ? "bg-slate-50 border-slate-100 opacity-60" // Làm mờ nếu đã xong
            : isOverdue ? "bg-white border-rose-200" 
            : "bg-white border-slate-100 hover:border-blue-200")}>
            
            {/* NÚT CHECK/UNCHECK LỚN BÊN TRÁI (Tối ưu Mobile & UX) */}
            <button 
              onClick={() => onComplete(task.id)}
              className={cn("mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-emerald-500 text-transparent hover:text-emerald-500"
              )}
            >
               <CheckCircle size={16} strokeWidth={3} className={isDone ? "text-white" : "opacity-0 group-hover:opacity-100"}/>
            </button>

            {/* NỘI DUNG CHI TIẾT */}
            <div className={cn("flex-1 min-w-0", isDone && "line-through text-slate-400")}>
              <h5 className="font-bold text-sm mb-1 leading-tight">{task.title}</h5>
              
              <div className="flex flex-wrap items-center gap-2 mt-2 no-underline">
                {/* Loại công việc */}
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  {getTaskTypeIcon(task.taskType)} 
                  {TASK_TYPE_LABELS[task.taskType] || task.taskType}
                </span>

                {/* Deadline thông minh */}
                <span className={cn("text-[10px] font-black px-2 py-1 rounded-md border", 
                  isOverdue ? "bg-rose-50 text-rose-600 border-rose-100" 
                  : "bg-slate-50 text-slate-400 border-slate-100")}>
                  {isOverdue ? "QUÁ HẠN" : `Hạn: ${dueDate.toLocaleDateString("vi-VN")}`}
                </span>
                
                {/* Độ ưu tiên (Chỉ hiện nếu chưa hoàn thành để đỡ rối) */}
                {!isDone && (
                  <span className={cn("text-[10px] font-black px-2 py-1 rounded-md border",
                    isHighPriority ? "text-rose-600 bg-rose-50 border-rose-100" : "text-amber-600 bg-amber-50 border-amber-100"
                  )}>
                    {TASK_PRIORITY_LABELS[task.priority]}
                  </span>
                )}
              </div>
            </div>
            
            {/* HÀNH ĐỘNG (Sửa/Xóa) - Luôn hiện mờ mờ trên Mobile, rõ trên Desktop khi Hover */}
            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} title="Sửa công việc" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit3 size={16}/>
              </button>
              <button onClick={() => onDelete(task.id)} title="Xóa công việc" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                <Trash2 size={16}/>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}