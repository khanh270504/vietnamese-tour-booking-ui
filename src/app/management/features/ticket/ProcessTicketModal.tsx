import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  User,
  Mail,
  Phone,
  Ticket,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import { ticketService } from "../../../services/ticket/ticket.service";
import {
  SupportTicketResponse,
  TicketStatus,
  TicketStatusLabel,
  TicketPriorityLabel
} from "../../../services/ticket/ticket.type";


interface ProcessTicketModalProps {
  ticket: SupportTicketResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProcessTicketModal({
  ticket,
  isOpen,
  onClose,
  onSuccess,
}: ProcessTicketModalProps) {
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<TicketStatus>(
    TicketStatus.PROCESSING
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setResponse(ticket.adminResponse || "");

      setStatus(
        (ticket.status as TicketStatus) || TicketStatus.PROCESSING
      );
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Vui lòng nhập phản hồi cho khách hàng");
      return;
    }

    try {
      setIsSubmitting(true);

      await ticketService.processTicket(ticket.id, {
        status,
        responseMessage: response,
      });

      toast.success("Cập nhật ticket thành công");

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi xử lý ticket"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColor = {
    OPEN: "bg-rose-50 text-rose-600 border-rose-100",
    PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
    RESOLVED: "bg-amber-50 text-amber-600 border-amber-100",
    CLOSED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Ticket #{ticket.id}
              </h2>

              <p className="text-slate-500 font-medium mt-1">
                {ticket.subject}
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

          {/* Customer Info */}
          <div className="bg-slate-50 rounded-2xl p-5">
            <h3 className="font-black text-slate-800 mb-4">
              Thông tin khách hàng
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">

              <div className="flex items-center gap-3">
                <User size={16} />
                <span>{ticket.customerName || "Không có dữ liệu"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span>{ticket.customerPhone || "Không có dữ liệu"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span>{ticket.customerEmail || "Không có dữ liệu"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Ticket size={16} />
                <span>
                  {ticket.bookingCode || "Không liên kết booking"}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-wrap items-center gap-4">

            <div>
              <p className="text-xs font-black uppercase text-slate-400 mb-2">
                Trạng thái hiện tại
              </p>

              <span
                className={`px-4 py-2 rounded-xl text-xs font-black border ${
                  statusColor[
                    ticket.status as keyof typeof statusColor
                  ]
                }`}
              >
                {TicketStatusLabel[ticket.status]}
              </span>
            </div>

            <div>
              <p className="text-xs font-black uppercase text-slate-400 mb-2">
                Mức ưu tiên
              </p>

              <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-black">
                {TicketPriorityLabel[ticket.priority]}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-black uppercase text-slate-400 mb-2">
              Nội dung khách gửi
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 text-slate-700 whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Change status */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">
              Cập nhật trạng thái
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as TicketStatus)
              }
              className="w-full p-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500"
            >
              <option value={TicketStatus.PROCESSING}>
                Đang xử lý
              </option>

              <option value={TicketStatus.RESOLVED}>
                Đã giải quyết
              </option>

              <option value={TicketStatus.CLOSED}>
                Đóng ticket
              </option>
            </select>
          </div>

          {/* Response */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">
              Phản hồi khách hàng
            </label>

            <textarea
              rows={6}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              disabled={isSubmitting}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 resize-none outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2 p-4 rounded-2xl bg-blue-50 text-blue-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>
              Phản hồi này sẽ được hiển thị cho khách hàng trong
              hệ thống hỗ trợ.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-4 rounded-2xl bg-slate-100 font-black text-slate-700 hover:bg-slate-200 transition-colors"
          >
            HỦY
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !response.trim()
            }
            className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                ĐANG LƯU...
              </>
            ) : (
              "LƯU THAY ĐỔI"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}