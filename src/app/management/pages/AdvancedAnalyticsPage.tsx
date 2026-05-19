import { Target, UserCheck, TrendingUp } from "lucide-react";
import { StatCard } from "../features/analytics/StatCards";
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie 
} from "recharts";

// 🎯 1. BỔ SUNG DATA BỊ THIẾU
const leadConversionData = [
  { stage: "Khách mới", count: 450 },
  { stage: "Đã liên hệ", count: 320 },
  { stage: "Đang tư vấn", count: 180 },
  { stage: "Đã chốt", count: 95 },
];

const customerSourceData = [
  { name: "Facebook", value: 35, color: "#3b82f6" },
  { name: "Google", value: 28, color: "#10b981" },
  { name: "Giới thiệu", value: 22, color: "#8b5cf6" },
  { name: "Website", value: 15, color: "#f59e0b" },
];

const COLORS = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"];

export function AdvancedAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hệ thống phân tích</h1>
          <p className="text-slate-500 font-medium">Báo cáo tổng quan hiệu suất kinh doanh năm 2026</p>
        </div>
        <button className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          Xuất dữ liệu .CSV
        </button>
      </div>

      {/* Grid thẻ chỉ số */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tỷ lệ chốt đơn" value="14.4%" trend="+2.3% tháng này" icon={Target} color="bg-blue-600" />
        <StatCard title="Khách thân thiết" value="87%" trend="+6% hài lòng" icon={UserCheck} color="bg-emerald-500" />
        <StatCard title="Tỷ lệ hủy" value="3.8%" trend="-1.1% cải thiện" icon={TrendingUp} color="bg-rose-500" />
      </div>

      {/* Biểu đồ chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phễu chuyển đổi */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <h3 className="font-black text-slate-900 uppercase tracking-tight mb-8 text-sm">Phễu khách hàng tiềm năng</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadConversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={900} // 🎯 Sửa fontBold thành fontWeight
                  width={100} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={28}>
                  {leadConversionData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nguồn khách hàng */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center hover:shadow-md transition-all">
          <h3 className="font-black text-slate-900 uppercase tracking-tight mb-4 self-start text-sm">Nguồn khách hàng</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={customerSourceData} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {customerSourceData.map((entry, i) => (
                    <Cell key={`cell-pie-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend thủ công cho đẹp */}
          <div className="grid grid-cols-2 gap-4 mt-4 w-full">
            {customerSourceData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{entry.name}</span>
                <span className="ml-auto text-[10px] font-black text-slate-900">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}