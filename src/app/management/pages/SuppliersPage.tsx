import { useEffect, useState } from "react";
import { Building2, Plus, Search, Phone, Mail, MapPin, CheckCircle, XCircle, Eye, Edit2, X, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

// Cấu hình số lượng dòng hiển thị trên một trang
const ITEMS_PER_PAGE = 5;

export function SuppliersPage() {
  const { 
    providers, 
    isLoading, 
    stats, 
    searchTerm, 
    setSearchTerm, 
    fetchProviders, 
    changeStatus, 
    addProvider, 
    updateProvider 
  } = useProviders();
  
  // State điều khiển Form (Thêm / Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderResponse | null>(null);

  // State điều khiển Drawer (Xem chi tiết)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailProvider, setDetailProvider] = useState<ProviderResponse | null>(null);

  // 🎯 PHÂN TRANG (FE State)
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 🎯 LOGIC TÌM KIẾM TRÊN FE
  const totalLinkedTours = providers.reduce((sum, sup) => sum + (sup.linkedToursCount || 0), 0);
  const filteredProviders = providers.filter((sup) => {
    const searchTarget = searchTerm.toLowerCase().trim();
    if (!searchTarget) return true;

    return (
      sup.name.toLowerCase().includes(searchTarget) ||
      sup.providerCode.toLowerCase().includes(searchTarget) ||
      sup.phone.includes(searchTarget) ||
      (sup.contactPerson && sup.contactPerson.toLowerCase().includes(searchTarget))
    );
  });

  // 🎯 LOGIC CHIA TRANG TRÊN FE
  const totalPages = Math.ceil(filteredProviders.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const displayedProviders = filteredProviders.slice(indexOfFirstItem, indexOfLastItem);

  // Mở Form Tạo mới / Chỉnh sửa
  const handleOpenEdit = (provider: ProviderResponse) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
    setIsDrawerOpen(false); 
  };

  // Mở Drawer Xem chi tiết
  const handleOpenDetail = (provider: ProviderResponse) => {
    setDetailProvider(provider);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedProvider) {
      return await updateProvider(selectedProvider.id, data);
    } else {
      return await addProvider(data);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 relative overflow-x-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nhà cung cấp</h1>
          <p className="text-slate-500 font-medium mt-1">Quản lý mạng lưới và thông tin liên hệ của đối tác dịch vụ lữ hành</p>
        </div>
        <button 
          onClick={() => { setSelectedProvider(null); setIsModalOpen(true); }}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Thêm đối tác
        </button>
      </div>

      {/* STATS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng đối tác hệ thống</p>
            <p className="text-3xl font-black text-slate-900 leading-tight">{stats.total || 0}</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">{stats.active || 0} Đối tác đang hoạt động</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng sản lượng điều hành</p>
            <p className="text-3xl font-black text-slate-900 leading-tight">{totalLinkedTours || 0} lượt</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Tổng số lịch trình đã và đang sử dụng dịch vụ</p>
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

      {/* BẢNG DỮ LIỆU & PHÂN TRANG */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[300px] flex flex-col justify-between">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <p className="font-bold text-slate-500">Đang tải dữ liệu...</p>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nhà cung cấp</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loại hình</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin liên hệ</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Tần suất sử dụng</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedProviders.map((sup) => {
                const typeInfo = typeConfig[sup.serviceType] || typeConfig.OTHER;
                
                return (
                  <tr key={sup.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p 
                        className="font-black text-slate-900 text-sm cursor-pointer hover:text-blue-600 transition-colors" 
                        onClick={() => handleOpenDetail(sup)}
                      >
                        {sup.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">{sup.providerCode}</span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5 truncate max-w-[180px]">
                          <MapPin size={10}/> {sup.address}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase inline-block border", typeInfo.color)}>
                        {typeInfo.label}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900">{sup.contactPerson}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <Phone size={12} className="text-slate-400"/> {sup.phone}
                          </p>
                          {sup.email && (
                            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                              <Mail size={12} className="text-slate-400"/> {sup.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {sup.linkedToursCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/70 text-blue-700 rounded-full text-xs font-black">
                          {sup.linkedToursCount} Lịch trình
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 italic bg-slate-50 px-2 py-1 rounded">
                          Chưa có lịch trình
                        </span>
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
                      <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenDetail(sup)} 
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" 
                          title="Xem chi tiết hồ sơ"
                        >
                          <Eye size={16} />
                        </button>

                        <button 
                          onClick={() => handleOpenEdit(sup)} 
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" 
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit2 size={16} />
                        </button>

                        {sup.status !== 'ACTIVE' && (
                          <button 
                            onClick={() => changeStatus(sup.id, 'ACTIVE')} 
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors" 
                            title="Kích hoạt / Duyệt hợp tác"
                          >
                            <CheckCircle size={16}/>
                          </button>
                        )}
                        {sup.status === 'ACTIVE' && (
                          <button 
                            onClick={() => changeStatus(sup.id, 'INACTIVE')} 
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" 
                            title="Tạm dừng hợp tác"
                          >
                            <XCircle size={16}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredProviders.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-medium">
                    Không tìm thấy nhà cung cấp nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🎯 THANH ĐIỀU HƯỚNG PHÂN TRANG (FE PAGINATION BAR) */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">
              Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProviders.length)} trong tổng số {filteredProviders.length} đối tác
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-xl text-xs font-black transition-all",
                    currentPage === page 
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/10" 
                      : "text-slate-500 hover:bg-white hover:text-slate-800"
                  )}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL FORM: THÊM / SỬA ĐỐI TÁC */}
      <ProviderFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={selectedProvider}
        onSubmit={handleFormSubmit}
      />

      {/* SLIDE-OVER DRAWER: XEM CHI TIẾT HỒ SƠ ĐỐI TÁC */}
      <div className={cn(
        "fixed inset-0 z-50 overflow-hidden transition-all duration-300 pointer-events-none",
        isDrawerOpen ? "pointer-events-auto" : ""
      )}>
        <div 
          className={cn(
            "absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 opacity-0",
            isDrawerOpen ? "opacity-100" : ""
          )} 
          onClick={() => setIsDrawerOpen(false)} 
        />

        <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className={cn(
            "w-screen max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col transition-transform duration-300 ease-out translate-x-full",
            isDrawerOpen ? "translate-x-0" : ""
          )}>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {detailProvider?.providerCode}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-2 truncate max-w-[280px]">
                  {detailProvider?.name}
                </h2>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại hình dịch vụ</p>
                  <p className="text-sm font-black text-slate-800 mt-1">
                    {detailProvider ? (typeConfig[detailProvider.serviceType] || typeConfig.OTHER).label : "---"}
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái hợp tác</p>
                  <p className="text-sm font-black text-slate-800 mt-1">
                    {detailProvider?.status === 'ACTIVE' ? 'Đang hợp tác' : detailProvider?.status === 'PENDING' ? 'Chờ duyệt' : 'Ngừng hợp tác'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 pb-1.5">Thông tin liên hệ</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Người đại diện liên hệ</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{detailProvider?.contactPerson || "Chưa cập nhật"}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-slate-400">Số điện thoại</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5"><Phone size={14} className="text-slate-400"/> {detailProvider?.phone}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-slate-400">Hòm thư điện tử</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 truncate"><Mail size={14} className="text-slate-400"/> {detailProvider?.email || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400">Địa chỉ văn phòng</p>
                    <p className="text-sm font-medium text-slate-700 mt-0.5 flex items-start gap-1.5 whitespace-normal"><MapPin size={14} className="text-slate-400 mt-0.5 shrink-0"/> {detailProvider?.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 pb-1.5">Sản lượng cung ứng</h3>
                <div className="bg-blue-50/40 border border-blue-100/50 p-4 rounded-2xl">
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    Nhà cung cấp này đã được điều phối và sử dụng trong bộ khung dịch vụ của <strong className="text-blue-700 font-black">{detailProvider?.linkedToursCount || 0} lịch trình tour</strong> thuộc hệ thống điều hành.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex gap-3">
              <button 
                onClick={() => detailProvider && handleOpenEdit(detailProvider)}
                className="flex-1 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 size={14} /> Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}