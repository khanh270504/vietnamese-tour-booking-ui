import { useEffect, useState } from "react";
import { Building2, Plus, Search, Phone, Mail, MapPin, MoreHorizontal, FileText, Wallet, CheckCircle, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { ProviderFormModal } from "../features/provider/ProviderFormModal";
import { useProviders } from "../features/provider/hooks/useProviders";
import { ProviderResponse } from "../../services/provider/provider.types";

const typeConfig: Record<string, { label: string, color: string }> = {
  HOTEL: { label: "Khách sạn", color: "bg-blue-50 text-blue-600 border-blue-100" },
  TRANSPORT: { label: "Vận chuyển", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  RESTAURANT: { label: "Nhà hàng", color: "bg-orange-50 text-orange-600 border-orange-100" },
  ATTRACTION: { label: "Vé/Tham quan", color: "bg-purple-50 text-purple-600 border-purple-100" },
  OTHER: { label: "Khác", color: "bg-slate-50 text-slate-600 border-slate-200" },
};

export function SuppliersPage() {
  // 🎯 FIX LỖI 1: Đã thêm addProvider và updateProvider vào đây
  const { providers, isLoading, stats, searchTerm, setSearchTerm, fetchProviders, changeStatus, addProvider, updateProvider } = useProviders();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderResponse | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const formatCurrency = (val: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  const handleOpenEdit = (provider: ProviderResponse) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedProvider) {
      return await updateProvider(selectedProvider.id, data);
    } else {
      return await addProvider(data);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nhà cung cấp</h1>
          <p className="text-slate-500 font-medium mt-1">Quản lý mạng lưới đối tác dịch vụ lữ hành</p>
        </div>
        <button 
          onClick={() => { setSelectedProvider(null); setIsModalOpen(true); }}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-black transition-all active:scale-95">
          <Plus size={16} strokeWidth={3} /> Thêm đối tác
        </button>
      </div>

      {/* STATS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Building2 size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng đối tác</p>
            <p className="text-3xl font-black text-slate-900 leading-tight">{stats.total}</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">{stats.active} Đang hợp tác</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Wallet size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng KL Giao dịch</p>
            <p className="text-3xl font-black text-slate-900 leading-tight">{formatCurrency(stats.totalVolume)}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Chi phí dự toán/thực tế</p>
          </div>
        </div>
      </div>

      {/* TOOLBAR TÌM KIẾM */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, mã nhà cung cấp, sđt..." 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
          />
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[300px]">
        {isLoading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center"><p className="font-bold text-slate-500">Đang tải dữ liệu...</p></div>}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nhà cung cấp</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loại hình</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin liên hệ</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thống kê Giao dịch</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {providers.map((sup) => {
                const typeInfo = typeConfig[sup.serviceType] || typeConfig.OTHER;
                
                return (
                  <tr key={sup.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-black text-slate-900 text-sm cursor-pointer hover:text-blue-600" onClick={() => handleOpenEdit(sup)}>
                        {sup.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">{sup.providerCode}</span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5 truncate max-w-[150px]"><MapPin size={10}/> {sup.address}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase inline-block border", typeInfo.color)}>
                        {typeInfo.label}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-900">{sup.contactPerson}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1"><Phone size={12} className="text-slate-400"/> {sup.phone}</p>
                          {sup.email && <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1"><Mail size={12} className="text-slate-400"/> {sup.email}</p>}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {sup.linkedToursCount > 0 ? (
                        <>
                          <p className="text-sm font-black text-slate-900">{formatCurrency(sup.totalCostVolume)}</p>
                          <p className="text-[10px] font-bold text-blue-600 mt-0.5 flex items-center justify-end gap-1"><FileText size={10}/> {sup.linkedToursCount} Lịch trình</p>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 italic bg-slate-50 px-2 py-1 rounded">Chưa phát sinh giao dịch</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 inline-block",
                        sup.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        sup.status === 'PENDING' ? "bg-orange-50 text-orange-600 border-orange-100" : 
                        "bg-rose-50 text-rose-600 border-rose-100"
                      )}>
                        {sup.status === 'ACTIVE' ? 'Đang hợp tác' : sup.status === 'PENDING' ? 'Chờ duyệt' : 'Ngừng HT'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {sup.status !== 'ACTIVE' && (
                           <button onClick={() => changeStatus(sup.id, 'ACTIVE')} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Duyệt hợp tác"><CheckCircle size={18}/></button>
                         )}
                         {sup.status === 'ACTIVE' && (
                           <button onClick={() => changeStatus(sup.id, 'INACTIVE')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Ngừng hợp tác"><XCircle size={18}/></button>
                         )}
                        <button onClick={() => handleOpenEdit(sup)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><MoreHorizontal size={18}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {providers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-medium">Không tìm thấy nhà cung cấp nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🎯 FIX LỖI 2: Đã xóa cái Modal nháp rác kia, chỉ giữ lại đúng Modal xịn này */}
      <ProviderFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={selectedProvider}
        onSubmit={handleFormSubmit}
      />

    </div>
  );
}