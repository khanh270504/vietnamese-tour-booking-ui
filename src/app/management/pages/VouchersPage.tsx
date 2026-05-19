import { useState } from "react";
import { Search, Plus, TrendingUp, Percent, Users, Tag, Loader2 } from "lucide-react";
import { useVouchers } from "../features/voucherAD/hooks/useVouchers";
import { VoucherStatCard } from "../features/voucherAD/VoucherStatCard";
import { VoucherCard } from "../features/voucherAD/VoucherCard";
import { VoucherFormModal } from "../features/voucherAD/VoucherFormModal"; // 🎯 Import Modal vào đây
import { Voucher } from "../../services/voucher/voucher.types";

export function VouchersPage() {
  // Lôi toàn bộ hỏa lực CRUD từ Hook ra
  const { vouchers, loading, error, createVoucher, updateVoucher } = useVouchers();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedVoucher(null); // Tạo mới thì cho dữ liệu ban đầu trống trơn
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher); // Đóng gói dữ liệu voucher muốn sửa ném vào form
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedVoucher) {
      // Nếu có voucher được chọn -> Đang chạy luồng CẬP NHẬT
      return await updateVoucher(selectedVoucher.id, formData);
    } else {
      // Nếu không -> Đang chạy luồng THÊM MỚI
      return await createVoucher(formData);
    }
  };

  // Logic lọc tìm kiếm
  const filteredVouchers = vouchers.filter((v) => 
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const now = new Date();
  const activeCount = vouchers.filter(v => v.isActive && new Date(v.expiryDate) >= now).length;
  const totalUsed = vouchers.reduce((sum, v) => sum + v.usageCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Chiến dịch Ưu đãi</h1>
          <p className="text-slate-500 font-medium">Tạo mã giảm giá, quản lý ngân sách khuyến mãi và theo dõi lượt sử dụng</p>
        </div>
        {/* 🎯 SỰ KIỆN NÚT TẠO MỚI */}
        <button 
          onClick={handleOpenCreateModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={3} />
          Tạo chiến dịch mới
        </button>
      </div>

      {/* TOP ANALYTICS MINI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <VoucherStatCard label="Tổng Voucher" value={vouchers.length} trend="Tất cả chiến dịch" icon={Tag} color="from-purple-500 to-purple-600" />
        <VoucherStatCard label="Đang chạy" value={activeCount} trend="Voucher còn hạn" icon={TrendingUp} color="from-emerald-500 to-emerald-600" />
        <VoucherStatCard label="Lượt sử dụng" value={totalUsed} trend="Tổng lượt áp mã" icon={Users} color="from-blue-500 to-blue-600" />
        <VoucherStatCard label="Ngân sách đã dùng" value="Đang cập nhật" trend="Dữ liệu tạm tính" icon={Percent} color="from-orange-500 to-orange-600" />
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã khuyến mãi, tên chương trình..."
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* VOUCHERS GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-blue-500">
          <Loader2 className="animate-spin w-10 h-10" />
          <span className="ml-3 font-bold">Đang tải dữ liệu voucher...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 font-bold text-center">{error}</div>
      ) : filteredVouchers.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium">Không tìm thấy mã giảm giá nào phù hợp.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredVouchers.map((v) => (
            // 🎯 TRUYỀN HÀM SỬA VÀO ĐÂY
            <VoucherCard key={v.id} voucher={v} onEdit={handleOpenEditModal} />
          ))}
        </div>
      )}

      {/* 🎯 POPUP MODAL FORM XỊN MỊN NẰM Ở ĐÂY */}
      <VoucherFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedVoucher}
      />
    </div>
  );
}