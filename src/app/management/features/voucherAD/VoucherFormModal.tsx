import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Search, Check } from "lucide-react";
import { Voucher, VoucherCreateRequest } from "../../../services/voucher/voucher.types";
import { tourService } from "../../../services/tour/tour.service"; // 🎯 Đã đổi sang tourService viết thường
import { cn } from "../../../lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VoucherCreateRequest) => Promise<boolean>;
  initialData?: Voucher | null;
}

export function VoucherFormModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quản lý danh sách tour lấy từ database (id, name)
  const [tours, setTours] = useState<{ id: number; name: string }[]>([]);

  // --- STATE QUẢN LÝ Ô TÌM KIẾM TOUR CUSTOM ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tourSearch, setTourSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<VoucherCreateRequest>({
    title: "",
    description: "",
    code: "",
    discountType: "PERCENT",
    discountValue: 0,
    maxDiscountAmount: null,
    minOrderValue: 0,
    maxUsage: 100,
    maxUsagePerUser: 1,
    startDate: "",
    expiryDate: "",
    isActive: true,
    tourId: null,
  });

  // Tự động đóng dropdown khi click ra ngoài vùng chọn
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 Gọi API và bóc tách ăn thẳng vào .result từ ApiResponse chuẩn của sếp
  useEffect(() => {
    const loadTours = async () => {
      try {
        const response = await tourService.getTourSelectList();
        
        if (response && response.result) {
          setTours(response.result); // Đổ mảng [ {id: 15, name: "Đà Lạt..."}, ... ]
        } else {
          setTours(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        console.error("Không thể tải danh sách tour", err);
      }
    };
    if (isOpen) loadTours();
  }, [isOpen]);

  // Đổ dữ liệu cũ vào form khi sửa hoặc reset khi tạo mới
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        code: initialData.code,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        maxDiscountAmount: initialData.maxDiscountAmount,
        minOrderValue: initialData.minOrderValue,
        maxUsage: initialData.maxUsage,
        maxUsagePerUser: initialData.maxUsagePerUser,
        startDate: initialData.startDate ? initialData.startDate.split("T")[0] : "",
        expiryDate: initialData.expiryDate ? initialData.expiryDate.split("T")[0] : "",
        isActive: initialData.isActive,
        tourId: initialData.tourId,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        code: "",
        discountType: "PERCENT",
        discountValue: 0,
        maxDiscountAmount: null,
        minOrderValue: 0,
        maxUsage: 100,
        maxUsagePerUser: 1,
        startDate: "",
        expiryDate: "",
        isActive: true,
        tourId: null,
      });
    }
    setTourSearch("");
    setIsDropdownOpen(false);
    setError(null);
  }, [initialData, isOpen]);

  // Lọc danh sách tour theo thời gian thực (gõ tên hoặc gõ ID)
  const filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().includes(tourSearch.toLowerCase()) ||
    tour.id.toString().includes(tourSearch)
  );

  // Tìm tên tour hiện tại đang được chọn để hiển thị lên thanh bấm
  const selectedTourTitle = formData.tourId
    ? tours.find((t) => t.id === formData.tourId)?.name
    : "✨ Áp dụng cho tất cả các Tour (Toàn hệ thống)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        code: formData.code.toUpperCase().trim(),
      };
      const success = await onSubmit(formattedData);
      if (success) onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? "Cập nhật Chiến dịch" : "Tạo Chiến dịch Ưu đãi"}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Cấu hình mã khuyến mãi kích cầu tour ế</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-all">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 text-sm font-bold text-slate-700">
          {error && <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl border border-rose-100 text-center font-bold">{error}</div>}

          {/* Tên chương trình */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Tên chương trình ưu đãi <span className="text-rose-500">*</span></label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Kích cầu Tour hè Sapa tuần này"
              className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Mã CODE & Loại ưu đãi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Mã CODE giảm giá <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                disabled={!!initialData}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="VD: SAPA15OFF"
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all uppercase disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Loại hình ưu đãi</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "PERCENT" | "FIXED" })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              >
                <option value="PERCENT">Giảm theo phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định (₫)</option>
              </select>
            </div>
          </div>

          {/* Mức giảm & Giảm tối đa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Giá trị giảm <span className="text-rose-500">*</span></label>
              <input
                type="number"
                required
                min={1}
                value={formData.discountValue || ""}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                placeholder={formData.discountType === "PERCENT" ? "VD: 15 (%)" : "VD: 300000 (₫)"}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Giảm tối đa (Bỏ trống = Không giới hạn)</label>
              <input
                type="number"
                disabled={formData.discountType === "FIXED"}
                value={formData.maxDiscountAmount || ""}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value ? Number(e.target.value) : null })}
                placeholder="VD: 200000 (₫)"
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:opacity-40"
              />
            </div>
          </div>

          {/* Điều kiện đơn hàng & Giới hạn sử dụng */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Đơn hàng tối thiểu</label>
              <input
                type="number"
                min={0}
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Tổng lượt phát hành</label>
              <input
                type="number"
                min={1}
                required
                value={formData.maxUsage}
                onChange={(e) => setFormData({ ...formData, maxUsage: Number(e.target.value) })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Lượt dùng / Khách</label>
              <input
                type="number"
                min={1}
                required
                value={formData.maxUsagePerUser}
                onChange={(e) => setFormData({ ...formData, maxUsagePerUser: Number(e.target.value) })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Thời hạn chạy chiến dịch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Ngày hết hạn <span className="text-rose-500">*</span></label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mô tả ngắn */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Mô tả hiển thị khi áp mã</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="VD: Áp dụng giảm giá đặc biệt cho dòng Tour chạy KPI tuần này..."
              className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* SEARCHABLE DROPDOWN - CHUẨN TOUR.NAME THEO ĐÚNG BACKEND */}
          <div className="space-y-2" ref={dropdownRef}>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Phạm vi áp dụng (Tìm chọn Tour ế để kích cầu)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-left font-bold text-slate-800 text-sm flex items-center justify-between focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
              >
                <span className="truncate pr-4">{selectedTourTitle}</span>
                <ChevronDown size={18} className={cn("text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-3 space-y-3 flex flex-col max-h-64 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={tourSearch}
                      onChange={(e) => setTourSearch(e.target.value)}
                      placeholder="Gõ mã ID hoặc tên tour cần tìm..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="overflow-y-auto flex-1 space-y-1 pr-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, tourId: null });
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between",
                        formData.tourId === null && "bg-blue-50/50 text-blue-600 hover:bg-blue-50"
                      )}
                    >
                      <span>✨ Tất cả các Tour (Toàn hệ thống)</span>
                      {formData.tourId === null && <Check size={14} strokeWidth={3} />}
                    </button>

                    {filteredTours.length === 0 ? (
                      <div className="text-center py-4 text-slate-400 font-medium italic">Không tìm thấy tour nào hợp lệ.</div>
                    ) : (
                      filteredTours.map((tour) => (
                        <button
                          key={tour.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, tourId: tour.id });
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between gap-2",
                            formData.tourId === tour.id && "bg-blue-50/50 text-blue-600 hover:bg-blue-50"
                          )}
                        >
                          <span className="truncate">🎯 [ID: {tour.id}] — {tour.name}</span>
                          {formData.tourId === tour.id && <Check size={14} strokeWidth={3} />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trạng thái kích hoạt */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div>
              <p className="text-xs text-slate-800">Kích hoạt chiến dịch ngay lập tức</p>
              <p className="text-[10px] text-slate-400 font-medium">Nếu tắt, khách hàng sẽ không thể nhập mã này khi thanh toán tour</p>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">Hủy bỏ</button>
            <button type="submit" disabled={loading} className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
              {loading ? "Đang xử lý..." : initialData ? "Lưu thay đổi" : "Tạo chiến dịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}