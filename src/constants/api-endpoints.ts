export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    VERIFY_2FA: '/api/v1/auth/verify-2fa',
    ENABLE_2FA: '/api/v1/auth/enable-2fa',
  },
  
  PREDICT: {
    PREDICT: '/api/v1/predict/predict',
    GET_RESULT: (id: string) => `/api/v1/predict/predict/${id}`,
    HEALTH: '/api/v1/predict/health',
  },
  
  REPORT: {
    CREATE: '/api/v1/report',
    LIST: '/api/v1/report',
    GET: (id: string) => `/api/v1/report/${id}`,
    UPDATE: (id: string) => `/api/v1/report/${id}`,
    DELETE: (id: string) => `/api/v1/report/${id}`,
  },
  
  FLAG: {
    LIST: '/api/v1/flag',
    CREATE: '/api/v1/flag',
    GET: (id: string) => `/api/v1/flag/${id}`,
    UPDATE: (id: string) => `/api/v1/flag/${id}`,
    DELETE: (id: string) => `/api/v1/flag/${id}`,
  },
  
  USER: {
    PROFILE: '/api/v1/user/profile',
    UPDATE_PROFILE: '/api/v1/user/profile',
    LIST: '/api/v1/user',
    GET: (id: string) => `/api/v1/user/${id}`,
    UPDATE: (id: string) => `/api/v1/user/${id}`,
    DELETE: (id: string) => `/api/v1/user/${id}`,
  },
  
  API_ACCESS: {
    LIST: '/api/v1/api-access',
    CREATE: '/api/v1/api-access',
    GET: (id: string) => `/api/v1/api-access/${id}`,
    REVOKE: (id: string) => `/api/v1/api-access/${id}/revoke`,
    REGENERATE: (id: string) => `/api/v1/api-access/${id}/regenerate`,
  },
} as const;
