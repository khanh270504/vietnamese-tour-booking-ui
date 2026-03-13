import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Kiểm tra email của bạn</h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email{" "}
            <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Nếu bạn không nhận được email trong vài phút, vui lòng kiểm tra thư mục spam hoặc thử lại.
          </p>
          <div className="space-y-3">
            <Link to="/login" className="block">
              <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]">
                Quay lại đăng nhập
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
            >
              Gửi lại email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2klMjBhbiUyMHZpZXRuYW0lMjBhbmNpZW50JTIwdG93bnxlbnwxfHx8fDE3NzI1MTA3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Travel Vietnam"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2563eb]/90 to-[#2563eb]/40 flex items-center justify-center p-12">
            <div className="text-white text-center">
              <h1 className="text-4xl font-bold mb-4">Quên mật khẩu?</h1>
              <p className="text-lg opacity-90">
                Đừng lo lắng, chúng tôi sẽ giúp bạn!
              </p>
              <p className="mt-2 opacity-75">
                Nhập email để nhận hướng dẫn đặt lại mật khẩu
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {/* Back Button */}
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563eb] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>

          {/* Logo - Mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#2563eb' }}>
              TravelVN
            </h1>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Quên mật khẩu</h2>
            <p className="text-gray-600">
              Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </div>
              ) : (
                "Gửi hướng dẫn"
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Nhớ mật khẩu rồi?{" "}
              <Link to="/login" className="text-[#2563eb] hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700">
              <strong>Lưu ý:</strong> Email khôi phục sẽ được gửi trong vòng 5-10 phút. Nếu không thấy email, vui lòng kiểm tra thư mục spam hoặc liên hệ bộ phận hỗ trợ của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
