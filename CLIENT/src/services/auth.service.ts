import apiService from './api';
import type { LoginCredentials, RegisterData, User, PasswordResetData } from '@/types';

// The backend returns the user's role as `type`; the client reads `userType`
// (ProtectedRoute, login redirect). Normalise so both names are present.
const normalizeUser = (user: any): User => (
  user ? { ...user, userType: user.userType ?? user.type } : user
);

class AuthService {
  // Routes are mounted at the API root (see backend routes/auth.ts), e.g.
  // /login, /signup — the axios instance already prefixes /api.

  async login(credentials: LoginCredentials) {
    const res = await apiService.post<{ token: string; user: any }>('/login', credentials);
    return { ...res, user: normalizeUser(res.user) };
  }

  async register(data: RegisterData) {
    const res = await apiService.post<{ token: string; user: any }>('/signup', data);
    return { ...res, user: normalizeUser(res.user) };
  }

  /**
   * Self-serve hotel onboarding: creates a company + its first org_admin and
   * returns an auto-login token. This is how a hotel "lists" on StayNG.
   */
  async onboardHotel(data: {
    company: { name: string; contactEmail: string; contactPhone?: string; address?: string };
    admin: { firstName: string; lastName: string; email: string; phoneNumber?: string; password: string };
  }) {
    const res = await apiService.post<{ token: string; user: any; company: { id: string; name: string } }>(
      '/onboard',
      data
    );
    return { ...res, user: normalizeUser(res.user) };
  }

  async logout() {
    return apiService.post('/logout');
  }

  async forgotPassword(email: string) {
    return apiService.post('/forgot', { email });
  }

  async resetPassword(data: PasswordResetData) {
    // Backend takes the token in the URL and the new password in the body.
    return apiService.post(`/reset/${data.token}`, {
      newPassword: data.newPassword,
      confirmPassword: data.newPassword,
    });
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
