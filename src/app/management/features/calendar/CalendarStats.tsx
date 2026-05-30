import { ClipboardList, CheckCircle2, AlertTriangle, Users } from "lucide-react";

interface Schedule {
  id: number;
  status: string;
  guestsCount?: number;
  maxGuests?: number;
}

interface CalendarStatsProps {
  schedules: Schedule[];
}

export function CalendarStats({ schedules }: CalendarStatsProps) {
  // Logic tính toán nhanh dựa trên mảng lịch trình thu được của tháng
  const total = schedules.length;
  const completed = schedules.filter((s) => s.status === "COMPLETED").length;
  const canceled = schedules.filter((s) => s.status === "CANCELED").length;
  
  // Ví dụ tính tổng khách nếu có data
  const totalGuests = schedules.reduce((sum, s) => sum + (s.guestsCount || 0), 0);

  const cardClass = "bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Card 1 */}
      <div className={cardClass}>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng Tour</p>
          <p className="text-xl font-bold text-slate-800">{total}</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className={cardClass}>
        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Thành công</p>
          <p className="text-xl font-bold text-slate-800">{completed}</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className={cardClass}>
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Đã Hủy</p>
          <p className="text-xl font-bold text-slate-800">{canceled}</p>
        </div>
      </div>

      {/* Card 4 */}
      <div className={cardClass}>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng lượng khách</p>
          <p className="text-xl font-bold text-slate-800">{totalGuests} Khách</p>
        </div>
      </div>
    </div>
  );
}