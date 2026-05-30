import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api"; 

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

    // 🎯 1. VALIDATION TRƯỚC KHI GỬI
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!agreeTerms) {
      toast.error("Bạn cần đồng ý với điều khoản dịch vụ");
      return;
    }

    setIsLoading(true);

    try {
      // 🎯 2. GỌI API ĐĂNG KÝ
      // Cấu trúc request body khớp với DTO bên Java của ông giáo
      const response = await api.post("/auth/register", {
       fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone, 
        password: formData.password,
        confirmPassword: formData.confirmPassword 
      });

      // 🎯 3. XỬ LÝ KẾT QUẢ
      toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
      
      navigate("/login"); 

    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        
        {/* LEFT SIDE: QUẢNG BÁ (Branding) */}
        <div className="hidden lg:block lg:w-5/12 relative">
          <img 
            src="https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?q=80&w=1080" 
            alt="Travel VN" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2563eb]/90 backdrop-blur-[2px] flex items-center justify-center p-12 text-white">
            <div>
              <h1 className="text-5xl font-black mb-6 leading-[1.1]">Hành trình mới bắt đầu từ đây.</h1>
              <p className="text-lg font-medium opacity-80 mb-10">Gia nhập cộng đồng 10,000+ lữ hành gia tại TravelVN.</p>
              
              <div className="space-y-5">
                {["Xác nhận đơn ngay lập tức", "Tích điểm đổi quà tặng", "Ưu đãi thành viên mới"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                    <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]" />
                    <span className="font-bold text-sm tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORM ĐĂNG KÝ */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto max-h-[95vh]">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 mb-10 transition-all">
            <ArrowLeft size={14} />
            Về trang chủ
          </Link>

          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Đăng ký</h2>
            <p className="text-gray-400 font-bold text-sm">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập ngay</Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Họ tên khách hàng</label>
              <div className="relative group">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-500/20 focus:bg-white transition-all font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Địa chỉ Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@gmail.com"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-500/20 focus:bg-white transition-all font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Số điện thoại</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xx xxx xxx"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-500/20 focus:bg-white transition-all font-bold text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mật khẩu</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-14 pr-12 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-500/20 focus:bg-white transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nhập lại</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-14 pr-12 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 outline-none focus:border-blue-500/20 focus:bg-white transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <div className="relative mt-1">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="peer hidden" 
                />
                <div className="w-5 h-5 border-2 border-gray-200 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all shadow-sm" />
                <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
              </div>
              <span className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                Tôi đồng ý với <Link to="/terms" className="text-blue-600 hover:underline">Điều khoản</Link> & <Link to="/privacy" className="text-blue-600 hover:underline">Bảo mật</Link>
              </span>
            </label>

            <button 
              disabled={isLoading}
              className="w-full bg-[#2563eb] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Tạo tài khoản"}
            </button>
          </form>

          {/* SOCIAL REGISTER */}
          <div className="mt-12">
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8">
              <span className="bg-white px-5 z-10">Liên kết mạng xã hội</span>
              <div className="absolute top-1/2 left-0 w-full border-t border-gray-50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-50 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-[0.97]">
                <img src="https://www.svgrepo.com/show/475656/google.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-50 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-[0.97]">
                <img src="https://www.svgrepo.com/show/475647/facebook.svg" className="w-5 h-5" alt="Facebook" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}