import { useState, useEffect } from "react";
import { Calendar, DollarSign, MapPin, Users, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "../../lib/utils";

// --- 🎯 DATA MOCKUP THUẦN BIỂU ĐỒ DU LỊCH ---
const revenueData = [
  { month: "Tháng 1", revenue: 1.2, cost: 0.8 },
  { month: "Tháng 2", revenue: 1.8, cost: 1.1 },
  { month: "Tháng 3", revenue: 2.4, cost: 1.5 },
  { month: "Tháng 4", revenue: 2.1, cost: 1.3 },
  { month: "Tháng 5", revenue: 3.2, cost: 1.8 },
  { month: "Tháng 6", revenue: 3.8, cost: 2.0 },
];

const destinationData = [
  { name: "Hạ Long", bookings: 450, color: "#3b82f6" },
  { name: "Phú Quốc", bookings: 380, color: "#10b981" },
  { name: "Đà Lạt", bookings: 320, color: "#f59e0b" },
  { name: "Sapa", bookings: 210, color: "#8b5cf6" },
  { name: "Đà Nẵng", bookings: 490, color: "#ec4899" },
];

const statusData = [
  { name: "Hoàn thành", value: 65, color: "#10b981" },
  { name: "Chờ thanh toán", value: 20, color: "#f59e0b" },
  { name: "Đã hủy", value: 15, color: "#ef4444" },
];

export function OverviewPage() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    updateTime();
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-gray-800 space-y-6">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Thống kê hoạt động</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{currentTime}</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button className="px-4 py-2 text-sm font-bold bg-blue-50 text-blue-600 rounded-lg">Tháng này</button>
          <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-lg">Quý này</button>
          <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-lg">Năm nay</button>
        </div>
      </div>

      {/* 2. THẺ CHỈ SỐ TỔNG QUAN (TOP CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Tổng Doanh Thu", value: "3.8 Tỷ", change: "+12.5%", isUp: true, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
          { title: "Tổng Đơn Đặt", value: "1,248", change: "+8.2%", isUp: true, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Khách Hàng Mới", value: "842", change: "+5.1%", isUp: true, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
          { title: "Tỷ lệ hủy tour", value: "4.2%", change: "-1.5%", isUp: false, icon: CreditCard, color: "text-red-600", bg: "bg-red-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className={cn("flex items-center text-sm font-bold", stat.isUp ? "text-emerald-500" : "text-emerald-500")}>
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

      {/* 3. BIỂU ĐỒ CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ Doanh Thu & Lợi nhuận (Area Chart) */}
        <div className="col-span-2 bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-800">Biến động Doanh thu & Chi phí (Tỷ VNĐ)</h3>
            <button className="text-sm text-blue-600 font-bold hover:underline">Xuất báo cáo</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Biểu đồ Tròn (Donut Chart) - Tỷ lệ trạng thái đơn */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-black text-gray-800 mb-2">Tỷ lệ trạng thái Booking</h3>
          <p className="text-xs text-gray-500 font-medium mb-6">Thống kê theo số lượng đơn hàng</p>
          
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            {statusData.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-semibold text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BIỂU ĐỒ PHỤ & BẢNG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Biểu đồ Cột ngang - Top Địa điểm */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-800">Top Địa điểm Yêu thích</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={destinationData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 700}} width={80} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="bookings" radius={[0, 8, 8, 0]} barSize={24}>
                  {destinationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng Tour sắp khởi hành (Dữ liệu thay vì biểu đồ để cân bằng layout) */}
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-800">Tour sắp khởi hành (24h tới)</h3>
            <button className="text-sm text-blue-600 font-bold hover:underline">Xem tất cả</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {[
              { code: "BK-8291", tour: "Hà Nội - Vịnh Hạ Long", pax: 12, time: "07:30 AM", guide: "Nguyễn Văn A" },
              { code: "BK-8295", tour: "Đà Nẵng - Hội An", pax: 8, time: "08:00 AM", guide: "Lê Thị B" },
              { code: "BK-8302", tour: "Khám phá Phú Quốc", pax: 24, time: "09:15 AM", guide: "Trần C" },
              { code: "BK-8310", tour: "Sapa Mờ Sương", pax: 15, time: "10:00 AM", guide: "Phạm D" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 font-black rounded-xl flex items-center justify-center text-xs">
                    {item.time.split(' ')[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.tour}</h4>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">Mã: <span className="text-blue-600">{item.code}</span> • {item.pax} khách</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Hướng dẫn viên</p>
                  <p className="text-sm font-bold text-gray-700">{item.guide}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}