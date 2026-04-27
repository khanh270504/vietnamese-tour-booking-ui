import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <>
      {/* Lớp nền mờ (Backdrop) */}
      <div
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Nội dung Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[70] w-[calc(100%-2rem)] max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header - Có nút X đóng nhanh */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Yêu cầu đăng nhập</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung thông báo */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">
              Vui lòng đăng nhập để xem và quản lý đơn hàng, bao gồm các tính năng như <span className="font-semibold text-gray-800">hủy tour</span> và <span className="font-semibold text-gray-800">hoàn tiền</span>.
            </p>
          </div>

          {/* Cặp nút hành động (Actions) - Thuần HTML & Tailwind */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors active:scale-95"
            >
              Để sau
            </button>
            <button
              onClick={handleLogin}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8] shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}