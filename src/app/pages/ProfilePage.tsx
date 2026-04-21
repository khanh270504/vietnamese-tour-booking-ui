import { useState } from "react";
import { User, ShoppingBag, Heart, Settings, LogOut, Calendar, CreditCard, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { Link } from "react-router";

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
      image: "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?q=80&w=600",
      departureDate: "15/06/2026",
      status: "confirmed",
      statusText: "Đã xác nhận",
      amount: 11480000,
      bookingDate: "03/03/2026"
    },
    {
      id: "TRV2026020015",
      tourName: "Tour Đà Nẵng - Hội An 4N3Đ",
      image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?q=80&w=600",
      departureDate: "20/02/2026",
      status: "completed",
      statusText: "Đã hoàn thành",
      amount: 7490000,
      bookingDate: "15/01/2026"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR TỰ CHẾ */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-8 text-center border-b border-gray-50">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-md">
                  <User className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="font-black text-gray-900 leading-tight">{userInfo.name}</h2>
                <p className="text-xs text-gray-400 font-bold mt-1 tracking-wide">{userInfo.email}</p>
              </div>

              <nav className="p-4 space-y-2">
                {[
                  { id: "info", icon: User, label: "Hồ sơ cá nhân" },
                  { id: "bookings", icon: ShoppingBag, label: "Đơn của tôi" },
                  { id: "wishlist", icon: Heart, label: "Tour yêu thích" },
                  { id: "settings", icon: Settings, label: "Cài đặt" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                      activeTab === item.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm">
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* NỘI DUNG CHÍNH (THAY THẾ TABS CONTENT) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* RENDER THEO TAB ACTIVE */}
            {activeTab === "info" && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Thông tin cá nhân</h2>
                <p className="text-gray-400 font-medium mb-10 text-sm">Quản lý thông tin tài khoản và địa chỉ của bạn</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Họ và tên", value: userInfo.name, icon: User },
                    { label: "Số điện thoại", value: userInfo.phone, icon: Phone },
                    { label: "Email", value: userInfo.email, icon: Mail },
                    { label: "Địa chỉ", value: userInfo.address, icon: MapPin },
                  ].map((field, i) => (
                    <div key={i} className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{field.label}</label>
                      <div className="relative group">
                        <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text" 
                          defaultValue={field.value}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white transition-all font-bold text-gray-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-12 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all active:scale-95 shadow-xl">
                  CẬP NHẬT THÔNG TIN
                </button>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-end justify-between px-4">
                  <h2 className="text-3xl font-black text-gray-900 leading-none">Đơn hàng</h2>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">{bookingHistory.length} Đơn</span>
                </div>

                {bookingHistory.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                        <img src={booking.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Mã đơn: {booking.id}</p>
                            <h3 className="text-xl font-black text-gray-900 leading-tight">{booking.tourName}</h3>
                          </div>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {booking.statusText}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                            <Calendar className="w-4 h-4" /> {booking.departureDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-black text-blue-600">
                            <CreditCard className="w-4 h-4" /> {booking.amount.toLocaleString('vi-VN')}₫
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link to={`/confirmation/${booking.id}`} className="flex-1">
                            <button className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-black text-xs hover:bg-gray-100 transition-all uppercase tracking-widest border border-gray-100">Chi tiết</button>
                          </Link>
                          {booking.status === "confirmed" && (
                            <button className="flex-1 bg-white text-red-500 py-3 rounded-xl font-black text-xs hover:bg-red-50 transition-all uppercase tracking-widest border border-red-100">Hủy đơn</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Re-use logic từ trang Payment hoặc list tour ở đây */}
                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">Danh sách yêu thích đang trống</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}