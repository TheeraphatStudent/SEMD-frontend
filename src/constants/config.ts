export const APP_CONFIG = {
  APP_NAME: 'SEMD',
  APP_DESCRIPTION: 'Suspiciour evaluate URL malicious detection ',
  APP_VERSION: '1.0.0',
  
  TOKEN_KEY: 'semd_auth_token',
  REFRESH_TOKEN_KEY: 'semd_refresh_token',
  USER_KEY: 'semd_user',
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
  
  CACHE: {
    PREDICTION_TTL: 3600,
    USER_TTL: 1800,
  },
} as const;

export const ROLE = {
  GUEST: 'GUEST',
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];
