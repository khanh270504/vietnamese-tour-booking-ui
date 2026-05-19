import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/auth/auth.service"; 
import { GoogleLogin } from "@react-oauth/google";
// 🎯 1. Import Redux
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice'; 

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 🎯 2. Khởi tạo dispatch
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (rememberMe) {
        localStorage.setItem("rememberMe", email);
      } else {
        localStorage.removeItem("rememberMe");
      }
      
      // 🎯 Bắn vào Redux khi login Email
      const user = authService.getUserProfile();
      dispatch(setCredentials({ token: response.result.token, user }));

      toast.success("Đăng nhập thành công!");
      navigate(user?.role?.includes("ADMIN") ? "/admin" : "/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Email hoặc mật khẩu không chính xác!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      
      // 🎯 Bắn vào Redux khi login Google
      const user = authService.getUserProfile();
      dispatch(setCredentials({ token: response.result.token, user }));

      toast.success("Đăng nhập Google thành công!");
      navigate("/");
    } catch (error: any) {
      console.error("Lỗi:", error);
      toast.error("Không thể xác thực với Google!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Tính năng đăng nhập ${provider} đang được phát triển...`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        
        {/* Cột trái - Giữ nguyên thiết kế */}
        <div className="hidden lg:block relative overflow-hidden bg-blue-600">
          <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 hover:scale-100 transition-transform duration-700" alt="Vietnam Travel" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/20 flex flex-col items-center justify-center p-16 text-center">
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
              <div className="text-4xl font-black text-white tracking-tighter">TVN</div>
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">Khám phá vẻ đẹp <br /> Việt Nam</h1>
          </div>
        </div>

        {/* Cột phải - Giữ nguyên thiết kế */}
        <div className="p-8 lg:p-16 flex flex-col justify-center relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 mb-10 transition-colors group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Về trang chủ
          </Link>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Đăng nhập</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center justify-center overflow-hidden h-[52px] rounded-2xl border-2 border-gray-50 hover:bg-gray-50 transition-all shadow-sm">
              <GoogleLogin 
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Bị lỗi khi mở bảng đăng nhập Google!")}
                useOneTap={false} // Tắt FedCM để tránh lỗi 403
                shape="rectangular"
                text="signin_with"
              />
            </div>
            <button onClick={() => handleSocialLogin("Facebook")} className="flex items-center justify-center gap-3 h-[52px] border-2 border-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="fb" /> Facebook
            </button>
          </div>

          {/* Form đăng nhập giữ nguyên JSX... */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Email */}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-600 transition-all font-medium" placeholder="traveler@example.com" />
            {/* Input Pass */}
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-600 transition-all font-medium" placeholder="••••••••" />
            
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700">
              {isLoading ? <Loader2 className="animate-spin" /> : "ĐĂNG NHẬP NGAY"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}