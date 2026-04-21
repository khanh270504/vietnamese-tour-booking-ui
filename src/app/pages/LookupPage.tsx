import { useState } from "react";
import { Search, Calendar, Users, MapPin, CreditCard } from "lucide-react";

export function LookupPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleLookup = () => {
    if (orderId && email) {
      setShowResult(true);
    }
  };

  const bookingDetails = {
    orderId: "TRV2026030001",
    status: "confirmed",
    tourName: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
    tourImage: "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    departureDate: "15/06/2026",
    duration: "3 ngày 2 đêm",
    pickupLocation: "Hà Nội",
    passengers: [
      { name: "Nguyễn Văn A", birthDate: "15/03/1990", gender: "Nam" },
      { name: "Trần Thị B", birthDate: "20/05/1992", gender: "Nữ" },
    ],
    payment: {
      amount: 11480000,
      method: "Chuyển khoản ngân hàng",
      status: "Đã thanh toán",
    },
    timeline: [
      { status: "Đơn hàng đã được xác nhận", date: "03/03/2026 10:30", completed: true },
      { status: "Thanh toán thành công", date: "03/03/2026 10:25", completed: true },
      { status: "Đang xử lý", date: "03/03/2026 10:20", completed: true },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Tra cứu đơn hàng</h1>
          <p className="text-gray-600">Nhập mã đơn hàng và email để tra cứu thông tin</p>
        </div>

        {/* Lookup Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Mã đơn hàng *
              </label>
              <input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="VD: TRV2026030001"
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
          </div>
          <button
            onClick={handleLookup}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 px-4 rounded-md"
          >
            <Search className="w-4 h-4 mr-2" />
            Tra cứu
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Mẹo: Thử mã "TRV2026030001" với bất kỳ email nào để xem kết quả mẫu
          </p>
        </div>

        {/* Results */}
        {showResult && (
          <div className="space-y-6">
            {/* Order Status Banner */}
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: '#2563eb' }}>
                    Đơn hàng: {bookingDetails.orderId}
                  </h2>
                  <p className="text-gray-600">Ngày đặt: 03/03/2026</p>
                </div>
                <div className="bg-green-500 text-lg px-4 py-2 text-white rounded-md">
                  Đã xác nhận
                </div>
              </div>
            </div>

            {/* Tour Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Thông tin đơn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{bookingDetails.tourName}</h4>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Ngày khởi hành</p>
                    <p className="font-semibold">{bookingDetails.departureDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Điểm đón</p>
                    <p className="font-semibold">{bookingDetails.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Số hành khách</p>
                    <p className="font-semibold">{bookingDetails.passengers.length} người</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                    <p className="font-semibold text-green-600">{bookingDetails.payment.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Lịch sử trạng thái</h3>
              <div className="space-y-4">
                {bookingDetails.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {item.completed ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${item.completed ? '' : 'text-gray-400'}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Thông tin thanh toán</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-semibold">{bookingDetails.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="text-green-600 font-semibold">{bookingDetails.payment.status}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold text-lg">Tổng tiền:</span>
                  <span className="text-2xl font-bold" style={{ color: '#2563eb' }}>
                    {bookingDetails.payment.amount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Danh sách hành khách</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">STT</th>
                      <th className="px-4 py-3 text-left">Họ và tên</th>
                      <th className="px-4 py-3 text-left">Ngày sinh</th>
                      <th className="px-4 py-3 text-left">Giới tính</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bookingDetails.passengers.map((passenger, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-semibold">{passenger.name}</td>
                        <td className="px-4 py-3">{passenger.birthDate}</td>
                        <td className="px-4 py-3">{passenger.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
               
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Hủy đơn
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Lưu ý: Việc hủy đơn sẽ áp dụng theo chính sách hủy tour
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
