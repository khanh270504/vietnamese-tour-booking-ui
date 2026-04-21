import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }

    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Email khôi phục đã được gửi!");
    }, 1500);
  };

  // Giao diện khi gửi thành công
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Kiểm tra hộp thư!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <br />
            <span className="font-bold text-gray-900 break-all">{email}</span>
          </p>
          
          <div className="space-y-3">
            <Link 
              to="/login" 
              className="block w-full py-3.5 bg-[#2563eb] text-white rounded-2xl font-bold hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
              Quay lại đăng nhập
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="w-full py-3.5 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              Gửi lại email khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Giao diện Form nhập email
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Cột trái - Decor & Branding */}
        <div className="hidden lg:block relative bg-[#2563eb]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center text-white">
            <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tight">Quên mật khẩu?</h1>
            <p className="text-lg text-blue-100 max-w-xs leading-relaxed">
              Đừng lo lắng, chuyện này thường xuyên xảy ra. Nhập email và chúng mình sẽ giúp bạn lấy lại tài khoản ngay!
            </p>
          </div>
        </div>

        {/* Cột phải - Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#2563eb] mb-10 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại đăng nhập
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Khôi phục mật khẩu</h2>
            <p className="text-gray-500 font-medium">An toàn và bảo mật là ưu tiên hàng đầu của TravelVN.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-black text-gray-700 uppercase tracking-wider">
                Địa chỉ Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2563eb] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#2563eb] transition-all font-medium text-gray-900"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#2563eb] text-white rounded-2xl font-black text-lg hover:bg-[#1d4ed8] shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </div>
              ) : (
                "Gửi hướng dẫn"
              )}
            </button>
          </form>

          {/* Tips box */}
          <div className="mt-10 p-5 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="flex gap-3">
              <div className="text-orange-500">💡</div>
              <p className="text-xs text-orange-800 leading-relaxed font-medium">
                Nếu bạn không tìm thấy email khôi phục trong <b>Hộp thư đến</b>, hãy thử kiểm tra mục <b>Quảng cáo</b> hoặc <b>Thư rác (Spam)</b> nhé!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}