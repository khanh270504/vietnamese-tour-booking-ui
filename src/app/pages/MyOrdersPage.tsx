import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, Calendar, Users, DollarSign, MapPin, Phone, Mail, Loader2, Info, LifeBuoy } from "lucide-react";
import { LoginModal } from "../features/auth/LoginModal";
import api from "../services/api"; 
import { toast } from "react-toastify";
import { TicketModal } from "../features/ticket/TicketModal"; 

export function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // STATE CHO TICKET MODAL
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedBookingCode, setSelectedBookingCode] = useState<string | null>(null);
  
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }

    const fetchMyOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/v1/bookings/me");
        const data = response.data.result || response.data;
        setOrders(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error("Lỗi lấy danh sách đơn:", error);
        if (error.response?.status === 401) {
            setShowLoginModal(true);
        } else {
            toast.error("Không thể tải danh sách đơn hàng.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, [isLoggedIn]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "CONFIRMED": return { label: "Đã xác nhận", color: "bg-green-100 text-green-700" };
      case "PENDING": return { label: "Chờ thanh toán", color: "bg-orange-100 text-orange-700" };
      case "COMPLETED": return { label: "Hoàn thành", color: "bg-blue-100 text-blue-700" };
      case "CANCELLED": return { label: "Đã hủy", color: "bg-red-100 text-red-700" };
      default: return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  // Hàm xử lý mở Modal
  const handleOpenTicketModal = (bookingCode: string) => {
    setSelectedBookingCode(bookingCode);
    setIsTicketModalOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginModal isOpen={showLoginModal} onClose={() => { setShowLoginModal(false); navigate("/"); }} />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Yêu cầu đăng nhập</h2>
          <button onClick={() => setShowLoginModal(true)} className="bg-[#2563eb] text-white px-8 py-3 rounded-xl font-bold">Đăng nhập ngay</button>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-50 rounded-2xl"><Package className="w-8 h-8 text-[#2563eb]" /></div>
            <h1 className="text-4xl font-black text-gray-900">Đơn của tôi</h1>
          </div>
          <p className="text-gray-500 ml-1">Chào mừng bạn quay lại!</p>
        </div>
        <Link to="/tours" className="text-blue-600 font-bold hover:underline">Đặt tour mới &rarr;</Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed p-16 text-center">
          <h2 className="text-2xl font-black mb-2">Bạn chưa có đơn hàng nào</h2>
          <button onClick={() => navigate("/tours")} className="bg-[#2563eb] text-white py-4 px-10 rounded-2xl font-black mt-4">KHÁM PHÁ NGAY</button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const status = getStatusInfo(order.status);
            return (
              <div key={order.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                <div className="bg-gray-50/50 px-8 py-4 flex flex-wrap items-center justify-between border-b">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Mã đơn</p>
                      <p className="font-black text-gray-900">{order.bookingCode}</p>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[10px] font-black ${status.color}`}>
                      {status.label}
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-gray-400 font-black uppercase">Ngày đặt</p>
                     <p className="font-bold text-gray-600 text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-black text-2xl text-gray-900 mb-6 leading-tight">
                    {order.tourNameSnapshot || order.tourName}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase">Khởi hành</p>
                          <p className="font-bold text-gray-900">{formatDate(order.departureDateSnapshot || order.departureDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Users className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase">Hành khách</p>
                          <p className="font-bold text-gray-900">{order.passengers?.length || 0} người</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 p-6 rounded-2xl flex flex-col justify-center">
                       <p className="text-blue-600 font-black text-xs uppercase mb-1">Tổng tiền</p>
                       <p className="font-black text-3xl text-blue-700">
                         {order.totalFinalPrice?.toLocaleString('vi-VN')}₫
                       </p>
                    </div>
                  </div>

                  {/* NÚT ACTION CỦA MỖI ĐƠN */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <button
                      onClick={() => navigate(`/confirmation/${order.id}`)}
                      className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all"
                    >
                      XEM CHI TIẾT
                    </button>
                    
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => navigate(`/payment/${order.id}`)}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg"
                      >
                        THANH TOÁN NGAY
                      </button>
                    )}

                    {/* NÚT HỖ TRỢ CHỈ HIỆN KHI ĐƠN ĐÃ ĐƯỢC XÁC NHẬN HOẶC HOÀN THÀNH */}
                    {(order.status === "CONFIRMED" || order.status === "COMPLETED") && (
                       <button
                         onClick={() => handleOpenTicketModal(order.bookingCode)}
                         className="flex-1 bg-orange-100 text-orange-700 py-4 rounded-2xl font-black hover:bg-orange-200 transition-all flex items-center justify-center gap-2"
                       >
                         <LifeBuoy className="w-5 h-5" />
                         HỖ TRỢ ĐƠN NÀY
                       </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-12 bg-orange-50 border-2 border-orange-100 rounded-[2rem] p-8 flex gap-5">
          <Info className="w-6 h-6 text-orange-600 mt-1" />
          <div className="text-sm text-orange-800 font-medium">
            <h3 className="font-black mb-1">LƯU Ý QUAN TRỌNG</h3>
            <p>Hệ thống tự động hủy đơn sau 24h nếu chưa thanh toán. Liên hệ 1900 1234 để được hỗ trợ.</p>
          </div>
      </div>

      {/* NHÚNG MODAL TICKET VÀO ĐÂY */}
      <TicketModal 
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        bookingCode={selectedBookingCode}
      />
    </div>
  );
}