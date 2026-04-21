import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      
      let role = "customer";
      let name = "Khách hàng";
      
      if (email === "admin@travelvn.com" || email.includes("admin")) {
        role = "admin";
        name = "Quản trị viên";
        toast.success("Đăng nhập thành công với quyền Admin!");
      } else {
        toast.success("Chào mừng bạn quay trở lại!");
      }
      
      const userData = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: role,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(userData));
      if (rememberMe) localStorage.setItem("rememberMe", "true");
      
      role === "admin" ? navigate("/admin") : navigate("/");
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Đang kết nối với ${provider}...`);
    setTimeout(() => {
      toast.success(`Đăng nhập ${provider} thành công!`);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        
        {/* Cột trái - Hình ảnh & Thông điệp */}
        <div className="hidden lg:block relative overflow-hidden bg-blue-600">
          <img 
            src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 hover:scale-100 transition-transform duration-700" 
            alt="Vietnam Travel"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/20 flex flex-col items-center justify-center p-16 text-center">
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
              <div className="text-4xl font-black text-white tracking-tighter">TVN</div>
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">
              Khám phá vẻ đẹp <br /> Việt Nam
            </h1>
            <p className="text-blue-100 text-lg font-medium opacity-90 max-w-sm">
              Hàng nghìn tour du lịch đặc sắc đang chờ đợi dấu chân bạn.
            </p>
          </div>
        </div>

        {/* Cột phải - Form đăng nhập */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 mb-10 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Trang chủ
          </Link>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Đăng nhập</h2>
            <p className="text-gray-500 font-medium">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-bold">
                Tham gia ngay
              </Link>
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center justify-center gap-3 py-3.5 border-2 border-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
              Google
            </button>
            <button 
              onClick={() => handleSocialLogin("Facebook")}
              className="flex items-center justify-center gap-3 py-3.5 border-2 border-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="fb" />
              Facebook
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative px-4 bg-white text-xs font-black text-gray-400 uppercase tracking-widest">Hoặc dùng Email</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-600 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Ghi nhớ tôi</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-sm font-bold text-blue-600 hover:underline">Quên mật khẩu?</Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang kiểm tra...</> : "ĐĂNG NHẬP NGAY"}
            </button>
          </form>

          <p className="text-[11px] text-center text-gray-400 mt-10 leading-relaxed max-w-[280px] mx-auto">
            Bằng việc tiếp tục, bạn đồng ý với <Link to="/terms" className="underline hover:text-gray-600">Điều khoản sử dụng</Link> & <Link to="/privacy" className="underline hover:text-gray-600">Chính sách bảo mật</Link> của TravelVN.
          </p>
        </div>
      </div>
    </div>
  );
}