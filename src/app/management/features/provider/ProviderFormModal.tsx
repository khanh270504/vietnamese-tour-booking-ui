import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ProviderRequest, ProviderResponse, ServiceType, ProviderStatus } from "../../../services/provider/provider.types";
import { cn } from "../../../lib/utils";

interface ProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderResponse | null; // Nếu null là Thêm mới, có data là Sửa
  onSubmit: (data: ProviderRequest) => Promise<boolean>;
}

const defaultForm: ProviderRequest = {
  name: "",
  serviceType: "HOTEL",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  status: "ACTIVE",
};

export function ProviderFormModal({ isOpen, onClose, provider, onSubmit }: ProviderFormModalProps) {
  const [formData, setFormData] = useState<ProviderRequest>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Điền data vào form nếu là chế độ Sửa
  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        serviceType: provider.serviceType,
        contactPerson: provider.contactPerson,
        phone: provider.phone,
        email: provider.email || "",
        address: provider.address || "",
        status: provider.status,
      });
    } else {
      setFormData(defaultForm);
    }
  }, [provider, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);
    if (success) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden scale-in-95">
        
        {/* Header Modal */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-900">
            {provider ? "Chỉnh sửa đối tác" : "Thêm nhà cung cấp mới"}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            
            {/* Tên & Loại dịch vụ */}
            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên Nhà cung cấp <span className="text-rose-500">*</span></label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="VD: Khách sạn Mường Thanh" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
            </div>
            
            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Loại Dịch vụ <span className="text-rose-500">*</span></label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all appearance-none cursor-pointer">
                <option value="HOTEL">Khách sạn / Lưu trú</option>
                <option value="TRANSPORT">Xe khách / Vận chuyển</option>
                <option value="RESTAURANT">Nhà hàng / Ẩm thực</option>
                <option value="ATTRACTION">Vé / Khu tham quan</option>
                <option value="OTHER">Dịch vụ khác</option>
              </select>
            </div>

            {/* Người liên hệ & SĐT */}
            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Người liên hệ <span className="text-rose-500">*</span></label>
              <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="VD: Mr. Tuấn (Sale)" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số điện thoại <span className="text-rose-500">*</span></label>
              <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="090..." className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
            </div>

            {/* Email & Trạng thái */}
            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@domain.com" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái Hợp tác</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all appearance-none cursor-pointer">
                <option value="ACTIVE">Đang hợp tác (ACTIVE)</option>
                <option value="PENDING">Chờ duyệt (PENDING)</option>
                <option value="INACTIVE">Ngừng hợp tác (INACTIVE)</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Địa chỉ</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Số nhà, đường, quận, thành phố..." className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" disabled={isSubmitting} className={cn("px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all", isSubmitting && "opacity-70 cursor-not-allowed")}>
              {isSubmitting ? "Đang lưu..." : provider ? "Lưu thay đổi" : "Tạo đối tác"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}