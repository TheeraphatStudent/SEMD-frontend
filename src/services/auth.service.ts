import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { APP_CONFIG } from '@/constants/config';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  TwoFactorRequest,
  TwoFactorResponse,
  User,
} from '@/types/auth.types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    
    if (response.token && !response.requiresTwoFactor) {
      apiClient.setToken(response.token);
      apiClient.setRefreshToken(response.refreshToken);
      this.saveUser(response.user);
    }
    
    return response;
  },
  
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    if (response.token) {
      apiClient.setToken(response.token);
      apiClient.setRefreshToken(response.refreshToken);
      this.saveUser(response.user);
    }
    
    return response;
  },
  
  async verifyTwoFactor(data: TwoFactorRequest): Promise<TwoFactorResponse> {
    const response = await apiClient.post<TwoFactorResponse>(
      API_ENDPOINTS.AUTH.VERIFY_2FA,
      data
    );
    
    if (response.token) {
      apiClient.setToken(response.token);
      apiClient.setRefreshToken(response.refreshToken);
    }
    
    return response;
  },
  
  async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    return await apiClient.post(API_ENDPOINTS.AUTH.ENABLE_2FA);
  },
  
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      this.clearAuth();
    }
  },
  
  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    
    if (response.token) {
      apiClient.setToken(response.token);
      apiClient.setRefreshToken(response.refreshToken);
    }
    
    return response;
  },
  
  saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user));
  },
  
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(APP_CONFIG.TOKEN_KEY);
  },
  
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(APP_CONFIG.REFRESH_TOKEN_KEY);
  },
  
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
  },
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  
  async verify2FA(email: string, code: string): Promise<TwoFactorResponse> {
    const response = await this.verifyTwoFactor({ email, code });
    
    if (response.user) {
      this.saveUser(response.user);
    }
    
    return response;
  },
  
  async enable2FA(code: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_2FA, { code });
  },
};
