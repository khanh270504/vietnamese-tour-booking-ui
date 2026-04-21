import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Package, Calendar, Users, DollarSign, MapPin, Phone, Mail } from "lucide-react";
import { LoginModal } from "../components/LoginModal";

export function MyOrdersPage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    // Kiểm tra đăng nhập khi component mount
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  const orders = [
    {
      id: "VN240305001",
      tourName: "Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ",
      date: "20/06/2026",
      status: "confirmed",
      statusText: "Đã xác nhận",
      totalAmount: 14980000,
      adults: 2,
      children: 0,
      contactName: "Nguyễn Văn A",
      contactPhone: "0912345678",
      contactEmail: "nguyenvana@email.com"
    },
    {
      id: "VN240228002",
      tourName: "Tour Phú Quốc Trọn Gói 3N2Đ",
      date: "25/06/2026",
      status: "pending",
      statusText: "Chờ xác nhận",
      totalAmount: 13980000,
      adults: 2,
      children: 0,
      contactName: "Nguyễn Văn A",
      contactPhone: "0912345678",
      contactEmail: "nguyenvana@email.com"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Nếu chưa đăng nhập, hiển thị modal và không render nội dung
  if (!isLoggedIn) {
    return (
      <>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            navigate("/");
          }}
        />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem đơn hàng của bạn</p>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8" style={{ color: '#2563eb' }} />
          <h1 className="text-3xl font-bold">Đơn của tôi</h1>
        </div>
        <p className="text-gray-600">Quản lý và theo dõi các đơn đặt tour của bạn</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa đặt tour nào. Khám phá các tour hấp dẫn ngay!
          </p>
          <button
            onClick={() => navigate("/tours")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Khám phá tour
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-semibold text-lg">{order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.statusText}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-4">{order.tourName}</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Tour Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Ngày khởi hành</p>
                        <p className="font-medium">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Số lượng</p>
                        <p className="font-medium">
                          {order.adults} người lớn {order.children > 0 && `, ${order.children} trẻ em`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Tổng tiền</p>
                        <p className="font-semibold text-lg" style={{ color: '#2563eb' }}>
                          {order.totalAmount.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Thông tin liên hệ</h4>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{order.contactName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{order.contactPhone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{order.contactEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded">
                    Xem chi tiết
                  </button>
                  {order.status === "confirmed" && (
                    <button className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded">
                      Hủy tour
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      {orders.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Chính sách hủy tour và hoàn tiền</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Hủy trước 15 ngày: Hoàn 100% tiền tour</li>
            <li>• Hủy trước 7-14 ngày: Hoàn 70% tiền tour</li>
            <li>• Hủy trước 3-6 ngày: Hoàn 50% tiền tour</li>
            <li>• Hủy trong vòng 2 ngày: Không hoàn tiền</li>
          </ul>
        </div>
      )}
    </div>
  );
}
