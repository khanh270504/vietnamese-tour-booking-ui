import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";


export function WishlistPage() {
  const wishlistTours = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 5990000,
      seatsLeft: 12,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5hbmclMjB2aWV0bmFtJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ",
      duration: "4 ngày 3 đêm",
      price: 7490000,
      seatsLeft: 3,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwaXNsYW5kJTIwYmVhY2h8ZW58MXx8fHwxNzcyNDIyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Phú Quốc Trọn Gói 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 6990000,
      seatsLeft: 8,
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1649530928914-c2df337e3007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBhJTIwdmlldG5hbSUyMG1vdW50YWluc3xlbnwxfHx8fDE3NzI1MTA3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Sapa - Fansipan - Hà Giang 4N3Đ",
      duration: "4 ngày 3 đêm",
      price: 5490000,
      seatsLeft: 10,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8" style={{ color: '#2563eb' }} />
          <h1 className="text-3xl font-bold">Tour yêu thích</h1>
        </div>
        <p className="text-gray-600">Bạn có {wishlistTours.length} tour trong danh sách yêu thích</p>
      </div>

      {wishlistTours.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Chưa có tour yêu thích</h2>
          <p className="text-gray-600 mb-6">
            Thêm các tour bạn quan tâm vào danh sách yêu thích để dễ dàng theo dõi
          </p>
          <Link to="/tours">
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 px-4 rounded-lg">
              Khám phá tour ngay
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
            
                <button className="absolute top-2 right-2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors group">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
                  {tour.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    Thời gian: {tour.duration}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Còn lại:</span>
                    <span className="font-semibold" style={{ color: '#2563eb' }}>
                      {tour.seatsLeft} chỗ
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Giá từ</p>
                    <p className="text-xl font-bold" style={{ color: '#2563eb' }}>
                      {tour.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/tours/${tour.id}`} className="flex-1">
                    <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 px-4 rounded-lg">
                      Xem chi tiết
                    </button>
                  </Link>
                  <button
                  
                    size="icon"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {wishlistTours.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Mẹo nhỏ</h3>
          <p className="text-sm text-gray-600">
            Thêm các tour vào danh sách yêu thích để nhận thông báo khi có chương trình khuyến mãi đặc biệt!
          </p>
        </div>
      )}
    </div>
  );
}