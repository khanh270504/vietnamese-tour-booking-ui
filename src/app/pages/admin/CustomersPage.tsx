import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Sửa lại import cho chuẩn
import { ArrowLeft, Search, MoreVertical, Mail, Phone, Calendar } from "lucide-react";

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <Link to="/admin" className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">Quản Lý Khách Hàng</h1>
            <p className="text-sm text-gray-500">Tìm thấy {filteredCustomers.length} khách hàng</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {(['all', 'active', 'inactive'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filterStatus === s 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {s === 'all' ? 'Tất cả' : s === 'active' ? 'Hoạt động' : 'Tạm ngừng'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow relative">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{customer.name}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                        customer.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {customer.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </div>
                  </div>

                  {/* Manual Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === customer.id ? null : customer.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openDropdown === customer.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-10 py-1 text-sm animate-in fade-in zoom-in duration-200">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Xem chi tiết</button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Gửi email</button>
                        <div className="border-t my-1"></div>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">Vô hiệu hóa</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>Tham gia: {customer.joinDate}</span>
                  </div>
                </div>

                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">{customer.totalBookings}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Đơn hàng</p>
                  </div>
                  <div className="text-center border-l">
                    <p className="text-xl font-bold text-green-600">
                      {(customer.totalSpent / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Tổng chi</p>
                  </div>
                </div>
                
                {customer.lastBooking !== "Chưa có" && (
                  <p className="text-[10px] text-gray-400 text-center mt-4 italic">
                    Đặt tour cuối: {customer.lastBooking}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="bg-white p-20 rounded-xl border text-center text-gray-400 shadow-inner">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p>Không tìm thấy khách hàng nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );
}