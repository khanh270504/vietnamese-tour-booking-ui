import { useState, useEffect, useMemo } from "react";
import { Search, Download, CreditCard, Banknote, Wallet, CheckCircle2, Clock3, XCircle, Undo2, Loader2, FileSearch } from "lucide-react";
import { cn } from "../../lib/utils";

import { usePayments } from "../features/payment/hooks/usePayments";
import { PaymentCreateModal } from "../features/payment/PaymentCreateModal";
import { PaymentCancelModal } from "../features/payment/PaymentCancelModal"; // 🎯 Đã import Modal mới
import { PaymentResponse } from "../../services/payment/payment.types";

const statusConfig: any = {
  SUCCESS: { label: "Thành công", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  PENDING: { label: "Chờ duyệt", icon: Clock3, color: "bg-orange-50 text-orange-600 border-orange-100" },
  FAILED: { label: "Thất bại", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-100" },
  REFUNDED: { label: "Đã hoàn", icon: Undo2, color: "bg-slate-100 text-slate-600 border-slate-200" },
};

const methodColors: any = {
  BANK_TRANSFER: { label: "Chuyển khoản", color: "bg-blue-50 text-blue-600" },
  CASH: { label: "Tiền mặt", color: "bg-emerald-50 text-emerald-600" },
  POS: { label: "Quẹt thẻ POS", color: "bg-purple-50 text-purple-600" },
};

export function PaymentsPage() {
  const { payments, isLoading, fetchPayments, fetchPaymentsByBooking, processManualPayment, cancelPayment } = usePayments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const stats = useMemo(() => {
    const totalRev = payments.filter(p => p.status === "SUCCESS").reduce((sum, p) => sum + p.amount, 0);
    const pendingCount = payments.filter(p => p.status === "PENDING").length;
    
    return [
      { title: "Tổng thực thu", value: `${(totalRev / 1000000).toFixed(1)}M`, change: "Cập nhật real-time", icon: Wallet, color: "from-emerald-500 to-teal-600" },
      { title: "Giao dịch chờ duyệt", value: `${pendingCount} GD`, change: "Cần kế toán đối soát", icon: CreditCard, color: "from-orange-500 to-amber-600" },
      { title: "Lịch sử giao dịch", value: `${payments.length} GD`, change: "Toàn hệ thống", icon: Banknote, color: "from-blue-500 to-indigo-600" },
    ];
  }, [payments]);

  // Hỗ trợ tìm kiếm Booking (Gọi api tìm lịch sử theo booking nếu search là 1 con số ID)
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm) {
      if (!isNaN(Number(searchTerm))) {
        fetchPaymentsByBooking(Number(searchTerm));
      }
    } else if (e.key === "Enter" && !searchTerm) {
      fetchPayments();
    }
  };

  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    return payments.filter(p => 
      p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.referenceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bookingId.toString().includes(searchTerm)
    );
  }, [payments, searchTerm]);

  const formatCurrency = (val: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quản lý Tài chính</h1>
          <p className="text-slate-500 font-medium mt-1">Đối soát ngân hàng, thu tiền mặt và duyệt trạng thái thanh toán</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={16} strokeWidth={3} /> Báo cáo
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            + Thu tiền thủ công
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={cn("w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
              <stat.icon size={24} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600" />
          <input
            type="text"
            placeholder="Tìm theo Mã GD, Mã tham chiếu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã Giao dịch</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin Đơn</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Số tiền</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Hình thức</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.map((payment) => {
                const status = statusConfig[payment.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;
                const methodInfo = methodColors[payment.paymentMethod] || methodColors.CASH;

                return (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">{payment.transactionId}</p>
                      {payment.referenceCode && (
                        <p className="text-[10px] font-bold text-slate-400 mt-1">Ref: {payment.referenceCode}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-black text-slate-900">Booking ID: {payment.bookingId}</p>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">Sale: {payment.createdBy}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                       <p className="text-sm font-black text-emerald-600">{formatCurrency(payment.amount)}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(payment.paymentDate).toLocaleString('vi-VN')}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                       <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter inline-block", methodInfo.color)}>
                          {methodInfo.label}
                       </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <span className={cn("flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest", status.color)}>
                          <StatusIcon size={12} strokeWidth={3} /> {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => setSelectedPayment(payment)} className="text-[11px] font-black text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 mx-auto">
                        <FileSearch size={14} /> Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <PaymentCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={processManualPayment} />
      
      {/* 🎯 Đã cập nhật thành CancelModal */}
      <PaymentCancelModal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} payment={selectedPayment} onCancelPayment={cancelPayment} />

    </div>
  );
}