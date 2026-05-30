import { Download, TrendingUp, Users, DollarSign, Target, ArrowUpRight } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { cn } from "../../lib/utils";

// --- MOCK DATA ---
const monthlyRevenueData = [
  { month: "T1", revenue: 180, target: 200, users: 450 },
  { month: "T2", revenue: 210, target: 200, users: 520 },
  { month: "T3", revenue: 240, target: 220, users: 580 },
  { month: "T4", revenue: 220, target: 220, users: 550 },
  { month: "T5", revenue: 280, target: 250, users: 690 },
  { month: "T6", revenue: 320, target: 270, users: 810 },
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
        <button className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-2">
          <Download size={16} strokeWidth={3} />
          <span>Xuất báo cáo PDF</span>
        </button>
      </div>

      {/* TOP ANALYTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportStatCard label="Doanh thu T6" value="320M" trend="+18.5%" sub="Vượt mục tiêu" icon={DollarSign} color="from-blue-500 to-indigo-500" />
        <ReportStatCard label="Tỷ lệ chốt" value="29.4%" trend="+1.3%" sub="Tăng ổn định" icon={Target} color="from-blue-500 to-indigo-500" />
        <ReportStatCard label="Khách hàng mới" value="810" trend="+17.4%" sub="Lưu lượng tăng mạnh" icon={Users} color="from-emerald-400 to-emerald-500" />
        <ReportStatCard label="Tăng trưởng" value="+45.2%" trend="YOY" sub="So với 2025" icon={TrendingUp} color="from-emerald-400 to-emerald-500" />
      </div>

      {/* MAIN CHART: REVENUE VS TARGET */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Doanh thu thực tế vs Mục tiêu (Triệu VNĐ)</h3>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-md bg-blue-600 shadow-sm" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thực tế</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-md bg-slate-200" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mục tiêu</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 900, fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 700, fontSize: 12}} domain={['dataMin - 50', 'dataMax + 50']} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}} 
                contentStyle={{borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                labelStyle={{color: '#0f172a', fontWeight: 900, marginBottom: '8px'}}
              />
              <Bar dataKey="target" name="Mục tiêu" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={24} />
              <Bar dataKey="revenue" name="Thực tế" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GROWTH AREA CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Lưu lượng Khách hàng mới</h3>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="users" name="Số khách mới" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* TOP TOURS PROGRESS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top doanh thu Tour</h3>
            <button className="p-2 bg-slate-50 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors"><ArrowUpRight size={20} /></button>
          </div>
          <div className="space-y-8">
            {topToursByRevenue.map((tour, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">0{index + 1}</span>
                    <p className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors">{tour.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{tour.revenue}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{tour.percentage}% Tỷ trọng</p>
                  </div>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 group-hover:bg-blue-500"
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
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow", color)}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-emerald-100">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-3xl font-black text-slate-900 leading-tight mb-1">{value}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{sub}</p>
      </div>
    </div>
  );
}