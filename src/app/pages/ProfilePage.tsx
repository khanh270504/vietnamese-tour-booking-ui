import { useState } from "react";
import { User, ShoppingBag, Heart, Settings, LogOut, Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router";
import { ImageFallback } from "../components/ImageFallback";

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");

  const userInfo = {
    name: "Trần Quốc Khánh",
    email: "khanhtran@email.com",
    phone: "0912345678",
    address: "Hà Nội, Việt Nam",
  };

  const bookingHistory = [
    {
      id: "TRV2026030001",
      tourName: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
      image: "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      departureDate: "15/06/2026",
      status: "confirmed",
      amount: 11480000,
      bookingDate: "03/03/2026"
    },
    {
      id: "TRV2026020015",
      tourName: "Tour Đà Nẵng - Hội An 4N3Đ",
      image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5hbmclMjB2aWV0bmFtJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      departureDate: "20/02/2026",
      status: "completed",
      amount: 7490000,
      bookingDate: "15/01/2026"
    },
    {
      id: "TRV2026010008",
      tourName: "Tour Phú Quốc 3N2Đ",
      image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwaXNsYW5kJTIwYmVhY2h8ZW58MXx8fHwxNzcyNDIyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      departureDate: "10/01/2026",
      status: "completed",
      amount: 6990000,
      bookingDate: "20/12/2025"
    },
  ];

  const wishlistTours = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1649530928914-c2df337e3007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBhJTIwdmlldG5hbSUyMG1vdW50YWluc3xlbnwxfHx8fDE3NzI1MTA3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Sapa - Fansipan 4N3Đ",
      price: 5490000,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1643030292895-caeed7e5d4f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhdmVsJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Nha Trang - Vinpearl 4N3Đ",
      price: 6790000,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">Đã xác nhận</span>;
      case "completed":
        return <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Đã hoàn thành</span>;
      case "cancelled":
        return <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Đã hủy</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm">Đang xử lý</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="font-semibold text-lg">{userInfo.name}</h2>
              <p className="text-sm text-gray-600">{userInfo.email}</p>
            </div>

            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <User className="w-5 h-5" />
                <span>Thông tin cá nhân</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <ShoppingBag className="w-5 h-5" />
                <span>Đơn của tôi</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <Heart className="w-5 h-5" />
                <span>Tour yêu thích</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <Settings className="w-5 h-5" />
                <span>Cài đặt</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left">
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="w-full">
            <div className="grid grid-cols-3 w-full mb-6 border-b">
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 py-2 text-center border-b-2 transition-colors ${
                  activeTab === "info"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 text-center border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Đơn của tôi
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`px-4 py-2 text-center border-b-2 transition-colors ${
                  activeTab === "wishlist"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Tour yêu thích
              </button>
            </div>

            {/* Personal Info Tab */}
            {activeTab === "info" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input
                        id="name"
                        defaultValue={userInfo.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        id="phone"
                        defaultValue={userInfo.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      defaultValue={userInfo.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      id="address"
                      defaultValue={userInfo.address}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    Cập nhật thông tin
                  </button>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Lịch sử booking</h2>
                  <p className="text-gray-600">{bookingHistory.length} đơn hàng</p>
                </div>

                {bookingHistory.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                      <div className="md:col-span-1">
                        <div className="relative h-32 rounded-lg overflow-hidden">
                          <ImageFallback
                            src={booking.image}
                            alt={booking.tourName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{booking.tourName}</h3>
                            <p className="text-sm text-gray-600">Mã đơn: {booking.id}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{booking.departureDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>{booking.amount.toLocaleString('vi-VN')}₫</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Đặt ngày: {booking.bookingDate}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Link to={`/confirmation/${booking.id}`}>
                            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded text-sm">
                              Xem chi tiết
                            </button>
                          </Link>
                          {booking.status === "confirmed" && (
                            <button className="border border-red-500 text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm">
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Tour yêu thích</h2>
                  <p className="text-gray-600">{wishlistTours.length} tour</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlistTours.map((tour) => (
                    <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48">
                        <ImageFallback
                          src={tour.image}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-2 right-2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors">
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-3">{tour.title}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold" style={{ color: '#2563eb' }}>
                            {tour.price.toLocaleString('vi-VN')}₫
                          </p>
                          <Link to={`/tours/${tour.id}`}>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                              Xem chi tiết
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/wishlist" className="block">
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded w-full">
                    Xem tất cả tour yêu thích
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}