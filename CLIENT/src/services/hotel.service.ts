import apiService from './api';
import type { Hotel, HotelSearchFilters, PaginatedResponse, PaginationParams } from '@/types';

/**
 * Paths map to the backend routes/hotel.ts. The axios instance prefixes /api.
 * The listing/discovery routes require authentication (staff only); the
 * by-slug and findone routes are the public, single-hotel surfaces.
 */
class HotelService {
  private baseUrl = '/hotels';

  /** Staff-only: list hotels scoped to the caller's company (platform admin: all). */
  async getAllHotels(params?: HotelSearchFilters & PaginationParams) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}`, { params });
  }

  async getHotelById(id: string) {
    return apiService.get<{ hotel: Hotel }>(`${this.baseUrl}/${id}`);
  }

  /** Public per-hotel landing page — resolves a single hotel by its slug with branding. */
  async getHotelBySlug(slug: string) {
    return apiService.get<{ hotel: Hotel }>(`${this.baseUrl}/slug/${slug}`);
  }

  async createHotel(hotelData: Partial<Hotel>) {
    return apiService.post<{ hotel: Hotel }>(`${this.baseUrl}`, hotelData);
  }

  async updateHotel(id: string, hotelData: Partial<Hotel>) {
    return apiService.put<{ hotel: Hotel }>(`${this.baseUrl}/${id}`, hotelData);
  }

  async deleteHotel(id: string) {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async searchHotels(filters: HotelSearchFilters) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/search`, { params: filters });
  }

  async getHotelsByCity(city: string) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/by-city`, { params: { city } });
  }

  // New methods for backend endpoints
  async getTopDeals(params?: HotelSearchFilters & PaginationParams) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/top-deals`, { params });
  }

  async getTopHotels(params?: HotelSearchFilters & PaginationParams) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/top-rated`, { params });
  }

  async getTopDestinations(params?: HotelSearchFilters & PaginationParams) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/top-destinations`, { params });
  }

  async getHotelsByDate(params?: HotelSearchFilters & PaginationParams) {
    return apiService.get<PaginatedResponse<Hotel>>(`${this.baseUrl}/by-date`, { params });
  }
}

export const hotelService = new HotelService();
export default hotelService;
