import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Ticket,
  AlertCircle,
  MessageSquare,
  AlignLeft,
} from "lucide-react";
import { toast } from "react-toastify";

import { ticketService } from "../../../services/ticket/ticket.service";
import {
  TicketPriority,
  TicketPriorityLabel,
} from "../../../services/ticket/ticket.type";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketModalProps) {
  // 🎯 Bỏ customerId/email, chỉ giữ lại các trường này
  const [bookingCode, setBookingCode] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>(
    TicketPriority.MEDIUM
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setBookingCode("");
      setSubject("");
      setDescription("");
      setPriority(TicketPriority.MEDIUM);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // 🎯 Validate: Booking code giờ là bắt buộc
    if (!bookingCode.trim()) {
      toast.error("Vui lòng nhập Mã Booking của đơn hàng");
      return;
    }
    if (!subject.trim() || !description.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    try {
      setIsSubmitting(true);

      // 🎯 API gọi xuống (Chỉ truyền 1 object request, không cần email/id nữa)
      await ticketService.createTicketByAdmin({
        bookingCode: bookingCode.trim(),
        subject: subject.trim(),
        description: description.trim(),
        priority: priority,
      });

      toast.success("Tạo ticket mới thành công!");

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra. Vui lòng kiểm tra lại Mã Booking xem có chính xác không."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Tạo Ticket Mới
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                Tạo yêu cầu hỗ trợ (Hệ thống tự nhận diện khách qua Mã Booking)
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          
          {/* Hàng 1: Booking & Priority */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                Mã Booking *
              </label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="text"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  placeholder="VD: BKG-2026-XYZ"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 focus:ring-4 ring-blue-50 font-black uppercase transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                Mức độ ưu tiên
              </label>
              <div className="relative">
                <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 font-bold appearance-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  {Object.entries(TicketPriorityLabel).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tiêu đề & Nội dung */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">
              Tiêu đề vấn đề *
            </label>
            <div className="relative mb-6">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Tóm tắt yêu cầu (VD: Khách muốn đổi ngày khởi hành)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 font-bold transition-all"
                disabled={isSubmitting}
              />
            </div>

            <label className="block text-xs font-black uppercase text-slate-400 mb-2">
              Nội dung chi tiết *
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-5 text-slate-400 w-5 h-5" />
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết vấn đề khách hàng đang gặp phải..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 resize-none font-medium transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-4 rounded-2xl bg-slate-200 font-black text-slate-700 hover:bg-slate-300 transition-colors"
          >
            HỦY
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !bookingCode || !subject || !description}
            className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                ĐANG TẠO...
              </>
            ) : (
              "TẠO TICKET"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}