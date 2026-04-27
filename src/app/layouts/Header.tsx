import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, User, Shield, LogOut, Sparkles } from "lucide-react";
import { LoginModal } from "../features/auth/LoginModal";
import { useState, useEffect } from "react";
import { authService } from "../services/auth/auth.service"; 

export function Header() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(authService.getUserProfile());

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(authService.isAuthenticated());
      setCurrentUser(authService.getUserProfile());
    };

    // Lắng nghe sự kiện storage để đồng bộ giữa các Tab
    window.addEventListener("storage", checkAuth);
    // Tự động kiểm tra lại sau mỗi lần render hoặc khi Token thay đổi
    checkAuth();

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleMyOrdersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate("/my-orders");
    }
  };

  const handleLogout = async () => {
    await authService.logout(); // Đợi API xóa Cookie ở Backend
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            
            {/* 1. LOGO */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="text-2xl font-black tracking-tighter text-[#2563eb] group-hover:scale-105 transition-transform flex items-center gap-1">
                <Sparkles className="text-orange-500" fill="currentColor" size={20} />
                TRAVEL<span className="text-orange-500">VN</span>
              </div>
            </Link>

            {/* 2. MENU ĐIỀU HƯỚNG (Desktop) */}
            <nav className="hidden md:flex items-center gap-8">
              {["Trang chủ", "Tour du lịch", "Hỗ trợ"].map((item, i) => (
                <Link 
                  key={i}
                  to={item === "Trang chủ" ? "/" : item === "Tour du lịch" ? "/tours" : "/support"} 
                  className="text-sm font-bold text-gray-600 hover:text-[#2563eb] transition-all relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2563eb] transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* 3. HÀNH ĐỘNG & AUTH */}
            <div className="flex items-center gap-4">
              
              {/* Nhóm Icons chức năng */}
              <div className="hidden lg:flex items-center gap-5 pr-5 border-r border-gray-100">
                {/* 🎯 Nút Admin (Chỉ hiện nếu role là ADMIN) */}
                {isLoggedIn && (currentUser?.role?.includes("ADMIN") || currentUser?.role?.includes("admin")) && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-xs font-black text-orange-600 bg-orange-50 px-3 py-2 rounded-xl hover:bg-orange-100 transition-all">
                    <Shield size={14} />
                    <span>QUẢN TRỊ</span>
                  </Link>
                )}

                <Link to="/wishlist" className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#2563eb] transition-colors">
                  <Heart size={18} />
                  <span className="hidden xl:inline">Yêu thích</span>
                </Link>

                <button onClick={handleMyOrdersClick} className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#2563eb] transition-colors">
                  <ShoppingBag size={18} />
                  <span className="hidden xl:inline">Đơn hàng</span>
                </button>
              </div>

              {/* Nhóm Đăng nhập / Profile */}
              <div className="flex items-center gap-2">
                {!isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="px-5 py-2.5 text-sm font-black text-[#2563eb] hover:bg-blue-50 rounded-2xl transition-all"
                    >
                      ĐĂNG NHẬP
                    </button>
                    <Link 
                      to="/register"
                      className="px-6 py-2.5 text-sm font-black bg-[#2563eb] text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                    >
                      ĐĂNG KÝ
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* User Profile Info */}
                    <Link to="/profile" className="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 rounded-full hover:bg-gray-100 border border-gray-100 transition-all">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-sm">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1 tracking-tighter">Thành viên</span>
                        <span className="text-sm font-black text-gray-800 leading-none">
                          {currentUser?.name || "Tài khoản"}
                        </span>
                      </div>
                    </Link>

                    {/* Nút Logout */}
                    <button 
                      onClick={handleLogout}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Đăng xuất"
                    >
                      <LogOut size={20} />
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