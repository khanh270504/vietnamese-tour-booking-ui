// Các loại dịch vụ của nhà cung cấp
export type ServiceType = 'HOTEL' | 'TRANSPORT' | 'RESTAURANT' | 'ATTRACTION' | 'OTHER';

// Trạng thái hợp tác
export type ProviderStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';

// Dữ liệu gửi đi khi Thêm/Sửa nhà cung cấp (Khớp với ProviderRequest bên Java)
export interface ProviderRequest {
    name: string;                   // Tên nhà cung cấp (VD: Khách sạn Mường Thanh)
    serviceType: ServiceType;       // Loại dịch vụ
    contactPerson: string;          // Người liên hệ (VD: Mr. Tuấn Sale)
    phone: string;                  // Số điện thoại
    email?: string;                 // Email (Không bắt buộc)
    address?: string;               // Địa chỉ
    status: ProviderStatus;         // Trạng thái (Thường tạo mới mặc định là PENDING hoặc ACTIVE)
}

// Dữ liệu nhận về để vẽ ra bảng (Khớp với ProviderResponse bên Java)
export interface ProviderResponse {
    id: number;                     // ID hệ thống
    providerCode: string;           // Mã nhà cung cấp (VD: SUP-12345)
    name: string;
    serviceType: ServiceType;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    status: ProviderStatus;
    
    // Thống kê phục vụ vẽ giao diện Bảng / Dashboard
    linkedToursCount: number;       // Số lượng Tour đã tham gia cung cấp
    totalCostVolume: number;        // Tổng số tiền đã giao dịch (VNĐ)
}