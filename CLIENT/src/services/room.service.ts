import apiService from './api';
import type { Room, PaginationParams, PaginatedResponse } from '@/types';

/** Paths map to the backend routes/room.ts. The axios instance prefixes /api. */
class RoomService {
  async getAllRooms(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Room>>('/rooms', { params });
  }

  async getRoomById(id: string) {
    return apiService.get<{ room: Room }>(`/room/${id}`);
  }

  async createRoom(roomData: Partial<Room>) {
    return apiService.post<{ room: Room }>('/room', roomData);
  }

  async updateRoom(id: string, roomData: Partial<Room>) {
    return apiService.put<{ room: Room }>(`/updateroom/${id}`, roomData);
  }

  async deleteRoom(id: string) {
    return apiService.delete(`/deleteroom/${id}`);
  }
}

export const roomService = new RoomService();
export default roomService;
