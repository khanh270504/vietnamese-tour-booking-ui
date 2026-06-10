import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  User,
  Shield,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { LoginModal } from "../features/auth/LoginModal";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logOut } from "../redux/authSlice";
import { authService } from "../services/auth/auth.service";
import { cn } from "../lib/utils";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  // Xử lý click ra ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Khóa cuộn trang khi mở menu Mobile
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [mobileMenuOpen]);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMyOrdersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    navigate("/my-orders");
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    }
    dispatch(logOut());
    setUserDropdownOpen(false);
    navigate("/");
  };

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Tour du lịch", path: "/tours" },
    { name: "Tra cứu", path: "/lookup" },
    { name: "Hỗ trợ", path: "/support" },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-20 items-center justify-between">
            
            {/* ==================== LOGO ==================== */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex items-center gap-1.5 text-2xl font-black tracking-tighter text-blue-600 group-hover:scale-105 transition-transform duration-300">
                <Sparkles size={24} className="text-orange-500 animate-pulse" fill="currentColor" />
                TRAVEL<span className="text-orange-500">VN</span>
              </div>
            </Link>

            {/* ==================== DESKTOP NAV ==================== */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative text-sm font-black transition-colors py-2 group",
                      isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
                    )}
                  >
                    {item.name}
                    <span className={cn(
                      "absolute left-1/2 -translate-x-1/2 -bottom-1 h-1 rounded-t-full bg-blue-600 transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                );
              })}
            </nav>

            {/* ==================== RIGHT SIDE ==================== */}
            <div className="flex items-center gap-4">
              
              {/* DESKTOP ACTIONS */}
              <div className="hidden lg:flex items-center gap-4 pr-6 border-r border-slate-200">
                {(user?.role?.includes("ADMIN") || user?.role?.includes("admin")) && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-black hover:shadow-lg transition-all active:scale-95"
                  >
                    <Shield size={14} /> QUẢN TRỊ
                  </Link>
                )}

                {/* <Link to="/wishlist" className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-rose-500 transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-rose-50 transition-colors"><Heart size={20} /></div>
                  <span className="hidden xl:inline">Yêu thích</span>
                </Link> */}

                <button
                  onClick={handleMyOrdersClick}
                  className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-600 transition-colors group"
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors"><ShoppingBag size={20} /></div>
                  <span className="hidden xl:inline">Đơn hàng</span>
                </button>
              </div>

              {/* AUTH & USER DROPDOWN */}
              {!isLoggedIn ? (
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="rounded-2xl px-5 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                  >
                    ĐĂNG NHẬP
                  </button>
                  <Link
                    to="/register"
                    className="rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                  >
                    ĐĂNG KÝ
                  </Link>
                </div>
              ) : (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 pr-4 hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-0.5">Thành viên</span>
                      <span className="text-xs font-black text-slate-800 leading-none truncate max-w-[100px]">
                        {user?.name?.split(" ")[0] || "Tài khoản"}
                      </span>
                    </div>
                    <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-300", userDropdownOpen && "rotate-180")} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
                      <div className="bg-slate-50/50 p-5 border-b border-slate-100">
                        <p className="text-sm font-black text-slate-900 truncate">{user?.name || "Tài khoản"}</p>
                        <p className="mt-1 text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link to="/profile" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <User size={18} /> Hồ sơ cá nhân
                        </Link>
                        <Link to="/my-orders" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <ShoppingBag size={18} /> Đơn đặt tour
                        </Link>
                        {/* <Link to="/wishlist" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                          <Heart size={18} /> Tour yêu thích
                        </Link> */}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors mt-2">
                          <LogOut size={18} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE DRAWER ==================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setMobileMenuOpen(false)} />
          
          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-[320px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-1.5 text-xl font-black text-blue-600">
                <Sparkles size={20} className="text-orange-500" /> TRAVEL<span className="text-orange-500">VN</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50">
                <X size={20} />
              </button>
            </div>

            {isLoggedIn && (
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
                    <User size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-black text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="block rounded-2xl px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50 active:bg-slate-100">
                  {item.name}
                </Link>
              ))}
              
              <div className="h-px bg-slate-100 my-4 mx-2" />

              {/* <Link to="/wishlist" className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50 active:bg-slate-100">
                <Heart size={20} className="text-rose-500" /> Tour yêu thích
              </Link> */}
              <button onClick={handleMyOrdersClick} className="w-full flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50 active:bg-slate-100">
                <ShoppingBag size={20} className="text-blue-500" /> Quản lý đơn hàng
              </button>

              {(user?.role?.includes("ADMIN") || user?.role?.includes("admin")) && (
                <Link to="/admin" className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 bg-slate-100 mt-2">
                  <Shield size={20} /> Trang Quản Trị
                </Link>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-black text-sm active:bg-slate-100">
                    ĐĂNG NHẬP
                  </button>
                  <Link to="/register" className="w-full py-3.5 rounded-2xl bg-blue-600 text-white text-center font-black text-sm shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                    ĐĂNG KÝ NGAY
                  </Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-50 py-4 text-sm font-black text-rose-600 active:bg-rose-100 transition-colors">
                  <LogOut size={18} /> ĐĂNG XUẤT TÀI KHOẢN
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}