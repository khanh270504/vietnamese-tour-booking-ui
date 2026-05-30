import { useState } from "react";
import { X, CheckCircle, Users, Ticket } from "lucide-react";
import { LeadResponse, LeadConvertRequest } from "../../../services/crm/crm.types";

interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadResponse;
  onConvert: (id: number, data: LeadConvertRequest) => void;
}

export function ConvertLeadModal({ isOpen, onClose, lead, onConvert }: ConvertLeadModalProps) {
  const [formData, setFormData] = useState<LeadConvertRequest>({
    adultCount: 1,
    childCount: 0,
    infantCount: 0,
    voucherCode: ""
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all">
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-slate-800">Xác Nhận Chốt Đơn</h2>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Khách hàng: <span className="text-blue-600">{lead.fullName}</span>
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onConvert(lead.id, formData); }} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Người lớn</label>
              <div className="relative">
                <Users size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" min={1} required value={formData.adultCount} onChange={e => setFormData({...formData, adultCount: Number(e.target.value)})} className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trẻ em</label>
              <div className="relative">
                <Users size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" min={0} value={formData.childCount} onChange={e => setFormData({...formData, childCount: Number(e.target.value)})} className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Em bé</label>
              <div className="relative">
                <Users size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" min={0} value={formData.infantCount} onChange={e => setFormData({...formData, infantCount: Number(e.target.value)})} className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mã Voucher (Nếu có)</label>
            <div className="relative">
              <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Nhập mã giảm giá..." value={formData.voucherCode} onChange={e => setFormData({...formData, voucherCode: e.target.value})} className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-emerald-600 outline-none focus:border-emerald-500 uppercase" />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_8px_20px_-6px_rgba(5,150,105,0.5)] transition-all mt-4">
            CHỐT ĐƠN & TẠO BOOKING
          </button>
        </form>
      </div>
    </div>
  );
}