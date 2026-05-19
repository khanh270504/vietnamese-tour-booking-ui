import { Download, TrendingUp, Users, DollarSign, Target, ArrowUpRight } from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { cn } from "../../lib/utils";

// --- MOCK DATA (Giữ nguyên để sau này map API Java) ---
const monthlyRevenueData = [
  { month: "T1", revenue: 180, target: 200 },
  { month: "T2", revenue: 210, target: 200 },
  { month: "T3", revenue: 240, target: 220 },
  { month: "T4", revenue: 220, target: 220 },
  { month: "T5", revenue: 280, target: 250 },
  { month: "T6", revenue: 320, target: 270 },
];

const topToursByRevenue = [
  { name: "Hà Nội - Hạ Long - Sapa", revenue: "435M", percentage: 18.5 },
  { name: "TP.HCM - Phú Quốc Resort", revenue: "384M", percentage: 16.3 },
  { name: "Đà Nẵng - Hội An - Huế", revenue: "336M", percentage: 14.2 },
];

export function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Báo cáo chiến lược</h1>
          <p className="text-slate-500 font-medium">Phân tích chuyên sâu về tăng trưởng và mục tiêu kinh doanh</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-2">
          <Download size={16} strokeWidth={3} />
          <span>Xuất báo cáo PDF</span>
        </button>
      </div>

      {/* TOP ANALYTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportStatCard label="Doanh thu T6" value="320M" trend="+18.5%" sub="Vượt mục tiêu" icon={DollarSign} color="from-blue-500 to-blue-600" />
        <ReportStatCard label="Tỷ lệ chốt" value="29.4%" trend="+1.3%" sub="Tăng ổn định" icon={Target} color="from-purple-500 to-purple-600" />
        <ReportStatCard label="Giữ chân khách" value="87.5%" trend="+2.1%" sub="Dịch vụ tốt" icon={Users} color="from-emerald-500 to-emerald-600" />
        <ReportStatCard label="Tăng trưởng" value="+45.2%" trend="YOY" sub="So với 2025" icon={TrendingUp} color="from-orange-500 to-orange-600" />
      </div>

      {/* MAIN CHART: REVENUE VS TARGET */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Doanh thu thực tế vs Mục tiêu (triệu đ)</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-600" />
               <span className="text-[10px] font-black text-slate-400 uppercase">Thực tế</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase">Mục tiêu</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 900, fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}} 
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} 
              />
              <Bar dataKey="revenue" fill="#2563eb" radius={[12, 12, 0, 0]} barSize={32} />
              <Bar dataKey="target" fill="#10b981" radius={[12, 12, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RETENTION CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Cơ cấu nguồn khách hàng</h3>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* TOP TOURS PROGRESS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top doanh thu theo Tour</h3>
            <ArrowUpRight className="text-blue-600" />
          </div>
          <div className="space-y-8">
            {topToursByRevenue.map((tour, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">0{index + 1}</span>
                    <p className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors">{tour.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{tour.revenue}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">{tour.percentage}% đóng góp</p>
                  </div>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${tour.percentage * 4}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// COMPONENT CON: ReportStatCard
function ReportStatCard({ label, value, trend, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={22} strokeWidth={3} />
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-tighter">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 leading-tight mb-1">{value}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase italic">{sub}</p>
      </div>
    </div>
  );
}