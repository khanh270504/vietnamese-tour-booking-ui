import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { ImageFallback } from "../components/ImageFallback";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      console.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!email.includes("@")) {
      console.error("Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      console.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if admin account
      let role = "customer";
      let name = "Khách hàng";
      
      if (email === "admin@travelvn.com" || email.includes("admin")) {
        role = "admin";
        name = "Quản trị viên";
        console.log("Đăng nhập thành công với quyền Admin!");
      } else {
        console.log("Đăng nhập thành công!");
      }
      
      // Save user info
      const userData = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: role,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Đang kết nối với ${provider}...`);
    // Giả lập social login
    setTimeout(() => {
      console.log(`Đăng nhập ${provider} thành công!`);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative">
          <ImageFallback
            src="https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Travel Vietnam"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2563eb]/90 to-[#2563eb]/40 flex items-center justify-center p-12">
            <div className="text-white text-center">
              <h1 className="text-4xl font-bold mb-4">Chào mừng trở lại!</h1>
              <p className="text-lg opacity-90">
                Khám phá Việt Nam cùng TravelVN
              </p>
              <p className="mt-2 opacity-75">
                Hàng nghìn tour du lịch đang chờ bạn
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563eb] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>

          {/* Logo - Mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#2563eb' }}>
              TravelVN
            </h1>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Đăng nhập</h2>
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-[#2563eb] hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="w-full h-11 border-2 border-gray-300 hover:bg-gray-50 rounded flex items-center justify-center"
              onClick={() => handleSocialLogin("Google")}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </button>
            <button
              type="button"
              className="w-full h-11 border-2 border-gray-300 hover:bg-gray-50 rounded flex items-center justify-center"
              onClick={() => handleSocialLogin("Facebook")}
            >
              <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng nhập với Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Hoặc đăng nhập với email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-[#2563eb] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-6">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <Link to="/terms" className="text-[#2563eb] hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link to="/privacy" className="text-[#2563eb] hover:underline">
              Chính sách bảo mật
            </Link>{" "}
            của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}