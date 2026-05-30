import { useState, useEffect, useRef } from "react";
import { X, UserPlus, Search, ChevronDown, Loader2 } from "lucide-react";
import { LeadCreateRequest, LEAD_SOURCE_LABELS, LeadSource } from "../../../services/crm/crm.types";
import { tourService } from "../../../services/tour/tour.service"; 
import { TourResponse } from "../../../services/tour/tour.types";
import { StaffProfileResponse } from "../../../services/staff/staff.types";
import { staffService } from "../../../services/staff/staff.service";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LeadCreateRequest) => void;
}

export function AddLeadModal({ isOpen, onClose, onSave }: AddLeadModalProps) {
  const [formData, setFormData] = useState<LeadCreateRequest>({ 
    fullName: "", 
    phone: "", 
    email: "", 
    interestedTourId: undefined, 
    assignedStaffId: undefined, 
    notes: "" 
  });

  // --- State quản lý Tour ---
  const [tours, setTours] = useState<TourResponse[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [isTourDropdownOpen, setIsTourDropdownOpen] = useState(false);
  const [searchTourQuery, setSearchTourQuery] = useState("");
  const tourDropdownRef = useRef<HTMLDivElement>(null);

  // --- State quản lý Nhân viên (Staff) ---
  const [staffs, setStaffs] = useState<StaffProfileResponse[]>([]); 
  const [isLoadingStaffs, setIsLoadingStaffs] = useState(false);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [searchStaffQuery, setSearchStaffQuery] = useState("");
  const staffDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchTours = async () => {
        setIsLoadingTours(true);
        try {
          const res = await tourService.getAllToursForClient(); 
          setTours(res.result || (res as any).data || []);
        } catch (error) {
          console.error("Lỗi lấy danh sách Tour", error);
        } finally {
          setIsLoadingTours(false);
        }
      };

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

      fetchTours();
      fetchStaffs();
    } else {
      setFormData({ 
        fullName: "", 
        phone: "", 
        email: "", 
        interestedTourId: undefined, 
        assignedStaffId: undefined, 
        notes: "",
        source: undefined
      });
      setSearchTourQuery("");
      setSearchStaffQuery("");
      setIsTourDropdownOpen(false);
      setIsStaffDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tourDropdownRef.current && !tourDropdownRef.current.contains(event.target as Node)) {
        setIsTourDropdownOpen(false);
      }
      if (staffDropdownRef.current && !staffDropdownRef.current.contains(event.target as Node)) {
        setIsStaffDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const filteredTours = tours.filter(tour => 
    tour.name?.toLowerCase().includes(searchTourQuery.toLowerCase())
  );

  const filteredStaffs = staffs.filter(staff => 
    staff.fullName?.toLowerCase().includes(searchStaffQuery.toLowerCase()) ||
    staff.employeeCode?.toLowerCase().includes(searchStaffQuery.toLowerCase())
  );

  const selectedTourName = tours.find(t => t.id === formData.interestedTourId)?.name || "Chọn Tour khách quan tâm...";
  const selectedStaffName = staffs.find(s => s.staffId === formData.assignedStaffId)?.fullName || "Chọn Sale phụ trách...";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-[1.8rem] sm:rounded-[2.5rem] p-5 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 relative custom-scrollbar">
        
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all duration-200 z-10 shadow-sm"
          title="Đóng"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="flex justify-between items-center mb-5 sm:mb-6 border-b border-slate-100 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <UserPlus size={18} className="sm:size-[20px]" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">Tạo Khách Hàng Tiềm Năng</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Họ và Tên *</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="VD: Nguyễn Văn A" />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Số điện thoại *</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="VD: 0901234567" />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="VD: email@example.com" />
            </div>

            <div className="sm:col-span-2 relative" ref={tourDropdownRef}>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Tour quan tâm</label>
              <div 
                onClick={() => setIsTourDropdownOpen(!isTourDropdownOpen)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold cursor-pointer flex justify-between items-center hover:bg-white hover:border-blue-500 transition-all"
              >
                <span className={formData.interestedTourId ? "text-slate-800 truncate" : "text-slate-400 truncate"}>{selectedTourName}</span>
                {isLoadingTours ? <Loader2 size={14} className="animate-spin text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </div>

              {isTourDropdownOpen && (
                <div className="absolute z-[110] top-full mt-1.5 left-0 w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                    <Search size={14} className="text-slate-400 ml-1" />
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="Gõ tên tour để tìm..." 
                      value={searchTourQuery}
                      onChange={(e) => setSearchTourQuery(e.target.value)}
                      className="w-full bg-transparent p-1.5 text-xs sm:text-sm outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div className="max-h-36 sm:max-h-40 overflow-y-auto custom-scrollbar">
                    {filteredTours.length > 0 ? (
                      filteredTours.map(tour => (
                        <div 
                          key={tour.id} 
                          onClick={() => {
                            setFormData({...formData, interestedTourId: tour.id});
                            setIsTourDropdownOpen(false);
                            setSearchTourQuery("");
                          }}
                          className={`px-4 py-2.5 cursor-pointer text-xs sm:text-sm font-semibold transition-colors ${formData.interestedTourId === tour.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          {tour.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">Không tìm thấy tour nào.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2 relative" ref={staffDropdownRef}>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Nhân viên phụ trách (Bộ phận Sale)</label>
              <div 
                onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold cursor-pointer flex justify-between items-center hover:bg-white hover:border-blue-500 transition-all"
              >
                <span className={formData.assignedStaffId ? "text-slate-800 truncate" : "text-slate-400 truncate"}>{selectedStaffName}</span>
                {isLoadingStaffs ? <Loader2 size={14} className="animate-spin text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </div>

              {isStaffDropdownOpen && (
                <div className="absolute z-[110] top-full mt-1.5 left-0 w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                    <Search size={14} className="text-slate-400 ml-1" />
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="Tìm theo tên hoặc mã Sale..." 
                      value={searchStaffQuery}
                      onChange={(e) => setSearchStaffQuery(e.target.value)}
                      className="w-full bg-transparent p-1.5 text-xs sm:text-sm outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div className="max-h-36 sm:max-h-40 overflow-y-auto custom-scrollbar">
                    {filteredStaffs.length > 0 ? (
                      filteredStaffs.map(staff => (
                        <div 
                          key={staff.staffId} 
                          onClick={() => {
                            setFormData({...formData, assignedStaffId: staff.staffId});
                            setIsStaffDropdownOpen(false);
                            setSearchStaffQuery("");
                          }}
                          className={`px-4 py-2.5 cursor-pointer text-xs sm:text-sm font-semibold transition-colors flex justify-between items-center ${formData.assignedStaffId === staff.staffId ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          <span>{staff.fullName}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{staff.employeeCode || "SALE"}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">Không tìm thấy nhân viên Sale nào.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Nguồn khách</label>
              <select 
                value={formData.source || ""} 
                onChange={e => setFormData({
                  ...formData, 
                  source: e.target.value ? (e.target.value as LeadSource) : undefined
                })} 
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">-- Chọn nguồn khách --</option>
                {Object.entries(LEAD_SOURCE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Ghi chú nhu cầu ban đầu</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all resize-none" placeholder="VD: Khách muốn ở khách sạn 4 sao gần biển..." rows={2} />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-100 mt-5 sm:mt-6">
            <button type="button" onClick={onClose} className="w-full sm:w-1/3 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">
              HỦY
            </button>
            <button type="submit" className="w-full sm:w-2/3 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
              LƯU KHÁCH HÀNG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}