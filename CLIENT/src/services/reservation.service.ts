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

  /**
   * Guest checkout — book a hotel from its public page without an account.
   * Returns a booking reference the guest presents at the front desk.
   */
  async createGuestReservation(data: {
    hotelId: string;
    roomId: string;
    dateIn: string;
    dateOut: string;
    guestCount: number;
    guest: { name: string; email: string; phone?: string };
  }) {
    return apiService.post<{ bookingReference: string; reservation: Reservation }>(
      '/reservation/guest',
      data
    );
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

  /** Front-desk: look up a booking by ID */
  async lookupReservation(id: string) {
    return apiService.get<Reservation>(`/lookup/${id}`);
  }

  async checkIn(id: string) {
    return apiService.put<Reservation>(`/checkin/${id}`, {});
  }

  async checkOut(id: string) {
    return apiService.put<Reservation>(`/checkout/${id}`, {});
  }
}

export const reservationService = new ReservationService();
export default reservationService;
