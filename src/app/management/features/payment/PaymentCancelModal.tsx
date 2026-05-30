import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { PaymentResponse } from "../../../services/payment/payment.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentResponse | null;
  onCancelPayment: (id: number) => Promise<boolean>;
}

export function PaymentCancelModal({ isOpen, onClose, payment, onCancelPayment }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !payment) return null;

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onCancelPayment(payment.id);
    if (success) onClose();
    setIsSubmitting(false);
  };

  // Nếu đã hủy hoặc hoàn rồi thì không cho thao tác nữa
  const canCancel = payment.status === "SUCCESS" || payment.status === "PENDING";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">Chi tiết giao dịch</h2>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full text-slate-400"><X size={20} strokeWidth={3} /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 mb-1">Mã GD Hệ thống:</p>
            <p className="text-sm font-black text-blue-600">{payment.transactionId}</p>
            
            <p className="text-xs font-bold text-slate-500 mb-1 mt-3">Số tiền:</p>
            <p className="text-sm font-black text-emerald-600">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(payment.amount)}
            </p>

            <p className="text-xs font-bold text-slate-500 mb-1 mt-3">Trạng thái hiện tại:</p>
            <p className="text-sm font-black text-slate-800">{payment.status}</p>
          </div>
          
          {canCancel ? (
            <form onSubmit={handleCancel}>
              <div className="flex items-start gap-3 p-4 bg-orange-50 text-orange-700 rounded-xl mb-4 border border-orange-100">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">
                  Hành động này sẽ <b>Hủy</b> hoặc <b>Hoàn tiền</b> cho giao dịch này. Không thể hoàn tác. Bạn có chắc chắn?
                </p>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 disabled:opacity-50">
                {isSubmitting ? "Đang xử lý..." : "Xác nhận Hủy giao dịch"}
              </button>
            </form>
          ) : (
            <div className="text-center p-3 text-sm font-bold text-rose-500 bg-rose-50 rounded-xl">
              Giao dịch này đã bị Hủy/Hoàn tiền.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}