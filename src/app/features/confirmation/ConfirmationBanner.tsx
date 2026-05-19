import { CheckCircle2, Clock } from "lucide-react";

interface ConfirmationBannerProps {
  status: string;
  orderId: string;
}

export function ConfirmationBanner({ status, orderId }: ConfirmationBannerProps) {
  const isPaid = status === 'CONFIRMED' || status === 'COMPLETED';

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className={`border-2 rounded-2xl p-8 text-center animate-in zoom-in duration-500 ${
        isPaid ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-400'
      }`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
          isPaid ? 'bg-green-500 shadow-green-200' : 'bg-orange-500 shadow-orange-200'
        }`}>
          {isPaid ? <CheckCircle2 className="w-12 h-12 text-white" /> : <Clock className="w-12 h-12 text-white" />}
        </div>
        
        <h1 className="text-3xl font-black mb-2" style={{ color: isPaid ? '#16a34a' : '#ea580c' }}>
          {isPaid ? 'Đặt tour thành công!' : 'Đã ghi nhận đơn hàng!'}
        </h1>
        
        <p className="text-gray-700 mb-6 font-medium text-lg">
          {isPaid 
            ? 'Cảm ơn bạn đã tin tưởng hệ thống. Chúng tôi đã gửi email xác nhận chi tiết đến hộp thư của bạn.' 
            : 'Đơn hàng của bạn đã được tạo thành công. Vui lòng hoàn tất thanh toán để hệ thống giữ chỗ cho bạn nhé!'}
        </p>
        
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
          <span className="text-gray-500 font-medium">Mã đơn hàng:</span>
          <span className="text-xl font-black tracking-widest text-gray-900">{orderId}</span>
        </div>
      </div>
    </div>
  );
}