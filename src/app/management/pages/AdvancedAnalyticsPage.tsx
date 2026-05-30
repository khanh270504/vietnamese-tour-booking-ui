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
    <div className="p-6 bg-slate-50 min-h-screen space-y-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-end">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Analytics & Business Insight
          </h1>
          <p className="text-slate-500 mt-1">
            Phân tích hiệu suất kinh doanh theo thời gian thực & chiến lược
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-white border rounded-2xl text-sm font-bold hover:bg-slate-100">
            Export CSV
          </button>
          <button className="px-5 py-2.5 bg-black text-white rounded-2xl text-sm font-bold hover:opacity-90">
            View Report
          </button>
        </div>
      </div>

      {/* KPI STRIP (QUAN TRỌNG NHẤT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Conversion Rate"
          value="14.4%"
          trend="+2.3% vs last month"
          icon={Target}
          color="bg-blue-600"
        />
        <StatCard
          title="Customer Retention"
          value="87%"
          trend="+6% improvement"
          icon={UserCheck}
          color="bg-emerald-500"
        />
        <StatCard
          title="Cancellation Rate"
          value="3.8%"
          trend="-1.1% improvement"
          icon={TrendingUp}
          color="bg-rose-500"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Funnel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">
            Customer Funnel
          </h3>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadConversionData} layout="vertical">
                <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="stage"
                  type="category"
                  width={120}
                  fontSize={12}
                  fontWeight={800}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                  }}
                />
                <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={26}>
                  {leadConversionData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Insight panel */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col">

          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">
            Insight Breakdown
          </h3>

          <div className="space-y-4">

            {customerSourceData.map((s, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">{s.name}</span>
                  <span className="text-xs font-black">{s.value}%</span>
                </div>

                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.value}%`,
                      backgroundColor: s.color
                    }}
                  />
                </div>
              </div>
            ))}

          </div>

          <div className="mt-auto pt-6 text-xs text-slate-400">
            Insight: Facebook & Google vẫn là nguồn chính → nên tăng ads retargeting.
          </div>

        </div>
      </div>
    </div>
  );
}