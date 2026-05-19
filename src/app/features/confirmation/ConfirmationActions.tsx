import { Link } from "react-router-dom";
import { Download, Printer } from "lucide-react";

interface ConfirmationActionsProps {
  orderId: string;
}

export function ConfirmationActions({ orderId }: ConfirmationActionsProps) {
  return (
    <>
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/profile/bookings" className="w-full">
          <button className="w-full px-4 py-3.5 border-2 border-gray-200 bg-white text-gray-700 font-bold rounded-xl hover:border-gray-900 hover:text-gray-900 transition-all">
            Xem đơn của tôi
          </button>
        </Link>
        <button className="w-full px-4 py-3.5 border-2 border-gray-200 bg-white text-gray-700 font-bold rounded-xl hover:border-[#2563eb] hover:text-[#2563eb] transition-all flex items-center justify-center">
          <Download className="w-5 h-5 mr-2" />
          Tải về PDF
        </button>
        <button 
          onClick={() => window.print()}
          className="w-full px-4 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-lg"
        >
          <Printer className="w-5 h-5 mr-2" />
          In biên lai
        </button>
      </div>

      {/* Support Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-blue-900 mb-1">Cần hỗ trợ?</h3>
          <p className="text-sm text-blue-700 font-medium">
            Vui lòng cung cấp mã đơn <span className="font-bold bg-white px-2 py-0.5 rounded text-blue-600">{orderId}</span> khi liên hệ.
          </p>
        </div>
        <div className="flex gap-4 font-bold text-sm bg-white px-6 py-4 rounded-xl border border-blue-100 shadow-sm w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Hotline</span>
            <span className="text-blue-600">1900 1234</span>
          </div>
          <div className="w-px bg-gray-100"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</span>
            <span className="text-blue-600">hotro@travel.vn</span>
          </div>
        </div>
      </div>
    </>
  );
}