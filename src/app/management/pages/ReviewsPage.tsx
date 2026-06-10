import { useState } from "react";
import { Search, Star, MessageCircle, TrendingUp, EyeOff, CheckCircle2, XCircle, Reply } from "lucide-react";
import { cn } from "../../lib/utils";
// 1. Đổi tên import sang Hook mới tổng hợp của Admin
import { useAdminReviews } from "../features/review/hooks/useTourReviews"; 
import { getStatusLabel } from "../../services/review/review.types";

const sentimentConfig: any = {
  POSITIVE: { label: "Tích cực", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  NEUTRAL: { label: "Trung tính", color: "bg-blue-50 text-blue-600 border-blue-100" },
  NEGATIVE: { label: "Tiêu cực", color: "bg-rose-50 text-rose-600 border-rose-100" },
};

const statusConfig: any = {
  ACTIVE: { label: "Đang hiển thị", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50/50" },
  HIDDEN: { label: "Đã ẩn", icon: XCircle, color: "text-rose-500 bg-rose-50/50" },
};

export function ReviewsPage() {
  // 2. Bỏ useParams và tourId dư thừa đi, gọi trực tiếp Hook tổng
  const { reviews, stats, sentimentAnalytics, isLoading, handleHideReview, handleAdminReply } = useAdminReviews();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [replyingReviewId, setReplyingReviewId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const filteredReviews = reviews.filter(review =>
    review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submitReply = (reviewId: number) => {
    if (!replyContent.trim()) return;
    handleAdminReply(reviewId, replyContent);
    setReplyContent("");
    setReplyingReviewId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER SECTION */}
      <div className="px-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Quản lý Phản hồi</h1>
        {/* 3. Đổi sub-header cho hợp với trang tổng hợp hệ thống */}
        <p className="text-slate-500 font-medium">Tổng hợp toàn bộ đánh giá và ý kiến phản hồi của khách hàng trên hệ thống</p>
      </div>

      {/* TOP ANALYTICS MINI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReviewStatCard 
          label="Rating Trung bình" 
          value={stats?.averageRating ? stats.averageRating.toFixed(1) : "0.0"} 
          trend="Điểm số toàn hệ thống" 
          icon={Star} 
          color="from-amber-400 to-orange-500" 
          isStar 
        />
        <ReviewStatCard 
          label="Tổng đánh giá" 
          value={stats?.totalReviews ? stats.totalReviews.toLocaleString() : "0"} 
          trend="Lượt phản hồi tích lũy" 
          icon={MessageCircle} 
          color="from-blue-500 to-indigo-600" 
        />
        <ReviewStatCard 
          label="Đánh giá bị ẩn" 
          value={sentimentAnalytics.hiddenCount.toString()} 
          trend="Nội dung tiêu cực/vi phạm" 
          icon={EyeOff} 
          color="from-rose-500 to-pink-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVIEWS LIST */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nội dung đánh giá, tên khách..."
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => {
                const currentSentiment = review.rating >= 4 ? "POSITIVE" : review.rating === 3 ? "NEUTRAL" : "NEGATIVE";

                return (
                  <div key={review.id} className={cn(
                    "bg-white p-8 rounded-[2.5rem] border transition-all relative overflow-hidden",
                    review.status === "HIDDEN" ? "border-rose-100 bg-rose-50/10 opacity-75 shadow-none" : "border-slate-100 shadow-sm hover:shadow-md"
                  )}>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
                          {review.customerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 leading-tight">{review.customerName}</h4>
                          {/* Đưa thêm thông tin Tour ID vào dòng phụ cho Admin dễ bám sát thông tin */}
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                            Mã đơn: #{review.bookingId} | Tour ID: #{review.tourId}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={cn("px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border", sentimentConfig[currentSentiment].color)}>
                          {sentimentConfig[currentSentiment].label}
                        </span>
                        <span className={cn("px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-1", statusConfig[review.status].color)}>
                          {getStatusLabel(review.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                      ))}
                      <span className="ml-3 text-[11px] font-black text-slate-300 uppercase">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 italic">"{review.comment}"</p>

                    {/* KHỐI HIỂN THỊ PHẢN HỒI CỦA ADMIN NẾU CÓ */}
                    {review.adminReply && (
                      <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs relative">
                        <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-slate-900 text-white font-black text-[8px] uppercase tracking-wider rounded-md">Phản hồi từ Ban quản trị</div>
                        <p className="text-slate-700 font-semibold leading-relaxed mt-1">
                          {review.adminReply}
                        </p>
                        {review.repliedAt && (
                          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">
                            Gửi ngày: {new Date(review.repliedAt).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Ô NHẬP LIỆU REPLY ĐƯỢC MỞ RA */}
                    {replyingReviewId === review.id && (
                      <div className="mb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Nhập nội dung phản hồi chính thức cho khách hàng..."
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all h-20 resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setReplyingReviewId(null)}
                            className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase"
                          >
                            Hủy
                          </button>
                          <button 
                            onClick={() => submitReply(review.id)}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase shadow-sm"
                          >
                            Gửi phản hồi
                          </button>
                        </div>
                      </div>
                    )}

                    {/* THANH THAO TÁC ACTIONS */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                      {review.status === "ACTIVE" && (
                        <button 
                          onClick={() => handleHideReview(review.id)}
                          className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-1.5"
                        >
                          <EyeOff size={12} />
                          Ẩn đánh giá
                        </button>
                      )}
                      
                      {!review.adminReply && replyingReviewId !== review.id && (
                        <button 
                          onClick={() => setReplyingReviewId(review.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-1.5"
                        >
                          <Reply size={12} />
                          Trả lời
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-[2rem] border border-slate-100 text-slate-400 font-bold text-sm">
                Không có dữ liệu phản hồi nào.
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR ANALYTICS */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight text-left mb-8">Phân tích cảm xúc</h3>
            <div className="space-y-6">
              <SentimentProgress label="Tích cực (4-5 ⭐)" value={sentimentAnalytics.positive} color="bg-emerald-500" />
              <SentimentProgress label="Trung tính (3 ⭐)" value={sentimentAnalytics.neutral} color="bg-blue-500" />
              <SentimentProgress label="Tiêu cực (1-2 ⭐)" value={sentimentAnalytics.negative} color="bg-rose-500" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-blue-600" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Thông tin vận hành</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Hệ thống lọc tự động phân chia trạng thái cảm xúc của khách dựa trên chỉ số xếp hạng (Stars Rating) thời gian thực của các Tour trên toàn hệ thống.
            </p>
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