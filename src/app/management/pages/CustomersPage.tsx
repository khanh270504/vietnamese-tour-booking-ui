import { Search, Filter, UserPlus, Phone, Mail, MapPin, Calendar, Tag, MoreHorizontal, UserCheck } from "lucide-react";

// Mock data (Sau này ông giáo map với API CustomerProfile từ Java nhé)
const customers = [
  { id: "C001", name: "Nguyễn Thị Lan", phone: "0901234567", email: "lan.nguyen@email.com", address: "Hà Nội", joinDate: "15/01/2024", totalBookings: 8, totalSpent: "45,600,000", tags: ["VIP", "Khách cũ"] },
  { id: "C002", name: "Trần Văn Minh", phone: "0912345678", email: "minh.tran@email.com", address: "TP. Hồ Chí Minh", joinDate: "22/03/2024", totalBookings: 5, totalSpent: "32,400,000", tags: ["Khách cũ"] },
  { id: "C003", name: "Lê Hoàng Nam", phone: "0923456789", email: "nam.le@email.com", address: "Đà Nẵng", joinDate: "05/05/2026", totalBookings: 1, totalSpent: "6,750,000", tags: ["Khách mới"] },
];

const tagColors: any = {
  "VIP": "bg-purple-50 text-purple-600 border-purple-100",
  "Khách cũ": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Khách mới": "bg-blue-50 text-blue-600 border-blue-100",
  "Gia đình": "bg-orange-50 text-orange-600 border-orange-100",
};

export function CustomersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cơ sở dữ liệu khách hàng</h1>
          <p className="text-slate-500 font-medium">Quản lý hồ sơ, hành vi và lòng trung thành của khách hàng</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
          <UserPlus size={16} strokeWidth={3} />
          Thêm khách hàng
        </button>
      </div>

      {/* TOP ANALYTICS MINI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MiniStatCard label="Tổng khách hàng" value="8,542" icon={UserCheck} color="from-blue-500 to-blue-600" />
        <MiniStatCard label="Khách hàng VIP" value="234" icon={Tag} color="from-purple-500 to-purple-600" />
        <MiniStatCard label="Mới tháng này" value="127" icon={UserPlus} color="from-emerald-500 to-emerald-600" />
        <MiniStatCard label="Tỷ lệ giữ chân" value="87.5%" icon={Calendar} color="from-orange-500 to-orange-600" />
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại hoặc mã KH..."
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
        <button className="px-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-tight">
          <Filter size={16} strokeWidth={3} />
          Lọc danh sách
        </button>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã KH</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khách hàng</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khu vực & Ngày tham gia</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Số đơn</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Chi tiêu</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Phân loại</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-6 px-8">
                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">{customer.id}</span>
                  </td>
                  <td className="py-6 px-8">
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-tight">{customer.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Phone size={10} /> {customer.phone}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Mail size={10} /> {customer.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <MapPin size={14} className="text-rose-500" /> {customer.address}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{customer.joinDate}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-center font-black text-slate-900">{customer.totalBookings}</td>
                  <td className="py-6 px-8 text-right font-black text-blue-600">{customer.totalSpent}₫</td>
                  <td className="py-6 px-8">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {customer.tags.map((tag) => (
                        <span key={tag} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${tagColors[tag]}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center justify-center gap-2">
                       <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-black transition-all">Hồ sơ</button>
                       <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 transition-all"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT CON CHO MINI STATS ---
function MiniStatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        <Icon size={20} strokeWidth={3} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}