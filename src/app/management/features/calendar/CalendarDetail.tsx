import { useState, useEffect } from "react";
import { Clock, MapPin, Users, BadgeDollarSign, Calendar, Users2, Edit3, ArrowRight, ArrowLeft, User, Save, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ScheduleResponse, PricingConfigResponse } from "../../../services/tour/tour.types";
import { statusUI } from "./constants";
import { bookingService } from "../../../services/booking/booking.service";
// Thêm service quản lý tour/lịch trình của sếp vào đây để gọi API cập nhật nếu cần, ví dụ:
// import { tourService } from "../../../services/tour/tour.service";

interface CalendarDetailProps {
  selected: ScheduleResponse | null;
  onSaveSuccess?: () => void; 
}

interface Passenger {
  id: number | string;
  name?: string;       
  fullName?: string;   
  phone?: string;
  phoneNumber?: string;
  passengerType: "ADULT" | "CHILD" | string;
}

export function CalendarDetail({ selected, onSaveSuccess }: CalendarDetailProps) {
  // Chế độ xem: 'detail' (Chi tiết), 'members' (Danh sách đoàn), 'edit' (Sửa giá trực tiếp)
  const [viewMode, setViewMode] = useState<'detail' | 'members' | 'edit'>('detail');
  const [members, setMembers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(false);

  // 🌟 Các State phục vụ cho việc chỉnh sửa giá trực tiếp
  const [adultPrice, setAdultPrice] = useState<number>(0);
  const [childPrice, setChildPrice] = useState<number>(0);
  const [maxSlots, setMaxSlots] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Tự động đồng bộ dữ liệu khi sếp đổi lịch trình khác bên cạnh
  useEffect(() => {
    setViewMode('detail');
    setMembers([]);
    if (selected) {
      const adult = selected.pricings?.find((p) => p.passengerType === "ADULT")?.price || 0;
      const child = selected.pricings?.find((p) => p.passengerType === "CHILD")?.price || 0;
      setAdultPrice(adult);
      setChildPrice(child);
      setMaxSlots(selected.maxSlots || 0);
    }
  }, [selected]);

  // Hàm kích hoạt chế độ chỉnh sửa giá
  const handleStartEdit = () => {
    if (!selected) return;
    const adult = selected.pricings?.find((p) => p.passengerType === "ADULT")?.price || 0;
    const child = selected.pricings?.find((p) => p.passengerType === "CHILD")?.price || 0;
    setAdultPrice(adult);
    setChildPrice(child);
    setMaxSlots(selected.maxSlots || 0);
    setViewMode('edit');
  };

  // Hàm gọi API Lưu chỉnh sửa giá
  const handleSaveInline = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      // 🌟 SẾP ĐỔI ĐOẠN NÀY THÀNH API CỦA SẾP NHÉ 🌟
      // Ví dụ cấu trúc gửi lên backend:
      // const updateData = {
      //   maxSlots: maxSlots,
      //   pricings: [
      //     { passengerType: "ADULT", price: adultPrice },
      //     { passengerType: "CHILD", price: childPrice }
      //   ]
      // };
      // await tourService.updateSchedulePricing(selected.id, updateData);
      
      console.log("Đã lưu giá mới thành công:", { id: selected.id, adultPrice, childPrice, maxSlots });

      setViewMode('detail');
      onSaveSuccess?.(); // Kích hoạt hàm reload lại lịch ở bên ngoài màn hình chính
    } catch (error) {
      console.error("Lỗi khi cập nhật giá lịch trình:", error);
      alert("Không thể lưu giá mới, sếp kiểm tra lại API nhé!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadMembers = async () => {
    if (!selected) return;
    setViewMode('members');
    setLoading(true);
    try {
      const response = await bookingService.getPassengersBySchedule(selected.id);
      const data = response?.result ?? response;
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đoàn:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getAdultPrice = (pricings?: PricingConfigResponse[]): number | null => {
    if (!pricings) return null;
    const adult = pricings.find((p) => p.passengerType === "ADULT");
    return adult?.price || null;
  };

  // ================= TRẠNG THÁI TRỐNG =================
  if (!selected) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center py-12">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
          <Calendar size={20} className="text-slate-400" />
        </div>
        <p className="text-slate-400 text-sm font-medium">
          Chọn một lịch trình ở lịch bên cạnh để xem chi tiết
        </p>
      </div>
    );
  }

  // ================= MÀN HÌNH CHỈNH SỬA GIÁ TRỰC TIẾP (INLINE EDIT) =================
  if (viewMode === 'edit') {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[480px] overflow-hidden animate-in fade-in duration-200">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Header Form */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Edit3 size={16} className="text-blue-500" /> Chỉnh sửa nhanh lịch trình
              </h3>
              <button 
                onClick={() => setViewMode('detail')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-700 truncate mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
              {selected.tourName}
            </p>

            {/* Các trường nhập liệu */}
            <div className="space-y-3.5">
              {/* Giá Người Lớn */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Giá tour người lớn (₫)</label>
                <div className="relative">
                  <BadgeDollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    value={adultPrice}
                    onChange={(e) => setAdultPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-hidden transition"
                    placeholder="Nhập giá người lớn..."
                  />
                </div>
              </div>

              {/* Giá Trẻ Em */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Giá tour trẻ em (₫)</label>
                <div className="relative">
                  <BadgeDollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    value={childPrice}
                    onChange={(e) => setChildPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-hidden transition"
                    placeholder="Nhập giá trẻ em..."
                  />
                </div>
              </div>

              {/* Sức chứa tối đa */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Sức chứa tối đa (Chỗ)</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    value={maxSlots}
                    onChange={(e) => setMaxSlots(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-hidden transition"
                    placeholder="Ví dụ: 30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cụm nút Lưu / Hủy */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5 mt-4">
            <button 
              type="button"
              onClick={() => setViewMode('detail')}
              className="py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button 
              type="button"
              disabled={isSaving}
              onClick={handleSaveInline}
              className="py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={14} /> Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MÀN HÌNH 2: DANH SÁCH ĐOÀN =================
  if (viewMode === 'members') {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[480px] overflow-hidden">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <button 
              onClick={() => setViewMode('detail')}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-black mb-4 transition cursor-pointer w-fit"
            >
              <ArrowLeft size={14} /> Quay lại chi tiết
            </button>

            <h3 className="text-base font-black text-slate-800">Danh sách đoàn</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4 truncate">{selected.tourName}</p>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400">Đang tải danh sách đoàn...</p>
              </div>
            ) : members.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Lịch trình này hiện chưa có khách đặt chỗ.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1 invisible-scrollbar">
                {members.map((m, index) => (
                  <div key={m.id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                        <User size={14} />
                      </div>
                      <div className="truncate max-w-[130px]">
                        <p className="font-bold text-slate-700 truncate">{m.name || m.fullName || "Ẩn danh"}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{m.phone || m.phoneNumber || "Không có SĐT"}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md font-bold scale-90 tracking-wide text-[10px] uppercase shrink-0",
                      m.passengerType?.toUpperCase() === "ADULT" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                    )}>
                      {m.passengerType?.toUpperCase() === "ADULT" ? "Người lớn" : "Trẻ em"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              onClick={handleStartEdit}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs bg-white hover:bg-slate-50 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Edit3 size={14} />
              Chỉnh sửa giá lịch này
            </button>
          </div>
        </div>

        {/* Khối Footer cố định ở đáy, không dùng margin âm để tránh lỗi nuốt click chuột */}
        <div className="bg-slate-50 border-t border-slate-100 text-xs text-slate-500 font-bold p-4 flex justify-between items-center px-6">
          <span className="text-slate-400 font-medium">Trạng thái đoàn:</span>
          <span className="text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-2xs">
            {members.length} hành khách
          </span>
        </div>
      </div>
    );
  }

  // ================= MÀN HÌNH 1: CHI TIẾT LỊCH TRÌNH =================
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[480px] overflow-hidden">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* HEADER */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              {selected.scheduleCode || `ID: ${selected.id}`}
            </span>
            <div className={cn("px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r shadow-sm", statusUI[selected.status] || "from-slate-500 to-slate-400")}>
              {selected.status}
            </div>
          </div>

          {/* Tên Tour */}
          <h3 className="text-base font-black text-slate-800 mt-4 leading-snug">{selected.tourName}</h3>

          {/* Lộ trình */}
          <div className="mt-5 p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
            <div className="flex items-start gap-3 text-slate-600 text-sm">
              <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Điểm khởi hành</span>
                <span className="font-semibold text-slate-700">{selected.departureLocation}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-slate-600 text-sm">
              <Clock size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Thời gian hành trình</span>
                <span className="font-medium text-slate-700 flex items-center gap-1.5 flex-wrap">
                  {selected.departureDate} <ArrowRight size={12} className="text-slate-300" /> {selected.returnDate}
                </span>
              </div>
            </div>
          </div>

          {/* Sức chứa & Giá */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3.5 border border-slate-100 rounded-2xl bg-white shadow-2xs">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium"><Users size={14} className="text-blue-500" /> Sức chứa</span>
              <p className="text-sm font-bold text-slate-800 mt-1.5">{selected.availableSlots} <span className="text-xs text-slate-400 font-normal">/ {selected.maxSlots} trống</span></p>
            </div>
            <div className="p-3.5 border border-slate-100 rounded-2xl bg-white shadow-2xs">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium"><BadgeDollarSign size={14} className="text-emerald-500" /> Giá người lớn</span>
              <p className="text-sm font-bold text-emerald-600 mt-1.5">{getAdultPrice(selected.pricings)?.toLocaleString() || "---"} <span className="text-xs font-normal text-slate-400">₫</span></p>
            </div>
          </div>
        </div>

        {/* Nhóm nút bấm hành động */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
          <button 
            onClick={handleLoadMembers}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Users2 size={16} /> Xem danh sách đoàn
          </button>
          <button 
            onClick={handleStartEdit}
            className="w-full py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit3 size={16} /> Chỉnh sửa lịch
          </button>
        </div>
      </div>
    </div>
  );
}