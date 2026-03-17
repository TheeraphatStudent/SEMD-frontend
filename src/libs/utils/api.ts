import * as getSemdApi from '@/services/generated/semdApi';
import { tokenManager } from './axios-instance';
import { APP_CONFIG } from '@/constants/config';

export const api = getSemdApi;

export { tokenManager };

export const saveUser = (user: unknown): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user));
};

export const getUser = <T = unknown>(): T | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!tokenManager.getToken();
};
