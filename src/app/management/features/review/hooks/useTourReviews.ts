import { useState, useEffect, useMemo } from "react";
import { reviewService } from "../../../../services/review/review.service";
import { ReviewResponse } from "../../../../services/review/review.types";

// Đổi tên thành useAdminReviews và BỎ tourId ở tham số đi ông nhé
export function useAdminReviews() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // Thêm state page để sau này có làm phân trang thì dùng luôn

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Thay thế hàm getByTourId thành getAllReviews tổng của Admin
      const reviewsRes = await reviewService.getAllReviews(page, 50); 

      if (reviewsRes && reviewsRes.result) {
        const data = reviewsRes.result;
        // Cấu trúc Spring Boot Page sẽ bọc mảng trong data.content
        setReviews(Array.isArray(data) ? data : data.content || []);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu tổng hợp review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // Hàm ẩn review - Giữ nguyên logic cũ rất tốt
  const handleHideReview = async (reviewId: number) => {
    try {
      await reviewService.hideReview(reviewId);
      setReviews(prev =>
        prev.map(r => (r.id === reviewId ? { ...r, status: "HIDDEN" as const } : r))
      );
    } catch (error) {
      console.error("❌ Không thể ẩn bài viết:", error);
    }
  };

  // Hàm Admin phản hồi - Giữ nguyên logic cũ
  const handleAdminReply = async (reviewId: number, replyText: string) => {
    try {
      const res = await reviewService.replyAdmin(reviewId, replyText);
      if (res && res.result) {
        setReviews(prev =>
          prev.map(r => (r.id === reviewId ? res.result : r))
        );
      }
    } catch (error) {
      console.error("❌ Lỗi gửi phản hồi:", error);
    }
  };

  // 2. TỰ ĐỘNG TÍNH TOÁN THỐNG KÊ (STATS) TỔNG CHO ADMIN NGAY TẠI FRONTEND
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) return { averageRating: 0, totalReviews: 0 };

    const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Number((totalStars / totalReviews).toFixed(1));

    return { averageRating, totalReviews };
  }, [reviews]);

  // Phân tích trạng thái cảm xúc - Giữ nguyên
  const sentimentAnalytics = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { positive: 0, neutral: 0, negative: 0, hiddenCount: 0 };

    const positive = reviews.filter(r => r.rating >= 4).length;
    const neutral = reviews.filter(r => r.rating === 3).length;
    const negative = reviews.filter(r => r.rating <= 2).length;
    const hiddenCount = reviews.filter(r => r.status === "HIDDEN").length;

    return {
      positive: Number(((positive / total) * 100).toFixed(1)),
      neutral: Number(((neutral / total) * 100).toFixed(1)),
      negative: Number(((negative / total) * 100).toFixed(1)),
      hiddenCount
    };
  }, [reviews]);

  return { 
    reviews, 
    stats, 
    sentimentAnalytics, 
    isLoading, 
    page,
    setPage,
    handleHideReview, 
    handleAdminReply,
    refreshData: fetchData 
  };
}