import { CheckCircle2, Clock, MapPin, XCircle } from "lucide-react";

interface BookingTimelineProps {
  status: string; // PENDING, CONFIRMED, COMPLETED, CANCELLED
  createdAt: string;
  paymentStatus: string;
  paymentDate: string;
}

export function BookingTimeline({ status, createdAt, paymentStatus, paymentDate }: BookingTimelineProps) {
  const isPaid = status === 'CONFIRMED' || status === 'COMPLETED';
  const isCompleted = status === 'COMPLETED';
  const isCancelled = status === 'CANCELLED';

  // Nếu đơn bị hủy, hiển thị giao diện báo Đỏ
  if (isCancelled) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-red-600">
            <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
            Đơn hàng đã hủy
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-600">Rất tiếc, chuyến đi này đã bị hủy.</p>
            <p className="text-sm text-gray-500 font-medium">Vui lòng liên hệ Hotline nếu bạn cần hỗ trợ thêm.</p>
          </div>
        </div>
      </div>
    );
  }

  // Giao diện Timeline 3 bước chuẩn (Happy Path)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-black mb-6 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#2563eb] rounded-full"></div>
          Trạng thái tiến độ
      </h2>
      <div className="space-y-6 relative">
        
        {/* Đường gạch dọc kết nối các Node (Chỉ trang trí) */}
        <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gray-100 z-0"></div>

        {/* BƯỚC 1: TẠO ĐƠN (Luôn xanh) */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center ring-4 ring-white">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">1. Đơn hàng đã được ghi nhận</p>
            <p className="text-sm text-gray-500 font-medium">{createdAt}</p>
          </div>
        </div>
        
        {/* BƯỚC 2: THANH TOÁN (Xanh nếu đã trả, Cam nếu chưa) */}
        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white ${isPaid ? 'bg-green-100' : 'bg-orange-100'}`}>
            {isPaid ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Clock className="w-6 h-6 text-orange-600" />}
          </div>
          <div className="flex-1">
            <p className={`font-bold ${isPaid ? 'text-gray-900' : 'text-orange-600'}`}>
              2. {paymentStatus}
            </p>
            <p className="text-sm text-gray-500 font-medium">{paymentDate}</p>
          </div>
        </div>

        {/* BƯỚC 3: HOÀN THÀNH CHUYẾN ĐI (Xanh nếu COMPLETED, Xám nếu chưa đi) */}
        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
            {isCompleted ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <MapPin className="w-6 h-6 text-gray-400" />}
          </div>
          <div className="flex-1">
            <p className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
              3. Hoàn thành chuyến đi
            </p>
            <p className="text-sm text-gray-500 font-medium">
              {isCompleted ? "Cảm ơn bạn đã đồng hành cùng chúng tôi!" : "Chờ khởi hành..."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}