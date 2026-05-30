import { Calendar, Users, Loader2 } from "lucide-react";
// Đã bỏ Link vì không dùng đến nữa

interface BookingSummaryProps {
  tourName: string;         
  departureDate: string;    
  thumbnailUrl?: string;    
  numberOfPassengers: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  onSubmit: () => void; 
  isLoading: boolean;   
}

export function BookingSummary({ 
  tourName, departureDate, thumbnailUrl, // 🎯 Hứng data thật
  numberOfPassengers, totalPrice, discount, finalPrice, 
  onSubmit, isLoading 
}: BookingSummaryProps) {
  
  // Ảnh mặc định nếu tour chưa có ảnh
  const defaultImage = "https://images.unsplash.com/photo-1554928121-450c86917fdf?q=80&w=500";

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 p-8 sticky top-24">
      <h2 className="text-xl font-black mb-6 border-b border-gray-100 pb-4">Chi tiết thanh toán</h2>

      <div className="mb-8">
        <div className="aspect-video rounded-xl bg-gray-200 mb-5 overflow-hidden shadow-inner">
          <img 
            src={thumbnailUrl || defaultImage} 
            alt={tourName} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
          />
        </div>
        {/* 🎯 Hiển thị tên Tour thật */}
        <h3 className="font-black text-gray-900 text-lg mb-4 leading-snug">{tourName || "Đang tải tên tour..."}</h3>
        
        <div className="space-y-3 text-sm font-medium">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            {/* 🎯 Hiển thị ngày đi thật */}
            <span>Khởi hành: <b className="text-gray-900">{departureDate || "Đang cập nhật"}</b></span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
            <span>Số lượng khách: <b className="text-gray-900">{numberOfPassengers} người</b></span>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-6">
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Tạm tính</span>
          <span className="font-bold text-gray-900">{totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Giảm giá voucher</span>
            <span className="font-bold">-{discount.toLocaleString('vi-VN')}₫</span>
          </div>
        )}
        <div className="flex justify-between items-end pt-4 border-t border-dashed border-gray-200">
          <span className="font-black text-gray-900 text-sm">TỔNG CỘNG</span>
          <div className="text-right">
            <p className="text-3xl font-black text-blue-600 leading-none">{finalPrice.toLocaleString('vi-VN')}₫</p>
            <p className="text-[10px] text-gray-400 mt-1.5 uppercase tracking-widest font-bold">Đã bao gồm thuế & phí</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full mt-8 flex items-center justify-center gap-2 text-white text-center py-4 rounded-xl font-black text-lg transition-all active:scale-95 ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
        }`}
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {isLoading ? 'ĐANG TẠO ĐƠN...' : 'XÁC NHẬN ĐẶT TOUR'}
      </button>
      
    </div>
  );
}