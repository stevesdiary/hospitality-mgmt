import apiService from './api';
import type { User, PaginationParams, PaginatedResponse } from '@/types';

class UserService {
  private baseUrl = '/users';

  async getAllUsers(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<User>>(this.baseUrl, { params });
  }

  async getUserById(id: string) {
    return apiService.get<User>(`${this.baseUrl}/${id}`);
  }

  async getCurrentUser() {
    return apiService.get<User>(`${this.baseUrl}/me`);
  }

  async createUser(userData: Partial<User>) {
    return apiService.post<User>(this.baseUrl, userData);
  }

  async updateUser(id: string, userData: Partial<User>) {
    return apiService.put<User>(`${this.baseUrl}/${id}`, userData);
  }

  async updateCurrentUser(userData: Partial<User>) {
    return apiService.put<User>(`${this.baseUrl}/me`, userData);
  }

  async deleteUser(id: string) {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return apiService.patch(`${this.baseUrl}/change-password`, { oldPassword, newPassword });
  }

  async uploadProfileImage(file: File) {
    return apiService.uploadFile<{ url: string }>(`${this.baseUrl}/upload-image`, file);
  }
}

export const userService = new UserService();
export default userService;
