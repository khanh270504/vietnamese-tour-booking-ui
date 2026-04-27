import { useState, useEffect } from "react";
import { Filter, MapPin, DollarSign, Calendar, RotateCcw, Check, PlaneTakeoff } from "lucide-react";
import { useSearchParams } from "react-router-dom"; // 🎯 Thêm hook này để thao tác URL

interface TourFilterProps {
  currentFilters: any;
  onFilterChange: (filters: any) => void;
  destinations?: { id: number; name: string }[];
}

export function TourFilter({ currentFilters, onFilterChange, destinations = [] }: TourFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. State nội bộ
  const [localFilters, setLocalFilters] = useState({
    destinationIds: currentFilters.destinationIds || [],
    departureLocations: currentFilters.departureLocations || [],
    minPrice: currentFilters.minPrice || 0,
    maxPrice: currentFilters.maxPrice || 30000000,
    fromDate: currentFilters.fromDate || "",
  });

  // Đồng bộ lại localFilters nếu currentFilters từ Component cha thay đổi 
  // (ví dụ khi khách bấm Back/Forward trên trình duyệt)
  useEffect(() => {
    setLocalFilters({
      destinationIds: currentFilters.destinationIds || [],
      departureLocations: currentFilters.departureLocations || [],
      minPrice: currentFilters.minPrice || 0,
      maxPrice: currentFilters.maxPrice || 30000000,
      fromDate: currentFilters.fromDate || "",
    });
  }, [currentFilters]);

  // 2. Hàm "Chốt hạ" - Đẩy lên URL và gọi API
  const handleApplyFilters = () => {
    // Lấy params hiện tại (để giữ lại keyword nếu có)
    const params = new URLSearchParams(searchParams);

    // Xử lý Điểm đến
    if (localFilters.destinationIds.length > 0) {
      params.set("destinationIds", localFilters.destinationIds.join(","));
    } else {
      params.delete("destinationIds"); // Xóa khỏi URL cho sạch nếu mảng rỗng
    }

    // Xử lý Nơi khởi hành
    if (localFilters.departureLocations.length > 0) {
      params.set("departureLocations", localFilters.departureLocations.join(","));
    } else {
      params.delete("departureLocations");
    }

    // Xử lý Giá
    if (localFilters.maxPrice < 30000000) {
      params.set("maxPrice", localFilters.maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }

    // Xử lý Ngày
    if (localFilters.fromDate) {
      params.set("fromDate", localFilters.fromDate);
    } else {
      params.delete("fromDate");
    }

    // Cập nhật lên thanh địa chỉ
    setSearchParams(params);

    // Gọi API thông qua component cha
    onFilterChange(localFilters);
  };

  const toggleListFilter = (field: string, value: any) => {
    setLocalFilters((prev: any) => {
      const currentList = prev[field] || [];
      const newList = currentList.includes(value)
        ? currentList.filter((item: any) => item !== value)
        : [...currentList, value];
      return { ...prev, [field]: newList };
    });
  };

  const handleReset = () => {
    const defaultFilters = {
      destinationIds: [],
      departureLocations: [],
      minPrice: 0,
      maxPrice: 30000000,
      fromDate: "",
    };
    
    setLocalFilters(defaultFilters);
    
    // Dọn dẹp URL, chỉ giữ lại keyword (nếu có)
    const params = new URLSearchParams(searchParams);
    params.delete("destinationIds");
    params.delete("departureLocations");
    params.delete("maxPrice");
    params.delete("fromDate");
    setSearchParams(params);

    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24 space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
        <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-sm tracking-tighter">
          <Filter size={18} /> Bộ lọc tìm kiếm
        </div>
        <button onClick={handleReset} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase">
          <RotateCcw size={14} /> Làm mới
        </button>
      </div>

      {/* 1. ĐIỂM ĐẾN (Multi-select) */}
      <section>
        <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase mb-4">
          <MapPin size={14} /> Điểm đến yêu thích
        </label>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {destinations.map((dest) => {
            const isSelected = localFilters.destinationIds.includes(dest.id);
            return (
              <label key={dest.id} className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                <div 
                  onClick={() => toggleListFilter("destinationIds", dest.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected ? "bg-blue-600 border-blue-600" : "border-gray-200"
                  }`}
                >
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-bold ${isSelected ? "text-blue-700" : "text-gray-600"}`}>
                  {dest.name}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* 2. NƠI KHỞI HÀNH (Multi-select) */}
      <section>
        <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase mb-4">
          <PlaneTakeoff size={14} /> Điểm khởi hành
        </label>
        <div className="flex flex-wrap gap-2">
          {["Hà Nội", "TP. HCM", "Đà Nẵng", "Cần Thơ"].map((loc) => {
            const isSelected = localFilters.departureLocations.includes(loc);
            return (
              <button
                key={loc}
                onClick={() => toggleListFilter("departureLocations", loc)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${
                  isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. NGÂN SÁCH */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase">
            <DollarSign size={14} /> Ngân sách tối đa
          </label>
          <span className="text-xs font-black text-blue-600">
            {(localFilters.maxPrice / 1000000).toFixed(0)} Triệu
          </span>
        </div>
        <input 
          type="range" min="1000000" max="50000000" step="1000000"
          value={localFilters.maxPrice}
          onChange={(e) => setLocalFilters({...localFilters, maxPrice: Number(e.target.value)})}
          className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </section>

      {/* 4. NGÀY KHỞI HÀNH */}
      <section>
        <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase mb-4">
          <Calendar size={14} /> Ngày đi từ
        </label>
        <input 
          type="date" 
          value={localFilters.fromDate}
          onChange={(e) => setLocalFilters({...localFilters, fromDate: e.target.value})}
          className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100" 
        />
      </section>

      {/* --- NÚT BẤM CHỐT HẠ --- */}
      <button 
        onClick={handleApplyFilters}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
      >
        Áp dụng bộ lọc
      </button>

    </div>
  );
}