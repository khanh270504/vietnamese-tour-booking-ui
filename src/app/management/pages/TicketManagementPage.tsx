import { useState } from "react";
import { Clock, CheckCircle2, AlertCircle, Search, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTicketManagement } from "../features/ticket/hooks/useTicketManagement";
import { SupportTicketResponse } from "../../services/ticket/ticket.type";

import { TicketTable } from "../features/ticket/TicketTable";
import { ProcessTicketModal } from "../features/ticket/ProcessTicketModal";
import { CreateTicketModal } from "../features/ticket/CreateTicketModal"; 

export function TicketManagementPage() {
  const { 
    isLoading, 
    stats, 
    refreshTickets,
    searchTerm,
    setSearchTerm,
    paginatedTickets,
    currentPage,
    setCurrentPage,
    totalPages
  } = useTicketManagement();

  // 🎯 Quản lý trạng thái: Chỉ cần lưu Ticket đang được chọn để Xử lý
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6">
      {/* Header & Nút Tạo mới */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trung tâm Hỗ trợ</h1>
          <p className="text-slate-500 font-medium">Quản lý khiếu nại và yêu cầu từ khách hàng</p>
        </div>
        
        {/* 🎯 Nút Tạo mới đã đổi sang màu Xanh - Trắng */}
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
            <Plus size={20}/> TẠO TICKET MỚI
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Đang mở", val: stats.open, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Đang xử lý", val: stats.processing, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Đã đóng", val: stats.closed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", s.bg)}>
              <s.icon className={s.color} size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Search & Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Thanh tìm kiếm */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã ticket, tên khách hàng..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-sm font-bold outline-none border border-slate-200 focus:border-blue-400 focus:ring-4 ring-blue-50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Bảng dữ liệu: Thêm Loading State */}
        {isLoading ? (
            <div className="p-20 flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        ) : (
            <>
                <TicketTable 
                    tickets={paginatedTickets}
                    onProcess={(t) => setSelectedTicket(t)}
                />

                {/* UI Phân trang */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-center items-center gap-4">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage((c: number) => c - 1)} 
                            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={20}/>
                        </button>
                        <span className="text-sm font-black text-slate-600">Trang {currentPage} / {totalPages}</span>
                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage((c: number) => c + 1)} 
                            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                )}
            </>
        )}
      </div>

      {/* 🎯 Gọi thẳng Process Modal, không cần check modalMode nữa */}
      <ProcessTicketModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onSuccess={refreshTickets}
      />

      <CreateTicketModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={refreshTickets} 
      />
    </div>
  );
}