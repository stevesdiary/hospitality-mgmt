import apiService from './api';

export interface CompanyBranding {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface Company extends CompanyBranding {
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  isActive: boolean;
}

class CompanyService {
  private baseUrl = '/companies';

  async getMyCompany(): Promise<Company> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.companyId) throw new Error('No company associated with user');
    return apiService.get<Company>(`${this.baseUrl}/${user.companyId}`);
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    return apiService.put<Company>(`${this.baseUrl}/${id}`, data);
  }

  async updateBranding(id: string, branding: Partial<CompanyBranding>): Promise<Company> {
    return apiService.put<Company>(`${this.baseUrl}/${id}`, branding);
  }
}

export const companyService = new CompanyService();
export default companyService;
