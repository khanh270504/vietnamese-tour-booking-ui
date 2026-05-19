import { useParams } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { usePayment } from "../features/payment/hooks/usePayment";
import { PaymentSummary } from "../features/payment/PaymentSummary";
import { PaymentMethods } from "../features/payment/PaymentMethods";
import { PaymentSidebar } from "../features/payment/PaymentSidebar";
import { PaymentSuccess } from "../features/payment/PaymentSuccess";

export function PaymentPage() {
  const { bookingId } = useParams();
  const { orderInfo, paymentMethod, setPaymentMethod, paymentStatus, isProcessing, isLoadingData, handleConfirmPayment } = usePayment(bookingId);

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4 text-blue-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-bold">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "completed") {
    return <PaymentSuccess bookingId={bookingId} orderId={orderInfo.orderId} totalAmount={orderInfo.totalAmount} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-8">
          <span>Đơn hàng</span><ChevronRight className="w-4 h-4" /><span className="text-[#2563eb]">Thanh toán</span><ChevronRight className="w-4 h-4" /><span>Hoàn tất</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <PaymentSummary orderInfo={orderInfo} />
            <PaymentMethods paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} orderId={orderInfo.orderId} />
          </div>

          <div className="lg:col-span-1">
            <PaymentSidebar isProcessing={isProcessing} handleConfirmPayment={handleConfirmPayment} />
          </div>
        </div>
      </div>
    </div>
  );
}