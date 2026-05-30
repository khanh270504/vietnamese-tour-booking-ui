import { useState, useEffect, useRef } from "react";
import { X, Edit3, Search, ChevronDown, Loader2, Calendar, DollarSign, Users } from "lucide-react";
import { 
  LeadResponse, 
  LeadUpdateRequest, 
  LeadStatus, 
  LeadPriority,
  LEAD_STATUS_LABELS, 
  LEAD_PRIORITY_LABELS 
} from "../../../services/crm/crm.types";
import { StaffProfileResponse } from "../../../services/staff/staff.types";
import { staffService } from "../../../services/staff/staff.service";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadResponse | null; 
  onUpdate: (id: number, data: LeadUpdateRequest) => void;
}

export function EditLeadModal({ isOpen, onClose, lead, onUpdate }: EditLeadModalProps) {
  const [formData, setFormData] = useState<LeadUpdateRequest>({ 
    fullName: "", 
    email: "", 
    status: "NEW", 
    priority: "WARM", // 🎯 Fix chuẩn Type
    estimatedPeople: undefined,
    estimatedBudget: undefined,
    expectedTravelDate: "", // 🎯 Thêm trường này để Backend tính tiền
    
    notes: "",
    assignedStaffId: undefined,
    lostReason: "" // 🎯 Hứng lý do mất khách
  });

  const [staffs, setStaffs] = useState<StaffProfileResponse[]>([]); 
  const [isLoadingStaffs, setIsLoadingStaffs] = useState(false);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [searchStaffQuery, setSearchStaffQuery] = useState("");
  const staffDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && lead) {
      let formattedFollowUp = "";
      if (lead.nextFollowUpAt) {
        formattedFollowUp = lead.nextFollowUpAt.substring(0, 16);
      }

      setFormData({
        fullName: lead.fullName || "",
        email: lead.email || "",
        status: (lead.status as LeadStatus) || "NEW",
        priority: (lead.priority as LeadPriority) || "WARM",
        estimatedPeople: (lead as any).estimatedPeople || undefined, 
        estimatedBudget: lead.estimatedBudget || undefined,
        expectedTravelDate: lead.expectedTravelDate || "", // 🎯 Nạp dữ liệu cũ
        
        notes: lead.notes || "",
        assignedStaffId: (lead as any).assignedStaffId || undefined,
        lostReason: (lead as any).lostReason || "" // 🎯 Nạp dữ liệu cũ
      });

      const fetchStaffs = async () => {
        setIsLoadingStaffs(true);
        try {
          const res = await staffService.getAllStaffs(); 
          const allStaff = res.result || [];
          const saleStaff = allStaff.filter((s: StaffProfileResponse) => 
            s.position?.toUpperCase().includes("SALE") || 
            s.departmentName?.toUpperCase().includes("SALE") ||
            s.departmentName?.toUpperCase().includes("KINH DOANH")
          );
          setStaffs(saleStaff);
        } catch (error) {
          console.error("Lỗi lấy danh sách nhân viên", error);
        } finally {
          setIsLoadingStaffs(false);
        }
      };

      fetchStaffs();
    }
  }, [isOpen, lead]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (staffDropdownRef.current && !staffDropdownRef.current.contains(event.target as Node)) {
        setIsStaffDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lead?.id) {
      const finalData = {
        ...formData,
       
        // Nếu không phải LOST thì clear lostReason đi cho sạch Data
        lostReason: formData.status === "LOST" ? formData.lostReason : undefined
      };
      onUpdate(lead.id, finalData);
    }
  };

  const filteredStaffs = staffs.filter(staff => 
    staff.fullName?.toLowerCase().includes(searchStaffQuery.toLowerCase()) ||
    staff.employeeCode?.toLowerCase().includes(searchStaffQuery.toLowerCase())
  );

  const selectedStaffName = staffs.find(s => s.staffId === formData.assignedStaffId)?.fullName || "Chọn Sale phụ trách...";

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-[1.8rem] sm:rounded-[2.5rem] p-5 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 relative custom-scrollbar">
        
        <button type="button" onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all duration-200 z-10 shadow-sm">
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <Edit3 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Cập Nhật Thông Tin Chăm Sóc</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                Mã khách: <span className="text-slate-600">{lead.leadCode}</span> | SĐT: <span className="text-slate-600">{lead.phone}</span> | Tour: <span className="text-blue-600">{lead.interestedTourName || "Chưa rõ"}</span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Họ và Tên Khách</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Email liên hệ</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="chưa có email..." />
            </div>

            <div className="relative">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Số khách dự kiến</label>
              <div className="relative">
                <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" min={1} value={formData.estimatedPeople || ""} onChange={e => setFormData({...formData, estimatedPeople: e.target.value ? Number(e.target.value) : undefined})} className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="VD: 4" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Ngân sách dự kiến (VNĐ)</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" min={0} value={formData.estimatedBudget || ""} onChange={e => setFormData({...formData, estimatedBudget: e.target.value ? Number(e.target.value) : undefined})} className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="VD: 15000000" />
              </div>
            </div>

            {/* 🎯 TRƯỜNG CRM MỚI: NGÀY ĐI DỰ KIẾN (Để chốt đơn tự động tính giá) */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày khởi hành dự kiến (Bắt buộc để tính giá)</label>
              <input 
                type="date" 
                value={formData.expectedTravelDate || ""} 
                onChange={e => setFormData({...formData, expectedTravelDate: e.target.value})} 
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700" 
              />
            </div>

            {/* 🎯 TỰ ĐỘNG MAP TỪ FILE TYPES ĐỂ TRÁNH LỖI GÕ TAY */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Mức độ ưu tiên</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as LeadPriority})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer">
                {Object.entries(LEAD_PRIORITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* 🎯 TỰ ĐỘNG MAP TỪ FILE TYPES ĐỂ TRÁNH LỖI GÕ TAY */}
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Trạng thái tiến độ</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as LeadStatus})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer">
                {Object.entries(LEAD_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* 🎯 HIỆN Ô LÝ DO NẾU CHỌN TRẠNG THÁI "LOST" */}
            {formData.status === "LOST" && (
              <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-100 rounded-xl animate-in slide-in-from-top-2">
                <label className="block text-[10px] sm:text-xs font-bold text-rose-600 uppercase mb-1.5">Lý do thất bại / Hủy bỏ *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.lostReason || ""} 
                  onChange={e => setFormData({...formData, lostReason: e.target.value})} 
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-xs sm:text-sm outline-none focus:border-rose-400" 
                  placeholder="VD: Khách chê giá đắt, Đã book bên khác..." 
                />
              </div>
            )}

          

            <div className="sm:col-span-2 relative" ref={staffDropdownRef}>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Bàn giao Sale phụ trách</label>
              <div 
                onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold cursor-pointer flex justify-between items-center hover:bg-white hover:border-blue-500 transition-all"
              >
                <span className="text-slate-800 truncate">{selectedStaffName}</span>
                {isLoadingStaffs ? <Loader2 size={14} className="animate-spin text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </div>

              {isStaffDropdownOpen && (
                <div className="absolute z-[110] top-full mt-1.5 left-0 w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                    <Search size={14} className="text-slate-400 ml-1" />
                    <input type="text" autoFocus placeholder="Tìm tên hoặc mã Sale..." value={searchStaffQuery} onChange={(e) => setSearchStaffQuery(e.target.value)} className="w-full bg-transparent p-1.5 text-xs sm:text-sm outline-none font-semibold text-slate-700" />
                  </div>
                  <div className="max-h-36 overflow-y-auto custom-scrollbar">
                    {filteredStaffs.map(staff => (
                      <div key={staff.staffId} onClick={() => { setFormData({...formData, assignedStaffId: staff.staffId}); setIsStaffDropdownOpen(false); setSearchStaffQuery(""); }} className={`px-4 py-2.5 cursor-pointer text-xs sm:text-sm font-semibold transition-colors flex justify-between items-center ${formData.assignedStaffId === staff.staffId ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}>
                        <span>{staff.fullName}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{staff.employeeCode || "SALE"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Ghi chú tiến độ nhu cầu</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all resize-none" rows={3} />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-100 mt-5 sm:mt-6">
            <button type="button" onClick={onClose} className="w-full sm:w-1/3 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">
              HỦY BỎ
            </button>
            <button type="submit" className="w-full sm:w-2/3 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
              LƯU THAY ĐỔI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}