import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

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
  
  // Mock data - in reality, this would come from your data source
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
    },
    {
      id: 4,
      name: "Nha Trang 3N2Đ",
      location: "Khánh Hòa",
      duration: "3 ngày 2 đêm",
      price: 4200000,
      rating: 4.6,
      reviews: 256,
      image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400",
      status: "active",
      category: "Miền Trung"
    },
    {
      id: 5,
      name: "Đà Lạt 2N1Đ",
      location: "Lâm Đồng",
      duration: "2 ngày 1 đêm",
      price: 2900000,
      rating: 4.8,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=400",
      status: "active",
      category: "Miền Nam"
    },
    {
      id: 6,
      name: "Ninh Bình 2N1Đ",
      location: "Ninh Bình",
      duration: "2 ngày 1 đêm",
      price: 2500000,
      rating: 4.7,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400",
      status: "inactive",
      category: "Miền Bắc"
    }
  ]);

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (tourId: number) => {
    toast.success(`Đã xóa tour ID: ${tourId}`);
  };

  const activeTours = tours.filter(t => t.status === "active").length;
  const inactiveTours = tours.filter(t => t.status === "inactive").length;

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
                  Quản Lý Tours
                </h1>
                <p className="text-gray-600 mt-1">
                  Tổng số: {tours.length} tours
                </p>
              </div>
            </div>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tour mới
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng số tours</p>
                <p className="text-2xl font-bold text-[#2563eb]">{tours.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{activeTours}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tạm ngừng</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveTours}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tour theo tên, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className={`absolute top-3 right-3 ${
                    tour.status === "active" ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {tour.status === "active" ? "Hoạt động" : "Tạm ngừng"}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{tour.name}</CardTitle>
                <p className="text-sm text-gray-600">{tour.location}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-bold text-[#2563eb]">
                      {tour.price.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Đánh giá:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{tour.rating}</span>
                      <span className="text-gray-500">({tour.reviews})</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Xem
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(tour.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Không tìm thấy tour nào</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
