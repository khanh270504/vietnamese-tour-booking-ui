// 1. SỬA LẠI ENUM: Trạng thái Booking chuẩn theo Backend
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PassengerType = "ADULT" | "CHILD";

export interface PassengerRequest {
  fullName: string;
  gender: string; // "MALE", "FEMALE", "OTHER"
  birthDate: string; // Định dạng "YYYY-MM-DD"
  passengerType: PassengerType;
  identityNumber?: string; 
}
export interface PassengerResponse {
  id: number;
  fullName: string;
  passengerType: 'ADULT' | 'CHILD' | string; 
  gender: string;
  birthDate: string; 
  unitPrice: number;
}
export interface ContactInfoReq {
  fullName: string;
  phone: string;
  email: string;
}

export interface BookingCreateRequest {
  scheduleId: number;
  contactInfo: ContactInfoReq; 
  passengers: PassengerRequest[];
  note?: string; 
  voucherCode?: string;
}

export interface BookingCancelRequest {
  bookingId: number;
  reason?: string;
}

export interface BookingPassengerResponse {
  id: number;
  fullName: string;
  gender: string;
  birthDate: string;
  passengerType: PassengerType;
  unitPrice: number;
}

// 🎯 THÊM TYPE CHO LỊCH SỬ TRẠNG THÁI (TIMELINE)
export interface BookingStatusHistoryResponse {
  toStatus: BookingStatus;
  reason: string;
  changedBy: string;
  createdAt: string;
}

// 🎯 THÊM TYPE CHO THANH TOÁN
export interface PaymentResponse {
  id: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionCode?: string;
  createdAt: string;
}

export interface BookingResponse {
  id: number;
  bookingCode: string;
  status: BookingStatus;
  
  totalOriginalPrice: number;
  totalSurcharge: number;
  totalDiscount: number;
  totalFinalPrice: number;
  
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  note?: string; 

  tourNameSnapshot: string; 
  departureDateSnapshot: string; 
  departureLocationSnapshot: string; 
  
  voucherCode?: string;
  createdByEmail?: string;
  createdAt: string;

  passengers: BookingPassengerResponse[];
  
  statusHistories?: BookingStatusHistoryResponse[];
  payments?: PaymentResponse[];
}