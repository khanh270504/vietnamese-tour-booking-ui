import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { TourCard } from "../components/TourCard";
import { Slider } from "../components/ui/slider";

export function TourListingPage() {
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState("newest");

  const tours = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 5990000,
      seatsLeft: 12,
      departureDate: "15/06/2026"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5hbmclMjB2aWV0bmFtJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ",
      duration: "4 ngày 3 đêm",
      price: 7490000,
      seatsLeft: 3,
      departureDate: "20/06/2026"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwaXNsYW5kJTIwYmVhY2h8ZW58MXx8fHwxNzcyNDIyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Phú Quốc Trọn Gói 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 6990000,
      seatsLeft: 8,
      departureDate: "25/06/2026"
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1649530928914-c2df337e3007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBhJTIwdmlldG5hbSUyMG1vdW50YWluc3xlbnwxfHx8fDE3NzI1MTA3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Sapa - Fansipan - Hà Giang 4N3Đ",
      duration: "4 ngày 3 đêm",
      price: 5490000,
      seatsLeft: 10,
      departureDate: "30/06/2026"
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2klMjBhbiUyMHZpZXRuYW0lMjBhbmNpZW50JTIwdG93bnxlbnwxfHx8fDE3NzI1MTA3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Hội An - Huế - Động Phong Nha 5N4Đ",
      duration: "5 ngày 4 đêm",
      price: 8990000,
      seatsLeft: 0,
      departureDate: "05/07/2026"
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1562004966-39bfac0faf6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWtvbmclMjBkZWx0YSUyMHZpZXRuYW0lMjByaXZlcnxlbnwxfHx8fDE3NzI1MTA3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Miền Tây - Cần Thơ - Châu Đốc 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 4990000,
      seatsLeft: 20,
      departureDate: "10/07/2026"
    },
    {
      id: "7",
      image: "https://images.unsplash.com/photo-1677837564800-73a0bb0ef938?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5vaSUyMHZpZXRuYW0lMjBjaXR5fGVufDF8fHx8MTc3MjUxMDc2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Hà Nội - Ninh Bình - Tam Cốc 2N1Đ",
      duration: "2 ngày 1 đêm",
      price: 3490000,
      seatsLeft: 18,
      departureDate: "15/07/2026"
    },
    {
      id: "8",
      image: "https://images.unsplash.com/photo-1643030292895-caeed7e5d4f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhdmVsJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Nha Trang - Vinpearl Land 4N3Đ",
      duration: "4 ngày 3 đêm",
      price: 6790000,
      seatsLeft: 14,
      departureDate: "20/07/2026"
    },
    {
      id: "9",
      image: "https://images.unsplash.com/photo-1677837564800-73a0bb0ef938?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5vaSUyMHZpZXRuYW0lMjBjaXR5fGVufDF8fHx8MTc3MjUxMDc2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Đà Lạt - Thành Phố Ngàn Hoa 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 4590000,
      seatsLeft: 7,
      departureDate: "25/07/2026"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Danh sách tour du lịch</h1>
        <p className="text-gray-600">Tìm thấy {tours.length} tour</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Panel */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5" style={{ color: '#2563eb' }} />
              <h2 className="font-semibold text-lg">Bộ lọc</h2>
            </div>

            {/* Destination Filter */}
            <div className="mb-6">
              <Label className="mb-2 block">Điểm đến</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn điểm đến" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="danang">Đà Nẵng</SelectItem>
                  <SelectItem value="halong">Hạ Long</SelectItem>
                  <SelectItem value="phuquoc">Phú Quốc</SelectItem>
                  <SelectItem value="sapa">Sapa</SelectItem>
                  <SelectItem value="hoian">Hội An</SelectItem>
                  <SelectItem value="nhatrang">Nha Trang</SelectItem>
                  <SelectItem value="dalat">Đà Lạt</SelectItem>
                  <SelectItem value="mientay">Miền Tây</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <Label className="mb-2 block">
                Khoảng giá: {priceRange[0].toLocaleString('vi-VN')}₫ - {priceRange[1].toLocaleString('vi-VN')}₫
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={50000000}
                step={1000000}
                className="mt-4"
              />
            </div>

            {/* Departure Date Filter */}
            <div className="mb-6">
              <Label className="mb-2 block">Ngày khởi hành</Label>
              <Input type="date" />
            </div>

            {/* Duration Filter */}
            <div className="mb-6">
              <Label className="mb-2 block">Số ngày</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn số ngày" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="2-3">2-3 ngày</SelectItem>
                  <SelectItem value="4-5">4-5 ngày</SelectItem>
                  <SelectItem value="6+">6+ ngày</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]">
              Áp dụng
            </Button>
          </div>
        </aside>

        {/* Tour Listing */}
        <div className="lg:col-span-3">
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
            <span className="text-sm text-gray-600">Sắp xếp theo:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tour Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <Button variant="outline" disabled>Trước</Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Sau</Button>
          </div>
        </div>
      </div>
    </div>
  );
}