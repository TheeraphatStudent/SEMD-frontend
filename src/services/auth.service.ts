import { api, tokenManager, saveUser, getUser, isAuthenticated } from '@/lib/api';
import {
  AuthLoginRequest,
  RegisterRequest,
  TwoFAVerifyRequest,
  TwoFAEnableRequest,
  TokenPairResponse,
  PreAuthResponse,
  RegisterResponse,
  TwoFASetupResponse,
} from '@/services/generated/models';

export interface LoginResult {
  requiresTwoFactor: boolean;
  accessToken?: string;
  refreshToken?: string;
  preAuthToken?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  twoFactorEnabled?: boolean;
}

const isTokenPairResponse = (response: TokenPairResponse | PreAuthResponse): response is TokenPairResponse => {
  return 'access_token' in response;
};

export const authService = {
  async login(data: AuthLoginRequest): Promise<LoginResult> {
    const response = await api.loginAuthLoginPost(data);
    const result = response.data;

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
      preAuthToken: result.pre_auth_token,
    };
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.registerAuthRegisterPost(data);
    return response.data;
  },

  async verify2FA(data: TwoFAVerifyRequest): Promise<TokenPairResponse> {
    const response = await api.login2faAuthLogin2faPost(data);
    const result = response.data;

    tokenManager.setToken(result.access_token);
    tokenManager.setRefreshToken(result.refresh_token);

    return result;
  },

  async setup2FA(): Promise<TwoFASetupResponse> {
    const response = await api.setup2faAuth2faSetupPost();
    return response.data;
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

    const response = await api.refreshAuthRefreshPost({ refresh_token: refreshToken });
    const result = response.data;

    tokenManager.setToken(result.access_token);
    tokenManager.setRefreshToken(result.refresh_token);

    return result;
  },

  saveUser,
  getUser: getUser<User>,
  getToken: tokenManager.getToken,
  getRefreshToken: tokenManager.getRefreshToken,
  clearAuth: tokenManager.clearAuth,
  isAuthenticated,
};
