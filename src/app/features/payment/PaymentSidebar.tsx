import { Clock, Loader2 } from "lucide-react";

interface PaymentSidebarProps {
  isProcessing: boolean;
  handleConfirmPayment: () => void;
}

export function PaymentSidebar({ isProcessing, handleConfirmPayment }: PaymentSidebarProps) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl p-8 sticky top-24 border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
          <Clock className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Đang chờ</h3>
        <p className="text-sm text-gray-500 font-medium">Hoàn tất thanh toán để nhận voucher qua Email</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
          <p className="text-xs font-bold text-gray-600 leading-relaxed">Xác nhận tự động trong 5 phút sau khi chuyển khoản.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirmPayment}
        disabled={isProcessing}
        className="w-full bg-[#2563eb] text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> ĐANG XỬ LÝ...</> : "THANH TOÁN NGAY"}
      </button>
    </div>
  );
}