import { useState } from "react";
import { Search } from "lucide-react";
import { useCustomerManagement } from "../features/customer/hooks/useCustomerManagement";
import { CustomerTableRow } from "../features/customer/CustomerTableRow";
import { CustomerProfileModal } from "../features/customer/CustomerProfileModal";
import { cn } from "../../lib/utils";

export function CustomersPage() {
  const { customers, isLoading, pagination, setPage, setKeyword, refresh } = useCustomerManagement();
  
  // State quản lý Modal
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Cơ sở dữ liệu khách hàng</h1>
          <p className="text-slate-500 font-medium">Quản lý toàn bộ hồ sơ khách hàng</p>
        </div>
        {/* ĐÃ XÓA NÚT "THÊM KHÁCH HÀNG" Ở ĐÂY VÌ SAI NGHIỆP VỤ */}
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-[2rem] border shadow-sm">
         <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm tên, email, SĐT..."
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white"
            />
         </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
  {isLoading ? (
    <div className="p-20 text-center font-black text-slate-400">Đang tải...</div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Mã KH</th>
            <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Khách hàng</th>
            <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Địa chỉ</th>
            <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Đơn</th>
            <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Chi tiêu</th>
            <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Điểm</th>
            <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Thao tác</th>
          </tr>
        </thead><tbody className="divide-y divide-slate-50">
          {customers.map((c: any) => (
            <CustomerTableRow 
              key={c.id} 
              customer={c} 
              onViewProfile={() => setSelectedCustomerId(c.id)} 
            />
          ))}
        </tbody>
      </table>
    </div>
  )}

        {/* PAGINATION */}
        <div className="p-6 border-t flex justify-center gap-2">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} 
                className={cn("w-9 h-9 rounded-xl font-black text-xs transition-all", 
                  pagination.page === i + 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}>{i + 1}</button>
            ))}
        </div>
      </div>

      {/* MODAL HỒ SƠ KHÁCH HÀNG */}
      {selectedCustomerId && (
        <CustomerProfileModal 
          customerId={selectedCustomerId} 
          onClose={() => setSelectedCustomerId(null)} 
          onSuccess={refresh} // Sửa thành công thì refresh lại bảng
        />
      )}
    </div>
  );
}