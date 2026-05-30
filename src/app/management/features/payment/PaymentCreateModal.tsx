import { useState } from "react";
import { X } from "lucide-react";
import { ManualPaymentRequest } from "../../../services/payment/payment.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ManualPaymentRequest) => Promise<boolean>;
}

export function PaymentCreateModal({ isOpen, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<ManualPaymentRequest>({ 
    bookingId: 0, 
    amount: 0, 
    paymentMethod: "BANK_TRANSFER", 
    referenceCode: "", 
    note: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Gửi data sạch lên API
    const payload = {
      ...formData,
      bookingId: Number(formData.bookingId),
      amount: Number(formData.amount),
      referenceCode: formData.referenceCode?.trim() || undefined,
      note: formData.note?.trim() || undefined
    };

    const success = await onSave(payload);
    if (success) onClose();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">Ghi nhận thu tiền</h2>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-full text-slate-400 transition-colors"><X size={20} strokeWidth={3} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Mã Booking (ID) *</label>
              <input required type="number" value={formData.bookingId || ""} onChange={e => setFormData({...formData, bookingId: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-600" placeholder="VD: 123" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Số tiền thu (VNĐ) *</label>
              <input required type="number" value={formData.amount || ""} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-emerald-600" placeholder="1000000" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Phương thức thanh toán *</label>
            <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">
              <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
              <option value="CASH">Tiền mặt tại quầy</option>
              <option value="POS">Quẹt thẻ POS</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Mã tham chiếu (Mã GD Ngân hàng)</label>
            <input type="text" value={formData.referenceCode} onChange={e => setFormData({...formData, referenceCode: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Nhập mã GD nếu chuyển khoản..." />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Ghi chú thêm</label>
            <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="VD: Khách trả tiền mặt đợt 1..." rows={2} />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 mt-4 disabled:opacity-50 transition-colors">
            {isSubmitting ? "Đang xử lý..." : "Xác nhận thu tiền"}
          </button>
        </form>
      </div>
    </div>
  );
}