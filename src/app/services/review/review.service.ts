// src/services/review/review.service.ts

import api from '../api';
import { ApiResponse } from '../auth/auth.types';
import { ReviewResponse, ReviewCreateRequest, TourRatingResponse } from './review.types';

export const reviewService = {
    create: (data: ReviewCreateRequest) => 
        api.post<ApiResponse<ReviewResponse>>('/api/v1/reviews', data).then(res => res.data),

    getByTourId: (tourId: number, page: number = 1, size: number = 5, rating?: number) => {
        let url = `/api/v1/reviews/tour/${tourId}?page=${page}&size=${size}`;
        if (rating) url += `&rating=${rating}`;
        return api.get<ApiResponse<any>>(url).then(res => res.data);
    },

    getRatingStats: (tourId: number) => 
        api.get<ApiResponse<TourRatingResponse>>(`/api/v1/reviews/tour/${tourId}/rating`).then(res => res.data),

    replyAdmin: (reviewId: number, reply: string) => 
        api.post<ApiResponse<ReviewResponse>>(`/api/v1/reviews/admin/${reviewId}/reply`, { reply }).then(res => res.data),

    hideReview: (reviewId: number) => 
        api.put<ApiResponse<void>>(`/api/v1/reviews/admin/${reviewId}/hide`).then(res => res.data),
    getAllReviews: (page: number = 1, size: number = 10) => 
        api.get<ApiResponse<any>>(`/api/v1/reviews/admin/all?page=${page}&size=${size}`).then(res => res.data)

};