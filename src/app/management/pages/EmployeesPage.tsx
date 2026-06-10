import { useState, useEffect } from "react";
import { 
  Search, UserPlus, Mail, Phone, MoreHorizontal, 
  CheckCircle2, XCircle, Loader2, UserX, 
  ChevronLeft, ChevronRight, Filter 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useStaffManagement } from "../features/staff/hooks/useStaffManagement"; 
import { StaffModal } from "../features/staff/StaffModal"; 

export function EmployeesPage() {
  const { staffs = [], departments = [], isLoading, refresh, toggleStaffStatus } = useStaffManagement();
  
  // States cho Modal & Hành động
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [togglingCode, setTogglingCode] = useState<string | null>(null);

  // 🌟 STATES CHO TÌM KIẾM & BỘ LỌC
  const [searchQuery, setSearchQuery] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // 🌟 STATES CHO PHÂN TRANG (PAGINATION)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Có thể đổi thành 10 để hiển thị 10 nhân viên/trang

  // Reset về trang 1 mỗi khi người dùng gõ tìm kiếm hoặc đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, deptFilter]);

  // Thống kê tổng quan
  const stats = {
    total: staffs.length,
    active: staffs.filter(s => s.status === 'ACTIVE').length,
    blocked: staffs.filter(s => s.status === 'BLOCKED' || s.status === 'INACTIVE').length
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  // Logic Đảo trạng thái
  const handleToggleStatus = async (staffId: number, currentStatus: string) => {
    if (!staffId) {
      alert("Lỗi dữ liệu: Không tìm thấy ID nhân viên!");
      return;
    }

    const actionText = currentStatus === 'ACTIVE' ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này?`)) return;

    try {
      setTogglingCode(staffId.toString()); 
      if (toggleStaffStatus) {
        await toggleStaffStatus(staffId);
        await refresh(); 
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    } finally {
      setTogglingCode(null); 
    }
  };

  // 🌟 LOGIC XỬ LÝ: TÌM KIẾM -> LỌC -> PHÂN TRANG
  const processedStaffs = staffs.filter((emp) => {
    const matchSearch = emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        emp.position?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || emp.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  // Tính toán số trang
  const totalItems = processedStaffs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = processedStaffs.slice(startIndex, startIndex + itemsPerPage);

  // 🌟 HÀM TẠO SỐ TRANG THÔNG MINH (Tối đa hiện 5 ô số)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Nhân sự</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Điều hành, phân quyền và giám sát đội ngũ hệ thống</p>
        </div>
        <button 
          onClick={() => { setSelectedStaff(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs tracking-wider transition-all active:scale-95 shadow-lg shadow-blue-500/10 active:shadow-none shrink-0"
        >
          <UserPlus size={16} /> THÊM NHÂN VIÊN MỚI
        </button>
      </div>

      {/* HR MINI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Tổng nhân sự" value={stats.total} color="text-blue-600" bg="bg-blue-50/50" />
        <StatCard label="Đang làm việc" value={stats.active} color="text-emerald-600" bg="bg-emerald-50/50" />
        <StatCard label="Tạm khóa/Nghỉ" value={stats.blocked} color="text-rose-600" bg="bg-rose-50/50" />
        <StatCard label="Phòng ban" value={departments.length} color="text-purple-600" bg="bg-purple-50/50" />
      </div>

      {/* EMPLOYEES CONTROL & TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* THANH CÔNG CỤ TÌM KIẾM & BỘ LỌC */}
        <div className="p-6 border-b border-slate-100/80 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/30">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm tên hoặc chức vụ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl text-xs font-bold outline-none border border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all text-slate-700 placeholder:text-slate-400" 
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-slate-500 shrink-0">
                <Filter size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Lọc</span>
              </div>
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full lg:w-auto px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 cursor-pointer transition-all"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang làm việc</option>
                <option value="BLOCKED">Đã khóa</option>
              </select>

            
            </div>
        </div>

        {/* LOADING & TABLE */}
        {isLoading ? (
          <div className="p-24 text-center flex-1">
            <Loader2 className="animate-spin mx-auto text-blue-600 w-8 h-8" />
            <p className="text-xs font-bold text-slate-400 mt-3">Đang đồng bộ dữ liệu...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-dashed border-slate-200 mb-4">
              <UserX size={28} />
            </div>
            <h3 className="text-sm font-black text-slate-700">Không tìm thấy nhân sự</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 max-w-xs">
              {searchQuery || statusFilter !== 'ALL' || deptFilter !== 'ALL' 
                ? "Không có kết quả khớp với bộ lọc hiện tại." 
                : "Hệ thống chưa ghi nhận tài khoản nào."}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="py-5 px-8">Nhân viên / Chức danh</th>
                  <th className="py-5 px-8">Phòng ban</th>
                  <th className="py-5 px-8">Thông tin liên hệ</th>
                  <th className="py-5 px-8">Trạng thái hệ thống</th>
                  <th className="py-5 px-8 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.map((emp: any) => (
                  <tr key={emp.staffId} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 font-black text-xs flex items-center justify-center shrink-0 transition-colors border border-slate-200/40">
                          {getInitials(emp.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">{emp.fullName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{emp.position || "Chưa set chức vụ"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-8 font-bold text-slate-600 text-xs">
                      {emp.departmentName || <span className="text-slate-400 font-medium">Chưa xếp phòng</span>}
                    </td>

                    <td className="py-4 px-8 text-xs text-slate-600 font-semibold space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone size={12} className="text-slate-400"/>
                        <span>{emp.phone || emp.phoneNumber || "---"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                        <Mail size={11}/>
                        <span className="truncate max-w-[180px]">{emp.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                        <label className="relative flex items-center cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={emp.status === 'ACTIVE'}
                            disabled={togglingCode === (emp.staffId?.toString())}
                            onChange={() => handleToggleStatus(emp.staffId, emp.status)}
                          />
                          <div className={cn(
                            "w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200",
                            emp.status === 'ACTIVE' 
                              ? "bg-emerald-500 border-emerald-500" 
                              : "bg-white border-slate-300 group-hover:border-slate-400",
                            togglingCode === (emp.staffId?.toString()) && "opacity-50 cursor-wait"
                          )}>
                            <CheckCircle2 
                              size={14} 
                              className={cn(
                                "text-white transition-opacity duration-200",
                                emp.status === 'ACTIVE' ? "opacity-100" : "opacity-0"
                              )} 
                            />
                          </div>
                        </label>

                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center w-fit gap-1.5 border", 
                          emp.status === 'ACTIVE' 
                            ? "bg-emerald-50/60 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50/60 text-rose-600 border-rose-100"
                        )}>
                          {emp.status === 'ACTIVE' ? "Đang làm" : "Đã khóa"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-8 text-right">
                      <button 
                        onClick={() => { setSelectedStaff(emp); setIsModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Chỉnh sửa tài khoản"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 🌟 CHÂN TRANG: ĐIỀU KHIỂN PHÂN TRANG VỚI CÁC Ô SỐ */}
            {totalPages > 0 && (
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white mt-auto">
                <p className="text-xs font-bold text-slate-500 hidden sm:block">
                  Hiển thị <span className="text-slate-900">{startIndex + 1}</span> - <span className="text-slate-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> / <span className="text-slate-900">{totalItems}</span>
                </p>
                
                <div className="flex items-center gap-1.5 ml-auto">
                  {/* Nút lùi (Prev) */}
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} strokeWidth={3} />
                  </button>
                  
                  {/* Các ô số Trang */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all border",
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-blue-600"
                        )}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  
                  {/* Nút tiến (Next) */}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <StaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refresh}
        staff={selectedStaff}
        departments={departments}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
}

function StatCard({ label, value, color, bg }: StatCardProps) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform cursor-default">
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        <p className={cn("text-2xl sm:text-3xl font-black tracking-tight", color)}>{value}</p>
      </div>
      <div className={cn("w-10 h-10 rounded-xl shrink-0 hidden sm:block", bg)} />
    </div>
  );
}