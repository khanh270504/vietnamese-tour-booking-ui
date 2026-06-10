import { useState } from "react";
// 1. Import thêm useLocation ở đây
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/auth/auth.service"; 
import { GoogleLogin } from "@react-oauth/google"; 
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice'; 

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Khởi tạo hook lấy vị trí
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🎯 3. HÀM ĐIỀU HƯỚNG THÔNG MINH DÙNG CHUNG CHO CẢ FORM VÀ GOOGLE
  const handleRedirectAfterLogin = (userRole: string | undefined) => {
    // Phân tích xem đường dẫn cũ từ Guard hoặc Modal truyền sang là Object hay String
    const fromState = location.state?.from;
    const redirectUrl = typeof fromState === "object" ? fromState.pathname : fromState;
    const destination = redirectUrl || "/";

    const cleanRole = userRole?.toUpperCase() || "";

    // Nếu là khối văn phòng (ADMIN hoặc SALE)
    if (cleanRole.includes("ADMIN") || cleanRole.includes("SALE")) {
      // Nếu trước đó họ đang cố vào 1 trang admin cụ thể (vd: /admin/bookings), trả họ về đó. 
      // Nếu không thì đưa vào trang tổng quan /admin
      navigate(destination.startsWith("/admin") ? destination : "/admin", { replace: true });
    } 
    // Nếu là khách hàng bình thường
    else {
      navigate(destination, { replace: true });
    }
  };

  // 1. Login bằng Email/Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (rememberMe) localStorage.setItem("rememberMe", email);
      
      const user = authService.getUserProfile();
      dispatch(setCredentials({ token: response.result.token, user }));

      toast.success("Đăng nhập thành công!");
      // Gọi hàm điều hướng thông minh
      handleRedirectAfterLogin(user?.role);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Email hoặc mật khẩu không chính xác!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
        
        {/* Banner */}
        <div className="hidden lg:block relative overflow-hidden bg-blue-600">
          <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Travel" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col items-center justify-center p-16 text-center">
            <h1 className="text-4xl font-black text-white mb-4">Khám phá Việt Nam</h1>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <Link to="/" className="text-sm font-bold text-slate-400 hover:text-blue-600 mb-10 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>

          <h2 className="text-4xl font-black text-slate-900 mb-8">Đăng nhập</h2>

          {/* 🎯 Google Login */}
          <div className="mb-8 w-full overflow-hidden rounded-2xl border-2 border-slate-100 h-[56px] flex items-center justify-center hover:border-slate-200 transition-all">
            <GoogleLogin 
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await authService.googleLogin(credentialResponse.credential!);
                  const user = authService.getUserProfile();
                  dispatch(setCredentials({ token: response.result.token, user }));
                  
                  toast.success("Đăng nhập thành công!");
                  // Gọi hàm điều hướng thông minh cho cả Google Login
                  handleRedirectAfterLogin(user?.role);
                } catch (err) {
                  toast.error("Xác thực thất bại!");
                }
              }}
              onError={() => toast.error("Lỗi xác thực Google!")}
              type="standard"
              theme="outline"
              size="large"
              width="400"
            />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-black uppercase text-slate-400">Hoặc email</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 py-4 bg-slate-50 rounded-2xl outline-none focus:border-blue-500 border-2 border-transparent" placeholder="Email" />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl outline-none focus:border-blue-500 border-2 border-transparent" placeholder="Mật khẩu" />
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black">
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "ĐĂNG NHẬP"}
            </button>
          </form>

          <p className="text-center text-sm font-semibold text-slate-500 mt-8">
            Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}