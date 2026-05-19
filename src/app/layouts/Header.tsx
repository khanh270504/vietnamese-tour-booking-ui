import { Link, useNavigate } from "react-router-dom";

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

export function Header() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  /*
  =========================================
  STATES
  =========================================
  */

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /*
  =========================================
  REDUX
  =========================================
  */

  const { isLoggedIn, user } = useSelector(
    (state: RootState) => state.auth
  );

  /*
  =========================================
  CLOSE DROPDOWN WHEN CLICK OUTSIDE
  =========================================
  */

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  /*
  =========================================
  HANDLERS
  =========================================
  */

  const handleMyOrdersClick = (
    e: React.MouseEvent
  ) => {

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

  /*
  =========================================
  NAV ITEMS
  =========================================
  */

  const navItems = [
    {
      name: "Trang chủ",
      path: "/",
    },
    {
      name: "Tour du lịch",
      path: "/tours",
    },
    {
      name: "Tra cứu",
      path: "/lookup",
    },
    {
      name: "Hỗ trợ",
      path: "/support",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl shadow-sm">

        <div className="container mx-auto px-4">

          <div className="flex h-20 items-center justify-between">

            {/* =========================================
                LOGO
            ========================================= */}

            <Link
              to="/"
              className="flex items-center gap-2 group"
            >

              <div className="flex items-center gap-1 text-2xl font-black tracking-tighter text-blue-600 group-hover:scale-105 transition-transform">

                <Sparkles
                  size={20}
                  className="text-orange-500"
                  fill="currentColor"
                />

                TRAVEL
                <span className="text-orange-500">
                  VN
                </span>
              </div>
            </Link>

            {/* =========================================
                DESKTOP NAV
            ========================================= */}

            <nav className="hidden md:flex items-center gap-8">

              {navItems.map((item) => (

                <Link
                  key={item.path}
                  to={item.path}
                  className="relative text-sm font-black text-gray-600 hover:text-blue-600 transition-colors group"
                >

                  {item.name}

                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />

                </Link>
              ))}
            </nav>

            {/* =========================================
                RIGHT SIDE
            ========================================= */}

            <div className="flex items-center gap-3">

              {/* =========================================
                  DESKTOP ACTIONS
              ========================================= */}

              <div className="hidden lg:flex items-center gap-5 pr-5 border-r border-gray-100">

                {(user?.role?.includes("ADMIN") ||
                  user?.role?.includes("admin")) && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs font-black text-orange-600 hover:bg-orange-100 transition-all"
                  >

                    <Shield size={14} />

                    QUẢN TRỊ
                  </Link>
                )}

                <Link
                  to="/wishlist"
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
                >

                  <Heart size={18} />

                  <span className="hidden xl:inline">
                    Yêu thích
                  </span>
                </Link>

                <button
                  onClick={handleMyOrdersClick}
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
                >

                  <ShoppingBag size={18} />

                  <span className="hidden xl:inline">
                    Đơn hàng
                  </span>
                </button>
              </div>

              {/* =========================================
                  MOBILE MENU BUTTON
              ========================================= */}

              <button
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="md:hidden p-2 rounded-xl hover:bg-gray-100"
              >

                <Menu size={24} />
              </button>

              {/* =========================================
                  AUTH
              ========================================= */}

              {!isLoggedIn ? (

                <div className="hidden md:flex items-center gap-2">

                  <button
                    onClick={() =>
                      setShowLoginModal(true)
                    }
                    className="rounded-2xl px-5 py-2.5 text-sm font-black text-blue-600 hover:bg-blue-50 transition-all"
                  >

                    ĐĂNG NHẬP
                  </button>

                  <Link
                    to="/register"
                    className="rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                  >

                    ĐĂNG KÝ
                  </Link>
                </div>

              ) : (

                /*
                =========================================
                USER DROPDOWN
                =========================================
                */

                <div
                  className="relative"
                  ref={dropdownRef}
                >

                  <button
                    onClick={() =>
                      setUserDropdownOpen(
                        !userDropdownOpen
                      )
                    }
                    className="flex items-center gap-3 rounded-full border border-gray-100 bg-gray-50 p-1.5 pr-4 hover:bg-gray-100 transition-all"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-sm">

                      <User size={18} />
                    </div>

                    <div className="hidden md:flex flex-col text-left">

                      <span className="text-[10px] font-black uppercase tracking-wide text-gray-400">

                        Thành viên
                      </span>

                      <span className="text-sm font-black text-gray-800">

                        {user?.name || "Tài khoản"}
                      </span>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        userDropdownOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* =========================================
                      DROPDOWN MENU
                  ========================================= */}

                  {userDropdownOpen && (

                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">

                      <div className="border-b border-gray-100 p-5">

                        <p className="text-sm font-black text-gray-900">

                          {user?.name || "Tài khoản"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">

                          {user?.email}
                        </p>
                      </div>

                      <div className="p-2">

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                        >

                          <User size={18} />

                          Hồ sơ
                        </Link>

                        <Link
                          to="/my-orders"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                        >

                          <ShoppingBag size={18} />

                          Đơn hàng
                        </Link>

                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                        >

                          <Heart size={18} />

                          Yêu thích
                        </Link>

                        {(user?.role?.includes("ADMIN") ||
                          user?.role?.includes(
                            "admin"
                          )) && (

                          <Link
                            to="/admin"
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50"
                          >

                            <Shield size={18} />

                            Quản trị
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50"
                        >

                          <LogOut size={18} />

                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =========================================
          MOBILE DRAWER
      ========================================= */}

      {mobileMenuOpen && (

        <div className="fixed inset-0 z-[100] md:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 flex h-full w-[290px] flex-col bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">

              <div className="flex items-center gap-1 text-2xl font-black tracking-tighter text-blue-600">

                <Sparkles
                  size={20}
                  className="text-orange-500"
                  fill="currentColor"
                />

                TRAVEL
                <span className="text-orange-500">
                  VN
                </span>
              </div>

              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-xl p-2 hover:bg-gray-100"
              >

                <X size={22} />
              </button>
            </div>

            {/* User */}
            {isLoggedIn && (

              <div className="border-b border-gray-100 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white">

                    <User size={20} />
                  </div>

                  <div>

                    <p className="font-black text-gray-900">

                      {user?.name}
                    </p>

                    <p className="text-xs text-gray-500">

                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="flex flex-col gap-1 p-4">

              {navItems.map((item) => (

                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >

                  {item.name}
                </Link>
              ))}

              <Link
                to="/wishlist"
                className="rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >

                Yêu thích
              </Link>

              <Link
                to="/my-orders"
                className="rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >

                Đơn hàng
              </Link>

              {(user?.role?.includes("ADMIN") ||
                user?.role?.includes("admin")) && (

                <Link
                  to="/admin"
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50"
                >

                  Quản trị
                </Link>
              )}
            </div>

            {/* Bottom */}
            <div className="mt-auto border-t border-gray-100 p-4">

              {!isLoggedIn ? (

                <div className="space-y-3">

                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-black"
                  >

                    Đăng nhập
                  </button>

                  <Link
                    to="/register"
                    className="block w-full rounded-2xl bg-blue-600 py-3 text-center text-sm font-black text-white"
                  >

                    Đăng ký
                  </Link>
                </div>

              ) : (

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-sm font-black text-red-500"
                >

                  <LogOut size={18} />

                  Đăng xuất
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          LOGIN MODAL
      ========================================= */}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() =>
          setShowLoginModal(false)
        }
      />
    </>
  );
}