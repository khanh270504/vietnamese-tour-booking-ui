import { useState, useEffect, useMemo, useRef } from "react";
import { X, UserPlus, Trash2, Search, Map, Calendar, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "./../../../services/api"; // Dùng instance api giống bên user của bạn
import { bookingService } from "./../../../services/booking/booking.service";
import { tourService } from "./../../../services/tour/tour.service";
import { VoucherService } from "./../../../services/voucher/voucher.service";
import { PricingConfigResponse } from "../../../services/tour/tour.types";
import { crmService } from "../../../services/crm/crm.service";

interface BookingCreateModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialLeadId?: number | null;
}

interface PassengerForm {
  id: number;
  fullName: string;
  birthDate: string;
  gender: string;
  passengerType: "ADULT" | "CHILD";
}

export function BookingCreateModal({ onClose, onSuccess, initialLeadId}: BookingCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // === DATA TỪ API ===
  const [tourList, setTourList] = useState<any[]>([]);
  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [voucherList, setVoucherList] = useState<any[]>([]);

  // === STATE CUSTOM DROPDOWN (TOUR) ===
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourSearch, setTourSearch] = useState("");
  const [selectedTour, setSelectedTour] = useState<any>(null);

  // === STATE CUSTOM DROPDOWN (SCHEDULE) ===
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  // === STATE CUSTOM DROPDOWN (VOUCHER) ===
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [voucherSearch, setVoucherSearch] = useState("");

  // === LOGIC QUẢN LÝ ĐƠN HÀNG (MÔ PHỎNG THEO HOOK USER) ===
  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { id: Date.now(), fullName: "", birthDate: "", gender: "MALE", passengerType: "ADULT" },
  ]);
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState({ fullName: "", phone: "", email: "" });

  const tourRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const voucherRef = useRef<HTMLDivElement>(null);

  // Hàm định dạng hiển thị tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const { adultPrice, childPrice } = useMemo(() => {
    if (!selectedSchedule || !selectedSchedule.pricings) {
      return { adultPrice: 0, childPrice: 0 };
    }
    
    const adultConfig = selectedSchedule.pricings.find((p: PricingConfigResponse) => p.passengerType === "ADULT");
    const childConfig = selectedSchedule.pricings.find((p: PricingConfigResponse) => p.passengerType === "CHILD");

    return {
      adultPrice: adultConfig ? adultConfig.price : 0,
      childPrice: childConfig ? childConfig.price : 0,
    };
  }, [selectedSchedule]);

  // Tính tổng tiền tự động (useMemo giống hệt bên User)
  const totalPrice = useMemo(() => {
    return passengers.reduce((sum, p) => {
      return sum + (p.passengerType === "ADULT" ? adultPrice : childPrice);
    }, 0);
  }, [passengers, adultPrice, childPrice]);

  const finalPrice = Math.max(0, totalPrice - discount);

  // Tự động reset voucher khi tổng tiền thay đổi (useEffect thần thánh bên user)
  useEffect(() => {
    if (discount > 0) {
      setDiscount(0);
      setVoucherSearch("");
      toast.info("Tổng chi phí thay đổi, vui lòng áp dụng lại mã giảm giá nếu có!");
    }
  }, [totalPrice]);
  useEffect(() => {
    const fetchInitialDataAndLead = async () => {
      setIsLoading(true);
      try {
        // 1. Tải danh sách Tour và Voucher trước
        const [toursRes, vouchersRes] = await Promise.all([
          tourService.getAllToursForAdmin(),
          VoucherService.getAllVouchers()
        ]);
        
        const tours = toursRes.result || (toursRes as any).data || [];
        setTourList(tours);
        setVoucherList(vouchersRes.data || (vouchersRes as any).data || []);

        // 2. NẾU CÓ TRUYỀN LEAD ID TỪ CRM SANG -> Gọi API lấy thông tin điền tự động
        if (initialLeadId) {
          const leadRes = await crmService.getLeadById(initialLeadId);
          const leadData = leadRes.result || (leadRes as any).data;

          if (leadData) {
            // Điền Thông tin liên hệ
            setContact({
              fullName: leadData.fullName || "",
              phone: leadData.phone || "",
              email: leadData.email || ""
            });

            // Tự động tìm và chọn Tour nếu khách đã chọn Tour ở CRM
            if (leadData.interestedTourId) {
              const matchedTour = tours.find((t: any) => t.id === leadData.interestedTourId);
              if (matchedTour) {
                setSelectedTour(matchedTour);
                setTourSearch(matchedTour.name);
              }
            }

            // Gợi ý ghi chú từ CRM
            if (leadData.notes) {
              setNote(`[CRM Ghi chú]: ${leadData.notes}`);
            }

            toast.info(`Tự động điền thông tin của khách hàng: ${leadData.fullName}`, { duration: 3000 });
          }
        }
      } catch (error) {
        toast.error("Lỗi tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialDataAndLead();
  }, [initialLeadId]);
  // Tải dữ liệu ban đầu cho Admin
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [toursRes, vouchersRes] = await Promise.all([
          tourService.getAllToursForAdmin(),
          VoucherService.getAllVouchers()
        ]);
        setTourList(toursRes.result || (toursRes as any).data || []);
        setVoucherList(vouchersRes.data || (vouchersRes as any).data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách Tour & Voucher");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Tải Lịch trình khi chọn Tour mới
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedTour) {
        setScheduleList([]);
        setSelectedSchedule(null);
        setScheduleSearch("");
        return;
      }
      try {
        const res = await tourService.getSchedulesByTour(selectedTour.id);
        setScheduleList(res.result || (res as any).data || []);
      } catch (error) {
        toast.error("Không thể tải lịch trình của Tour này");
        setScheduleList([]);
      }
    };
    fetchSchedules();
  }, [selectedTour]);

  // Click ra ngoài tự đóng Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tourRef.current && !tourRef.current.contains(event.target as Node)) setIsTourOpen(false);
      if (scheduleRef.current && !scheduleRef.current.contains(event.target as Node)) setIsScheduleOpen(false);
      if (voucherRef.current && !voucherRef.current.contains(event.target as Node)) setIsVoucherOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === CÁC HÀM XỬ LÝ HÀNH KHÁCH (THEO ID GIỐNG USER HOOK) ===
  const addPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), fullName: "", birthDate: "", gender: "MALE", passengerType: "ADULT" },
    ]);
  };

  const removePassenger = (id: number) => {
    if (passengers.length <= 1) {
      toast.error("Phải có ít nhất 1 hành khách!");
      return;
    }
    setPassengers((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePassenger = (id: number, field: keyof PassengerForm, value: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // === HÀM APPLY VOUCHER TỪ API QUAN TRỌNG CỦA BẠN ===
  const handleApplyVoucher = async (codeStr: string) => {
    if (!codeStr.trim()) return;
    try {
      const payload = {
        code: codeStr.toUpperCase(),
        orderTotal: totalPrice,
        tourId: selectedTour?.id || null,
      };

      const res = await api.post("/api/v1/vouchers/public/apply", payload);
      const result = res.data.result || res.data;
      
      setDiscount(result.discountAmount);
      setVoucherSearch(codeStr.toUpperCase());
      toast.success(`Áp dụng thành công! Giảm ${formatCurrency(result.discountAmount)}`);
    } catch (error: any) {
      setDiscount(0);
      const msg = error.response?.data?.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn!";
      toast.error(msg);
    }
  };

  const removeVoucher = () => {
    setDiscount(0);
    setVoucherSearch("");
    toast.success("Đã xóa mã giảm giá");
  };

  // === BỘ LỌC TÌM KIẾM CHO DROPDOWN ===
  const filteredTours = tourList.filter(t => t.name?.toLowerCase().includes(selectedTour ? "" : tourSearch.toLowerCase()));
  const filteredSchedules = scheduleList.filter(s => s.departureDate?.toLowerCase().includes(selectedSchedule ? "" : scheduleSearch.toLowerCase()));
  const filteredVouchers = voucherList.filter(v => v.code?.toLowerCase().includes(voucherSearch.toLowerCase()));

  // Submit đơn hàng kèm TOAST VALIDATE siêu chi tiết
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Chọn Tour & Lịch trình trước
    if (!selectedTour) {
      toast.error("Vui lòng chọn một Tour trong danh sách!");
      return;
    }
    if (!selectedSchedule?.id) {
      toast.error("Vui lòng chọn lịch trình khởi hành cho Tour này!");
      return;
    }

    // 2. Validate Thông tin liên hệ (Contact Info)
    if (!contact.fullName.trim()) {
      toast.error("Người liên hệ không được để trống họ tên!");
      return;
    }

    // Validate Số điện thoại (Đơn giản: chỉ chứa số, dài từ 10-11 ký tự)
    const phoneTrimmed = contact.phone.trim();
    if (!phoneTrimmed) {
      toast.error("Vui lòng nhập số điện thoại người liên hệ!");
      return;
    } else if (!/^\d{10,11}$/.test(phoneTrimmed)) {
      toast.error("Số điện thoại không hợp lệ! Phải bao gồm từ 10 đến 11 chữ số.");
      return;
    }

    // Validate Định dạng Email
    const emailTrimmed = contact.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      toast.error("Vui lòng nhập Email người liên hệ!");
      return;
    } else if (!emailRegex.test(emailTrimmed)) {
      toast.error("Định dạng Email người liên hệ không chính xác (vd: abc@gmail.com)!");
      return;
    }

    // 3. Validate Danh sách hành khách (Passengers)
    if (passengers.length === 0) {
      toast.error("Đơn hàng phải có ít nhất 1 hành khách!");
      return;
    }

    // Vòng lặp check từng hành khách một
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      const passengerIndexText = `Hành khách số ${i + 1}`;

      if (!passenger.fullName.trim()) {
        toast.error(`${passengerIndexText}: Chưa nhập họ và tên!`);
        return;
      }
      if (!passenger.birthDate) {
        toast.error(`${passengerIndexText}: Chưa chọn ngày tháng năm sinh!`);
        return;
      }
    }

    // === NẾU VƯỢT QUA TẤT CẢ BIỆN PHÁP CHECK TRÊN THÌ MỚI GỬI API ===
    setIsSubmitting(true);
    try {
      const payload = {
        scheduleId: Number(selectedSchedule.id),
        contactInfo: {
          fullName: contact.fullName.trim(),
          phone: phoneTrimmed,
          email: emailTrimmed
        },
        passengers: passengers.map(({ id, ...rest }) => ({
          ...rest,
          fullName: rest.fullName.trim()
        })), // Loại bỏ ID tạm trước khi gửi lên API và trim tên
        note: note.trim(),
        voucherCode: voucherSearch.trim() || undefined
      };

      const res = await bookingService.createBooking(payload);
      if (res) {
        toast.success("Tạo đơn hàng thành công!");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      const apiMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(apiMessage ? `Thất bại: ${apiMessage}` : "Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
          <h2 className="text-xl font-black text-slate-900">Tạo Đơn Hàng Mới (Admin)</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors shadow-sm">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* BODY */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="font-bold text-slate-400">Đang tải dữ liệu Tour hệ thống...</p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-8 flex-1 hide-scrollbar">
            
            {/* 1. LIÊN HỆ */}
            <section>
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">1. Người đặt / Liên hệ</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Họ và tên *</label>
                  <input type="text" value={contact.fullName} onChange={e => setContact({...contact, fullName: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập họ tên..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Số điện thoại *</label>
                  <input type="text" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="09xx..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Email *</label>
                  <input type="text" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@..." />
                </div>
              </div>
            </section>

            {/* 2. DỊCH VỤ */}
            <section>
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">2. Thông tin Dịch vụ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 2.1 Chọn Tour */}
                <div className="relative md:col-span-2" ref={tourRef}>
                  <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Map size={14}/> Chọn Tour *
                  </label>
                  <div className="flex items-center w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Search size={18} className="text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      value={tourSearch}
                      onChange={e => { setTourSearch(e.target.value); setSelectedTour(null); setIsTourOpen(true); }}
                      onClick={() => setIsTourOpen(true)}
                      className="bg-transparent outline-none w-full placeholder:text-slate-400 font-bold"
                      placeholder="Gõ để tìm kiếm tên Tour..."
                    />
                    {tourSearch && (
                      <button type="button" onClick={() => { setTourSearch(""); setSelectedTour(null); }} className="ml-2 text-slate-400 hover:text-rose-500">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {isTourOpen && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                      {filteredTours.length > 0 ? filteredTours.map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => { setSelectedTour(t); setTourSearch(t.name); setIsTourOpen(false); }}
                          className="p-3 hover:bg-blue-50 cursor-pointer text-sm font-bold text-slate-700 border-b border-slate-100 last:border-0"
                        >
                          {t.name}
                        </div>
                      )) : <div className="p-4 text-center text-sm font-bold text-slate-400">Không tìm thấy Tour nào!</div>}
                    </div>
                  )}
                </div>

                {/* 2.2 Chọn Lịch trình Dropdown */}
                <div className="relative" ref={scheduleRef}>
                  <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar size={14}/> Lịch trình khởi hành *
                  </label>
                  <div className={`flex items-center w-full p-3 border rounded-xl text-sm font-bold focus-within:ring-2 focus-within:ring-blue-500 transition-all ${!selectedTour ? "bg-slate-100/70 border-slate-200 cursor-not-allowed" : "bg-slate-50 border-slate-200"}`}>
                    <Search size={18} className="text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      disabled={!selectedTour}
                      value={scheduleSearch}
                      onChange={e => { setScheduleSearch(e.target.value); setSelectedSchedule(null); setIsScheduleOpen(true); }}
                      onClick={() => { if(selectedTour) setIsScheduleOpen(true); }}
                      className="bg-transparent outline-none w-full placeholder:text-slate-400 font-bold disabled:cursor-not-allowed text-blue-700"
                      placeholder={selectedTour ? "Tìm ngày đi hoặc giá vé..." : "Vui lòng chọn Tour trước..."}
                    />
                    {scheduleSearch && (
                      <button type="button" onClick={() => { setScheduleSearch(""); setSelectedSchedule(null); }} className="ml-2 text-slate-400 hover:text-rose-500">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {isScheduleOpen && selectedTour && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                      {filteredSchedules.length > 0 ? filteredSchedules.map(s => {
                        const isFull = s.availableSlots <= 0;
                        return (
                          <div 
                            key={s.id} 
                            onClick={() => {
                              if (!isFull) {
                                setSelectedSchedule(s);
                                setScheduleSearch(`${s.departureDate}`);
                                setIsScheduleOpen(false);
                              }
                            }}
                            className={`p-3 border-b border-slate-100 last:border-0 flex justify-between items-center text-sm font-bold transition-colors ${isFull ? "bg-slate-50 text-slate-400 cursor-not-allowed line-through" : "hover:bg-blue-50 cursor-pointer text-slate-700"}`}
                          >
                            <div>
                              <span className="text-blue-600 block text-xs">Khởi hành:</span>
                              {s.departureDate}
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] text-slate-400 font-medium">Còn {s.availableSlots} chỗ trống</span>
                            </div>
                          </div>
                        );
                      }) : <div className="p-4 text-center text-sm font-bold text-slate-400">{scheduleList.length === 0 ? "Chưa lập lịch trình!" : "Không tìm thấy!"}</div>}
                    </div>
                  )}
                </div>

                {/* 2.3 Áp dụng Voucher Dropdown */}
                <div className="relative" ref={voucherRef}>
                  <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Ticket size={14}/> Mã giảm giá (Voucher)
                  </label>
                  <div className="flex items-center w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Search size={18} className="text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      value={voucherSearch}
                      onChange={e => { setVoucherSearch(e.target.value.toUpperCase()); setIsVoucherOpen(true); }}
                      onClick={() => setIsVoucherOpen(true)}
                      onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleApplyVoucher(voucherSearch); setIsVoucherOpen(false); } }}
                      className="bg-transparent outline-none w-full placeholder:text-slate-400 uppercase font-bold text-rose-600"
                      placeholder="Chọn hoặc gõ nhấn Enter để áp dụng..."
                    />
                    {voucherSearch && (
                      <button type="button" onClick={removeVoucher} className="ml-2 text-slate-400 hover:text-rose-500">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {isVoucherOpen && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                      {filteredVouchers.length > 0 ? filteredVouchers.map(v => {
                        const isExpired = v.usageCount >= v.maxUsage;
                        return (
                          <div 
                            key={v.id} 
                            onClick={() => {
                              if (!isExpired) {
                                handleApplyVoucher(v.code);
                                setIsVoucherOpen(false);
                              }
                            }}
                            className={`p-3 border-b border-slate-100 last:border-0 flex justify-between items-center text-sm font-bold transition-colors ${isExpired ? "bg-slate-50 text-slate-400 cursor-not-allowed line-through" : "hover:bg-blue-50 cursor-pointer text-slate-700"}`}
                          >
                            <div>
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs tracking-wider border">{v.code}</span>
                              <span className="block text-[11px] text-slate-400 font-medium mt-1">Còn {v.maxUsage - v.usageCount} lượt dùng</span>
                            </div>
                            <div className="text-right text-rose-600 font-black">
                              Giảm: {v.discountValue?.toLocaleString()}{v.discountType === 'PERCENT' ? '%' : 'đ'}
                            </div>
                          </div>
                        );
                      }) : (
                        <div 
                          onClick={() => { handleApplyVoucher(voucherSearch); setIsVoucherOpen(false); }}
                          className="p-3 text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                        >
                          Nhấn áp dụng trực tiếp mã: "{voucherSearch}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Ghi chú */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ghi chú điều hành</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Yêu cầu đặc biệt nếu có..." rows={2} />
                </div>
              </div>
            </section>

            {/* 3. HÀNH KHÁCH */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">3. Danh sách Hành khách ({passengers.length})</h3>
                <button onClick={addPassenger} type="button" className="text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <UserPlus size={14} /> Thêm người
                </button>
              </div>
              
              <div className="space-y-3">
                {passengers.map((p, index) => (
                  <div key={p.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 border border-slate-200 rounded-2xl bg-white relative group">
                    <span className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-slate-800 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{index + 1}</span>
                    
                    <input type="text" value={p.fullName} onChange={e => updatePassenger(p.id, "fullName", e.target.value)} className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" placeholder="Họ tên hành khách..." />
                    <input type="date" value={p.birthDate} onChange={e => updatePassenger(p.id, "birthDate", e.target.value)} className="w-[140px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" />
                    
                    <select value={p.gender} onChange={e => updatePassenger(p.id, "gender", e.target.value)} className="w-[100px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>

                    <select value={p.passengerType} onChange={e => updatePassenger(p.id, "passengerType", e.target.value as any)} className="w-[110px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                      <option value="ADULT">Người lớn</option>
                      <option value="CHILD">Trẻ em</option>
                    </select>

                    <button onClick={() => removePassenger(p.id)} type="button" className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* FOOTER */}
        {!isLoading && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-bold text-slate-600 self-start sm:self-auto space-y-1">
              {selectedSchedule ? (
                <>
                  <div>Tạm tính: <span className="text-slate-900 font-black">{formatCurrency(totalPrice)}</span></div>
                  {discount > 0 && (
                    <div className="text-rose-600 text-xs font-bold">Giảm giá voucher: -{formatCurrency(discount)}</div>
                  )}
                  <div className="text-base text-emerald-600 font-black">Tổng cộng: {formatCurrency(finalPrice)}</div>
                </>
              ) : <p className="text-slate-400 italic">Chọn lịch trình để ước tính chi phí...</p>}
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-end">
              <button type="button" onClick={onClose} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto">
                Hủy bỏ
              </button>
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                {isSubmitting ? "Đang xử lý..." : "Lên đơn ngay"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}