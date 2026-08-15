import apiService from './api';
import type { RatingAndReview, CreateReviewRequest, PaginationParams, PaginatedResponse } from '@/types';

class RatingAndReviewService {
  private baseUrl = '/ratings';

  async createRating(userId: string, reviewData: CreateReviewRequest) {
    return apiService.post<RatingAndReview>(`${this.baseUrl}/createrating/${userId}`, reviewData);
  }

  async getRating(id: string) {
    return apiService.get<RatingAndReview>(`${this.baseUrl}/getrating/${id}`);
  }

  async updateRating(id: string, reviewData: Partial<RatingAndReview>) {
    return apiService.put<RatingAndReview>(`${this.baseUrl}/updaterating/${id}`, reviewData);
  }

  async deleteRating(id: string) {
    return apiService.delete(`${this.baseUrl}/deleterating/${id}`);
  }

  async getRatingsByHotel(hotelId: string, params?: PaginationParams) {
    return apiService.get<PaginatedResponse<RatingAndReview>>(`${this.baseUrl}/hotel/${hotelId}`, { params });
  }

  async getRatingsByRoom(roomId: string, params?: PaginationParams) {
    return apiService.get<PaginatedResponse<RatingAndReview>>(`${this.baseUrl}/room/${roomId}`, { params });
  }
}

export const ratingAndReviewService = new RatingAndReviewService();
export default ratingAndReviewService;