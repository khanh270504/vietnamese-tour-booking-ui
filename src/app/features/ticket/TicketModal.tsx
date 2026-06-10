import React, { useState } from "react";
import { X, Send, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { ticketService } from "../../services/ticket/ticket.service"; 

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingCode: string | null;
}

export function TicketModal({ isOpen, onClose, bookingCode }: TicketModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await ticketService.createTicket({
        bookingCode: bookingCode,
        subject: subject,
        description: description,
      });

      toast.success(res.message || "Đã gửi yêu cầu hỗ trợ thành công!");
      setSubject("");
      setDescription("");
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi gửi ticket:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header - Chuyển sang tone Xanh */}
        <div className="bg-blue-50 px-8 py-6 flex items-center justify-between border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Gửi Yêu Cầu Hỗ Trợ</h3>
              {bookingCode && (
                <p className="text-sm font-bold text-blue-600 mt-1">Đơn hàng: {bookingCode}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                Tiêu đề vấn đề
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ví dụ: Xin hoàn tiền, Đổi ngày khởi hành..."
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none font-medium transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                Chi tiết nội dung
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                rows={4}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none font-medium transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-2 p-4 bg-blue-50 rounded-2xl text-blue-800 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
              <p>Nhân viên chăm sóc khách hàng sẽ phản hồi trong vòng 24h qua email và hệ thống.</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-2xl font-black bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ĐANG GỬI...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  GỬI YÊU CẦU
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}