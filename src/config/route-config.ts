import { ROUTES } from '@/constants/routes';
import { ROLE } from '@/constants/config';

export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  allowedRoles?: string[];
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export const routeConfigs: RouteConfig[] = [
  {
    path: '/',
    requiresAuth: false,
  },
  {
    path: ROUTES.AUTH.LOGIN,
    requiresAuth: false,
    redirectIfAuthenticated: true,
    redirectTo: ROUTES.DASHBOARD.HOME,
  },
  {
    path: ROUTES.AUTH.REGISTER,
    requiresAuth: false,
    redirectIfAuthenticated: true,
    redirectTo: ROUTES.DASHBOARD.HOME,
  },
  {
    path: '/two-factor',
    requiresAuth: false,
    redirectIfAuthenticated: true,
    redirectTo: ROUTES.DASHBOARD.HOME,
  },
  {
    path: '/two-factor-setup',
    requiresAuth: false,
    redirectIfAuthenticated: true,
    redirectTo: ROUTES.DASHBOARD.HOME,
  },
  {
    path: ROUTES.DASHBOARD.HOME,
    requiresAuth: true,
    redirectTo: ROUTES.AUTH.LOGIN,
  },
  {
    path: ROUTES.DASHBOARD.SCAN,
    requiresAuth: true,
    redirectTo: ROUTES.AUTH.LOGIN,
  },
  {
    path: ROUTES.DASHBOARD.REPORT,
    requiresAuth: true,
    redirectTo: ROUTES.AUTH.LOGIN,
  },
  {
    path: ROUTES.DASHBOARD.FLAGS,
    requiresAuth: true,
    redirectTo: ROUTES.AUTH.LOGIN,
  },
  {
    path: ROUTES.DASHBOARD.API_ACCESS,
    requiresAuth: true,
    redirectTo: ROUTES.AUTH.LOGIN,
  },
  {
    path: ROUTES.DASHBOARD.API_CODE,
    requiresAuth: true,
    redirectTo: ROUTES.AUTH.LOGIN,
  },
  {
    path: ROUTES.DASHBOARD.PROFILE,
    requiresAuth: true,
    redirectTo: ROUTES.AUTH.LOGIN,
  },
  {
    path: ROUTES.ADMIN.USERS,
    requiresAuth: true,
    allowedRoles: [ROLE.ADMIN, ROLE.MASTER_ADMIN],
    redirectTo: ROUTES.DASHBOARD.HOME,
  },
  {
    path: ROUTES.ADMIN.FLAGS,
    requiresAuth: true,
    allowedRoles: [ROLE.ADMIN, ROLE.MASTER_ADMIN],
    redirectTo: ROUTES.DASHBOARD.HOME,
  },
  {
    path: ROUTES.ADMIN.API_MANAGEMENT,
    requiresAuth: true,
    allowedRoles: [ROLE.ADMIN, ROLE.MASTER_ADMIN],
    redirectTo: ROUTES.DASHBOARD.HOME,
  },
];

export const ignoredRoutes: string[] = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/public',
];

export function getRouteConfig(pathname: string): RouteConfig | undefined {
  return routeConfigs.find(config => {
    if (config.path.includes('[')) {
      const pattern = config.path.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return pathname.startsWith(config.path);
  });
}

export function shouldIgnoreRoute(pathname: string): boolean {
  return true;
  return ignoredRoutes.some(route => pathname.startsWith(route));
}
