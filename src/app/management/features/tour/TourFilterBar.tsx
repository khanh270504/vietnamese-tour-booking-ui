import { useState } from "react";
import { Search, Filter, CheckCircle, Trash2, Eye, ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface TourFilterBarProps {
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  filterStatus: "ACTIVE" | "INACTIVE" | "";
  setFilterStatus: (status: "ACTIVE" | "INACTIVE" | "") => void;
  selectedDestination: string;
  setSelectedDestination: (val: string) => void;
  destinations: any[]; 
}

export function TourFilterBar({
  searchKeyword,
  setSearchKeyword,
  filterStatus,
  setFilterStatus,
  selectedDestination,
  setSelectedDestination,
  destinations,
}: TourFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Tính số lượng bộ lọc đang được áp dụng
  const activeFiltersCount = selectedDestination ? 1 : 0;

  return (
    <div className="space-y-4">
      {/* THANH CHÍNH */}
      <div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã tour..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setFilterStatus("ACTIVE")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                filterStatus === "ACTIVE" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle size={14} /> Hoạt động
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("INACTIVE")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                filterStatus === "INACTIVE" ? "bg-white text-red-500 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Trash2 size={14} /> Kho lưu trữ
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                filterStatus === "" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye size={14} /> Tất cả
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm ${
              showAdvanced || activeFiltersCount > 0
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter size={14} strokeWidth={2.5} />
            <span>Lọc nâng cao</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
                {activeFiltersCount}
              </span>
            )}
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* PANEL LỌC NÂNG CAO CỦA TOUR GỐC (CHỈ CÓ ĐIỂM ĐẾN) */}
      {showAdvanced && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={14} className="text-slate-400" /> Lọc theo điểm đến
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            >
              <option value="">-- Tất cả điểm đến --</option>
              {destinations.map((dest: any) => (
                <option key={dest.id} value={dest.name}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <div className="md:col-span-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDestination("")}
                className="text-xs font-black text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}