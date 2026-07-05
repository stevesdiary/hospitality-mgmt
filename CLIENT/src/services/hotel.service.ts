import apiService from './api';
import type { Hotel, HotelSearchFilters, PaginatedResponse, PaginationParams } from '@/types';

class HotelService {
  private baseUrl = '/hotels';

  async getAllHotels(params?: HotelSearchFilters & PaginationParams) {
    return apiService.get<PaginatedResponse<Hotel>>(this.baseUrl, { params });
  }

  async getHotelById(id: string) {
    return apiService.get<Hotel>(`${this.baseUrl}/${id}`);
  }

  /** Public per-hotel landing page — resolves a single hotel by its slug. */
  async getHotelBySlug(slug: string) {
    return apiService.get<{ hotel: Hotel }>(`/hotels/by-slug/${slug}`);
  }

  async createHotel(hotelData: Partial<Hotel>) {
    return apiService.post<Hotel>(this.baseUrl, hotelData);
  }

  async updateHotel(id: string, hotelData: Partial<Hotel>) {
    return apiService.put<Hotel>(`${this.baseUrl}/${id}`, hotelData);
  }

  async deleteHotel(id: string) {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async searchHotels(filters: HotelSearchFilters) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/search`, { params: filters });
  }

  async getHotelsByCity(city: string) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/city/${city}`);
  }

  async getPopularHotels(limit?: number) {
    return apiService.get<Hotel[]>(`${this.baseUrl}/popular`, { params: { limit } });
  }
}

export const hotelService = new HotelService();
export default hotelService;
