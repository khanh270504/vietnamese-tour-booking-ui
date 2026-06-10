export interface ReviewResponse {
    id: number;
    bookingId: number;
    tourId: number;
    customerName: string;
    rating: number;
    comment: string;
    status: 'ACTIVE' | 'HIDDEN';
    createdAt: string; // ISO Date string
    adminReply?: string;
    repliedAt?: string;
}

export const getStatusLabel = (status: 'ACTIVE' | 'HIDDEN') => {
    switch(status) {
        case 'ACTIVE': return 'Đang hiển thị';
        case 'HIDDEN': return 'Đã ẩn';
        default: return status;
    }
};

export interface ReviewCreateRequest {
    bookingId: number;
    rating: number;
    comment: string;
}

export interface TourRatingResponse {
    averageRating: number;
    totalReviews: number;
}