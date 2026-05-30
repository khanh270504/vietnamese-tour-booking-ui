import { useState, useEffect } from "react";
import { X, Gift, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    // 1. Kiểm tra xem phiên làm việc này khách đã tắt banner chưa
    const isClosed = sessionStorage.getItem("promoBannerClosed");
    if (!isClosed) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer); // Tránh rò rỉ bộ nhớ nếu user chuyển trang nhanh
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // 2. 🎯 SỬA LẠI LOGIC ĐẾM NGƯỢC CHUẨN ĐÉT
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(interval); // Hết giờ thì dừng đếm, không cho chạy âm
          return prev;
        }

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]); // Chỉ chạy bộ đếm khi banner thực sự hiển thị

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("promoBannerClosed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl shadow-2xl overflow-hidden border-2 border-white relative">
        
        {/* Nút đóng (X) */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Ưu đãi đặc biệt!</h3>
              <p className="text-white/90 text-sm">Giảm giá lên đến 30%</p>
            </div>
          </div>

          <p className="text-white/95 text-sm mb-4 leading-relaxed">
            Đặt tour ngay hôm nay để nhận ưu đãi độc quyền! Áp dụng cho các tour khởi hành trong tháng này.
          </p>

          {/* Countdown display */}
          <div className="flex items-center gap-2 mb-4 bg-white/10 rounded-lg p-3">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Kết thúc trong:</span>
            <div className="flex gap-1 ml-auto">
              {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <div className="bg-white/20 rounded px-2 py-1 min-w-[2rem] text-center">
                    <span className="text-white font-black text-sm tabular-nums">
                      {String(unit).padStart(2, "0")}
                    </span>
                  </div>
                  {i < 2 && <span className="text-white font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Nút CTA */}
          <Link 
            to="/tours" 
            onClick={handleClose}
            className="block w-full bg-white text-[#2563eb] hover:bg-gray-100 font-black text-center py-3 rounded-xl transition-all active:scale-95 shadow-lg"
          >
            Khám phá ngay
          </Link>
        </div>
      </div>
    </div>
  );
}