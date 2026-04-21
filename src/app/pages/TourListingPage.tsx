import { useState } from "react";
import { Filter } from "lucide-react";
import { TourCard } from "../components/TourCard";

export function TourListingPage() {
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [destination, setDestination] = useState("all");
  const [departureDate, setDepartureDate] = useState("");
  const [duration, setDuration] = useState("all");

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="danang">Đà Nẵng</option>
                <option value="halong">Hạ Long</option>
                <option value="phuquoc">Phú Quốc</option>
                <option value="sapa">Sapa</option>
                <option value="hoian">Hội An</option>
                <option value="nhatrang">Nha Trang</option>
                <option value="dalat">Đà Lạt</option>
                <option value="mientay">Miền Tây</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá: {priceRange[0].toLocaleString('vi-VN')}₫ - {priceRange[1].toLocaleString('vi-VN')}₫
              </label>
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="1000000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="1000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Departure Date Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khởi hành</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Duration Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số ngày</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="2-3">2-3 ngày</option>
                <option value="4-5">4-5 ngày</option>
                <option value="6+">6+ ngày</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Áp dụng
            </button>
          </div>
        </aside>

        {/* Tour Listing */}
        <div className="lg:col-span-3">
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-md p-4">
            <span className="text-sm text-gray-600">Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="popular">Phổ biến nhất</option>
            </select>
          </div>

          {/* Tour Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <button className="border border-gray-300 text-gray-300 px-4 py-2 rounded cursor-not-allowed">Trước</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">1</button>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded">2</button>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded">3</button>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}