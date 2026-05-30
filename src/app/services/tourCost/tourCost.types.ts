// Trạng thái thanh toán của kế toán
export type TourCostStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';

// Dữ liệu gửi đi khi Điều hành viên thêm chi phí thực tế
export interface TourCostRequest {
    scheduleId: number;             // ID của Lịch trình (TourSchedule)
    providerId: number;             // ID của Nhà cung cấp (Khách sạn, xe...)
    expenseName: string;            // Tên khoản chi (VD: Thuê xe 45 chỗ 2 ngày)
    amount: number;                 // Số tiền thực chi
    status: TourCostStatus;         // Trạng thái (Thường tạo mới là UNPAID)
    note?: string;                  // Ghi chú thêm
    paidAt?: string;                // Ngày thanh toán (ISO string, nếu đã trả)
}

// Dữ liệu nhận về để vẽ vào Bảng thống kê chi phí
export interface TourCostResponse {
    id: number;
    
    // Thông tin Lịch trình
    scheduleId: number;
    tourName: string;               // Tên Tour để hiển thị cho đẹp
    
    // Thông tin Nhà cung cấp
    providerId: number;
    providerName: string;           
    providerCode: string;
    
    // Thông tin Chi tiết khoản chi
    expenseName: string;
    amount: number;
    status: TourCostStatus;
    note: string;
    paidAt: string;                 // Ngày thực tế đã chi tiền
    createdAt: string;              // Ngày tạo phiếu chi
}