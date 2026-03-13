import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Users, 
  ShoppingBag, 
  MapPin, 
  MessageSquare, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    newMessages: 0
  });

  useEffect(() => {
    // Load statistics from localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const users = Object.keys(localStorage).filter(key => key.startsWith("chat_"));
    
    const totalRevenue = bookings.reduce((sum: number, booking: any) => {
      return sum + (booking.totalPrice || 0);
    }, 0);

    const pendingBookings = bookings.filter((b: any) => b.status === "pending").length;
    const completedBookings = bookings.filter((b: any) => b.status === "confirmed").length;

    setStats({
      totalCustomers: users.length,
      totalBookings: bookings.length,
      totalRevenue: totalRevenue,
      pendingBookings: pendingBookings,
      completedBookings: completedBookings,
      newMessages: users.length
    });
  }, []);

  const statCards = [
    {
      title: "Tổng khách hàng",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/customers"
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalBookings,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admin/bookings"
    },
    {
      title: "Doanh thu",
      value: `${stats.totalRevenue.toLocaleString('vi-VN')}₫`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/admin/bookings"
    },
    {
      title: "Đơn chờ xử lý",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/admin/bookings"
    },
    {
      title: "Đơn hoàn thành",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      link: "/admin/bookings"
    },
    {
      title: "Tin nhắn mới",
      value: stats.newMessages,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/support"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#2563eb' }}>
                Quản Trị Hệ Thống
              </h1>
              <p className="text-gray-600 mt-1">Chào mừng đến với trang quản lý TravelVN</p>
            </div>
            <div className="flex gap-3">
              <Link to="/">
                <Button variant="outline">
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-4 rounded-lg`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tác vụ nhanh</CardTitle>
            <CardDescription>Các chức năng quản lý chính</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/customers">
                <Button className="w-full h-20 bg-[#2563eb] hover:bg-[#1d4ed8]" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Quản lý khách hàng
                </Button>
              </Link>
              <Link to="/admin/bookings">
                <Button className="w-full h-20 bg-green-600 hover:bg-green-700" size="lg">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Quản lý đơn hàng
                </Button>
              </Link>
              <Link to="/admin/tours">
                <Button className="w-full h-20 bg-yellow-600 hover:bg-yellow-700" size="lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  Quản lý Tours
                </Button>
              </Link>
              <Link to="/admin/support">
                <Button className="w-full h-20 bg-purple-600 hover:bg-purple-700" size="lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Hỗ trợ khách hàng
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 text-white p-2 rounded">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Khách hàng mới đăng ký</p>
                    <p className="text-xs text-gray-500">5 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-600 text-white p-2 rounded">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Đơn hàng mới</p>
                    <p className="text-xs text-gray-500">15 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-purple-600 text-white p-2 rounded">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tin nhắn hỗ trợ mới</p>
                    <p className="text-xs text-gray-500">30 phút trước</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm font-medium">Phiên bản</span>
                  <span className="text-sm text-gray-600">1.0.0</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm font-medium">Trạng thái hệ thống</span>
                  <span className="text-sm text-green-600 font-medium">Hoạt động tốt</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm font-medium">Cập nhật cuối</span>
                  <span className="text-sm text-gray-600">10/03/2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
