import { useState, useEffect } from "react";
import { 
  Calendar, DollarSign, MapPin, Users, CreditCard, 
  ArrowUpRight, ArrowDownRight, BarChart3, Trophy, 
  Share2, AlertCircle, CheckCircle2, Loader2
} from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from "recharts";
import { cn } from "../../lib/utils";
import { dashboardService } from "../../services/dashboard/dashboard.service";
import { DashboardOverviewResponse } from "../../services/dashboard/dashboard.types";

export function OverviewPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // SỬA TẠI ĐÂY: Thêm State để quản lý bộ lọc (Mặc định ban đầu hiển thị theo năm)
  const [activePeriod, setActivePeriod] = useState<"MONTH" | "YEAR">("YEAR");

  useEffect(() => {
    // Cập nhật giờ hiển thị
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    updateTime();
  }, []);

  // SỬA TẠI ĐÂY: Tách hàm gọi API dựa theo activePeriod để tự load lại data khi bấm nút
  useEffect(() => {
    setIsLoading(true);
    dashboardService.getOverview(activePeriod)
      .then(res => {
        if (res.result) {
          setDashboardData(res.result);
        }
      })
      .catch(err => console.error("Lỗi lấy dữ liệu Dashboard:", err))
      .finally(() => setIsLoading(false));
  }, [activePeriod]); // Kích hoạt chạy lại mỗi khi activePeriod đổi giá trị

  // Màn hình Loading khi chờ API
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Đang tải dữ liệu Trung tâm điều hành...</p>
      </div>
    );
  }

  // Nếu lỗi không có data
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-slate-500 font-bold">Không thể tải dữ liệu. Vui lòng kiểm tra lại hệ thống.</p>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho Top Cards từ Backend
  const topCards = [
    { 
      title: "Doanh Thu Thực Tế", 
      value: dashboardData.topStats.totalRevenue, 
      change: dashboardData.topStats.revenueChange, 
      isUp: dashboardData.topStats.revenueChange.startsWith('+'), 
      icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" 
    },
    { 
      title: "Tỷ Lệ Chốt Sale", 
      value: dashboardData.topStats.winRate, 
      change: dashboardData.topStats.winRateChange, 
      isUp: dashboardData.topStats.winRateChange.startsWith('+'), 
      icon: BarChart3, color: "text-blue-600", bg: "bg-blue-100" 
    },
    { 
      title: "Leads Mới Đổ Về", 
      value: dashboardData.topStats.newLeads.toLocaleString(), 
      change: dashboardData.topStats.leadsChange, 
      isUp: dashboardData.topStats.leadsChange.startsWith('+'), 
      icon: Users, color: "text-purple-600", bg: "bg-purple-100" 
    },
    { 
      title: "Task Cần Xử Lý", 
      value: `${dashboardData.topStats.pendingTasks} việc`, 
      change: `${dashboardData.topStats.overdueTasks} quá hạn`, 
      isUp: dashboardData.topStats.overdueTasks === 0, 
      icon: AlertCircle, color: dashboardData.topStats.overdueTasks === 0 ? "text-emerald-600" : "text-amber-600", bg: dashboardData.topStats.overdueTasks === 0 ? "bg-emerald-100" : "bg-amber-100" 
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-gray-800 space-y-6">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">CRM Trung Tâm Điều Hành</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{currentTime}</p>
        </div>
        
        {/* SỬA TẠI ĐÂY: Thêm sự kiện onClick và đổi class CSS động khi nút được chọn active */}
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button 
            onClick={() => setActivePeriod("MONTH")}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all",
              activePeriod === "MONTH" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            Tháng này
          </button>
          <button 
            onClick={() => setActivePeriod("YEAR")}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-lg transition-all",
              activePeriod === "YEAR" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            Năm nay
          </button>
        </div>
      </div>

      {/* 2. THẺ CHỈ SỐ TỔNG QUAN (TOP CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className={cn("flex items-center text-sm font-bold", stat.isUp ? "text-emerald-500" : "text-rose-500")}>
                {stat.change} {stat.isUp ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TẦNG CHIẾN LƯỢC CRM: PHỄU BÁN HÀNG & NGUỒN KHÁCH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Phễu Chuyển Đổi (Sales Funnel) */}
        <div className="col-span-2 bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-black text-gray-800">Phễu Chuyển Đổi Khách Hàng (Sales Funnel)</h3>
            <p className="text-xs text-gray-400 font-medium">Đo lường hiệu suất chuyển đổi qua từng giai đoạn chăm sóc</p>
          </div>
          <div className="space-y-3.5 pt-2">
            {dashboardData.funnelData.map((item, index) => (
              <div key={index} className="relative flex items-center">
                <div 
                  className="h-11 rounded-xl flex items-center justify-between px-4 text-white font-bold text-xs transition-all duration-500 shadow-sm"
                  style={{ 
                    backgroundColor: item.color, 
                    width: `${100 - (index * 12)}%`,
                    marginLeft: `${index * 6}%` 
                  }}
                >
                  <span className="truncate">{item.stage}</span>
                  <span>{item.count} khách</span>
                </div>
                <span className="absolute right-0 text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  {item.conversion}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Biểu đồ Tròn Nguồn Khách Hàng (Lead Sources) */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-2">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Share2 size={18} className="text-blue-500"/> Nguồn Khách Hàng
            </h3>
            <p className="text-xs text-gray-400 font-medium">Kênh marketing mang lại hiệu quả cao nhất</p>
          </div>
          
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboardData.sourceData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {dashboardData.sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {dashboardData.sourceData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-gray-500 truncate">{item.name}</span>
                  <span className="text-xs font-black text-gray-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TẦNG HIỆU SUẤT ĐỘI NGŨ & DOANH THU */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Doanh Thu & Chi phí */}
        <div className="col-span-2 bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-800">Biến động Doanh thu & Chi phí (Triệu VNĐ)</h3>
            <button className="text-sm text-blue-600 font-bold hover:underline">Xuất báo cáo</button>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                <Area type="monotone" name="Doanh thu" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRev)" />
                <Area type="monotone" name="Chi phí" dataKey="cost" stroke="#f43f5e" strokeWidth={3} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng Xếp Hạng Doanh Số Nhân Viên */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500"/>Top Sale Hệ Thống
            </h3>
            <span className="text-xs font-bold text-slate-400">Theo doanh số</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {dashboardData.salesLeaderboard.map((sales, index) => (
              <div key={index} className="p-3 bg-slate-50/60 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-5 text-xs font-black text-center",
                    index === 0 ? "text-yellow-500 text-sm" : "text-slate-400"
                  )}>
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 font-black text-xs flex items-center justify-center">
                    {sales.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{sales.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400">{sales.deals} đơn chốt</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900">{sales.revenue}</span>
                  <div className="w-16 bg-slate-200 h-1 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(sales.target, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. TẦNG VẬN HÀNH: TOP ĐỊA ĐIỂM & ĐIỀU HÀNH TƯƠNG TÁC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Cột ngang - Top Địa điểm */}
        <div className="col-span-1 bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-800">Top Địa điểm Yêu thích</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.destinationData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 700}} width={80} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="bookings" radius={[0, 8, 8, 0]} barSize={20}>
                  {dashboardData.destinationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Tròn Trạng thái Booking */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-black text-gray-800 mb-1">Trạng thái Booking</h3>
          <p className="text-xs text-gray-400 font-medium mb-4">Thống kê theo số lượng đơn hàng</p>
          <div className="flex-1 min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboardData.statusData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {dashboardData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} đơn`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {dashboardData.statusData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-500">{item.name}</span>
                </div>
                <span className="font-black text-gray-900">{item.value} đơn</span>
              </div>
            ))}
          </div>
        </div>

        {/* Giám sát Tương tác / Cảnh báo Task */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-1.5">
              <AlertCircle size={18} className="text-rose-500"/> Giám Sát Task CRM
            </h3>
            {dashboardData.urgentTasks.length > 0 && (
               <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-600 font-black px-2 py-0.5 rounded-md uppercase animate-pulse">Cảnh báo trễ</span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[250px] pr-1 custom-scrollbar">
            {dashboardData.urgentTasks.length > 0 ? (
               dashboardData.urgentTasks.map((task, i) => (
                <div key={i} className="p-3 bg-rose-50/30 border border-rose-100 rounded-xl flex flex-col gap-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">{task.text}</h4>
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded shrink-0",
                      task.isUrgent ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {task.delay}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400">
                    <span>Phụ trách: <strong className="text-gray-600">{task.staff}</strong></span>
                    <span className="text-blue-600 hover:underline cursor-pointer">Nhắc nhở</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl flex flex-col items-center justify-center gap-2 text-center h-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1"/> 
                <span className="text-xs font-bold text-emerald-700">Tuyệt vời!</span>
                <span className="text-[10px] font-medium text-emerald-600">Tất cả các Task đang chạy đúng tiến độ.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}