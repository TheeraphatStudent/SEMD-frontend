import { APP_CONFIG, ROLE, type Role } from '@/constants/config';
import type { RoleType, UserModel } from '@/services/generated/models';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  twoFactorEnabled: boolean;
  profileImageUri?: string | null;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function canUseDocument() {
  return typeof document !== 'undefined';
}

function encodeCookieValue(value: string) {
  return encodeURIComponent(value);
}

function decodeCookieValue(value: string) {
  return decodeURIComponent(value);
}

export function getCookie(name: string): string | null {
  if (!canUseDocument()) {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeCookieValue(cookie.slice(name.length + 1));
}

export function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE) {
  if (!canUseDocument()) {
    return;
  }

  document.cookie = `${name}=${encodeCookieValue(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeCookie(name: string) {
  if (!canUseDocument()) {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function normalizeBackendRole(role?: RoleType | string | null): Role {
  switch (role) {
    case 'ADMIN':
      return ROLE.ADMIN;
    case 'SUPER_ADMIN':
      return ROLE.MASTER_ADMIN;
    case 'MEMBER':
      return ROLE.USER;
    default:
      return ROLE.GUEST;
  }
}

export function serializeUser(user: AuthUser) {
  return JSON.stringify(user);
}

export function deserializeUser(serialized: string | null): AuthUser | null {
  if (!serialized) {
    return null;
  }

  try {
    return JSON.parse(serialized) as AuthUser;
  } catch {
    return null;
  }
}

export function toAuthUser(user: UserModel): AuthUser {
  return {
    id: String(user.user_id ?? user.username),
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    role: normalizeBackendRole(user.role),
    twoFactorEnabled: Boolean(user.is_2fa_enabled),
    profileImageUri: user.profile_img_uri,
  };
}

export const authStorage = {
  getAccessToken() {
    return getCookie(APP_CONFIG.TOKEN_KEY);
  },
  setAccessToken(token: string) {
    setCookie(APP_CONFIG.TOKEN_KEY, token);
  },
  getRefreshToken() {
    return getCookie(APP_CONFIG.REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string) {
    setCookie(APP_CONFIG.REFRESH_TOKEN_KEY, token);
  },
  getUser() {
    return deserializeUser(getCookie(APP_CONFIG.USER_KEY));
  },
  setUser(user: AuthUser) {
    setCookie(APP_CONFIG.USER_KEY, serializeUser(user));
  },
  clear() {
    removeCookie(APP_CONFIG.TOKEN_KEY);
    removeCookie(APP_CONFIG.REFRESH_TOKEN_KEY);
    removeCookie(APP_CONFIG.USER_KEY);
  },
};
