import { useState } from "react";
import { useParams, Link } from "react-router";
import { Calendar, Clock, MapPin, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageFallback } from "../components/ImageFallback";

export function TourDetailPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("intro");

  const tourImages = [
    "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5hbmclMjB2aWV0bmFtJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwaXNsYW5kJTIwYmVhY2h8ZW58MXx8fHwxNzcyNDIyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const departureDates = [
    { date: "15/06/2026", seats: 5, status: "low" },
    { date: "22/06/2026", seats: 2, status: "low" },
    { date: "29/06/2026", seats: 12, status: "available" },
    { date: "06/07/2026", seats: 15, status: "available" },
    { date: "13/07/2026", seats: 0, status: "full" },
  ];

  const reviews = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      date: "20/05/2026",
      comment: "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, lịch trình hợp lý. Gia đình tôi rất hài lòng."
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 4,
      date: "15/05/2026",
      comment: "Chuyến đi thú vị, phong cảnh đẹp. Khách sạn tốt, ăn uống ngon."
    },
    {
      id: 3,
      name: "Lê Văn C",
      rating: 5,
      date: "10/05/2026",
      comment: "Đáng giá tiền! Sẽ đi cùng TravelVN cho những chuyến sau."
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length);
  };

  const tabContent = {
    intro: (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="font-semibold text-lg mb-4">Giới thiệu về tour</h3>
        <p className="text-gray-600 mb-4">
          Tour Vịnh Hạ Long - Đảo Cát Bà là một trong những tour du lịch hấp dẫn nhất tại Việt Nam.
          Bạn sẽ được trải nghiệm vẻ đẹp kỳ vĩ của Di sản Thiên nhiên Thế giới, khám phá các hang động
          nổi tiếng và tận hưởng không gian trong lành của biển cả.
        </p>
        <h4 className="font-semibold mb-2">Điểm nổi bật:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Du thuyền 5 sao trên Vịnh Hạ Long</li>
          <li>Tham quan Hang Sửng Sốt, Hang Thiên Cung</li>
          <li>Kayaking khám phá làng chài</li>
          <li>Nghỉ dưỡng tại đảo Cát Bà</li>
          <li>Thưởng thức hải sản tươi sống</li>
        </ul>
      </div>
    ),
    itinerary: (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="font-semibold text-lg mb-4">Lịch trình chi tiết</h3>
        <div className="space-y-6">
          <div className="border-l-4 border-[#2563eb] pl-4">
            <h4 className="font-semibold mb-2">Ngày 1: Hà Nội - Hạ Long</h4>
            <p className="text-gray-600 text-sm mb-2">07:00 - Xe đón tại điểm hẹn</p>
            <p className="text-gray-600 text-sm mb-2">12:00 - Lên tàu, check-in cabin</p>
            <p className="text-gray-600 text-sm mb-2">14:00 - Tham quan Hang Sửng Sốt</p>
            <p className="text-gray-600 text-sm">19:00 - Bữa tối trên tàu</p>
          </div>
          <div className="border-l-4 border-[#2563eb] pl-4">
            <h4 className="font-semibold mb-2">Ngày 2: Hạ Long - Cát Bà</h4>
            <p className="text-gray-600 text-sm mb-2">06:00 - Tập thể dục buổi sáng</p>
            <p className="text-gray-600 text-sm mb-2">09:00 - Kayaking, tham quan làng chài</p>
            <p className="text-gray-600 text-sm mb-2">12:00 - Check-out, di chuyển đến Cát Bà</p>
            <p className="text-gray-600 text-sm">15:00 - Check-in khách sạn, tự do tắm biển</p>
          </div>
          <div className="border-l-4 border-[#2563eb] pl-4">
            <h4 className="font-semibold mb-2">Ngày 3: Cát Bà - Hà Nội</h4>
            <p className="text-gray-600 text-sm mb-2">08:00 - Ăn sáng, check-out</p>
            <p className="text-gray-600 text-sm mb-2">09:00 - Tham quan Vườn Quốc gia Cát Bà</p>
            <p className="text-gray-600 text-sm">17:00 - Về đến Hà Nội, kết thúc tour</p>
          </div>
        </div>
      </div>
    ),
    pricing: (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="font-semibold text-lg mb-4">Bảng giá tour</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Loại khách</th>
                <th className="px-4 py-3 text-right">Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3">Người lớn</td>
                <td className="px-4 py-3 text-right font-semibold" style={{ color: '#2563eb' }}>
                  5.990.000₫
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Trẻ em (5-11 tuổi)</td>
                <td className="px-4 py-3 text-right font-semibold" style={{ color: '#2563eb' }}>
                  4.490.000₫
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Trẻ nhỏ (dưới 5 tuổi)</td>
                <td className="px-4 py-3 text-right font-semibold" style={{ color: '#2563eb' }}>
                  Miễn phí
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Giá tour bao gồm:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Xe đưa đón theo chương trình</li>
            <li>Khách sạn 3-4 sao</li>
            <li>Ăn uống theo chương trình</li>
            <li>Vé tham quan các điểm trong lịch trình</li>
            <li>Hướng dẫn viên nhiệt tình</li>
            <li>Bảo hiểm du lịch</li>
          </ul>
        </div>
      </div>
    ),
    policy: (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="font-semibold text-lg mb-4">Chính sách hủy tour</h3>
        <div className="space-y-4 text-gray-600">
          <p>
            <span className="font-semibold">Hủy trước 30 ngày:</span> Hoàn 90% chi phí
          </p>
          <p>
            <span className="font-semibold">Hủy trước 15-29 ngày:</span> Hoàn 70% chi phí
          </p>
          <p>
            <span className="font-semibold">Hủy trước 7-14 ngày:</span> Hoàn 50% chi phí
          </p>
          <p>
            <span className="font-semibold">Hủy trong vòng 7 ngày:</span> Không hoàn lại chi phí
          </p>
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm">
              <span className="font-semibold">Lưu ý:</span> Chính sách hủy có thể thay đổi tùy theo từng tour
              và thời điểm đặt. Vui lòng liên hệ với bộ phận chăm sóc khách hàng để biết thêm chi tiết.
            </p>
          </div>
        </div>
      </div>
    ),
    reviews: (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-8 mb-6 pb-6 border-b">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: '#2563eb' }}>4.8</div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600">125 đánh giá</p>
          </div>
          <div className="flex-1">
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded">
              Viết đánh giá
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-semibold">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="mb-8">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <ImageFallback
            src={tourImages[currentImageIndex]}
            alt="Tour"
            className="w-full h-full object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {tourImages.length}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {tourImages.map((image, index) => (
            <div
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${
                currentImageIndex === index ? 'border-[#2563eb]' : 'border-transparent'
              }`}
            >
              <ImageFallback
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>3 ngày 2 đêm</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>Khởi hành từ Hà Nội</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>Tối đa 30 người</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.8</span>
              <span className="text-gray-600">(125 đánh giá)</span>
            </div>
          </div>

          {/* Custom Tabs Section */}
          <div className="w-full">
            <div className="grid grid-cols-5 w-full mb-6">
              {[
                { id: "intro", label: "Giới thiệu" },
                { id: "itinerary", label: "Lịch trình" },
                { id: "pricing", label: "Bảng giá" },
                { id: "policy", label: "Chính sách hủy" },
                { id: "reviews", label: "Đánh giá" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#2563eb] text-[#2563eb]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {tabContent[activeTab as keyof typeof tabContent]}
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Giá từ</p>
              <p className="text-3xl font-bold" style={{ color: '#2563eb' }}>5.990.000₫</p>
              <p className="text-sm text-gray-500">/ người</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Ngày khởi hành</h3>
              <div className="space-y-2">
                {departureDates.map((departure, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      departure.status === 'full'
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                        : 'hover:border-[#2563eb]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{departure.date}</span>
                      </div>
                      {departure.status === 'full' ? (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Hết chỗ</span>
                      ) : departure.status === 'low' ? (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Còn {departure.seats} chỗ</span>
                      ) : (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Còn chỗ</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to={`/booking/${id}`}>
              <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-6 text-lg rounded">
                Đặt Tour Ngay
              </button>
            </Link>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</p>
              <p className="font-semibold" style={{ color: '#2563eb' }}>Hotline: 1900 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
