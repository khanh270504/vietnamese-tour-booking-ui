import { useState } from "react";
import { useParams, Link } from "react-router";
import { ImageFallback } from "../components/ImageFallback";
import { CreditCard, Smartphone, Building2, CheckCircle2, Clock } from "lucide-react";

export function PaymentPage() {
  const { bookingId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed">("pending");

  const orderInfo = {
    orderId: "TRV2026030001",
    tourName: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
    departureDate: "15/06/2026",
    passengers: 2,
    totalAmount: 11480000,
  };

  const handleConfirmPayment = () => {
    setPaymentStatus("completed");
  };

  if (paymentStatus === "completed") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thanh toán thành công!</h1>
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã tin tưởng TravelVN. Chúng tôi đã gửi email xác nhận đến hộp thư của bạn.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold">{orderInfo.orderId}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-semibold" style={{ color: '#2563eb' }}>
                {orderInfo.totalAmount.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="text-green-600 font-semibold">Đã thanh toán</span>
            </div>
          </div>
          <Link to={`/confirmation/${bookingId}`}>
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded">
              Xem chi tiết đơn hàng
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Thanh toán</h1>
        <p className="text-gray-600">Vui lòng chọn phương thức thanh toán</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold">{orderInfo.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tour:</span>
                <span className="font-semibold text-right max-w-xs">{orderInfo.tourName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày khởi hành:</span>
                <span className="font-semibold">{orderInfo.departureDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số khách:</span>
                <span className="font-semibold">{orderInfo.passengers} người</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold text-lg">Tổng tiền:</span>
                <span className="text-2xl font-bold" style={{ color: '#2563eb' }}>
                  {orderInfo.totalAmount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
            <div className="space-y-4">
              {/* Bank Transfer */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                paymentMethod === "bank" ? "border-[#2563eb] bg-blue-50" : "border-gray-200"
              }`} onClick={() => setPaymentMethod("bank")}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  <label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Building2 className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-600">Chuyển khoản qua tài khoản ngân hàng</p>
                    </div>
                  </label>
                </div>
                {paymentMethod === "bank" && (
                  <div className="mt-4 pl-9 space-y-2 text-sm">
                    <p><span className="font-semibold">Ngân hàng:</span> Vietcombank</p>
                    <p><span className="font-semibold">Số tài khoản:</span> 0123456789</p>
                    <p><span className="font-semibold">Chủ tài khoản:</span> CÔNG TY TRAVELVN</p>
                    <p><span className="font-semibold">Nội dung:</span> {orderInfo.orderId}</p>
                  </div>
                )}
              </div>

              {/* E-Wallet */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                paymentMethod === "wallet" ? "border-[#2563eb] bg-blue-50" : "border-gray-200"
              }`} onClick={() => setPaymentMethod("wallet")}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  <label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Smartphone className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Ví điện tử</p>
                      <p className="text-sm text-gray-600">MoMo, ZaloPay, VNPay</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Credit Card */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                paymentMethod === "card" ? "border-[#2563eb] bg-blue-50" : "border-gray-200"
              }`} onClick={() => setPaymentMethod("card")}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  <label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Thẻ tín dụng</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Button */}
          <button
            onClick={handleConfirmPayment}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-6 text-lg rounded"
          >
            Xác nhận thanh toán
          </button>
        </div>

        {/* Payment Status Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Trạng thái thanh toán</h2>

            <div className="text-center py-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-lg font-semibold mb-2">Chờ thanh toán</p>
              <p className="text-sm text-gray-600">
                Vui lòng hoàn tất thanh toán để xác nhận đơn hàng
              </p>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Lưu ý:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Đơn hàng sẽ được xác nhận sau khi nhận được thanh toán</li>
                <li>• Vui lòng kiểm tra kỹ thông tin trước khi thanh toán</li>
                <li>• Liên hệ hotline 1900 1234 nếu cần hỗ trợ</li>
              </ul>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <ImageFallback
                  src="https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tour"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold mt-3">{orderInfo.tourName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
