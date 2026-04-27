import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Users, Trash2, Plus } from "lucide-react";

export function BookingPage() {
  const { id } = useParams();
  const [passengers, setPassengers] = useState([
    { id: 1, name: "", birthDate: "", gender: "" }
  ]);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const tourPrice = 5990000;
  const numberOfPassengers = passengers.length;
  const totalPrice = tourPrice * numberOfPassengers;
  const finalPrice = totalPrice - discount;

  const addPassenger = () => {
    setPassengers([...passengers, { id: Date.now(), name: "", birthDate: "", gender: "" }]);
  };

  const removePassenger = (id: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const applyVoucher = () => {
    if (voucherCode === "SUMMER2026") {
      setDiscount(500000);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Xác nhận đặt tour</h1>
        <p className="text-gray-500">Chỉ còn một bước nữa để bắt đầu chuyến hành trình của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Form nhập liệu */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thông tin người liên hệ */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Thông tin liên hệ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Họ và tên *</label>
                <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Số điện thoại *</label>
                <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0912345678" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Email nhận vé *</label>
                <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" type="email" placeholder="example@email.com" />
              </div>
            </div>
          </section>

          {/* Thông tin hành khách */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Danh sách hành khách
              </h2>
              <button
                onClick={addPassenger}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Thêm người
              </button>
            </div>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="relative p-5 rounded-2xl bg-gray-50 border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Khách hàng #{index + 1}
                    </span>
                    {passengers.length > 1 && (
                      <button
                        onClick={() => removePassenger(passenger.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-500" placeholder="Họ tên hành khách" />
                    <input className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-500" type="date" />
                    <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-500 appearance-none">
                      <option value="">Giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Voucher */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">Mã giảm giá</h2>
            <div className="flex gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Nhập mã (Ví dụ: SUMMER2026)"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 uppercase font-medium"
              />
              <button
                onClick={applyVoucher}
                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
              >
                Áp dụng
              </button>
            </div>
            {discount > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2">
                <span className="text-green-700 text-sm font-bold italic">✓ Đã giảm {(discount).toLocaleString('vi-VN')}₫ vào tổng bill!</span>
              </div>
            )}
          </section>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng (Sidebar) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-black mb-6 border-b pb-4">Chi tiết thanh toán</h2>

            <div className="mb-6">
              <div className="aspect-video rounded-xl bg-gray-200 mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1554928121-450c86917fdf?q=80&w=500" alt="tour" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-3">Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Khởi hành: <b className="text-gray-800">15/06/2026</b></span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Số lượng khách: <b className="text-gray-800">{numberOfPassengers} người</b></span>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-bold text-gray-800">{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá voucher</span>
                  <span className="font-bold">-{discount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-2 border-t border-dashed">
                <span className="font-black text-gray-900">TỔNG CỘNG</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600 leading-none">
                    {finalPrice.toLocaleString('vi-VN')}₫
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Đã bao gồm thuế & phí</p>
                </div>
              </div>
            </div>

            <Link 
              to={`/payment/${id}`}
              className="block w-full mt-8 bg-[#2563eb] text-white text-center py-4 rounded-2xl font-black text-lg hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
            >
              THANH TOÁN NGAY
            </Link>

            <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
              Nhấn "Thanh toán" đồng nghĩa với việc bạn đồng ý với <Link to="/terms" className="text-blue-500 underline">Điều khoản dịch vụ</Link> của TravelVN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}