import apiService from './api';
import type { Reservation, CreateReservationRequest, PaginationParams, PaginatedResponse } from '@/types';

/**
 * Paths map to the backend routes/reservation.ts. The axios instance already
 * prefixes /api, so paths here are relative to the API root.
 */
class ReservationService {
  async getAllReservations(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Reservation>>('/getall', { params });
  }

  async getReservationById(id: string) {
    return apiService.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  async getUserReservations(userId: string, params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Reservation>>(`${this.baseUrl}/user/${userId}`, { params });
  }

  async getCurrentUserReservations(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Reservation>>(`${this.baseUrl}/my`, { params });
  }

  async createReservation(reservationData: CreateReservationRequest) {
    return apiService.post<{ reservation: Reservation }>('/reservation', reservationData);
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

  /** Public: is this room free for the given stay? */
  async checkRoomAvailability(roomId: string, dateIn: string, dateOut: string) {
    return apiService.get<{ available: boolean; reason?: string }>(
      `/availability/room/${roomId}`,
      { params: { dateIn, dateOut } }
    );
  }

  /** Public: which of a hotel's rooms are free for the given stay. */
  async getAvailableRooms(hotelId: string, dateIn: string, dateOut: string) {
    return apiService.get<{ Count: number; Rooms: any[] }>(
      `/availability/hotel/${hotelId}`,
      { params: { dateIn, dateOut } }
    );
  }

  async updateReservation(id: string, reservationData: Partial<Reservation>) {
    return apiService.put<{ reservation: Reservation }>(`/updatereservation/${id}`, reservationData);
  }

  async deleteReservation(id: string) {
    return apiService.delete(`/deletereservation/${id}`);
  }

  // Admin endpoints
  async getAllReservationsAdmin(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Reservation>>(this.baseUrl, { params });
  }

  async removeAllReservations() {
    return apiService.delete(this.baseUrl);
  }

  async checkAvailability(roomId: string, checkIn: string, checkOut: string) {
    return apiService.get<boolean>(`${this.baseUrl}/check-availability`, {
      params: { roomId, checkIn, checkOut },
    });
  }
}

export const reservationService = new ReservationService();
export default reservationService;
