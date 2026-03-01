export const ROUTES = {
  HOME: '/',
  
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  
  DASHBOARD: {
    HOME: '/dashboard',
    SCAN: '/scan',
    REPORT: '/report',
    FLAGS: '/flags',
    API_ACCESS: '/api-access',
    API_CODE: '/api-code',
    PROFILE: '/profile',
  },
  
  ADMIN: {
    USERS: '/admin/users',
    FLAGS: '/admin/flags',
    API_MANAGEMENT: '/admin/api-management',
  },
  
  PREDICT: {
    RESULT: (id: string) => `/predict/${id}`,
  },
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD.HOME,
  ROUTES.DASHBOARD.SCAN,
  ROUTES.DASHBOARD.REPORT,
  ROUTES.DASHBOARD.FLAGS,
  ROUTES.DASHBOARD.API_ACCESS,
  ROUTES.DASHBOARD.API_CODE,
  ROUTES.DASHBOARD.PROFILE,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.FLAGS,
  ROUTES.ADMIN.API_MANAGEMENT,
];
