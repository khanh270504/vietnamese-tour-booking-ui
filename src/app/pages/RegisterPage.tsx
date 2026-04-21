import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

    // Validation cơ bản
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!agreeTerms) {
      toast.error("Vui lòng đồng ý với điều khoản dịch vụ");
      return;
    }

    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Đăng ký thành công! Chào mừng bạn đến với TravelVN");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: QUẢNG BÁ (Chỉ hiện trên Desktop) */}
        <div className="hidden lg:block lg:w-5/12 relative">
          <img 
            src="https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?q=80&w=1080" 
            alt="Travel VN" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-600/80 backdrop-blur-[2px] flex items-center justify-center p-12">
            <div className="text-white">
              <h1 className="text-4xl font-black mb-6 leading-tight">Khám phá Việt Nam theo cách của bạn.</h1>
              <p className="text-lg font-medium opacity-90 mb-8">Hơn 1,000+ tour du lịch đang chờ đón bạn trải nghiệm.</p>
              
              <div className="space-y-4">
                {["Ưu đãi độc quyền", "Hỗ trợ 24/7", "Thanh toán an toàn"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORM ĐĂNG KÝ */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto max-h-[90vh]">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Tạo tài khoản mới</h2>
            <p className="text-gray-400 font-bold text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* HỌ VÀ TÊN */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Họ và tên</label>
              <div className="relative group">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  name="fullName"
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white transition-all font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="email"
                    type="email"
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>

              {/* SỐ ĐIỆN THOẠI */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Số điện thoại</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="phone"
                    onChange={handleChange}
                    placeholder="0912345678"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            {/* MẬT KHẨU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mật khẩu</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    className="w-full pl-14 pr-12 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Xác nhận</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={handleChange}
                    className="w-full pl-14 pr-12 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-200 focus:bg-white transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* TERMS CHECKBOX TỰ CHẾ */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-1">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="peer hidden" 
                />
                <div className="w-5 h-5 border-2 border-gray-200 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-500 leading-relaxed">
                Tôi đồng ý với <Link to="/terms" className="text-blue-600">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-blue-600">Chính sách bảo mật</Link>
              </span>
            </label>

            {/* SUBMIT BUTTON */}
            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Đăng ký ngay"}
            </button>
          </form>

          {/* SOCIAL REGISTER */}
          <div className="mt-10">
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-8">
              <span className="bg-white px-4 z-10">Hoặc đăng ký bằng</span>
              <div className="absolute top-1/2 left-0 w-full border-t border-gray-50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-50 font-bold text-xs hover:bg-gray-50 transition-all">
                <img src="https://www.svgrepo.com/show/475656/google.svg" className="w-5 h-5" alt="" />
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-50 font-bold text-xs hover:bg-gray-50 transition-all">
                <img src="https://www.svgrepo.com/show/475647/facebook.svg" className="w-5 h-5" alt="" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}