import { useState, useEffect } from "react";
import { CheckCircle2, Map, DollarSign, MessageCircle, Star, User, Send } from "lucide-react";
// Import các service của bạn
import { reviewService } from "../../../services/review/review.service"; 
import { bookingService } from "../../../services/booking/booking.service"; 
import { ReviewResponse, TourRatingResponse } from "../../../services/review/review.types";
import { BookingResponse } from "../../../services/booking/booking.types";

export function TourTabs({ tour }: { tour: any }) {
  const [activeTab, setActiveTab] = useState("intro");
  
  // --- States phục vụ hiển thị Đánh giá ---
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [ratingStats, setRatingStats] = useState<TourRatingResponse | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // --- States phục vụ VIẾT Đánh giá trực tiếp ---
  const [eligibleBooking, setEligibleBooking] = useState<BookingResponse | null>(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: "intro", label: "Giới thiệu", icon: CheckCircle2 },
    { id: "itinerary", label: "Lịch trình", icon: Map },
    { id: "pricing", label: "Bảng giá", icon: DollarSign },
    { id: "reviews", label: "Đánh giá", icon: MessageCircle },
  ];

  // Fix lỗi undefined bảng giá và lịch trình
  const samplePricings = tour?.schedules?.length > 0 ? tour.schedules[0].pricings : [];
  let parsedItinerary: any[] = [];
  try {
    parsedItinerary = typeof tour?.itinerary === 'string' ? JSON.parse(tour.itinerary) : (tour?.itinerary || []);
  } catch (error) {
    console.error("Lỗi parse JSON lịch trình:", error);
  }

  // Hàm tải danh sách và thống kê review
  const fetchReviewsData = async () => {
    if (!tour?.id) return;
    setIsLoadingReviews(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        reviewService.getRatingStats(tour.id),
        reviewService.getByTourId(tour.id, 1, 10) 
      ]);
      setRatingStats(statsRes.result);
      setReviews(listRes.result?.content || listRes.result || []); 
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // TỰ ĐỘNG CHẠY KHI VÀO TAB "ĐÁNH GIÁ"
  useEffect(() => {
    if (activeTab === "reviews" && tour?.id) {
      // 1. Tải dữ liệu review hiển thị
      fetchReviewsData();

      // 2. Tận dụng `getMyBookings` để check xem user này có đơn hàng nào hợp lệ để đánh giá không
      const checkEligibility = async () => {
        try {
          const res = await bookingService.getMyBookings();
          // Cấu trúc response có thể bọc trong res.result tùy theo API của bạn
          const myBookings: BookingResponse[] = res.result || res || []; 
          
          // Tìm xem có đơn nào của Tour này có trạng thái COMPLETED không
          const foundCompletedBooking = myBookings.find(
            (b) => b.status === "COMPLETED" && 
            (b.tourNameSnapshot === tour.title || (b as any).tourId === tour.id)
          );
          
          if (foundCompletedBooking) {
            setEligibleBooking(foundCompletedBooking);
          }
        } catch (error) {
          console.error("Chưa đăng nhập hoặc lỗi lấy lịch sử đơn hàng:", error);
        }
      };

      checkEligibility();
    }
  }, [activeTab, tour?.id]);

  // HÀM XỬ LÝ GỬI ĐÁNH GIÁ LÊN BACKEND
  const handleSubmmitReview = async () => {
    if (!eligibleBooking) return;
    if (userComment.trim().length < 5) {
      alert("Vui lòng nhập nội dung đánh giá dài hơn một chút nhé!");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.create({
        bookingId: eligibleBooking.id,
        rating: userRating,
        comment: userComment
      });
      
      alert("Đăng đánh giá thành công! Cảm ơn ý kiến của bạn.");
      setUserComment(""); // Xóa trắng ô nhập dữ liệu
      setEligibleBooking(null); // Ẩn luôn form viết sau khi đã viết xong
      fetchReviewsData(); // Refresh lại danh sách hiển thị ở dưới để thấy luôn bài mình vừa đăng
    } catch (error: any) {
      alert(error.response?.data?.message || "Không thể gửi đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, callback?: (star: number) => void) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={interactive ? 24 : 14} 
        onClick={() => interactive && callback && callback(i + 1)}
        className={`${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""} ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"
        }`} 
      />
    ));
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      
      {/* 🎯 HEADER TABS */}
      <div className="flex border-b border-gray-50 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-5 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 animate-in fade-in" />}
          </button>
        ))}
      </div>

      {/* 🎯 CONTENT TABS */}
      <div className="p-8 md:p-10">
        
        {/* --- TAB 1: GIỚI THIỆU --- */}
        {activeTab === "intro" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-xl font-black mb-4">Tổng quan hành trình</h3>
            <p className="text-gray-600 leading-relaxed font-medium mb-8 whitespace-pre-line">
              {tour?.description || "Đang cập nhật thông tin giới thiệu cho tour này..."}
            </p>
            
            <h4 className="font-black text-gray-900 mb-4 uppercase text-sm tracking-widest">Dịch vụ nổi bật</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Xe đưa đón đời mới", "Khách sạn tiêu chuẩn", "Hướng dẫn viên nhiệt tình", "Bảo hiểm du lịch"].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl">
                  <CheckCircle2 className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm text-gray-700">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
{activeTab === "itinerary" && (
  <div className="space-y-8 animate-in fade-in duration-500">
    {parsedItinerary.length > 0 ? (
      parsedItinerary.map((item: any, i: number) => (
        <div key={i} className="relative pl-10 border-l-2 border-dashed border-gray-100 last:border-0 pb-8 last:pb-0">
          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
          
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Ngày {item.day || item.dayNumber || (i + 1)}
          </span>
          
          <h4 className="text-lg font-black text-gray-900 mt-1 mb-3">
            {item.title || "Khám phá các điểm đến"}
          </h4>
          
          {/* ĐOẠN HIỂN THỊ NỘI DUNG ĐÃ SỬA */}
          <div className="text-gray-600 font-medium text-sm leading-relaxed bg-gray-50/50 p-5 rounded-2xl border border-gray-50 space-y-3">
            {/* 1. Hiển thị mô tả chung */}
            {item.description && <p>{item.description}</p>}
            
            {/* 2. Hiển thị chi tiết hoạt động (mảng activities) */}
            {item.activities && Array.isArray(item.activities) && (
              <div className="space-y-2 mt-2">
                {item.activities.map((act: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="font-bold text-blue-700 shrink-0">{act.period}:</span>
                    <span className="text-gray-700">{act.detail}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Trường hợp không có cả hai */}
            {!item.description && (!item.activities || item.activities.length === 0) && (
              <p>Đang cập nhật hoạt động...</p>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
        <Map className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 font-bold">Chưa có thông tin lịch trình chi tiết.</p>
      </div>
    )}
  </div>
)}

        {/* --- TAB 3: BẢNG GIÁ --- */}
        {activeTab === "pricing" && (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-black mb-6">Bảng giá tham khảo</h3>
            {samplePricings.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Đối tượng</th>
                      <th className="px-6 py-4 text-right">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {samplePricings.map((priceItem: any) => (
                      <tr key={priceItem.id} className="font-bold hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          {priceItem.passengerType === 'ADULT' ? 'Người lớn' : 
                           priceItem.passengerType === 'CHILD' ? 'Trẻ em' : 
                           priceItem.passengerType === 'INFANT' ? 'Em bé' : priceItem.passengerType}
                        </td>
                        <td className="px-6 py-5 text-right text-blue-600">
                          {priceItem.price.toLocaleString('vi-VN')} {priceItem.currency || 'VNĐ'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 font-medium bg-blue-50/50 p-4 rounded-xl text-center">
                Vui lòng chọn ngày khởi hành để xem giá chi tiết.
              </p>
            )}
          </div>
        )}

        {/* --- TAB 4: ĐÁNH GIÁ (XEM & VIẾT TẠI CHỖ) --- */}
        {activeTab === "reviews" && (
          <div className="animate-in fade-in duration-500">
            {isLoadingReviews ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* 🌟 ĐOẠN ĐẶC BIỆT: HIỆN FORM NHẬP NẾU USER ĐÃ ĐI TOUR XONG */}
                {eligibleBooking && (
                  <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-100 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-black text-gray-900 text-base">Viết nhận xét của bạn</h4>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-3 py-1 rounded-lg">
                        Đơn hàng: {eligibleBooking.bookingCode}
                      </span>
                    </div>
                    
                    {/* Chọn sao */}
                    <div className="flex gap-1.5 mb-4">
                      {renderStars(userRating, true, (star) => setUserRating(star))}
                    </div>

                    {/* Ô nhập chữ */}
                    <div className="relative">
                      <textarea
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Hãy chia sẻ trải nghiệm thực tế của bạn về tour diễn ra như thế nào nhé..."
                        className="w-full h-24 p-4 pr-12 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm font-medium transition-all"
                      />
                      <button 
                        onClick={handleSubmmitReview}
                        disabled={isSubmitting}
                        className="absolute bottom-4 right-4 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Khối Thống kê điểm tổng quan */}
                {ratingStats && ratingStats.totalReviews > 0 && (
                  <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <div className="text-center">
                      <span className="text-4xl font-black text-blue-600">{ratingStats.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400 font-bold">/5</span>
                    </div>
                    <div>
                      <div className="flex gap-1 mb-1">
                        {renderStars(Math.round(ratingStats.averageRating))}
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        Dựa trên {ratingStats.totalReviews} lượt đánh giá từ khách hàng
                      </p>
                    </div>
                  </div>
                )}

                {/* Danh sách bình luận ở dưới */}
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User size={18} className="text-gray-400" />
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-900 text-sm">{review.customerName || "Khách hàng"}</h5>
                              <p className="text-xs text-gray-400 font-medium mt-0.5">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-600 font-medium text-sm leading-relaxed mt-3">{review.comment}</p>

                        {/* Phản hồi từ admin */}
                        {review.adminReply && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-xl border-l-4 border-blue-600">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Phản hồi từ Ban Quản Trị</p>
                            <p className="text-sm text-gray-700 font-medium">{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-400 mb-2">Chưa có đánh giá nào</h3>
                    <p className="text-sm font-medium text-gray-400">Hãy là người đầu tiên trải nghiệm và để lại nhận xét nhé!</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}