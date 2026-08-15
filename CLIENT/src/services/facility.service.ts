import apiService from './api';
import type { Facility, PaginationParams, PaginatedResponse } from '@/types';

class FacilityService {
  private baseUrl = '/facilities';

  async createFacility(facilityData: Partial<Facility>) {
    return apiService.post<Facility>(`${this.baseUrl}/createfacility`, facilityData);
  }

  async getFacilityByHotel(hotelId: string) {
    return apiService.get<Facility>(`${this.baseUrl}/findfacility/${hotelId}`);
  }

  async getAllFacilities(params?: PaginationParams) {
    return apiService.get<PaginatedResponse<Facility>>(`${this.baseUrl}/findfacilities`, { params });
  }

  async updateFacility(id: string, facilityData: Partial<Facility>) {
    return apiService.put<Facility>(`${this.baseUrl}/facility/${id}`, facilityData);
  }

  async deleteFacility(id: string) {
    return apiService.delete(`${this.baseUrl}/facility/${id}`);
  }
}

export const facilityService = new FacilityService();
export default facilityService;