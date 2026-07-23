import apiService from './api';
import type { Hotel, HotelSearchFilters, PaginatedResponse, PaginationParams } from '@/types';

/**
 * Paths map to the backend routes/hotel.ts. The axios instance prefixes /api.
 * The listing/discovery routes require authentication (staff only); the
 * by-slug and findone routes are the public, single-hotel surfaces.
 */
class HotelService {
  /** Staff-only: list hotels scoped to the caller's company (platform admin: all). */
  async getAllHotels(params?: HotelSearchFilters & PaginationParams) {
    return apiService.get<PaginatedResponse<Hotel>>('/findall', { params });
  }

  async getHotelById(id: string) {
    return apiService.get<{ hotel: Hotel }>(`/findone/${id}`);
  }

  /** Public per-hotel landing page — resolves a single hotel by its slug. */
  async getHotelBySlug(slug: string) {
    return apiService.get<{ hotel: Hotel }>(`/hotels/by-slug/${slug}`);
  }

  async createHotel(hotelData: Partial<Hotel>) {
    return apiService.post<{ hotel: Hotel }>('/createhotel', hotelData);
  }

  async updateHotel(id: string, hotelData: Partial<Hotel>) {
    return apiService.put<{ hotel: Hotel }>(`/update/${id}`, hotelData);
  }

  async deleteHotel(id: string) {
    return apiService.delete(`/delete/${id}`);
  }
}

export const hotelService = new HotelService();
export default hotelService;
