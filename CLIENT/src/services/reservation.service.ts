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
    return apiService.get<{ reservation: Reservation }>(`/getone/${id}`);
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

  async updateReservation(id: string, reservationData: Partial<Reservation>) {
    return apiService.put<{ reservation: Reservation }>(`/updatereservation/${id}`, reservationData);
  }

  async deleteReservation(id: string) {
    return apiService.delete(`/deletereservation/${id}`);
  }

  /** Front-desk: look up a booking by reservation ID. */
  async lookupReservation(id: string) {
    return apiService.get<{ reservation: Reservation }>(`/lookup/${id}`);
  }

  /** Front-desk: look up a guest booking by its booking reference. */
  async lookupByReference(reference: string) {
    return apiService.get<{ reservation: Reservation }>(`/lookup-ref/${reference}`);
  }

  async checkIn(id: string) {
    return apiService.put<{ reservation: Reservation }>(`/checkin/${id}`, {});
  }

  async checkOut(id: string) {
    return apiService.put<{ reservation: Reservation }>(`/checkout/${id}`, {});
  }
}

export const reservationService = new ReservationService();
export default reservationService;
