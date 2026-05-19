import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import api from "../../../services/api";

export interface PassengerForm {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
  passengerType: "ADULT" | "CHILD";
}

export function useBooking(adultPrice: number = 0, childPrice: number = 0, tourId?: number | null) {
  
  const [passengers, setPassengers] = useState<PassengerForm[]>([
    {
      id: Date.now(),
      name: "",
      birthDate: "",
      gender: "MALE",
      passengerType: "ADULT",
    },
  ]);

  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  // 🔥 IMPORTANT: lưu tourId runtime (KHÔNG dùng param hook)
  const tourIdRef = useRef<number | null>(null);

  const setTourId = (id: number | null) => {
    tourIdRef.current = id;
  };

  const numberOfPassengers = passengers.length;

  const totalPrice = useMemo(() => {
    return passengers.reduce((sum, p) => {
      return sum + (p.passengerType === "ADULT" ? adultPrice : childPrice);
    }, 0);
  }, [passengers, adultPrice, childPrice]);

  const finalPrice = Math.max(0, totalPrice - discount);

  // reset voucher khi thay đổi tiền
  useEffect(() => {
    if (discount > 0) {
      setDiscount(0);
      setVoucherCode("");
      toast.info("Tổng tiền thay đổi, vui lòng áp dụng lại voucher!");
    }
  }, [totalPrice]);

  const addPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        birthDate: "",
        gender: "MALE",
        passengerType: "ADULT",
      },
    ]);
  };

  const removePassenger = (id: number) => {
    if (passengers.length <= 1) {
      toast.error("Phải có ít nhất 1 hành khách!");
      return;
    }

    setPassengers((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePassenger = (
    id: number,
    field: keyof PassengerForm,
    value: string
  ) => {
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const applyVoucher = async (code?: string, tourId?: number | null) => {
  const codeToApply = code ?? voucherCode;
console.log(" DEBUG: Hàm applyVoucher nhận được:", { code, tourId });
  const payload: any = {
    code: codeToApply.toUpperCase(),
    orderTotal: totalPrice,
    tourId: tourId,
  };
  
console.log("FINAL PAYLOAD:", payload);
  const res = await api.post(
    "/api/v1/vouchers/public/apply",
    payload
  );

  const result = res.data.result || res.data;

  setDiscount(result.discountAmount);
  setVoucherCode(codeToApply.toUpperCase());

  
};
  const removeVoucher = () => {
  setDiscount(0);
  setVoucherCode("");
  toast.success("Đã xóa mã giảm giá");
};

  return {
    passengers,
    voucherCode,
    setVoucherCode,
    
    discount,
    totalPrice,
    finalPrice,
    removeVoucher,
    numberOfPassengers,
    isApplyingVoucher,

    addPassenger,
    removePassenger,
    updatePassenger,

    applyVoucher,

    setTourId,
  };
}