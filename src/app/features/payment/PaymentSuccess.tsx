import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

interface PaymentSuccessProps {
  bookingId: string | undefined;
  orderId: string;
  totalAmount: number;
}

export function PaymentSuccess({ bookingId, orderId, totalAmount }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Thanh toán hoàn tất!</h1>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
          Đơn hàng của bạn đã được xác nhận thành công. <br /> Email chi tiết đã được gửi tới bạn.
        </p>
        
        <div className="bg-gray-50 rounded-3xl p-6 mb-10 space-y-4 border border-gray-100">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-400 uppercase tracking-widest">Mã đơn hàng</span>
            <span className="text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">{orderId}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-400 uppercase tracking-widest">Số tiền</span>
            <span className="text-[#2563eb] text-xl">{totalAmount.toLocaleString('vi-VN')}₫</span>
          </div>
        </div>

        <Link to={`/confirmation/${bookingId}`} className="block">
          <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all active:scale-95 shadow-xl">
            XEM CHI TIẾT ĐƠN HÀNG
          </button>
        </Link>
      </div>
    </div>
  );
}