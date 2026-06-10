import { useState } from "react";
import { Send, MessageSquare, AlertCircle, Phone, Mail, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ticketService } from "../services/ticket/ticket.service"; 

export function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ subject: "", description: "", bookingCode: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return toast.error("Vui lòng điền đủ thông tin");
    
    setLoading(true);
    try {
      await ticketService.createTicket(formData); // API khách gửi ticket
      toast.success("Gửi yêu cầu hỗ trợ thành công! Admin sẽ phản hồi sớm nhất.");
      setFormData({ subject: "", description: "", bookingCode: "" });
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Phần 1: Form tạo Ticket */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm">
          <h1 className="text-3xl font-black mb-2">Trung tâm Hỗ trợ</h1>
          <p className="text-slate-500 mb-8 font-medium">Bạn cần giúp đỡ về đơn hàng? Hãy gửi yêu cầu cho chúng tôi.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
             <input placeholder="Mã Booking (VD: BK-123)" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                onChange={(e) => setFormData({...formData, bookingCode: e.target.value})} />
             <input placeholder="Tiêu đề yêu cầu" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                onChange={(e) => setFormData({...formData, subject: e.target.value})} />
             <textarea rows={4} placeholder="Mô tả chi tiết vấn đề..." className="w-full p-4 bg-slate-50 rounded-2xl border font-bold"
                onChange={(e) => setFormData({...formData, description: e.target.value})} />
             <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : "GỬI YÊU CẦU"}
             </button>
          </form>
        </div>

        {/* Phần 2: Thông tin liên hệ nhanh */}
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
                <h3 className="font-black text-xl mb-6">Liên hệ trực tiếp</h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Phone size={20}/></div>
                    <div><p className="text-xs text-slate-400 font-bold uppercase">Hotline</p><p className="font-black">1900 888 888</p></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Mail size={20}/></div>
                    <div><p className="text-xs text-slate-400 font-bold uppercase">Email</p><p className="font-black">support@travelvn.com</p></div>
                </div>
            </div>
            
            <div className="bg-orange-500 p-8 rounded-[2rem] text-white">
                <MessageSquare className="mb-4" />
                <h3 className="font-black text-xl mb-2">Thời gian phản hồi</h3>
                <p className="text-orange-100 font-medium text-sm">Chúng tôi cam kết giải quyết khiếu nại của bạn trong vòng 24 giờ làm việc.</p>
            </div>
        </div>
      </div>
    </div>
  );
}