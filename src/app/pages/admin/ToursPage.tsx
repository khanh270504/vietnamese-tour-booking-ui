import { useState } from "react";
import { Link } from "react-router-dom"; // Sửa lại import cho chuẩn
import { ArrowLeft, Plus, Search, Edit, Trash2, Eye } from "lucide-react";

interface Tour {
  id: number;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  status: "active" | "inactive";
  category: string;
}

export function ToursPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [tours] = useState<Tour[]>([
    {
      id: 1,
      name: "Hạ Long - Sapa 4N3Đ",
      location: "Quảng Ninh - Lào Cai",
      duration: "4 ngày 3 đêm",
      price: 6500000,
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1589307357838-f6d31eedb3a3?w=400",
      status: "active",
      category: "Miền Bắc"
    },
    {
      id: 2,
      name: "Phú Quốc 3N2Đ",
      location: "Kiên Giang",
      duration: "3 ngày 2 đêm",
      price: 4500000,
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400",
      status: "active",
      category: "Miền Nam"
    },
    {
      id: 3,
      name: "Đà Nẵng - Hội An 3N2Đ",
      location: "Đà Nẵng - Quảng Nam",
      duration: "3 ngày 2 đêm",
      price: 3800000,
      rating: 4.7,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400",
      status: "active",
      category: "Miền Trung"
    }
    // ... các tours khác
  ]);

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (tourId: number) => {
    alert(`Đã xóa tour ID: ${tourId}`); // Thay tạm toast bằng alert nếu chưa cài thư viện toast
  };

  const activeTours = tours.filter(t => t.status === "active").length;
  const inactiveTours = tours.filter(t => t.status === "inactive").length;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Quản Lý Tours</h1>
                <p className="text-sm text-gray-500">Tổng số: {tours.length} tours</p>
              </div>
            </div>
            <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tour mới
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Tổng số tours</p>
            <p className="text-3xl font-bold text-blue-600">{tours.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Đang hoạt động</p>
            <p className="text-3xl font-bold text-green-600">{activeTours}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Tạm ngừng</p>
            <p className="text-3xl font-bold text-gray-400">{inactiveTours}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tour theo tên, địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="group bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                    tour.status === "active" ? "bg-green-500" : "bg-gray-500"
                  }`}>
                  {tour.status === "active" ? "Hoạt động" : "Tạm ngừng"}
                </span>
              </div>
              
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{tour.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {tour.location}
                  </p>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Thời gian:</span>
                    <span className="font-semibold text-gray-800">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Giá:</span>
                    <span className="font-bold text-blue-600">
                      {tour.price.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Đánh giá:</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      ★ <span className="font-medium text-gray-800">{tour.rating}</span>
                      <span className="text-gray-400 text-xs">({tour.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" /> Xem
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(tour.id)}
                    className="p-2 border rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="bg-white p-20 rounded-2xl border text-center text-gray-500 shadow-inner">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Không tìm thấy tour nào khớp với tìm kiếm của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
}