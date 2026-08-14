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
