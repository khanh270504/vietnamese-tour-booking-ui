import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#2563eb' }}>
              TravelVN
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Đặt tour nhanh chóng - Giá tốt - Hỗ trợ tận tâm
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Phone className="w-4 h-4" />
              <span>Hotline: 1900 1234</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Mail className="w-4 h-4" />
              <span>info@travelvn.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Hà Nội, Việt Nam</span>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Đội ngũ
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Đối tác
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Chính sách hủy tour
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Chính sách thanh toán
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Gửi yêu cầu
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Hỗ trợ khách hàng
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  Gửi phản hồi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>© 2026 TravelVN. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
