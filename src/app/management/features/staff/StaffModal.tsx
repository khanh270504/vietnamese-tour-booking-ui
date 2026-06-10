import { useState, useEffect } from "react";
import { X, Loader2, User, Mail, Phone, Briefcase, Lock, Building, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { staffService } from "../../../services/staff/staff.service";

// 🌟 ĐỊNH NGHĨA TYPE RÕ RÀNG THAY VÌ DÙNG 'ANY'
interface Department {
  departmentId: string | number;
  name: string;
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staff?: any; 
  departments: Department[];
}

export function StaffModal({ isOpen, onClose, onSuccess, staff, departments = [] }: StaffModalProps) {
  const [formData, setFormData] = useState({ 
    fullName: "", email: "", password: "", departmentId: "", position: "", phone: "", roleName: "" 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 🌟 State ẩn/hiện mật khẩu

  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setFormData({ 
          fullName: staff.fullName || "", 
          email: staff.email || "", 
          password: "", 
          departmentId: staff.departmentId || "", 
          position: staff.position || "", 
          phone: staff.phone || "", 
          roleName: staff.roleName || "" 
        });
      } else {
        setFormData({ fullName: "", email: "", password: "", departmentId: "", position: "", phone: "", roleName: "" });
      }
      setShowPassword(false);
    }
  }, [staff, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🌟 Ngăn load lại trang khi submit form
    
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.roleName) {
      toast.error("Vui lòng điền đủ các trường bắt buộc (*)");
      return;
    }

    setLoading(true);
    try {
      if (staff) {
        await staffService.updateStaff(staff.staffId, formData);
        toast.success("Cập nhật thành công!");
      } else {
        if (!formData.password) {
          toast.error("Vui lòng nhập mật khẩu cho nhân viên mới!");
          setLoading(false);
          return;
        }
        await staffService.createStaff(formData);
        toast.success("Thêm nhân viên thành công!");
      }
      onSuccess(); 
      onClose();
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Có lỗi xảy ra"); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      
      {/* 🌟 Thay đổi từ div thường sang thẻ form để bắt được sự kiện gõ Enter */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] scale-in-center animate-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {staff ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        {/* BODY INPUTS */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 CustomScrollbar">
          
          {/* Nhóm 1: Thông tin cá nhân */}
          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Thông tin cá nhân
            </label>
            
            {/* Họ và tên */}
            <div className="relative group focus-within:text-blue-600 text-slate-400">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={18} />
              <input 
                required
                type="text"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 group-hover:bg-slate-100/50 focus:bg-white rounded-2xl border border-slate-200/80 outline-none font-semibold text-slate-700 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50/80" 
                placeholder="Họ và tên *" 
                value={formData.fullName} 
                onChange={e => setFormData({...formData, fullName: e.target.value})} 
              />
            </div>

            {/* Email */}
            <div className="relative group focus-within:text-blue-600 text-slate-400">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={18} />
              <input 
                required
                type="email"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 group-hover:bg-slate-100/50 focus:bg-white rounded-2xl border border-slate-200/80 outline-none font-semibold text-slate-700 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50/80" 
                placeholder="Địa chỉ Email *" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            {/* Số điện thoại */}
            <div className="relative group focus-within:text-blue-600 text-slate-400">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={18} />
              <input 
                type="tel"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 group-hover:bg-slate-100/50 focus:bg-white rounded-2xl border border-slate-200/80 outline-none font-semibold text-slate-700 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50/80" 
                placeholder="Số điện thoại" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
          </div>

          {/* Nhóm 2: Thông tin công việc */}
          <div className="space-y-3.5 pt-4 border-t border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Phân quyền & Tổ chức
            </label>
            
            {/* Chọn Quyền (Role) */}
            <div className="relative group focus-within:text-blue-600 text-slate-400">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={18} />
              <select 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 group-hover:bg-slate-100/50 focus:bg-white rounded-2xl border border-slate-200/80 outline-none font-bold text-slate-600 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50/80 appearance-none cursor-pointer" 
                value={formData.roleName} 
                onChange={e => setFormData({...formData, roleName: e.target.value})}
              >
                <option value="">Chọn vai trò hệ thống *</option>
                <option value="ADMIN">Quản trị viên (Admin)</option>
                <option value="SALE">Nhân viên Sale </option>
                <option value="KT">Nhân viên Kế toán</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2 text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Chọn Phòng ban */}
            <div className="relative group focus-within:text-blue-600 text-slate-400">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={18} />
              <select 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 group-hover:bg-slate-100/50 focus:bg-white rounded-2xl border border-slate-200/80 outline-none font-bold text-slate-600 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50/80 appearance-none cursor-pointer" 
                value={formData.departmentId} 
                onChange={e => setFormData({...formData, departmentId: e.target.value})}
              >
                <option value="">Thuộc phòng ban (Không bắt buộc)</option>
                {departments.map((d: Department) => (
                  <option key={d.departmentId} value={d.departmentId}>{d.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2 text-slate-400 text-[10px]">▼</div>
            </div>

            {/* Chức vụ cụ thể */}
            <div className="relative group focus-within:text-blue-600 text-slate-400">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={18} />
              <input 
                type="text"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 group-hover:bg-slate-100/50 focus:bg-white rounded-2xl border border-slate-200/80 outline-none font-semibold text-slate-700 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50/80" 
                placeholder="Chức vụ danh nghĩa (VD: Trưởng nhóm Sale)" 
                value={formData.position} 
                onChange={e => setFormData({...formData, position: e.target.value})} 
              />
            </div>
          </div>

          {/* Nhóm 3: Mật khẩu (Chỉ hiện khi tạo mới) */}
          {!staff && (
            <div className="space-y-3.5 pt-4 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                Bảo mật tài khoản
              </label>
              <div className="relative group focus-within:text-blue-600 text-slate-400">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 group-hover:bg-slate-100/50 focus:bg-white rounded-2xl border border-slate-200/80 outline-none font-bold text-slate-700 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50/80" 
                  placeholder="Mật khẩu khởi tạo tài khoản *" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                {/* Nút mắt ẩn/hiện mật khẩu */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTION BUTTON */}
        <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/40 rounded-b-[2rem]">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center min-h-[56px]"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : "LƯU THÔNG TIN NHÂN VIÊN"}
          </button>
        </div>
      </form>
    </div>
  );
}