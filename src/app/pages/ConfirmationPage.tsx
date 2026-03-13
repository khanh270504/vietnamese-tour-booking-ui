import { Link } from "react-router";
import { CheckCircle2, Calendar, Users, MapPin, Download, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ConfirmationPage() {
  const bookingInfo = {
    orderId: "TRV2026030001",
    status: "confirmed",
    tourName: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
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
      date: "03/03/2026"
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2563eb' }}>
            Đặt tour thành công!
          </h1>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã tin tưởng TravelVN. Chúng tôi đã gửi email xác nhận đến hộp thư của bạn.
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="text-xl font-bold" style={{ color: '#2563eb' }}>
              {bookingInfo.orderId}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Tour Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin tour</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tour"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">{bookingInfo.tourName}</h3>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Ngày khởi hành</p>
                <p className="font-semibold">{bookingInfo.departureDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Điểm đón</p>
                <p className="font-semibold">{bookingInfo.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Số hành khách</p>
                <p className="font-semibold">{bookingInfo.passengers.length} người</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="font-semibold">{bookingInfo.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Trạng thái đơn</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Đơn hàng đã được xác nhận</p>
                <p className="text-sm text-gray-600">03/03/2026 10:30</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Thanh toán thành công</p>
                <p className="text-sm text-gray-600">03/03/2026 10:25</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-400">Khởi hành tour</p>
                <p className="text-sm text-gray-600">15/06/2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách hành khách</h2>
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
                {bookingInfo.passengers.map((passenger, index) => (
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

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-semibold">{bookingInfo.payment.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày thanh toán:</span>
              <span className="font-semibold">{bookingInfo.payment.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="text-green-600 font-semibold">{bookingInfo.payment.status}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="font-semibold text-lg">Tổng tiền:</span>
              <span className="text-2xl font-bold" style={{ color: '#2563eb' }}>
                {bookingInfo.payment.amount.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/profile" className="w-full">
            <Button variant="outline" className="w-full">
              Xem đơn của tôi
            </Button>
          </Link>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Tải về PDF
          </Button>
          <Button variant="outline" className="w-full">
            <Printer className="w-4 h-4 mr-2" />
            In đơn hàng
          </Button>
        </div>

        {/* Support Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Cần hỗ trợ?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Nếu bạn có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ với chúng tôi:
          </p>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Hotline:</span> 1900 1234</p>
            <p><span className="font-semibold">Email:</span> support@travelvn.com</p>
            <p><span className="font-semibold">Mã đơn hàng:</span> {bookingInfo.orderId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
