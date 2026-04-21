import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Phone, ArrowLeft } from "lucide-react";
import { ImageFallback } from "../components/ImageFallback";

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      console.log("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!formData.email.includes("@")) {
      console.log("Email không hợp lệ");
      return;
    }

    if (formData.phone.length < 10) {
      console.log("Số điện thoại không hợp lệ");
      return;
    }

    if (formData.password.length < 6) {
      console.log("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!agreeTerms) {
      console.log("Vui lòng đồng ý với điều khoản dịch vụ");
      return;
    }

    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Đăng ký thành công! Chào mừng bạn đến với TravelVN");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    }, 1500);
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Đang kết nối với ${provider}...`);
    setTimeout(() => {
      console.log(`Đăng ký ${provider} thành công!`);
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
            src="https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwaXNsYW5kJTIwYmVhY2h8ZW58MXx8fHwxNzcyNDIyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Travel Vietnam"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2563eb]/90 to-[#2563eb]/40 flex items-center justify-center p-12">
            <div className="text-white text-center">
              <h1 className="text-4xl font-bold mb-4">Bắt đầu hành trình!</h1>
              <p className="text-lg opacity-90">
                Tham gia cộng đồng yêu du lịch
              </p>
              <p className="mt-2 opacity-75">
                Khám phá Việt Nam với hàng nghìn tour độc đáo
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center max-h-screen overflow-y-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563eb] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>

          {/* Logo - Mobile */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: '#2563eb' }}>
              TravelVN
            </h1>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Đăng ký tài khoản</h2>
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-[#2563eb] hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Social Register */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="w-full h-11 border-2 border-gray-300 hover:bg-gray-50 rounded px-4 flex items-center justify-center"
              onClick={() => handleSocialRegister("Google")}
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
              Đăng ký với Google
            </button>
            <button
              type="button"
              className="w-full h-11 border-2 border-gray-300 hover:bg-gray-50 rounded px-4 flex items-center justify-center"
              onClick={() => handleSocialRegister("Facebook")}
            >
              <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng ký với Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Hoặc đăng ký với email</span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0912345678"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-11"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-11"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="terms"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                Tôi đồng ý với{" "}
                <Link to="/terms" className="text-[#2563eb] hover:underline">
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="text-[#2563eb] hover:underline">
                  Chính sách bảo mật
                </Link>{" "}
                của TravelVN
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </div>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>

          {/* Terms Note */}
          <p className="text-xs text-center text-gray-500 mt-4">
            Bằng việc đăng ký, bạn xác nhận đã đọc và hiểu các điều khoản của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}
