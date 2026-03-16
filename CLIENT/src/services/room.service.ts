import apiService from './api';
import type { Room, RoomBookingRequest, PaginationParams, PaginatedResponse } from '@/types';

class RoomService {
  private baseUrl = '/rooms';

  async getAllRooms(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Room>>(this.baseUrl, { params });
  }

  async getRoomById(id: string) {
    return apiService.get<Room>(`${this.baseUrl}/${id}`);
  }

  async getRoomsByHotel(hotelId: string, params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Room>>(`${this.baseUrl}/hotel/${hotelId}`, { params });
  }

  async createRoom(roomData: Partial<Room>) {
    return apiService.post<Room>(this.baseUrl, roomData);
  }

  async updateRoom(id: string, roomData: Partial<Room>) {
    return apiService.put<Room>(`${this.baseUrl}/${id}`, roomData);
  }

  async deleteRoom(id: string) {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async checkAvailability(hotelId: string, checkIn: string, checkOut: string, guests?: number) {
    return apiService.get<Room[]>(`${this.baseUrl}/availability`, {
      params: { hotelId, checkIn, checkOut, guests },
    });
  }

  async bookRoom(bookingRequest: RoomBookingRequest) {
    return apiService.post(`${this.baseUrl}/book`, bookingRequest);
  }
}

export const roomService = new RoomService();
export default roomService;
