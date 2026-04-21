import { Link, useNavigate } from "react-router";
import { Heart, ShoppingBag, User, Shield } from "lucide-react";
import { LoginModal } from "./LoginModal";
import { useState, useEffect } from "react";

export function Header() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Kiểm tra trạng thái đăng nhập từ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  });

  // Theo dõi thay đổi localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "{}"));
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleMyOrdersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate("/my-orders");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold" style={{ color: '#2563eb' }}>
                TravelVN
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm hover:text-[#2563eb] transition-colors">
                Trang chủ
              </Link>
              <Link to="/tours" className="text-sm hover:text-[#2563eb] transition-colors">
                Tour du lịch
              </Link>
              <Link to="/support" className="text-sm hover:text-[#2563eb] transition-colors">
                Hỗ trợ
              </Link>
            </nav>

            {/* Right Side Icons and Buttons */}
            <div className="flex items-center gap-4">
              {/* Admin Link - Only show for admin users */}
              {isLoggedIn && currentUser.role === "admin" && (
                <Link to="/admin" className="hidden md:flex items-center gap-1 text-sm hover:text-[#2563eb] transition-colors">
                  <Shield className="w-5 h-5" />
                  <span>Quản trị</span>
                </Link>
              )}
              <Link to="/wishlist" className="hidden md:flex items-center gap-1 text-sm hover:text-[#2563eb] transition-colors">
                <Heart className="w-5 h-5" />
                <span>Yêu thích</span>
              </Link>
              <a 
                href="/my-orders" 
                onClick={handleMyOrdersClick}
                className="hidden md:flex items-center gap-1 text-sm hover:text-[#2563eb] transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Đơn của tôi</span>
              </a>
              <Link to="/profile" className="hidden md:flex items-center gap-1 text-sm hover:text-[#2563eb] transition-colors">
                <User className="w-5 h-5" />
                <span>Tài khoản</span>
              </Link>
              <div className="flex items-center gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login">
                      <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 text-sm rounded">
                        Đăng nhập
                      </button>
                    </Link>
                    <Link to="/register">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">
                        Đăng ký
                      </button>
                    </Link>
                  </>
                ) : (
                  <button 
                    className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 text-sm rounded"
                    onClick={() => {
                      setIsLoggedIn(false);
                      localStorage.removeItem("isLoggedIn");
                      localStorage.removeItem("rememberMe");
                      navigate("/");
                    }}
                  >
                    Đăng xuất
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}