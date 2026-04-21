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
    const isClosed = sessionStorage.getItem("promoBannerClosed");
    if (!isClosed) {
      setTimeout(() => setIsVisible(true), 2000);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes = 59; seconds = 59; hours > 0 && hours--; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
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
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-sm">
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-2xl shadow-2xl overflow-hidden border-2 border-white relative">
        
        {/* Nút đóng (X) thuần HTML */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Ưu đãi đặc biệt!</h3>
              <p className="text-white/90 text-sm">Giảm giá lên đến 30%</p>
            </div>
          </div>

          <p className="text-white/95 text-sm mb-4">
            Đặt tour ngay hôm nay để nhận ưu đãi độc quyền! Áp dụng trong tháng 6.
          </p>

          {/* Countdown display */}
          <div className="flex items-center gap-2 mb-4 bg-white/10 rounded-lg p-3">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Kết thúc trong:</span>
            <div className="flex gap-1 ml-auto">
              {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <div className="bg-white/20 rounded px-2 py-1">
                    <span className="text-white font-bold text-sm">
                      {String(unit).padStart(2, "0")}
                    </span>
                  </div>
                  {i < 2 && <span className="text-white">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Nút CTA thuần HTML (Bọc trong Link) */}
          <Link 
            to="/tours" 
            onClick={handleClose}
            className="block w-full bg-white text-[#2563eb] hover:bg-gray-100 font-bold text-center py-3 rounded-xl transition-all active:scale-95"
          >
            Khám phá ngay
          </Link>
        </div>
      </div>
    </div>
  );
}