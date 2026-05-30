import { useState, useEffect, useRef } from "react";
import { X, DollarSign, Plus, Trash2, Search, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { tourService } from "../../../services/tour/tour.service"; 

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TourSelectOption {
  id: number;
  name: string;
  tourCode?: string;
}

// Danh sách các loại đối tượng hành khách phổ biến trong hệ thống Tour
const PASSENGER_TYPES = [
  { value: "ADULT", label: "🧑 Người lớn (ADULT)" },
  { value: "CHILD", label: "🧒 Trẻ em (CHILD)" },
  { value: "INFANT", label: "👶 Em bé (INFANT)" },
];

export function CreateScheduleModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateScheduleModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Trạng thái tìm kiếm Tour
  const [tours, setTours] = useState<TourSelectOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTourName, setSelectedTourName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Khởi tạo trạng thái form
  const [formData, setFormData] = useState({
    tourId: "",
    departureLocation: "",
    departureDate: "",
    returnDate: "",
    maxSlots: 30,
    // Khởi tạo mặc định có sẵn Người lớn để đỡ phải bấm thêm
    pricings: [
      { passengerType: "ADULT", price: 0, currency: "VND" }
    ],
    surcharges: [] as { surchargeName: string; amount: number; isMandatory: boolean }[],
  });

  // Gọi API lấy danh sách Tour select list khi mở modal
  useEffect(() => {
    if (isOpen) {
      const fetchTourList = async () => {
        try {
          const response = await tourService.getTourSelectList();
          const data = response.result || response.data || response;
          if (Array.isArray(data)) {
            setTours(data);
          }
        } catch (error) {
          console.error("Lỗi lấy danh sách tour select-list:", error);
        }
      };
      fetchTourList();
    } else {
      // Reset form khi close modal
      setSearchQuery("");
      setSelectedTourName("");
      setIsDropdownOpen(false);
      setFormData({
        tourId: "",
        departureLocation: "",
        departureDate: "",
        returnDate: "",
        maxSlots: 30,
        pricings: [{ passengerType: "ADULT", price: 0, currency: "VND" }],
        surcharges: [],
      });
    }
  }, [isOpen]);

  // Click bên ngoài đóng dropdown search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Tự động map dữ liệu bảng giá mẫu từ Backend về (bất kể có bao nhiêu loại giá)
  const fetchAndApplyTemplatePrice = async (tourId: number) => {
    try {
      const response = await tourService.getPricingByTour(tourId);
      const pricingData = response.result;
      
      if (pricingData && pricingData.length > 0) {
        const templatePricings = pricingData.map((p: any) => ({
          passengerType: p.passengerType,
          price: p.price,
          currency: p.currency || "VND",
        }));
        setFormData((prev) => ({ ...prev, pricings: templatePricings }));
      }
    } catch (error) {
      console.error("Lỗi tự động lấy giá mẫu:", error);
    }
  };

  const handleSelectTour = (tour: TourSelectOption) => {
    setFormData((prev) => ({ ...prev, tourId: tour.id.toString() }));
    setSelectedTourName(tour.name);
    setSearchQuery("");
    setIsDropdownOpen(false);
    fetchAndApplyTemplatePrice(tour.id);
  };

  const filteredTours = tours.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.tourCode && t.tourCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    t.id.toString().includes(searchQuery)
  );

  // ================= XỬ LÝ MẢNG GIÁ ĐỘNG (PRICINGS) =================
  
  // Thêm một dòng cấu hình giá mới
  const handleAddPricing = () => {
    setFormData((prev) => ({
      ...prev,
      pricings: [
        ...prev.pricings,
        { passengerType: "CHILD", price: 0, currency: "VND" } // Mặc định gợi ý CHILD
      ]
    }));
  };

  // Xóa một dòng cấu hình giá
  const handleRemovePricing = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricings: prev.pricings.filter((_, i) => i !== index)
    }));
  };

  // Thay đổi thông tin (loại khách hoặc số tiền) trong mảng cấu hình giá
  const handlePricingFieldChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      pricings: prev.pricings.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // ================= XỬ LÝ PHỤ PHÍ (SURCHARGES) =================
  const handleAddSurcharge = () => {
    setFormData((prev) => ({
      ...prev,
      surcharges: [...prev.surcharges, { surchargeName: "", amount: 0, isMandatory: false }]
    }));
  };

  const handleRemoveSurcharge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      surcharges: prev.surcharges.filter((_, i) => i !== index)
    }));
  };

  const handleSurchargeChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      surcharges: prev.surcharges.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Submit form lên backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tourId) {
      alert("Vui lòng chọn một Tour từ danh sách!");
      return;
    }
    if (formData.pricings.length === 0) {
      alert("Vui lòng cấu hình ít nhất một loại giá tiền!");
      return;
    }
    setLoading(true);

    const payload = {
      tourId: Number(formData.tourId),
      departureLocation: formData.departureLocation,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      maxSlots: Number(formData.maxSlots),
      pricings: formData.pricings,
      surcharges: formData.surcharges,
    };

    try {
      const response = await tourService.createSchedule(payload);
      if (response) {
        onSuccess(); 
        onClose();   
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch trình:", error);
      alert("Tạo lịch khởi hành thất bại! Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-lg font-black tracking-tight">Tạo lịch khởi hành</h2>
          <button onClick={onClose} type="button" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* 🔍 Tìm kiếm chọn Tour */}
          <div className="space-y-1.5 relative" ref={dropdownRef}>
            <label className="text-sm font-semibold text-slate-700">Chọn Tour áp dụng lịch</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition select-none"
            >
              <span className={cn(selectedTourName ? "text-slate-900 font-medium" : "text-slate-400")}>
                {selectedTourName ? `[ID: ${formData.tourId}] - ${selectedTourName}` : "Nhấp để tìm và chọn Tour..."}
              </span>
              <ChevronDown size={16} className={cn("text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                  <Search size={14} className="text-slate-400 ml-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Gõ tên, mã hoặc ID tour để lọc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs py-1.5 outline-none text-slate-800"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1 py-1 custom-scrollbar">
                  {filteredTours.length > 0 ? (
                    filteredTours.map((tour) => (
                      <div
                        key={tour.id}
                        onClick={() => handleSelectTour(tour)}
                        className={cn(
                          "px-4 py-2 text-xs hover:bg-slate-50 cursor-pointer text-slate-700 transition flex flex-col gap-0.5",
                          formData.tourId === tour.id.toString() && "bg-slate-100 font-bold text-black"
                        )}
                      >
                        <span className="text-slate-900 font-medium line-clamp-1">{tour.name}</span>
                        <span className="text-[10px] text-slate-400">Mã ID: {tour.id} {tour.tourCode ? `| Code: ${tour.tourCode}` : ""}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-center text-slate-400">Không tìm thấy tour nào</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Nơi khởi hành */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Nơi khởi hành</label>
            <input
              required
              type="text"
              placeholder="Ví dụ: Đà Nẵng, Hà Nội..."
              value={formData.departureLocation}
              onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          {/* Ngày đi / Ngày về */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Ngày đi</label>
              <input
                required
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Ngày về</label>
              <input
                required
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
              />
            </div>
          </div>

          {/* Số chỗ tối đa */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Số chỗ tối đa</label>
            <input
              required
              type="number"
              min="1"
              value={formData.maxSlots}
              onChange={(e) => setFormData({ ...formData, maxSlots: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          <hr className="border-slate-100" />

          {/* 💰 KHU VỰC CẤU HÌNH GIÁ BIẾN ĐỘNG (Pricings) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <DollarSign size={16} className="text-emerald-500" />
                Cấu hình giá lịch trình
              </h3>
              <button
                type="button"
                onClick={handleAddPricing}
                className="text-xs text-black font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Thêm loại giá
              </button>
            </div>

            {formData.pricings.map((pricing, index) => (
              <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 animate-in fade-in duration-150">
                {/* Lựa chọn loại đối tượng hành khách */}
                <select
                  value={pricing.passengerType}
                  onChange={(e) => handlePricingFieldChange(index, "passengerType", e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-black"
                >
                  {PASSENGER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                  {/* Trường hợp backend trả về loại khách lạ nằm ngoài 3 loại trên */}
                  {!PASSENGER_TYPES.find(t => t.value === pricing.passengerType) && (
                    <option value={pricing.passengerType}>{pricing.passengerType}</option>
                  )}
                </select>

                {/* Nhập số tiền */}
                <div className="relative w-32">
                  <input
                    required
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Giá"
                    value={pricing.price || ""}
                    onChange={(e) => handlePricingFieldChange(index, "price", Number(e.target.value))}
                    className="w-full pl-2 pr-6 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-right outline-none focus:ring-1 focus:ring-black"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₫</span>
                </div>

                {/* Nút xóa dòng giá */}
                <button
                  type="button"
                  onClick={() => handleRemovePricing(index)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <hr className="border-slate-100" />

          {/* ➕ Khu vực cấu hình phụ phí tùy chọn (Surcharges) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800">Phụ phí phát sinh (Nếu có)</h3>
              <button
                type="button"
                onClick={handleAddSurcharge}
                className="text-xs text-black font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Thêm mục
              </button>
            </div>

            {formData.surcharges.map((surcharge, index) => (
              <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 animate-in fade-in duration-150">
                <input
                  required
                  type="text"
                  placeholder="Tên phụ phí (VD: Phòng đơn)"
                  value={surcharge.surchargeName}
                  onChange={(e) => handleSurchargeChange(index, "surchargeName", e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  required
                  type="number"
                  placeholder="Số tiền"
                  value={surcharge.amount || ""}
                  onChange={(e) => handleSurchargeChange(index, "amount", Number(e.target.value))}
                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSurcharge(index)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3 sticky bottom-0 bg-white border-t border-slate-50 mt-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl font-semibold border border-slate-200 hover:bg-slate-50 transition text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 py-3 rounded-2xl font-semibold text-white transition text-sm",
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:opacity-90"
              )}
            >
              {loading ? "Đang tạo lịch..." : "Xác nhận tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}