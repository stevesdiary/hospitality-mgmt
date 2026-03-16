import apiService from './api';
import type { Reservation, CreateReservationRequest, PaginationParams, PaginatedResponse } from '@/types';

class ReservationService {
  private baseUrl = '/reservations';

  async getAllReservations(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Reservation>>(this.baseUrl, { params });
  }

  async getReservationById(id: string) {
    return apiService.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  async getUserReservations(userId: string, params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Reservation>>(`${this.baseUrl}/user/${userId}`, { params });
  }

  async getCurrentUserReservations(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Reservation>>(`${this.baseUrl}/my-reservations`, { params });
  }

  async createReservation(reservationData: CreateReservationRequest) {
    return apiService.post<Reservation>(this.baseUrl, reservationData);
  }

  async updateReservation(id: string, reservationData: Partial<Reservation>) {
    return apiService.put<Reservation>(`${this.baseUrl}/${id}`, reservationData);
  }

  async cancelReservation(id: string) {
    return apiService.patch<Reservation>(`${this.baseUrl}/${id}/cancel`);
  }

  async confirmReservation(id: string) {
    return apiService.patch<Reservation>(`${this.baseUrl}/${id}/confirm`);
  }

  async deleteReservation(id: string) {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async checkAvailability(roomId: string, checkIn: string, checkOut: string) {
    return apiService.get<boolean>(`${this.baseUrl}/check-availability`, {
      params: { roomId, checkIn, checkOut },
    });
  }
}

export const reservationService = new ReservationService();
export default reservationService;
