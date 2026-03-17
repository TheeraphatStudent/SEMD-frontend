import { create } from 'zustand';
import { authService, UserModel } from '@/services/auth.service';
import { AuthLoginRequest, RegisterRequest } from '@/services/generated/models';
import { toast } from '@/hooks/use-toast';

interface TwoFASetupData {
  secret: string;
  qrUri: string;
}

interface AuthState {
  user: UserModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  preAuthToken: string | null;
  twoFASetupData: TwoFASetupData | null;

  login: (data: AuthLoginRequest) => Promise<{ requiresTwoFactor?: boolean; preAuthToken?: string }>;
  register: (data: RegisterRequest) => Promise<void>;
  registerAndSetup2FA: (data: RegisterRequest) => Promise<TwoFASetupData>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
  verify2FA: (preAuthToken: string, code: string) => Promise<void>;
  enable2FA: (secret: string, code: string) => Promise<void>;
  setup2FA: () => Promise<TwoFASetupData>;
  fetchMe: () => Promise<UserModel | null>;
  createExtensionToken: () => Promise<string>;
  connectOAuth: (provider: 'google' | 'github') => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  loading: false,
  error: null,
  preAuthToken: null,
  twoFASetupData: null,

  login: async (data: AuthLoginRequest) => {
    set({ isLoading: true, loading: true, error: null });
    try {
      const result = await authService.login(data);

      if (result.requiresTwoFactor) {
        set({ isLoading: false, loading: false, preAuthToken: result.preAuthToken });
        return { requiresTwoFactor: true, preAuthToken: result.preAuthToken };
      }

      const user = await authService.getMe();
      authService.saveUser(user);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        loading: false,
      });
      return {};
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'เข้าสู่ระบบไม่สำเร็จ';
      set({
        error: message,
        isLoading: false,
        loading: false,
      });
      toast.error(message);
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
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'ลงทะเบียนไม่สำเร็จ';
      set({
        error: message,
        isLoading: false,
      });
      toast.error(message);
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
      
      const user = await authService.getMe();
      authService.saveUser(user);
      
      set({
        user,
        isAuthenticated: true,
        loading: false,
        preAuthToken: null,
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'ยืนยัน 2FA ไม่สำเร็จ';
      set({
        error: message,
        loading: false,
      });
      toast.error(message);
      throw error;
    }
  },

  enable2FA: async (secret: string, code: string) => {
    set({ loading: true, error: null });
    try {
      await authService.enable2FA({ secret, otp_code: code });
      
      const user = await authService.getMe();
      authService.saveUser(user);
      
      set({
        user,
        loading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'เปิดใช้งาน 2FA ไม่สำเร็จ';
      set({
        error: message,
        loading: false,
      });
      toast.error(message);
      throw error;
    }
  },

  setup2FA: async () => {
    set({ loading: true, error: null });
    try {
      const result = await authService.setup2FA();
      const setupData = {
        secret: result.secret,
        qrUri: result.qr_uri,
      };
      set({
        twoFASetupData: setupData,
        loading: false,
      });
      return setupData;
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'ตั้งค่า 2FA ไม่สำเร็จ';
      set({
        error: message,
        loading: false,
      });
      toast.error(message);
      throw error;
    }
  },

  registerAndSetup2FA: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(data);
      
      await authService.login({ username: data.username, password: data.password });
      
      const result = await authService.setup2FA();
      const setupData = {
        secret: result.secret,
        qrUri: result.qr_uri,
      };
      
      set({
        twoFASetupData: setupData,
        isLoading: false,
      });
      
      return setupData;
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'ลงทะเบียนไม่สำเร็จ';
      set({
        error: message,
        isLoading: false,
      });
      toast.error(message);
      throw error;
    }
  },

  fetchMe: async () => {
    try {
      const user = await authService.getMe();
      authService.saveUser(user);
      set({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      return null;
    }
  },

  createExtensionToken: async () => {
    set({ loading: true, error: null });
    try {
      const result = await authService.createExtensionToken();
      set({ loading: false });

      const token = (result?.data as any)?.ex_acc_token;

      return token;
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'สร้าง Token ไม่สำเร็จ';
      set({ error: message, loading: false });
      toast.error(message);
      throw error;
    }
  },

  connectOAuth: async (provider: 'google' | 'github') => {
    try {
      const authUrl = await authService.getOAuthAuthorizeUrl(provider);
      window.location.href = authUrl;
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'เชื่อมต่อไม่สำเร็จ';
      toast.error(message);
      throw error;
    }
  },
}));
