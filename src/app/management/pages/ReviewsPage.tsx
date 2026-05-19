import { Search, Star, ThumbsUp, MessageCircle, TrendingUp, Filter, CheckCircle2, XCircle, Clock3 } from "lucide-react";
import { cn } from "../../lib/utils";

// --- MOCK DATA (Ông giáo giữ nguyên để sau này map API Review từ Java) ---
const reviews = [
  { id: "R001", customer: "Nguyễn Thị Lan", tour: "Hà Nội - Hạ Long 5N4Đ", rating: 5, date: "08/05/2026", comment: "Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, khách sạn sạch sẽ. Gia đình tôi rất hài lòng.", likes: 12, status: "approved", sentiment: "positive" },
  { id: "R004", customer: "Phạm Thu Hà", tour: "Nha Trang Vinpearl 3N2Đ", rating: 3, date: "05/05/2026", comment: "Chất lượng không như quảng cáo. Phòng khách sạn cũ, bữa ăn bình thường.", likes: 2, status: "pending", sentiment: "negative" },
];

const sentimentConfig: any = {
  positive: { label: "Tích cực", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  neutral: { label: "Trung tính", color: "bg-blue-50 text-blue-600 border-blue-100" },
  negative: { label: "Tiêu cực", color: "bg-rose-50 text-rose-600 border-rose-100" },
};

const statusConfig: any = {
  approved: { label: "Đã duyệt", icon: CheckCircle2, color: "text-emerald-500" },
  pending: { label: "Chờ duyệt", icon: Clock3, color: "text-orange-500" },
  rejected: { label: "Từ chối", icon: XCircle, color: "text-rose-500" },
};

export function ReviewsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quản lý Phản hồi</h1>
          <p className="text-slate-500 font-medium">Lắng nghe ý kiến khách hàng và cải thiện chất lượng dịch vụ</p>
        </div>
      </div>

      {/* TOP ANALYTICS MINI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReviewStatCard label="Rating Trung bình" value="4.7" trend="+0.2 tháng này" icon={Star} color="from-amber-400 to-orange-500" isStar />
        <ReviewStatCard label="Tổng đánh giá" value="1,234" trend="+87 lượt mới" icon={MessageCircle} color="from-blue-500 to-indigo-600" />
        <ReviewStatCard label="Tỷ lệ hài lòng" value="89.5%" trend="Rất tích cực" icon={ThumbsUp} color="from-emerald-500 to-teal-600" />
        <ReviewStatCard label="Đang chờ duyệt" value="23" trend="Cần xử lý ngay" icon={Filter} color="from-rose-500 to-pink-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVIEWS LIST */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Tìm nội dung đánh giá, tên khách..."
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                      {review.customer.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">{review.customer}</h4>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{review.tour}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={cn("px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border", sentimentConfig[review.sentiment].color)}>
                      {sentimentConfig[review.sentiment].label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                  ))}
                  <span className="ml-3 text-[11px] font-black text-slate-300 uppercase">{review.date}</span>
                </div>

                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 italic">"{review.comment}"</p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase">
                    <ThumbsUp size={14} />
                    <span>{review.likes} người thấy hữu ích</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {review.status === "pending" ? (
                      <>
                        <button className="px-5 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all">Từ chối</button>
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Duyệt đăng</button>
                      </>
                    ) : (
                      <div className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest", statusConfig[review.status].color)}>
                        {statusConfig[review.status].label}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR ANALYTICS */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight text-left mb-8">Phân tích cảm xúc</h3>
            <div className="space-y-6">
              <SentimentProgress label="Tích cực" value={89.5} color="bg-emerald-500" />
              <SentimentProgress label="Trung tính" value={7.2} color="bg-blue-500" />
              <SentimentProgress label="Tiêu cực" value={3.3} color="bg-rose-500" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-blue-600" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Tour đánh giá cao</h3>
            </div>
            <div className="space-y-5">
              {/* Tour item */}
              <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                <div className="flex-1">
                   <p className="text-xs font-black text-slate-900 leading-tight">Vịnh Hạ Long - Sapa</p>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">234 Đánh giá</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
                   <Star size={12} className="fill-amber-400 text-amber-400" />
                   <span className="text-xs font-black text-slate-900">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function ReviewStatCard({ label, value, trend, icon: Icon, color, isStar }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={cn("w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
        <Icon size={24} strokeWidth={3} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-center gap-2">
           <p className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">{value}</p>
           {isStar && <Star size={18} className="fill-amber-400 text-amber-400" />}
        </div>
        <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">{trend}</p>
      </div>
    </div>
  );
}

function SentimentProgress({ label, value, color }: any) {
  return (
    <div className="text-left">
      <div className="flex justify-between items-end mb-2 px-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-slate-900">{value}%</span>
      </div>
      <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}