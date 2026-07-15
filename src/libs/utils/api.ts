import { getSemdApi } from '@/services/generated/semdApi';
import { axiosInstance, tokenManager } from './axios-instance';
import { authStorage, type AuthUser } from './auth-storage';

export const api = getSemdApi(axiosInstance);

export { tokenManager };

export const saveUser = (user: AuthUser): void => {
  authStorage.setUser(user);
};

export const getUser = <T = AuthUser>(): T | null => {
  return authStorage.getUser() as T | null;
};

export const isAuthenticated = (): boolean => {
  return !!tokenManager.getToken();
};
