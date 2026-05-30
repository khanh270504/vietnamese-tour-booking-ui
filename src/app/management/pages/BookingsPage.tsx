import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // 🎯 1. Import để đọc URL
import { Download, ChevronLeft, ChevronRight, Plus, ShoppingCart, Clock, CheckCircle, Wallet } from "lucide-react";
import { BookingFilterBar } from "../features/booking/BookingFilterBar"; 
import { BookingTable } from "../features/booking/BookingTable"; 
import { BookingDetailModal } from "../features/booking/BookingDetailModal"; 
import { useBookings } from "../features/booking/hooks/useBookings"; 
import { BookingCreateModal } from "../features/booking/BookingCreateModal";

export function BookingsPage() {
  const { bookings, isLoading, fetchBookings, changeBookingStatus } = useBookings();
  const [searchParams, setSearchParams] = useSearchParams(); // 🎯 2. Khởi tạo Hook đọc URL

  useEffect(() => { 
    fetchBookings(); 
  }, [fetchBookings]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<any>("");
  const [paymentStatus, setPaymentStatus] = useState<any>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // 🎯 3. THÊM STATE ĐỂ LƯU LEAD ID
  const [initialLeadId, setInitialLeadId] = useState<number | null>(null);

  // 🎯 4. LOGIC ĐÓN ĐẦU TỪ TRANG CRM SANG
  useEffect(() => {
    if (searchParams.get("autoCreate") === "true") {
      const leadIdFromUrl = searchParams.get("leadId");
      
      if (leadIdFromUrl) {
        setInitialLeadId(Number(leadIdFromUrl)); // Lưu ID lại để lát truyền cho Modal
      }
      
      setShowCreateModal(true); // Bật popup Tạo đơn lên
      
      // Xóa mấy cái đuôi trên URL đi để F5 trang không bị bật lại popup
      searchParams.delete("autoCreate");
      searchParams.delete("leadId");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Các Logic Thống kê và Lọc (Giữ nguyên của sếp)
  const stats = useMemo(() => {
    let totalRev = 0, pending = 0, confirmed = 0;
    bookings.forEach(b => {
      const status = String(b.status).toUpperCase();
      if (status !== 'CANCELLED') totalRev += (b.totalFinalPrice || 0);
      if (status === 'PENDING') pending++;
      if (status === 'CONFIRMED' || status === 'COMPLETED') confirmed++;
    });
    return { totalCount: bookings.length, totalRev, pending, confirmed };
  }, [bookings]);

  const { paginatedData, totalElements, totalPages } = useMemo(() => {
    let processed = [...bookings]; 

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      processed = processed.filter(b => 
        String(b.bookingCode || "").toLowerCase().includes(keyword) ||
        String(b.contactName || "").toLowerCase().includes(keyword) ||
        String(b.contactPhone || "").includes(keyword)
      );
    }
    
    if (filterStatus) {
      processed = processed.filter(b => String(b.status).toUpperCase() === String(filterStatus).toUpperCase());
    }
    
    if (paymentStatus) {
      processed = processed.filter(b => {
        const totalFinal = b.totalFinalPrice || 0;
        const totalPaid = (b.payments || []).reduce((s: number, p: any) => p.status === "SUCCESS" ? s + (p.amount || 0) : s, 0);
        let currentPayStatus = "UNPAID";
        if (totalPaid > 0 && totalPaid < totalFinal) currentPayStatus = "PARTIAL";
        else if (totalPaid >= totalFinal && totalFinal > 0) currentPayStatus = "PAID";
        return currentPayStatus === String(paymentStatus).toUpperCase();
      });
    }

    if (dateFrom) processed = processed.filter(b => b.departureDateSnapshot >= dateFrom);
    if (dateTo) processed = processed.filter(b => b.departureDateSnapshot <= dateTo);

    const totalCount = processed.length;
    const pagesCount = Math.ceil(totalCount / pageSize) || 1;
    const safeCurrentPage = currentPage > pagesCount ? 1 : currentPage;
    const offset = (safeCurrentPage - 1) * pageSize;
    
    return { 
      paginatedData: processed.slice(offset, offset + pageSize), 
      totalElements: totalCount, 
      totalPages: pagesCount 
    };
  }, [bookings, searchKeyword, filterStatus, paymentStatus, dateFrom, dateTo, currentPage]);

  useEffect(() => { 
    setCurrentPage(1); 
  }, [searchKeyword, filterStatus, paymentStatus, dateFrom, dateTo]);

  const handleUpdateStatus = async (id: number, status: string) => {
    await changeBookingStatus(id, status as any, `Admin thao tác chuyển sang ${status}`);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-slate-500 font-bold">Kiểm soát trạng thái đơn hàng và thông tin khách hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download size={16} strokeWidth={3} />
            <span>Xuất Excel</span>
          </button>
          <button 
              onClick={() => setShowCreateModal(true)} 
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              <span>Tạo đơn mới</span>
          </button>
        </div>
      </div>

      {/* BẢNG THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... (Giữ nguyên các card thống kê của sếp) ... */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><ShoppingCart size={20} strokeWidth={2.5}/></div>
          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng đơn</p><p className="text-2xl font-black text-slate-900">{stats.totalCount}</p></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Wallet size={20} strokeWidth={2.5}/></div>
          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Doanh thu dự kiến</p><p className="text-xl font-black text-slate-900">{stats.totalRev.toLocaleString()}₫</p></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><Clock size={20} strokeWidth={2.5}/></div>
          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Chờ duyệt</p><p className="text-2xl font-black text-slate-900">{stats.pending}</p></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><CheckCircle size={20} strokeWidth={2.5}/></div>
          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Đã xác nhận</p><p className="text-2xl font-black text-slate-900">{stats.confirmed}</p></div>
        </div>
      </div>

      <BookingFilterBar 
        searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
      />

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <p className="font-bold text-blue-600 animate-pulse">Đang tải dữ liệu đơn hàng...</p>
          </div>
        )}

        <BookingTable 
          bookings={paginatedData} 
          onViewDetail={(booking: any) => setSelectedBooking(booking)} 
          onUpdateStatus={handleUpdateStatus}
        />

        {totalPages > 1 && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
             {/* ... Phân trang giữ nguyên ... */}
          </div>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
      
      {showCreateModal && (
        <BookingCreateModal 
          initialLeadId={initialLeadId} // 🎯 5. TRUYỀN ID XUỐNG CHO MODAL LÀM VIỆC
          onClose={() => {
            setShowCreateModal(false);
            setInitialLeadId(null); // Đóng form thì xóa ID đi cho sạch state
          }}
          onSuccess={() => {
            fetchBookings(); 
          }}
        />
      )}
    </div>
  );
}