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
}

export const roomService = new RoomService();
export default roomService;
