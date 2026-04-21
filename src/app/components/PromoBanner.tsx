import { useState, useEffect } from "react";
import { X, Gift, Clock } from "lucide-react";
import { Link } from "react-router";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Kiểm tra nếu user đã đóng banner trong session này
    const isClosed = sessionStorage.getItem("promoBannerClosed");
    if (!isClosed) {
      // Hiển thị banner sau 2 giây
      setTimeout(() => setIsVisible(true), 2000);
    }

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("promoBannerClosed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-sm animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl shadow-2xl overflow-hidden border-2 border-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Ưu đãi đặc biệt!</h3>
              <p className="text-white/90 text-sm">Giảm giá lên đến 30%</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-white/95 text-sm mb-4">
            Đặt tour ngay hôm nay để nhận ưu đãi độc quyền! Áp dụng cho tất cả các tour trong tháng 6.
          </p>

          {/* Countdown */}
          <div className="flex items-center gap-2 mb-4 bg-white/10 rounded-lg p-3">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Kết thúc trong:</span>
            <div className="flex gap-1 ml-auto">
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-bold text-sm">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="text-white">:</span>
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-bold text-sm">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-white">:</span>
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-bold text-sm">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link to="/tours" onClick={handleClose}>
            <button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold px-4 py-2 rounded">
              Khám phá ngay
            </button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </div>
    </div>
  );
}
