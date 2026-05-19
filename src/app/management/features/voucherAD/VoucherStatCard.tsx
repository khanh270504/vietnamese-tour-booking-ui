import { cn } from "../../../lib/utils"; 
interface Props {
  label: string;
  value: string | number;
  trend: string;
  icon: any;
  color: string;
}

export function VoucherStatCard({ label, value, trend, icon: Icon, color }: Props) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={cn("w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
        <Icon size={24} strokeWidth={3} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">{value}</p>
        <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">{trend}</p>
      </div>
    </div>
  );
}