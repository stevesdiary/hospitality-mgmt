import apiService from './api';
import type { User, PaginationParams, PaginatedResponse } from '@/types';

/** Paths map to the backend routes/user.ts. The axios instance prefixes /api. */
class UserService {
  async getAllUsers(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<User>>('/alluser', { params });
  }

  async getUserById(id: string) {
    return apiService.get<{ user: User }>(`/user/${id}`);
  }

  async updateUser(id: string, userData: Partial<User>) {
    return apiService.put<{ user: User }>(`/updateuser/${id}`, userData);
  }

  async deleteUser(id: string) {
    return apiService.delete(`/deleteuser/${id}`);
  }
}

export const userService = new UserService();
export default userService;
