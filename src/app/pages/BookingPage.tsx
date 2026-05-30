import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../services/api"; 

import { useBooking } from "../features/booking/hooks/useBooking";
import { bookingService } from "../services/booking/booking.service"; 
import { BookingCreateRequest } from "../services/booking/booking.types"; 

import { ContactForm } from "../features/booking/ContactForm";
import { PassengerList } from "../features/booking/PassengerList";
import { VoucherForm } from "../features/booking/VoucherForm";
import { BookingSummary } from "../features/booking/BookingSummary";

export function BookingPage() {
  const MINIO_BASE_URL = import.meta.env.VITE_MINIO_URL || "http://localhost:9000/tours";
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get("scheduleId"); 
  const navigate = useNavigate();
  
  const [contactInfo, setContactInfo] = useState({ fullName: "", phone: "", email: "" });
  const [isLoading, setIsLoading] = useState(false); 
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]); 

  const [scheduleInfo, setScheduleInfo] = useState({
    tourName: "Đang tải...",
    tourId: null as number | null,
    departureDate: "",
    adultPrice: 0,
    childPrice: 0,
    thumbnailUrl: "",
    isLoadingData: true
  });

  const tourId = scheduleInfo.tourId;
 
  const {
    passengers, voucherCode, setVoucherCode, discount,
    numberOfPassengers, totalPrice, finalPrice,
    addPassenger, removePassenger, updatePassenger, applyVoucher,
    isApplyingVoucher,removeVoucher
  } = useBooking(scheduleInfo.adultPrice, scheduleInfo.childPrice, tourId); 


const filteredVouchers = useMemo(() => {
  return availableVouchers.filter((v: any) => {
    return !v.tour || v.tour.id === tourId;
  });
}, [availableVouchers, tourId]); 
  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Schedule (Bắt buộc)
      if (!scheduleId) {
        toast.error("Thiếu lịch trình!");
        navigate("/tours");
        return;
      }

      try {
        const scheduleRes = await api.get(`/api/v1/schedules/${scheduleId}`);
        const d = scheduleRes.data.result || scheduleRes.data;
        let thumbnail = "";
        if (d.tourId) {
          try {
            const tourRes = await api.get(`/api/v1/tours/${d.tourId}`);
            thumbnail = tourRes.data.result?.thumbnail || "";
          } catch (e) {
            console.error("Không lấy được ảnh tour");
          }
        } 
        setScheduleInfo({
          tourName: d.tourName || "Tour du lịch",
          tourId: d.tourId ?? null,
          departureDate: d.departureDate || "",
          adultPrice: d.pricings?.find((p: any) => p.passengerType === "ADULT")?.price || 0,
          childPrice: d.pricings?.find((p: any) => p.passengerType === "CHILD")?.price || 0,
          thumbnailUrl: thumbnail,
          isLoadingData: false
        });
        console.log("Schedule info2:", thumbnail);
        // 2. Fetch Vouchers
        try {
          const vRes = await api.get("/api/v1/vouchers/public/active");
          setAvailableVouchers(vRes.data.result || vRes.data);
        } catch (e) { toast.error("Không tải được voucher"); }

        // 3. Fetch Profile (Chỉ gọi nếu có Token)
        if (localStorage.getItem("access_token")) {
          try {
            const pRes = await api.get("/api/v1/customers/me");
            const p = pRes.data.result || pRes.data;
            setContactInfo({ fullName: p.fullName || "", phone: p.phone || "", email: p.user?.email || p.email || "" });
          } catch (e) { console.log("Guest mode"); }
        }

      } catch (err) {
        console.error(err);
        toast.error("Lỗi tải thông tin tour!");
        navigate("/tours");
      }
    };

    fetchData();
  }, [scheduleId, navigate]);

  // --- SUBMIT ---
  const handleSubmitBooking = async () => {
    if (!contactInfo.fullName || !contactInfo.phone || !contactInfo.email) return toast.error("Thiếu thông tin liên hệ");
    if (!scheduleId) return toast.error("Thiếu scheduleId");

    setIsLoading(true);
    try {
      const payload: BookingCreateRequest = {
        scheduleId: Number(scheduleId),
        contactInfo,
        passengers: passengers.map(p => ({ 
            fullName: p.name, birthDate: p.birthDate, gender: p.gender.toUpperCase(), passengerType: p.passengerType 
        })),
        voucherCode: voucherCode || undefined,
        note: voucherCode ? `Voucher: ${voucherCode}` : ""
      };
      const res = await bookingService.createBooking(payload);
      navigate(`/payment/${(res as any).result?.id || (res as any).id}`);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Lỗi tạo booking");
    } finally {
      setIsLoading(false); 
    }
  };

  if (scheduleInfo.isLoadingData) return <div className="p-20 text-center animate-pulse">Đang tải...</div>;
    
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black mb-8">Xác nhận đặt tour</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ContactForm contactInfo={contactInfo} setContactInfo={setContactInfo} />
          <PassengerList passengers={passengers} addPassenger={addPassenger} removePassenger={removePassenger} updatePassenger={updatePassenger} />
          <VoucherForm 
            voucherCode={voucherCode} 
            setVoucherCode={setVoucherCode} 
            applyVoucher={(c, t) => applyVoucher(c, t)}           
            removeVoucher={removeVoucher}        
            discount={discount} 
            isApplyingVoucher={isApplyingVoucher} 
            availableVouchers={filteredVouchers} 
            orderTotal={totalPrice} 
            tourId={tourId ?? undefined}
/>
        </div>
        <div className="lg:col-span-1">
          <BookingSummary 
            thumbnailUrl={scheduleInfo.thumbnailUrl ? `${MINIO_BASE_URL}/${scheduleInfo.thumbnailUrl}` : undefined}
            tourName={scheduleInfo.tourName} departureDate={scheduleInfo.departureDate}
            numberOfPassengers={numberOfPassengers} totalPrice={totalPrice} 
            discount={discount} finalPrice={finalPrice} 
            onSubmit={handleSubmitBooking} isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}