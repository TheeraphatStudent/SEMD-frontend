import * as getSemdApi from '@/services/generated/semdApi';
import { axiosInstance, tokenManager } from '@/libs/utils/axios-instance';
import { APP_CONFIG } from '@/constants/config';
import type {
  AuthLoginRequest,
  RegisterRequest,
  TwoFAVerifyRequest,
  TwoFAEnableRequest,
  TokenPairResponse,
  UserModel,
  TwoFASetupResponse,
  AccessKeyResponse,
} from '@/services/generated/models';

const api = getSemdApi;

export interface LoginResult {
  requiresTwoFactor: boolean;
  accessToken?: string;
  refreshToken?: string;
  preAuthToken?: string;
}

const isTokenPairResponse = (response: any): response is TokenPairResponse => {
  return 'access_token' in response;
};

export const authService = {
  async login(data: AuthLoginRequest): Promise<LoginResult> {
    const result = await api.loginAuthLoginPost(data);

    if (isTokenPairResponse(result)) {
      tokenManager.setToken(result.access_token);
      tokenManager.setRefreshToken(result.refresh_token);
      return {
        requiresTwoFactor: false,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      };
    }

    return {
      requiresTwoFactor: true,
      preAuthToken: (result as any).pre_auth_token,
    };
  },

  async register(data: RegisterRequest): Promise<void> {
    await api.registerAuthRegisterPost(data);
  },

  async verify2FA(data: TwoFAVerifyRequest): Promise<TokenPairResponse> {
    const result = await api.login2faAuthLogin2faPost(data);

    tokenManager.setToken(result.access_token);
    tokenManager.setRefreshToken(result.refresh_token);

    return result;
  },

  async setup2FA(): Promise<TwoFASetupResponse> {
    const result = await api.setup2faAuth2faSetupPost();
    return result;
  },

  async enable2FA(data: TwoFAEnableRequest): Promise<void> {
    await api.enable2faAuth2faEnablePost(data);
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await api.logoutAuthLogoutPost({ refresh_token: refreshToken });
      }
    } finally {
      tokenManager.clearAuth();
    }
  },

  async refreshToken(): Promise<TokenPairResponse> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const result = await api.refreshAuthRefreshPost({ refresh_token: refreshToken });

    tokenManager.setToken(result.access_token);
    tokenManager.setRefreshToken(result.refresh_token);

    return result;
  },

  async getMe(): Promise<UserModel> {
    const result = await api.getMeAuthMeGet();
    return result;
  },

  async updateMe(data: any): Promise<UserModel> {
    const result = await api.updateMeAuthMePut(data);
    return result;
  },

  async createExtensionToken(): Promise<AccessKeyResponse> {
    const result = await api.createExtensionTokenSettingAccessKeyExtensionTokenPost();
    return result
  },

  async getOAuthAuthorizeUrl(provider: 'google' | 'github'): Promise<string> {
    const result = await api.oauthAuthorizeAuthOauthAuthorizePost({ provider });
    return result.authorization_url;
  },

  saveUser: (user: UserModel): void => {
    if (typeof window === 'undefined') return;
    const userStr = JSON.stringify(user);
    localStorage.setItem(APP_CONFIG.USER_KEY, userStr);

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${APP_CONFIG.USER_KEY}=${encodeURIComponent(userStr)}; expires=${expires}; path=/; SameSite=Lax`;
  },

  getUser: (): UserModel | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: tokenManager.getToken,
  getRefreshToken: tokenManager.getRefreshToken,
  clearAuth: tokenManager.clearAuth,
  
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },
};

export type { UserModel };
