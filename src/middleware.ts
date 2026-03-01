import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_CONFIG } from './constants/config';
import { getRouteConfig, shouldIgnoreRoute } from './config/route-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (shouldIgnoreRoute(pathname)) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get(APP_CONFIG.TOKEN_KEY)?.value;
  const userStr = request.cookies.get(APP_CONFIG.USER_KEY)?.value;
  
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }
  
  const isAuthenticated = !!token;
  const routeConfig = getRouteConfig(pathname);
  
  if (!routeConfig) {
    return NextResponse.next();
  }
  
  if (routeConfig.redirectIfAuthenticated && isAuthenticated) {
    const redirectUrl = routeConfig.redirectTo || '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  if (routeConfig.requiresAuth && !isAuthenticated) {
    const loginUrl = new URL(routeConfig.redirectTo || '/login', request.url);
    if (routeConfig.redirectTo === '/login') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
  
  if (routeConfig.allowedRoles && routeConfig.allowedRoles.length > 0) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (!user?.role || !routeConfig.allowedRoles.includes(user.role)) {
      const redirectUrl = routeConfig.redirectTo || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
