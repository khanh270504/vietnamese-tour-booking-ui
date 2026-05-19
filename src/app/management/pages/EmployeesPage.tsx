import { Search, UserPlus, TrendingUp, Award, Target, MoreHorizontal, Mail, Phone } from "lucide-react";
import { cn } from "../../lib/utils";

// Mock data (Sau này ông giáo map với API Staff/Employee từ Java)
const employees = [
  { id: "E001", name: "Trần Thị Mai", role: "Tư vấn viên Senior", email: "mai.tran@vn-travel.com", customersManaged: 156, bookingsThisMonth: 23, revenueThisMonth: "45.6M", conversionRate: "28.5%", kpiProgress: 85 },
  { id: "E002", name: "Nguyễn Văn An", role: "Tư vấn viên", email: "an.nguyen@vn-travel.com", customersManaged: 124, bookingsThisMonth: 18, revenueThisMonth: "38.2M", conversionRate: "24.3%", kpiProgress: 72 },
  { id: "E003", name: "Phạm Thị Linh", role: "Tư vấn viên", email: "linh.pham@vn-travel.com", customersManaged: 98, bookingsThisMonth: 15, revenueThisMonth: "32.8M", conversionRate: "26.1%", kpiProgress: 68 },
];

const topPerformers = [
  { name: "Trần Thị Mai", revenue: "45.6M", bookings: 23, growth: "+18%" },
  { name: "Nguyễn Văn An", revenue: "38.2M", bookings: 18, growth: "+12%" },
];

export function EmployeesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Đội ngũ nhân sự</h1>
          <p className="text-slate-500 font-medium">Theo dõi hiệu suất kinh doanh và tiến độ KPI thực tế</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
          <UserPlus size={16} strokeWidth={3} />
          Thêm nhân viên mới
        </button>
      </div>

      {/* TOP ANALYTICS MINI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EmployeeStatCard label="Tổng nhân sự" value="42" trend="+3 tháng này" icon={UserPlus} color="from-blue-500 to-blue-600" />
        <EmployeeStatCard label="Trung bình KPI" value="78.5%" trend="+5.2% nỗ lực" icon={Target} color="from-emerald-500 to-emerald-600" />
        <EmployeeStatCard label="Doanh thu/Người" value="35.2M" trend="+12.3% tăng trưởng" icon={TrendingUp} color="from-purple-500 to-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN EMPLOYEES TABLE */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <div className="relative group max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân sự..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border-transparent rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nhân viên</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Hiệu suất</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Doanh thu</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tiến độ KPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs uppercase tracking-tighter">
                            {emp.name.split(' ').pop()?.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">{emp.name}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">{emp.role}</p>
                         </div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                       <p className="text-sm font-black text-slate-900">{emp.bookingsThisMonth}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Bookings</p>
                    </td>
                    <td className="py-6 px-8 text-right font-black text-emerald-600">{emp.revenueThisMonth}</td>
                    <td className="py-6 px-8 w-1/3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all duration-1000", 
                              emp.kpiProgress >= 80 ? "bg-emerald-500" : emp.kpiProgress >= 60 ? "bg-orange-500" : "bg-rose-500"
                            )}
                            style={{ width: `${emp.kpiProgress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-black text-slate-900 w-10 text-right">{emp.kpiProgress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP PERFORMERS SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-amber-500 shadow-sm" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Performance</h3>
            </div>

            <div className="space-y-6">
              {topPerformers.map((performer, index) => (
                <div key={index} className="relative p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-blue-100 transition-all group overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                       <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-xs text-blue-600 shadow-sm border border-slate-100">0{index + 1}</span>
                       <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-lg tracking-widest">{performer.growth}</span>
                    </div>
                    <h4 className="font-black text-slate-900 mb-1">{performer.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">{performer.bookings} Bookings thành công</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Doanh thu</span>
                       <span className="text-lg font-black text-blue-600">{performer.revenue}</span>
                    </div>
                  </div>
                  {/* Background decoration */}
                  <Award className="absolute -bottom-6 -right-6 w-24 h-24 text-blue-500 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// COMPONENT CON: StatCard
function EmployeeStatCard({ label, value, trend, icon: Icon, color }: any) {
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