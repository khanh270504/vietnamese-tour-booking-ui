import { useState, useEffect, useRef } from "react";
import { X, Search, ChevronDown, Loader2 } from "lucide-react";
import { TourCostRequest, TourCostResponse } from "../../../services/tourCost/tourCost.types";

// 🎯 IMPORT TOUR SERVICE ĐỂ GỌI API LOAD LỊCH TRÌNH
import { tourService } from "../../../services/tour/tour.service"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cost?: TourCostResponse | null;
  onSubmit: (data: TourCostRequest) => Promise<boolean>;
  tours?: { id: number; name: string }[];      
  providers?: { id: number; name: string }[];
}

// Hàm tiện ích nối class (Phòng trường hợp ông chưa import cn)
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// 🎯 COMPONENT DROPDOWN TÌM KIẾM CÓ HỖ TRỢ DISABLED VÀ LOADING
function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  isLoading = false
}: {
  label: string;
  options: { id: number; name: string }[];
  value: number;
  onChange: (val: number) => void;
  placeholder: string;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click ra ngoài thì tự đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
      <div
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm font-bold border border-transparent flex justify-between items-center transition-all",
          disabled ? "bg-slate-100 cursor-not-allowed opacity-60" : "bg-slate-50 hover:bg-slate-100 cursor-pointer"
        )}
      >
        <span className={selectedOption ? "text-slate-900 truncate pr-2" : "text-slate-400"}>
          {isLoading ? "Đang tải dữ liệu..." : (selectedOption ? selectedOption.name : placeholder)}
        </span>
        
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-blue-600" />
        ) : (
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-slate-50 bg-slate-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Gõ để tìm kiếm..."
                className="w-full pl-9 pr-3 py-2 bg-white rounded-lg text-xs font-bold outline-none border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    value === opt.id ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {opt.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-xs font-medium text-slate-400">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TourCostFormModal({ 
  isOpen, 
  onClose, 
  cost, 
  onSubmit, 
  tours = [], 
  providers = [] 
}: Props) {
  const [formData, setFormData] = useState<TourCostRequest>({
    scheduleId: 0,
    providerId: 0,
    expenseName: "",
    amount: 0,
    status: "UNPAID",
    note: "",
  });

  // 🎯 STATE QUẢN LÝ LỊCH TRÌNH
  const [selectedTourId, setSelectedTourId] = useState<number>(0);
  const [schedulesList, setSchedulesList] = useState<{ id: number; name: string }[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  // Đổ dữ liệu khi mở form Sửa/Thêm mới
  useEffect(() => {
    if (cost) {
      setFormData({
        scheduleId: cost.scheduleId,
        providerId: cost.providerId,
        expenseName: cost.expenseName,
        amount: cost.amount,
        status: cost.status,
        note: cost.note || "",
      });
      // Lưu ý: Thường lúc sửa mình chỉ có scheduleId, chưa có selectedTourId. 
      // Form sẽ vẫn hiển thị được lịch trình cũ nhờ SearchableSelect nếu ông load đủ data.
    } else {
      setFormData({ scheduleId: 0, providerId: 0, expenseName: "", amount: 0, status: "UNPAID", note: "" });
      setSelectedTourId(0);
      setSchedulesList([]);
    }
  }, [cost, isOpen]);

  // 🎯 GỌI API LOAD LỊCH TRÌNH KHI ĐỔI TOUR
  useEffect(() => {
    if (selectedTourId > 0) {
      const loadSchedules = async () => {
        setIsLoadingSchedules(true);
        try {
          // Gọi API lấy lịch trình theo Tour
          const response = await tourService.getSchedulesByTour(selectedTourId);
          
          // Tuỳ cấu trúc trả về của API, thông thường là response.result hoặc response.data
          const data = (response as any).result || (response as any).data || response;
          
          if (Array.isArray(data)) {
            const mapped = data.map((s: any) => ({
              id: s.id,
            name: `[${s.scheduleCode}] Đi: ${s.departureDate} (Còn ${s.availableSlots} chỗ)`}));
            setSchedulesList(mapped);
          } else {
            setSchedulesList([]);
          }
        } catch (error) {
          console.error("Lỗi load lịch trình:", error);
          setSchedulesList([]);
        } finally {
          setIsLoadingSchedules(false);
        }
      };

      loadSchedules();
      // Reset lịch trình khi chọn lại Tour khác (chỉ reset nếu đang tạo mới hoặc cố tình đổi tour)
      setFormData(prev => ({ ...prev, scheduleId: 0 }));
    } else {
      setSchedulesList([]);
    }
  }, [selectedTourId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate trước khi submit
    if (formData.scheduleId === 0 && !cost) {
      alert("Vui lòng chọn Lịch trình Tour!");
      return;
    }
    if (formData.providerId === 0) {
      alert("Vui lòng chọn Nhà cung cấp!");
      return;
    }

    const success = await onSubmit(formData);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-[500px] bg-white rounded-[2rem] shadow-2xl overflow-visible animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">{cost ? "Sửa phiếu chi" : "Tạo phiếu chi mới"}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Tên khoản chi</label>
            <input required type="text" value={formData.expenseName} onChange={e => setFormData({...formData, expenseName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent transition-all" placeholder="VD: Thuê xe 45 chỗ..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Số tiền (VNĐ)</label>
              <input required type="number" min="0" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent transition-all" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Trạng thái</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent transition-all">
                <option value="UNPAID">Chưa thanh toán</option>
                <option value="PARTIAL">Thanh toán 1 phần</option>
                <option value="PAID">Đã thanh toán</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
            {/* 🎯 BƯỚC 1: CHỌN TOUR ĐỂ LOAD LỊCH TRÌNH */}
            <SearchableSelect 
              label="1. Chọn Tour du lịch"
              placeholder="-- Tìm và chọn Tour --"
              options={tours}
              value={selectedTourId}
              onChange={(id) => setSelectedTourId(id)}
            />

            {/* 🎯 BƯỚC 2: CHỌN LỊCH TRÌNH ĐÃ ĐƯỢC LOAD */}
            <SearchableSelect 
              label="2. Chọn Lịch trình cụ thể"
              placeholder={selectedTourId === 0 && !cost ? "Vui lòng chọn Tour ở trên trước" : "-- Chọn Lịch trình --"}
              options={schedulesList}
              value={formData.scheduleId}
              onChange={(id) => setFormData({...formData, scheduleId: id})}
              disabled={selectedTourId === 0 && schedulesList.length === 0} // Khoá lại nếu chưa có data
              isLoading={isLoadingSchedules}
            />
          </div>

          <SearchableSelect 
            label="Nhà cung cấp dịch vụ"
            placeholder="-- Tìm và chọn NCC --"
            options={providers}
            value={formData.providerId}
            onChange={(id) => setFormData({...formData, providerId: id})}
          />

          <button type="submit" className="w-full py-3.5 mt-2 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95">
            {cost ? "Cập nhật phiếu chi" : "Lưu phiếu chi"}
          </button>
        </form>
      </div>
    </div>
  );
}