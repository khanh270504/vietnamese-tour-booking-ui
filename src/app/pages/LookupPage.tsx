import { useState } from "react";
import { Search, Calendar, Users, MapPin, CreditCard, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";
import api from "../services/api"; // 🎯 Đường dẫn axios của ông giáo
import { toast } from "react-toastify";

export function LookupPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const handleLookup = async () => {
    if (!orderId || !email) {
      toast.warn("Vui lòng nhập đầy đủ Mã đơn hàng và Email!");
      return;
    }

    setIsLoading(true);
    setBookingData(null); // Reset dữ liệu cũ khi tra cứu mới

    try {
     
      const response = await api.get(`/api/v1/bookings/lookup`, {
        params: { bookingCode: orderId, email: email }
      });

      const data = response.data.result || response.data;
      setBookingData(data);
    } catch (error: any) {
      console.error("Lỗi tra cứu:", error);
      const msg = error.response?.data?.message || "Không tìm thấy đơn hàng phù hợp!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper check trạng thái
  const isPaid = bookingData?.status === 'CONFIRMED' || bookingData?.status === 'COMPLETED';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-3 text-gray-900 tracking-tight">Tra cứu đơn hàng</h1>
          <p className="text-gray-500 font-medium">Nhập mã đơn hàng và email bạn đã dùng khi đặt tour</p>
        </div>

        {/* 1. LOOKUP FORM */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 p-8 mb-10 border border-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Mã đơn hàng
              </label>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="VD: BK-123456"
                className="w-full border-2 border-gray-100 rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Email đặt tour
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border-2 border-gray-100 rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>
          </div>
          <button
            onClick={handleLookup}
            disabled={isLoading}
            className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-5 px-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> ĐANG TRUY XUẤT...</>
            ) : (
              <><Search className="w-6 h-6" /> TÌM KIẾM ĐƠN HÀNG</>
            )}
          </button>
        </div>

        {/* 2. RESULTS SECTION */}
        {bookingData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            
            {/* Status Banner */}
            <div className={`border-2 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
              isPaid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isPaid ? 'bg-green-500' : 'bg-orange-500'}`}>
                  {isPaid ? <CheckCircle2 className="text-white w-10 h-10" /> : <Clock className="text-white w-10 h-10" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Mã đơn: {bookingData.bookingCode}</h2>
                  <p className="text-gray-500 font-bold">Trạng thái: {bookingData.status}</p>
                </div>
              </div>
              <div className={`px-6 py-3 rounded-xl font-black text-white shadow-md ${isPaid ? 'bg-green-500' : 'bg-orange-500'}`}>
                {isPaid ? 'ĐÃ XÁC NHẬN' : 'CHỜ THANH TOÁN'}
              </div>
            </div>

            {/* Tour Info */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                Thông tin chuyến đi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <h4 className="font-black text-2xl text-gray-900 mb-2">{bookingData.tourNameSnapshot || bookingData.tourName}</h4>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Ngày khởi hành</p>
                      <p className="font-bold text-gray-900">{bookingData.departureDateSnapshot}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Điểm đón</p>
                      <p className="font-bold text-gray-900">{bookingData.departureLocationSnapshot || "Hà Nội"}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 flex flex-col justify-center">
                  <p className="text-blue-600 font-bold text-sm mb-1 uppercase">Tổng số tiền</p>
                  <p className="text-4xl font-black text-blue-700">
                    {bookingData.totalFinalPrice.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Box Hành khách */}
               <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                  <h3 className="font-black text-lg mb-4">Hành khách ({bookingData.passengers?.length})</h3>
                  <div className="space-y-3">
                    {bookingData.passengers?.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-xl font-bold text-sm">
                        <span>{p.fullName}</span>
                        <span className="text-gray-400">{p.passengerType}</span>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Nút Hủy Đơn */}
               <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 flex flex-col justify-center items-center text-center">
                  <h3 className="font-black text-red-600 text-lg mb-2">Bạn muốn hủy chuyến?</h3>
                  <p className="text-sm text-red-400 font-medium mb-6">Việc hủy đơn sẽ được xử lý theo chính sách của TravelVN</p>
                  <button className="w-full bg-white border-2 border-red-200 text-red-600 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all">
                    YÊU CẦU HỦY ĐƠN
                  </button>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}