import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ title, value, trend, icon: Icon, color }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{title}</p>
          <h4 className="text-3xl font-black text-slate-900 mb-1">{value}</h4>
          <span className={`text-xs font-bold ${trend.includes('+') ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}