import apiService from './api';
import type { LoginCredentials, RegisterData, User, PasswordResetData } from '@/types';

class AuthService {
  private baseUrl = '/auth';

  async login(credentials: LoginCredentials) {
    return apiService.post<{ token: string; user: User }>(`${this.baseUrl}/login`, credentials);
  }

  async register(data: RegisterData) {
    return apiService.post<{ token: string; user: User }>(`${this.baseUrl}/register`, data);
  }

  /**
   * Self-serve hotel onboarding: creates a company + its first org_admin and
   * returns an auto-login token. This is how a hotel "lists" on StayNG.
   */
  async onboardHotel(data: {
    company: { name: string; contactEmail: string; contactPhone?: string; address?: string };
    admin: { firstName: string; lastName: string; email: string; phoneNumber?: string; password: string };
  }) {
    return apiService.post<{ token: string; user: User; company: { id: string; name: string } }>(
      '/onboard',
      data
    );
  }

  async logout() {
    return apiService.post(`${this.baseUrl}/logout`);
  }

  async forgotPassword(email: string) {
    return apiService.post(`${this.baseUrl}/forgot-password`, { email });
  }

  async resetPassword(data: PasswordResetData) {
    return apiService.post(`${this.baseUrl}/reset-password`, data);
  }

  async verifyEmail(token: string) {
    return apiService.post(`${this.baseUrl}/verify-email`, { token });
  }

  async getCurrentUser() {
    return apiService.get<User>('/users/me');
  }

  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();
export default authService;
