import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Filter, MoreVertical, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  status: "active" | "inactive";
  joinDate: string;
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    // Load customer data from localStorage
    const chatKeys = Object.keys(localStorage).filter(key => key.startsWith("chat_"));
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    
    const customersData: Customer[] = chatKeys.map((key, index) => {
      const userId = key.replace("chat_", "");
      const userBookings = bookings.filter((b: any) => b.userId === userId);
      const totalSpent = userBookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
      
      return {
        id: userId,
        name: `Khách hàng ${index + 1}`,
        email: `customer${index + 1}@email.com`,
        phone: `0${Math.floor(Math.random() * 900000000 + 100000000)}`,
        totalBookings: userBookings.length,
        totalSpent: totalSpent,
        lastBooking: userBookings.length > 0 ? userBookings[userBookings.length - 1].date : "Chưa có",
        status: userBookings.length > 0 ? "active" : "inactive",
        joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')
      };
    });

    setCustomers(customersData);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#2563eb' }}>
                  Quản Lý Khách Hàng
                </h1>
                <p className="text-gray-600 mt-1">
                  Tổng số: {filteredCustomers.length} khách hàng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-[#2563eb]" : ""}
                >
                  Tất cả
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  className={filterStatus === "active" ? "bg-[#2563eb]" : ""}
                >
                  Hoạt động
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  onClick={() => setFilterStatus("inactive")}
                  className={filterStatus === "inactive" ? "bg-[#2563eb]" : ""}
                >
                  Không hoạt động
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-lg">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <Badge variant={customer.status === "active" ? "default" : "secondary"} className="mt-1">
                        {customer.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                      <DropdownMenuItem>Gửi email</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Vô hiệu hóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Tham gia: {customer.joinDate}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-[#2563eb]">{customer.totalBookings}</p>
                        <p className="text-xs text-gray-500">Đơn hàng</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {(customer.totalSpent / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-gray-500">Tổng chi tiêu</p>
                      </div>
                    </div>
                  </div>
                  {customer.lastBooking !== "Chưa có" && (
                    <div className="text-xs text-gray-500 text-center pt-2 border-t">
                      Đặt tour cuối: {customer.lastBooking}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
