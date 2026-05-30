import { useState } from "react";
import { Search, Filter, CheckCircle, Clock, XCircle, AlertCircle, ChevronDown, ChevronUp, Eye, DollarSign, Calendar } from "lucide-react";

interface BookingFilterBarProps {
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  filterStatus: "confirmed" | "pending" | "processing" | "cancelled" | "";
  setFilterStatus: (status: "confirmed" | "pending" | "processing" | "cancelled" | "") => void;
  paymentStatus: "paid" | "partial" | "unpaid" | "";
  setPaymentStatus: (val: "paid" | "partial" | "unpaid" | "") => void;
  dateFrom: string;
  setDateFrom: (val: string) => void;
  dateTo: string;
  setDateTo: (val: string) => void;
}

export function BookingFilterBar({
  searchKeyword,
  setSearchKeyword,
  filterStatus,
  setFilterStatus,
  paymentStatus,
  setPaymentStatus,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: BookingFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFiltersCount =
    (paymentStatus ? 1 : 0) +
    (dateFrom || dateTo ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* THANH CHÍNH: TÌM KIẾM + TAB TRẠNG THÁI + NÚT LỌC NÂNG CAO */}
      <div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        
        {/* Hộp Tìm Kiếm */}
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên khách, số điện thoại..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Tab Trạng Thái & Nút Bấm */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 overflow-x-auto hide-scrollbar">
            <button
              type="button"
              onClick={() => setFilterStatus("")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterStatus === "" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye size={14} /> Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("pending")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterStatus === "pending" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock size={14} /> Chờ duyệt
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("processing")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterStatus === "processing" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AlertCircle size={14} /> Đang xử lý
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("confirmed")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterStatus === "confirmed" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle size={14} /> Đã xác nhận
            </button>
             <button
              type="button"
              onClick={() => setFilterStatus("cancelled")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                filterStatus === "cancelled" ? "bg-white text-rose-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <XCircle size={14} /> Đã hủy
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
            <span className="hidden sm:inline">Lọc nâng cao</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
                {activeFiltersCount}
              </span>
            )}
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* PANEL LỌC NÂNG CAO */}
      {showAdvanced && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
          
          {/* Lọc Trạng Thái Thanh Toán */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign size={14} className="text-slate-400" /> Trạng thái thanh toán
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            >
              <option value="">-- Tất cả --</option>
              <option value="paid">Đã thanh toán (Full)</option>
              <option value="partial">Thanh toán một phần</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>
          </div>

          {/* Khoảng Thời Gian */}
           <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={14} className="text-slate-400" /> Khởi hành từ ngày
            </label>
             <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              />
          </div>

           <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={14} className="text-slate-400" /> Đến ngày
            </label>
             <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              />
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="md:col-span-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setPaymentStatus("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="text-xs font-black text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
              >
                Xóa bộ lọc nâng cao
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}