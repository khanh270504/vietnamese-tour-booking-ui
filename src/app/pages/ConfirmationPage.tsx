import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useConfirmation } from "../features/confirmation/hooks/useConfirmation";
import { ConfirmationBanner } from "../features/confirmation/ConfirmationBanner";
import { TourDetails } from "../features/confirmation/TourDetails";
import { BookingTimeline } from "../features/confirmation/BookingTimeline";
import { PassengerTable } from "../features/confirmation/PassengerTable";
import { PaymentDetails } from "../features/confirmation/PaymentDetails";
import { ConfirmationActions } from "../features/confirmation/ConfirmationActions";

export function ConfirmationPage() {
  const { bookingId } = useParams();
  const { bookingInfo, isLoading } = useConfirmation(bookingId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-blue-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-bold">Đang truy xuất thông tin biên lai...</p>
        </div>
      </div>
    );
  }

  if (!bookingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-red-500">Không tìm thấy thông tin đơn hàng!</p>
      </div>
    );
    
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 1. Banner Trạng thái */}
      <ConfirmationBanner status={bookingInfo.status} orderId={bookingInfo.orderId} 
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* 2. Thông tin Tour */}
        <TourDetails 
          tourName={bookingInfo.tourName}
          departureDate={bookingInfo.departureDate}
          pickupLocation={bookingInfo.pickupLocation}
          duration={bookingInfo.duration}
          passengersCount={bookingInfo.passengers.length}
          
        />
        
        {/* 3. Trạng thái Đơn hàng */}
        <BookingTimeline 
          status={bookingInfo.status}
          createdAt={bookingInfo.createdAt}
          paymentStatus={bookingInfo.payment.status}
          paymentDate={bookingInfo.payment.date}
        />

        {/* 4. Danh sách Hành khách */}
        <PassengerTable passengers={bookingInfo.passengers} />

        {/* 5. Thông tin Thanh toán */}
        <PaymentDetails 
          method={bookingInfo.payment.method}
          statusText={bookingInfo.payment.status}
          amount={bookingInfo.payment.amount}
          statusCode={bookingInfo.status}
        />

        {/* 6. Nút Hành động & Hỗ trợ */}
        <ConfirmationActions orderId={bookingInfo.orderId} />
      </div>
    </div>
  );
}