import { create } from 'zustand';
import { authService, User } from '@/services/auth.service';
import { AuthLoginRequest, RegisterRequest } from '@/services/generated/models';
import { normalizeError } from '@/libs/utils/api-error';
import { signOut } from 'next-auth/react';

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
  checkAuth: () => Promise<void>;
  clearError: () => void;
  verify2FA: (preAuthToken: string, code: string) => Promise<void>;
  enable2FA: (secret: string, code: string) => Promise<void>;
  syncExternalSession: (accessToken: string, refreshToken?: string | null) => Promise<void>;
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

      const user = authService.getUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        loading: false,
      });
      return {};
    } catch (error: any) {
      const normalized = normalizeError(error);
      set({
        error: normalized.message,
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
      const normalized = normalizeError(error);
      set({
        error: normalized.message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      await signOut({ redirect: false });
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

  checkAuth: async () => {
    const user = authService.getUser();
    const authenticated = authService.isAuthenticated();

    set({ user, isAuthenticated: authenticated });

    if (!authenticated) {
      return;
    }

    if (user) {
      return;
    }

    try {
      const syncedUser = await authService.syncCurrentUser();
      set({ user: syncedUser as User, isAuthenticated: true });
    } catch {
      await authService.logout();
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),

  verify2FA: async (preAuthToken: string, code: string) => {
    set({ loading: true, error: null });
    try {
      await authService.verify2FA({ pre_auth_token: preAuthToken, otp_code: code });
      const user = authService.getUser();
      set({
        user,
        isAuthenticated: true,
        loading: false,
        preAuthToken: null,
      });
    } catch (error: any) {
      const normalized = normalizeError(error);
      set({
        error: normalized.message,
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
      const normalized = normalizeError(error);
      set({
        error: normalized.message,
        loading: false,
      });
      throw error;
    }
  },

  syncExternalSession: async (accessToken: string, refreshToken?: string | null) => {
    set({ isLoading: true, error: null });

    try {
      const user = await authService.hydrateFromExternalTokens(accessToken, refreshToken);
      set({
        user: user as User,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const normalized = normalizeError(error);
      set({
        user: null,
        isAuthenticated: false,
        error: normalized.message,
        isLoading: false,
      });
      throw error;
    }
  },
}));
