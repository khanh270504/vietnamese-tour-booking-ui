import { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { customerService } from '../../../services/customer/customer.service';
import { toast } from 'react-toastify';

interface Props {
  customerId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerProfileModal({ customerId, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Lấy dữ liệu hồ sơ chi tiết khi mở Modal
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await customerService.getAdminCustomerDetail(customerId);
        if (res.result) setFormData(res.result);
      } catch (error) {
        toast.error("Không thể tải hồ sơ khách hàng");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [customerId, onClose]);

  // 2. Xử lý sửa form
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Xử lý Lưu dữ liệu
  const handleSave = async () => {
    setIsSaving(true);
    try {
         await customerService.updateAdminCustomerProfile(customerId, formData);
        
        toast.success("Cập nhật hồ sơ thành công!");
        onSuccess(); // Refresh lại bảng ở ngoài
        onClose();   // Đóng modal
    } catch (error) {
        toast.error("Lỗi khi cập nhật hồ sơ");
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white font-bold animate-pulse">Đang tải hồ sơ...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><User size={20} /></div>
            <h2 className="text-lg font-black text-slate-900">Hồ Sơ Khách Hàng #{customerId}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* BODY - FORM */}
        <div className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Họ và tên</label>
                    <input type="text" name="fullName" value={formData?.fullName || ''} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                    <input type="text" name="phone" value={formData?.phone || ''} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Loại giấy tờ</label>
                    <input type="text" name="identityType" value={formData?.identityType || ''} onChange={handleChange} placeholder="VD: CCCD, Passport"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Mã số giấy tờ</label>
                    <input type="text" name="identityNumber" value={formData?.identityNumber || ''} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ</label>
                    <input type="text" name="address" value={formData?.address || ''} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Quốc tịch</label>
                    <input type="text" name="nationality" value={formData?.nationality || ''} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase text-amber-500">Điểm thành viên (Loyalty)</label>
                    <input type="number" name="loyaltyPoints" value={formData?.loyaltyPoints || 0} onChange={handleChange}
                        className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm font-black text-amber-600 outline-none" />
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all">
            Hủy bỏ
          </button>
          <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-50">
            <Save size={16} /> {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

      </div>
    </div>
  );
}