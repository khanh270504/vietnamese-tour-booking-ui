import { Calendar, DollarSign, MapPin, CreditCard, Users, TrendingUp, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "../../lib/utils";

// --- 🎯 PHỤC HỒI ĐẦY ĐỦ DATA CỦA ÔNG GIÁO ---
const statsCards = [
  { title: "Tổng đơn đặt tour", value: "1,234", change: "+12.5%", trend: "up", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { title: "Doanh thu tháng", value: "2.4 tỷ", change: "+18.2%", trend: "up", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
  { title: "Tour hoạt động", value: "87", change: "+5 tour", trend: "up", icon: MapPin, color: "from-purple-500 to-purple-600" },
  { title: "Thanh toán chờ", value: "23", change: "-3 đơn", trend: "down", icon: CreditCard, color: "from-orange-500 to-orange-600" },
  { title: "Tổng khách hàng", value: "8,542", change: "+234", trend: "up", icon: Users, color: "from-cyan-500 to-cyan-600" },
  { title: "Lead hôm nay", value: "47", change: "Ổn định", trend: "neutral", icon: TrendingUp, color: "from-pink-500 to-pink-600" },
];

const revenueData = [
  { month: "T1", revenue: 1.8 }, { month: "T2", revenue: 2.1 }, { month: "T3", revenue: 2.4 },
  { month: "T4", revenue: 2.2 }, { month: "T5", revenue: 2.8 }, { month: "T6", revenue: 3.2 },
];

const bookingStatusData = [
  { name: "Đã xác nhận", value: 542, color: "#10b981" },
  { name: "Chờ duyệt", value: 123, color: "#f59e0b" },
  { name: "Đang đi", value: 234, color: "#3b82f6" },
  { name: "Hoàn thành", value: 335, color: "#6366f1" },
];

const topTours = [
  { name: "Hà Nội - Hạ Long - Sapa 5N4Đ", bookings: 145, revenue: "435M" },
  { name: "TP.HCM - Phú Quốc 4N3Đ", bookings: 128, revenue: "384M" },
  { name: "Đà Nẵng - Hội An - Huế 3N2Đ", bookings: 112, revenue: "336M" },
  { name: "Nha Trang - Vinpearl 3N2Đ", bookings: 98, revenue: "294M" },
  { name: "Đà Lạt - Lâm Đồng 2N1Đ", bookings: 87, revenue: "174M" },
];

const recentBookings = [
  { id: "BK001234", customer: "Nguyễn Thị Lan", tour: "Hà Nội - Hạ Long", date: "15/06/2026", amount: "12,500,000", status: "confirmed" },
  { id: "BK001235", customer: "Trần Văn Minh", tour: "Phú Quốc Resort", date: "18/06/2026", amount: "8,900,000", status: "pending" },
  { id: "BK001236", customer: "Lê Hoàng Nam", tour: "Đà Nẵng - Hội An", date: "20/06/2026", amount: "6,750,000", status: "confirmed" },
  { id: "BK001237", customer: "Phạm Thu Hà", tour: "Nha Trang Biển", date: "22/06/2026", amount: "9,200,000", status: "processing" },
];

export function OverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bảng điều khiển</h1>
          <p className="text-slate-500 font-medium">Chào buổi sáng! Hệ thống đang vận hành ổn định.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>12/05/2026 23:55</span>
        </div>
      </div>

      {/* 2. QUICK STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="group bg-white rounded-[2rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{card.title}</p>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{card.value}</h3>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                    card.trend === 'up' ? "bg-emerald-50 text-emerald-600" : card.trend === 'down' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"
                  )}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={cn("w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg", card.color)}>
                <card.icon size={24} strokeWidth={3} />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>

      {/* 3. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Biến động doanh thu (Tỷ VNĐ)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 900, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 text-center">Trạng thái đơn</h3>
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingStatusData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {bookingStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 px-2">
            {bookingStatusData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                <span className="text-[10px] font-black text-slate-500 uppercase">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TOP TOURS & RECENT BOOKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tour bán chạy */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Tour bán chạy nhất</h3>
          <div className="space-y-6">
            {topTours.map((tour, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-xs text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">0{index + 1}</div>
                  <div>
                    <p className="text-sm font-black text-slate-900 leading-tight truncate max-w-[150px]">{tour.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{tour.bookings} lượt đặt</p>
                  </div>
                </div>
                <p className="font-black text-blue-600">{tour.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bảng đơn gần đây */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Đơn hàng mới</h3>
            <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã đơn</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khách hàng</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Tổng tiền</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-8 font-black text-blue-600 text-sm">{bk.id}</td>
                    <td className="py-6 px-8">
                      <p className="font-black text-slate-900 text-sm">{bk.customer}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{bk.tour}</p>
                    </td>
                    <td className="py-6 px-8 text-right font-black text-slate-900">{bk.amount}₫</td>
                    <td className="py-6 px-8 text-center">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2",
                        bk.status === 'confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        bk.status === 'pending' ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {bk.status === 'confirmed' ? 'Đã chốt' : bk.status === 'pending' ? 'Chờ duyệt' : 'Xử lý'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}