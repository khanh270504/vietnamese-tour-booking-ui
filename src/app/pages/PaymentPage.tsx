import { useState } from "react";
import { useParams, Link } from "react-router";
import { CreditCard, Smartphone, Building2, CheckCircle2, Clock, Loader2, ChevronRight } from "lucide-react";

export function PaymentPage() {
  const { bookingId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed">("pending");
  const [isProcessing, setIsProcessing] = useState(false);

  const orderInfo = {
    orderId: "TRV2026030001",
    tourName: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
    departureDate: "15/06/2026",
    passengers: 2,
    totalAmount: 11480000,
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Giả lập xử lý thanh toán
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus("completed");
    }, 2000);
  };

  // --- GIAO DIỆN KHI THÀNH CÔNG ---
  if (paymentStatus === "completed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Thanh toán hoàn tất!</h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Tuyệt vời! Đơn hàng của bạn đã được xác nhận thành công. <br />
            Một email chi tiết đã được gửi tới bạn.
          </p>
          
          <div className="bg-gray-50 rounded-3xl p-6 mb-10 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400 uppercase tracking-widest">Mã đơn hàng</span>
              <span className="text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">{orderInfo.orderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400 uppercase tracking-widest">Số tiền</span>
              <span className="text-[#2563eb] text-xl">{orderInfo.totalAmount.toLocaleString('vi-VN')}₫</span>
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

  // --- GIAO DIỆN THANH TOÁN ---
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-8">
          <span>Đơn hàng</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#2563eb]">Thanh toán</span>
          <ChevronRight className="w-4 h-4" />
          <span>Hoàn tất</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Tóm tắt đơn hàng */}
            <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-[#2563eb] rounded-full"></div>
                Thông tin chuyến đi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 font-bold">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Mã tour</p>
                  <p className="text-gray-900">{orderInfo.orderId}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest pt-2">Tên tour</p>
                  <p className="text-gray-900 leading-tight">{orderInfo.tourName}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 flex flex-col justify-between border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-600">Tổng cộng</span>
                    <span className="text-2xl font-black text-[#2563eb]">{orderInfo.totalAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="text-xs text-blue-400 font-bold mt-4 italic">
                    * Giá đã bao gồm thuế và phí dịch vụ
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Phương thức thanh toán (Dùng Input Radio Thuần) */}
            <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Chọn phương thức</h2>
              <div className="space-y-4">
                
                {/* Bank Transfer */}
                <label className={`relative block cursor-pointer group`}>
                  <input 
                    type="radio" name="payment" value="bank" className="peer sr-only" 
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                  />
                  <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-50 bg-gray-50 peer-checked:border-[#2563eb] peer-checked:bg-blue-50/50 transition-all">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 peer-checked:text-[#2563eb]">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-500 font-medium tracking-tight">Vietcombank, Techcombank, v.v.</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 peer-checked:border-[#2563eb] flex items-center justify-center">
                       <div className={`w-3 h-3 rounded-full bg-[#2563eb] transition-transform ${paymentMethod === "bank" ? "scale-100" : "scale-0"}`}></div>
                    </div>
                  </div>
                  
                  {paymentMethod === "bank" && (
                    <div className="mt-2 p-6 bg-white border-2 border-dashed border-blue-200 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-4 text-sm font-bold uppercase tracking-tighter">
                        <div>
                          <p className="text-gray-400 mb-1">Số tài khoản</p>
                          <p className="text-gray-900 text-lg">0123 456 789</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Ngân hàng</p>
                          <p className="text-gray-900 text-lg">Vietcombank</p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-gray-50">
                          <p className="text-gray-400 mb-1">Nội dung</p>
                          <p className="text-blue-600 text-lg">{orderInfo.orderId}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* E-Wallet */}
                <label className="relative block cursor-pointer">
                  <input 
                    type="radio" name="payment" value="wallet" className="peer sr-only"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                  />
                  <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-50 bg-gray-50 peer-checked:border-[#2563eb] peer-checked:bg-blue-50/50 transition-all">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 peer-checked:text-[#2563eb]">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">Ví điện tử</p>
                      <p className="text-sm text-gray-500 font-medium">MoMo, ZaloPay, VNPay</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 peer-checked:border-[#2563eb] flex items-center justify-center">
                       <div className={`w-3 h-3 rounded-full bg-[#2563eb] transition-transform ${paymentMethod === "wallet" ? "scale-100" : "scale-0"}`}></div>
                    </div>
                  </div>
                </label>

                {/* Credit Card */}
                <label className="relative block cursor-pointer">
                  <input 
                    type="radio" name="payment" value="card" className="peer sr-only"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-50 bg-gray-50 peer-checked:border-[#2563eb] peer-checked:bg-blue-50/50 transition-all">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 peer-checked:text-[#2563eb]">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">Thẻ tín dụng</p>
                      <p className="text-sm text-gray-500 font-medium">Visa, Mastercard, JCB</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 peer-checked:border-[#2563eb] flex items-center justify-center">
                       <div className={`w-3 h-3 rounded-full bg-[#2563eb] transition-transform ${paymentMethod === "card" ? "scale-100" : "scale-0"}`}></div>
                    </div>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* SIDEBAR STATUS */}
          <div className="lg:col-span-1">
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
                  <p className="text-xs font-bold text-gray-600 leading-relaxed">Xác nhận tự động trong 5 phút sau khi chuyển khoản thành công.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed">Mọi giao dịch đều được mã hóa và bảo mật 100%.</p>
                </div>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full bg-[#2563eb] text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> ĐANG XỬ LÝ...</>
                ) : (
                  "THANH TOÁN NGAY"
                )}
              </button>

              <div className="mt-8 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1668000018482-a02acf02b22a?q=80&w=400"
                  alt="Tour"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}