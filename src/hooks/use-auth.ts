import { create } from 'zustand';
import { authService, User } from '@/services/auth.service';
import { AuthLoginRequest, RegisterRequest } from '@/services/generated/models';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  preAuthToken: string | null;

  login: (data: AuthLoginRequest) => Promise<{ requiresTwoFactor?: boolean; preAuthToken?: string }>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
  verify2FA: (preAuthToken: string, code: string) => Promise<void>;
  enable2FA: (secret: string, code: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  loading: false,
  error: null,
  preAuthToken: null,

  login: async (data: AuthLoginRequest) => {
    set({ isLoading: true, loading: true, error: null });
    try {
      const result = await authService.login(data);

      if (result.requiresTwoFactor) {
        set({ isLoading: false, loading: false, preAuthToken: result.preAuthToken });
        return { requiresTwoFactor: true, preAuthToken: result.preAuthToken };
      }

      set({
        isAuthenticated: true,
        isLoading: false,
        loading: false,
      });
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'เข้าสู่ระบบไม่สำเร็จ';
      set({
        error: message,
        isLoading: false,
        loading: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(data);
      set({
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'ลงทะเบียนไม่สำเร็จ';
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        preAuthToken: null,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  checkAuth: () => {
    const user = authService.getUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated });
  },

  clearError: () => set({ error: null }),

  verify2FA: async (preAuthToken: string, code: string) => {
    set({ loading: true, error: null });
    try {
      await authService.verify2FA({ pre_auth_token: preAuthToken, otp_code: code });
      set({
        isAuthenticated: true,
        loading: false,
        preAuthToken: null,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'ยืนยัน 2FA ไม่สำเร็จ';
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },

  enable2FA: async (secret: string, code: string) => {
    set({ loading: true, error: null });
    try {
      await authService.enable2FA({ secret, otp_code: code });
      const user = authService.getUser();
      set({
        user: user ? { ...user, twoFactorEnabled: true } : null,
        loading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'เปิดใช้งาน 2FA ไม่สำเร็จ';
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },
}));
