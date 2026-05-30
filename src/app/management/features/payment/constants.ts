import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export const PAYMENT_STATUS_CONFIG: Record<string, any> = {
  success: { label: "Thành công", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  pending: { label: "Chờ duyệt", icon: Clock3, color: "bg-orange-50 text-orange-600 border-orange-100" },
  failed: { label: "Thất bại", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-100" },
};

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
  "Chuyển khoản": "bg-blue-50 text-blue-600",
  "Tiền mặt": "bg-emerald-50 text-emerald-600",
  "Thẻ tín dụng": "bg-purple-50 text-purple-600",
};