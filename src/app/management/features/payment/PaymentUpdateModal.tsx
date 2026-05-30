import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { PaymentResponse } from "../../../services/payment/payment.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentResponse | null;
  onUpdate: (id: number, status: string) => Promise<boolean>;
}

export function PaymentUpdateModal({ isOpen, onClose, payment, onUpdate }: Props) {
  const [status, setStatus] = useState<string>("PENDING");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (payment) setStatus(payment.status);
  }, [payment]);

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onUpdate(payment.id, status);
    if (success) onClose();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">Trạng thái giao dịch</h2>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full text-slate-400"><X size={20} strokeWidth={3} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Mã GD Hệ thống: <span className="text-blue-600">{payment.transactionId}</span></label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none mt-2">
              <option value="PENDING"> Chờ xác nhận </option>
              <option value="SUCCESS"> Đã nhận tiền thành công</option>
              <option value="FAILED"> Thất bại / Hủy bỏ</option>
              <option value="REFUNDED"> Đã hoàn tiền</option>
            </select>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}