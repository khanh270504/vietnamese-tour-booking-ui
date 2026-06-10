import { useEffect, useState } from "react";
import { Receipt, Search, Filter, CheckCircle, Clock, FileX, MoreHorizontal, Plus, Banknote, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { TourCostResponse, TourCostStatus } from "../../services/tourCost/tourCost.types";
import { useTourCosts } from "../features/tourCost/hooks/useTourCosts"; 
import { TourCostFormModal } from "../features/tourCost/TourCostFormModal"; 

import { providerService } from "../../services/provider/provider.service";
import { tourService } from "../../services/tour/tour.service";

const statusConfig: Record<TourCostStatus, { label: string; icon: any; color: string }> = {
  UNPAID: { label: "Chưa thanh toán", icon: Clock, color: "bg-rose-50 text-rose-600 border-rose-100" },
  PARTIAL: { label: "Thanh toán 1 phần", icon: Banknote, color: "bg-orange-50 text-orange-600 border-orange-100" },
  PAID: { label: "Đã thanh toán", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  CANCELLED: { label: "Đã hủy", icon: FileX, color: "bg-slate-50 text-slate-500 border-slate-200" },
};

export function TourCostsPage() {
  const { 
    costs, 
    stats,
    isLoading, 
    currentPage, 
    totalPages, 
    totalElements, 
    keyword, 
    setKeyword, 
    fetchCosts, 
    changeStatus, 
    addCost, 
    updateCost, 
    deleteCost 
  } = useTourCosts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCost, setSelectedCost] = useState<TourCostResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // 🎯 ĐỔI TÊN STATE THÀNH toursList CHO CHUẨN LOGIC
  const [toursList, setToursList] = useState<{ id: number; name: string }[]>([]);
  const [providersList, setProvidersList] = useState<{ id: number; name: string }[]>([]);

  // Gọi API lấy dữ liệu Bảng
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCosts(currentPage, keyword, statusFilter);
    }, 500); 
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, keyword, statusFilter, fetchCosts]);

  // Lấy danh sách Tour và Provider cho Dropdown
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [resTours, resProviders] = await Promise.all([
          tourService.getTourSelectList(), // 🎯 ĐÃ SỬA THÀNH HÀM CHUẨN CỦA ÔNG
          providerService.getAll()      
        ]);

        // Xử lý lấy mảng data bất chấp việc backend bọc bao nhiêu lớp ApiResponse
        const toursData = Array.isArray(resTours) ? resTours : (resTours?.result || resTours?.data || []);
const providersData = Array.isArray(resProviders) ? resProviders : (resProviders as any);
        const mappedTours = toursData.map((item: any) => ({
          id: item.id,
          name: item.name || item.tourName || `Tour #${item.id}` 
        }));

        const mappedProviders = providersData.map((item: any) => ({
          id: item.id,
          name: item.name
        }));

        setToursList(mappedTours);
        setProvidersList(mappedProviders);
      } catch (error) {
        console.error("Lỗi tải danh sách Tour/Nhà cung cấp:", error);
      }
    };

    fetchDependencies();
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  const handleMarkAsPaid = async (id: number) => {
    if (window.confirm("Xác nhận đã thanh toán khoản chi này?")) {
      await changeStatus(id, 'PAID', 'Kế toán xác nhận duyệt chi');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu chi này không?")) {
      await deleteCost(id);
    }
  };

  const handleOpenEdit = (cost: TourCostResponse) => {
    setSelectedCost(cost);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedCost) {
      return await updateCost(selectedCost.id, data);
    } else {
      return await addCost(data);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Đối soát & Chi phí</h1>
          <p className="text-slate-500 font-medium mt-1">Quản lý các khoản chi và công nợ nhà cung cấp</p>
        </div>
        <button 
          onClick={() => { setSelectedCost(null); setIsModalOpen(true); }}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Tạo phiếu chi
        </button>
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Receipt size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng tiền phát sinh</p>
            <p className="text-3xl font-black text-slate-900 leading-tight">{formatCurrency(stats?.totalAmount || 0)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Clock size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Công nợ phải trả</p>
            <p className="text-3xl font-black text-rose-600 leading-tight">{formatCurrency(stats?.totalUnpaid || 0)}</p>
          </div>
        </div>
      </div>

      {/* TOOLBAR TÌM KIẾM VÀ LỌC TRẠNG THÁI */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600" />
          <input 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên khoản chi..." 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
          />
        </div>
        
        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-5 pr-12 py-3.5 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors outline-none cursor-pointer appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="UNPAID">Chưa thanh toán</option>
            <option value="PARTIAL">Thanh toán 1 phần</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
          <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[400px] flex flex-col">
        {isLoading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center"><p className="font-bold text-slate-500">Đang tải dữ liệu...</p></div>}
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Chi tiết khoản chi</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Số tiền</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {costs.map((cost) => {
                const statusInfo = statusConfig[cost.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={cost.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-black text-slate-900 text-sm">{cost.expenseName}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{cost.providerCode}</span>
                        <span className="text-[11px] font-medium text-slate-500">{cost.providerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <p className="text-sm font-black text-slate-900">{formatCurrency(cost.amount)}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 w-max mx-auto border-2", statusInfo.color)}>
                        <StatusIcon size={12} strokeWidth={3} /> {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {cost.status === 'UNPAID' && (
                          <button onClick={() => handleMarkAsPaid(cost.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Duyệt chi"><CheckCircle size={18} /></button>
                        )}
                        <button onClick={() => handleOpenEdit(cost)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><MoreHorizontal size={18} /></button>
                        <button onClick={() => handleDelete(cost.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {costs.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-sm font-medium">Không tìm thấy khoản chi nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* THANH PHÂN TRANG NÚT VUÔNG */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400">
            Hiển thị tổng cộng <span className="text-slate-900">{totalElements}</span> khoản chi
          </p>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage <= 1}
              onClick={() => fetchCosts(currentPage - 1, keyword, statusFilter)}
              className="p-2 mr-2 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            {(() => {
              const pages = [];
              const maxVisible = 5;

              if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (currentPage <= 3) {
                  pages.push(1, 2, 3, 4, '...', totalPages);
                } else if (currentPage >= totalPages - 2) {
                  pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                }
              }

              return pages.map((page, index) => {
                if (page === '...') {
                  return <span key={`ellipsis-${index}`} className="px-2 text-slate-400 text-xs font-bold">...</span>;
                }
                
                const isCurrent = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => fetchCosts(page as number, keyword, statusFilter)}
                    className={cn(
                      "min-w-[32px] h-8 px-2 flex items-center justify-center rounded-md text-xs font-black transition-all",
                      isCurrent 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                        : "bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                    )}
                  >
                    {page}
                  </button>
                );
              });
            })()}
            
            <button 
              disabled={currentPage >= (totalPages || 1)}
              onClick={() => fetchCosts(currentPage + 1, keyword, statusFilter)}
              className="p-2 ml-2 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <TourCostFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cost={selectedCost} 
        onSubmit={handleFormSubmit} 
        tours={toursList}
        providers={providersList}
      />
    </div>
  );
}