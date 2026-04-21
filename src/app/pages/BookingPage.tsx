import { useState } from "react";
import { useParams, Link } from "react-router-dom"; // Sửa lại import cho chuẩn
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
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt tour</h1>
          <p className="text-gray-500">Vui lòng điền đầy đủ thông tin để hoàn tất đặt tour</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Thông tin người đặt
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input 
                    type="text" 
                    placeholder="0912345678" 
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    placeholder="example@email.com" 
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  Danh sách hành khách
                </h2>
                <button
                  onClick={addPassenger}
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm hành khách
                </button>
              </div>

              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="border rounded-xl p-5 relative bg-gray-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Hành khách {index + 1}</h3>
                      {passengers.length > 1 && (
                        <button
                          onClick={() => removePassenger(passenger.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên *</label>
                        <input 
                          type="text" 
                          placeholder="Nguyễn Văn A" 
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày sinh *</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giới tính *</label>
                        <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer">
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voucher */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Mã giảm giá
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <button
                  onClick={applyVoucher}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                  Áp dụng
                </button>
              </div>
              {discount > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 mt-3 font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Áp dụng thành công! Giảm {discount.toLocaleString('vi-VN')}₫
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>

              {/* Tour Summary */}
              <div className="mb-6">
                <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1668000018482-a02acf02b22a?w=800"
                    alt="Tour"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs font-medium opacity-80">Mã tour: #{id || 'SAPA-2026'}</p>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 leading-tight">Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ</h3>
                <div className="space-y-2.5 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Ngày khởi hành: 15/06/2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Số khách: {numberOfPassengers} người</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-dashed pt-5 mb-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giá tour ({numberOfPassengers} người)</span>
                  <span className="font-bold text-gray-800">{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giảm giá</span>
                    <span className="text-green-600 font-bold">-{discount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                  <span className="font-bold text-gray-900 text-lg">Thành tiền</span>
                  <span className="text-2xl font-black text-blue-600 tracking-tight">
                    {finalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <Link to={`/payment/${id}`}>
                <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98]">
                  Tiếp tục thanh toán
                </button>
              </Link>

              <p className="text-[10px] text-gray-400 text-center mt-5 leading-relaxed">
                Bằng việc tiếp tục, bạn đồng ý với{" "}
                <Link to="/terms" className="text-blue-600 hover:underline font-medium">
                  điều khoản sử dụng
                </Link>
                {" "}và chính sách bảo mật của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}