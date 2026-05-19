import { Zap, Clock, Mail, Bell, XCircle, Calendar, CheckCircle, Plus, MoreHorizontal } from "lucide-react";

// Mock data (Ông giáo giữ nguyên logic này để sau này gọi API)
const automations = [
  {
    id: "A001",
    name: "Hủy booking chưa thanh toán",
    description: "Tự động hủy booking sau 48h nếu khách chưa đóng tiền",
    trigger: "Booking PENDING > 48h",
    action: "Hủy đơn + Gửi Email thông báo",
    status: "active",
    executionCount: 23,
    icon: XCircle,
    color: "from-rose-500 to-red-600",
  },
  {
    id: "A002",
    name: "Nhắc chăm sóc khách hàng",
    description: "Gửi nhắc nhở cho nhân viên về lịch hẹn tư vấn",
    trigger: "Lịch hẹn đến hạn",
    action: "Bắn thông báo qua App/Email cho Sale",
    status: "active",
    executionCount: 156,
    icon: Bell,
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "A004",
    name: "Email xác nhận đơn hàng",
    description: "Gửi email xác nhận ngay khi đơn được tạo thành công",
    trigger: "New Booking Created",
    action: "Gửi Email đính kèm vé PDF",
    status: "active",
    executionCount: 1234,
    icon: Mail,
    color: "from-blue-500 to-indigo-600",
  },
];

export function AutomationPage() {
  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tự động hóa</h1>
          <p className="text-slate-500 font-medium">Cấu hình các kịch bản vận hành tự động (Cron Jobs & Triggers)</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
          <Plus size={18} strokeWidth={3} />
          Tạo quy trình mới
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatSmall label="Tổng quy trình" value="24" trend="+3 tháng này" icon={Zap} color="text-purple-600" />
        <StatSmall label="Đang chạy" value="18" trend="75% hiệu suất" icon={CheckCircle} color="text-emerald-600" />
        <StatSmall label="Thực thi hôm nay" value="247" trend="+18% tải" icon={Clock} color="text-blue-600" />
        <StatSmall label="Tiết kiệm" value="32.5h" trend="Tháng này" icon={Zap} color="text-orange-600" />
      </div>

      {/* AUTOMATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col">
              <div className={`bg-gradient-to-br ${item.color} p-8 text-white relative overflow-hidden`}>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Icon size={28} />
                  </div>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {item.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                  </span>
                </div>
                <h3 className="relative z-10 text-xl font-black mt-6 leading-tight">{item.name}</h3>
                <p className="relative z-10 text-xs mt-2 opacity-80 font-medium">{item.description}</p>
                {/* Decoration Icon mờ phía sau */}
                <Icon size={120} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trigger</p>
                    <p className="text-sm font-bold text-slate-700">{item.trigger}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Action</p>
                    <p className="text-sm font-bold text-slate-700">{item.action}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thực thi</p>
                    <p className="text-lg font-black text-slate-900">{item.executionCount} lần</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                        <MoreHorizontal size={18} />
                     </button>
                     <button className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                       item.status === 'active' ? 'bg-slate-900 text-white hover:bg-black' : 'bg-blue-600 text-white hover:bg-blue-700'
                     }`}>
                       {item.status === 'active' ? 'Tắt' : 'Bật'}
                     </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOG HISTORY */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Lịch sử thực thi gần đây</h3>
           <button className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Xem tất cả</button>
        </div>
        <div className="p-4 space-y-2">
           <LogItem label="Email xác nhận" detail="Đã gửi cho khách hàng BK-9912" time="2 phút trước" status="success" />
           <LogItem label="Nhắc thanh toán" detail="Đã gửi cho 12 khách hàng" time="1 giờ trước" status="success" />
           <LogItem label="Hủy đơn tự động" detail="Lỗi kết nối Server Email" time="3 giờ trước" status="failed" />
        </div>
      </div>
    </div>
  );
}

// COMPONENT CON: StatSmall
function StatSmall({ label, value, trend, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`p-4 rounded-2xl bg-slate-50 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-[10px] font-bold text-emerald-500">{trend}</p>
      </div>
    </div>
  );
}

// COMPONENT CON: LogItem
function LogItem({ label, detail, time, status }: any) {
  return (
    <div className="flex items-center gap-6 p-4 hover:bg-slate-50/50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
      <div className={`w-3 h-3 rounded-full shrink-0 ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
      <div className="flex-1">
        <h4 className="font-black text-slate-900 text-sm">{label}</h4>
        <p className="text-xs text-slate-500 font-medium">{detail}</p>
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase whitespace-nowrap">{time}</span>
    </div>
  );
}