import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { User, LoginRequest, RegisterRequest } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  
  login: (data: LoginRequest) => Promise<{ requiresTwoFactor?: boolean }>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
  verify2FA: (email: string, code: string) => Promise<void>;
  enable2FA: (code: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  loading: false,
  error: null,
  
  login: async (data: LoginRequest) => {
    set({ isLoading: true, loading: true, error: null });
    try {
      const response = await authService.login(data);
      
      if (response.requiresTwoFactor) {
        set({ isLoading: false, loading: false });
        return { requiresTwoFactor: true };
      }
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        loading: false,
      });
      return {};
    } catch (error: any) {
      set({
        error: error.message || 'เข้าสู่ระบบไม่สำเร็จ',
        isLoading: false,
        loading: false,
      });
      throw error;
    }
  },
  
  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'ลงทะเบียนไม่สำเร็จ',
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
  
  verify2FA: async (email: string, code: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.verify2FA(email, code);
      set({
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'ยืนยัน 2FA ไม่สำเร็จ',
        loading: false,
      });
      throw error;
    }
  },
  
  enable2FA: async (code: string) => {
    set({ loading: true, error: null });
    try {
      await authService.enable2FA(code);
      const user = authService.getUser();
      set({
        user: user ? { ...user, twoFactorEnabled: true } : null,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'เปิดใช้งาน 2FA ไม่สำเร็จ',
        loading: false,
      });
      throw error;
    }
  },
}));
