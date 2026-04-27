
export enum PassengerType {
  ADULT = "ADULT",
  CHILD = "CHILD",
}

export const PassengerTypeLabels: Record<string, string> = {
  ADULT: "Người lớn",
  CHILD: "Trẻ em",
};

export interface TourResponse {
  id: number;
  tourcode: string;           // Mã tour chính
  name: string;
  description: string;
  status: string;
  destinationName: string;    // Tên điểm đến từ Entity Destination
  itinerary: Array<Record<string, any>>; 
  thumbnail: string;
  minParticipants: number;
  duration: string;           
  schedules: ScheduleResponse[]; 
  tourImages?: TourImageResponse[];
}

export interface ScheduleResponse {
  id: number;
  tourId: number;
  tourName: string;
  scheduleCode: string;       // Mã lịch trình (vd: SAPA2504)
  departureLocation: string;  // Nơi khởi hành (🎯 Mới)
  departureDate: string;      // ISO String
  returnDate: string;         // ISO String
  maxSlots: number;
  availableSlots: number;
  status: string;
  duration: string;           // Thời lượng riêng của lịch này
  pricings?: PricingConfigResponse[]; // Load kèm nếu cần
  surcharges?: SurchargeResponse[];   // Load kèm nếu cần
}

export interface PricingConfigResponse {
  id: number;
  scheduleId: number;         // 🎯 Đổi từ tourId sang scheduleId
  passengerType: string;
  price: number;
  currency: string;
  // ❌ Xóa effectiveDate: Rác!
}

export interface SurchargeResponse {
  id: number;
  scheduleId: number;         // 🎯 Đổi từ tourId sang scheduleId
  surchargeName: string;
  amount: number;
  isMandatory: boolean;
}

// =====================================================================
// 3. REQUEST TYPES (Dành cho Form và Search)
// =====================================================================

export interface TourCreateRequest {
  destinationId: number;
  name: string;
  description: string;
  itinerary: Array<Record<string, any>>;
  thumbnail: string;
  minParticipants: number;
  tourCode: string;
  // ❌ Xóa tourType và duration: Rác!
}

export interface TourSearchRequest {
  keyword?: string;
  destinationIds?: number[];         // 🎯 Hệ Multi-select (number[])
  departureLocations?: string[];      // 🎯 Lọc theo nơi đi (string[])
  fromDate?: string;                 // YYYY-MM-DD
  toDate?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ScheduleCreateRequest {
  tourId: number;
  scheduleCode: string;
  departureLocation: string;         // 🎯 Admin phải nhập nơi đi
  departureDate: string;
  returnDate: string;
  maxSlots: number;
}

export interface PricingConfigRequest {
  scheduleId: number;                // 🎯 Gắn vào lịch trình
  passengerType: string;
  price: number;
  currency?: string;
}

export interface SurchargeRequest {
  scheduleId: number;                // 🎯 Gắn vào lịch trình
  surchargeName: string;
  amount: number;
  isMandatory: boolean;
}

export interface PageResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T[]; 
}
export interface DestinationResponse {
  id: number;
  name: string;
  description: string;
}

// --- 🎯 HÌNH ẢNH TOUR (Nếu ông giáo có dùng ở trang chi tiết) ---
export interface TourImageResponse {
  id: number;
  tourId: number;
  imageUrl: string;
}
export interface TourImageRequest {
  tourId: number;
  imageUrl: string;
}