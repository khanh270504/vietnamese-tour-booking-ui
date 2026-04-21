import { Link, useNavigate } from "react-router";
import { Heart, ShoppingBag, User, Shield, LogOut } from "lucide-react";
import { LoginModal } from "../features/auth/LoginModal";
import { useState, useEffect } from "react";

export function Header() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  });

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberMe");
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="text-2xl font-black tracking-tighter text-[#2563eb] group-hover:scale-105 transition-transform">
                TRAVEL<span className="text-orange-500">VN</span>
              </div>
            </Link>

            {/* Menu điều hướng */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
                Trang chủ
              </Link>
              <Link to="/tours" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
                Tour du lịch
              </Link>
              <Link to="/support" className="text-sm font-medium text-gray-600 hover:text-[#2563eb] transition-colors">
                Hỗ trợ
              </Link>
            </nav>

            {/* Các icon và nút hành động */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4 pr-4 border-r border-gray-100">
                {isLoggedIn && currentUser.role === "admin" && (
                  <Link to="/admin" className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                    <Shield className="w-4 h-4" />
                    <span>Quản trị</span>
                  </Link>
                )}
                <Link to="/wishlist" className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#2563eb] transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Yêu thích</span>
                </Link>
                <button 
                  onClick={handleMyOrdersClick}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#2563eb] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Đơn hàng</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pl-2">
                {!isLoggedIn ? (
                  <>
                    <Link 
                      to="/login"
                      className="px-4 py-2 text-sm font-bold text-[#2563eb] hover:bg-blue-50 rounded-xl transition-all"
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      to="/register"
                      className="px-4 py-2 text-sm font-bold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] shadow-md shadow-blue-100 transition-all active:scale-95"
                    >
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/profile" className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 hidden sm:inline">{currentUser.name || "Tài khoản"}</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Đăng xuất"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
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