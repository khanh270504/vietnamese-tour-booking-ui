import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold mb-4" style={{ color: '#2563eb' }}>404</h1>
          <h2 className="text-3xl font-bold mb-4">Không tìm thấy trang</h2>
          <p className="text-gray-600 text-lg">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </button>
          </Link>
          <Link to="/tours">
            <button className="border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white">
              <Search className="w-4 h-4 mr-2" />
              Tìm tour
            </button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Bạn có thể quan tâm:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link to="/tours" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold mb-1">Tour du lịch</h4>
              <p className="text-sm text-gray-600">Khám phá các tour hấp dẫn</p>
            </Link>
            <Link to="/lookup" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold mb-1">Tra cứu đơn hàng</h4>
              <p className="text-sm text-gray-600">Kiểm tra trạng thái đơn</p>
            </Link>
            <Link to="/wishlist" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold mb-1">Tour yêu thích</h4>
              <p className="text-sm text-gray-600">Xem tour đã lưu</p>
            </Link>
            <Link to="/profile" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold mb-1">Tài khoản</h4>
              <p className="text-sm text-gray-600">Quản lý thông tin cá nhân</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
