'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/libs/utils/utils';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { ROLE } from '@/constants/config';
import {
  X,
  Home,
  Search,
  Flag,
  FileText,
  Key,
  User,
  Users,
  Shield,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const userNavItems: NavItem[] = [
  { label: 'แดชบอร์ด', href: ROUTES.DASHBOARD.HOME, icon: <Home size={20} /> },
  { label: 'ตรวจสอบ URL', href: ROUTES.DASHBOARD.SCAN, icon: <Search size={20} /> },
  { label: 'รายงาน URL', href: ROUTES.DASHBOARD.REPORT, icon: <FileText size={20} /> },
  { label: 'URL Flags ของฉัน', href: ROUTES.DASHBOARD.FLAGS, icon: <Flag size={20} /> },
  { label: 'API Access', href: ROUTES.DASHBOARD.API_ACCESS, icon: <Key size={20} /> },
  { label: 'โปรไฟล์', href: ROUTES.DASHBOARD.PROFILE, icon: <User size={20} /> },
];

const adminNavItems: NavItem[] = [
  { label: 'จัดการผู้ใช้', href: ROUTES.ADMIN.USERS, icon: <Users size={20} />, roles: [ROLE.ADMIN, ROLE.MASTER_ADMIN] },
  { label: 'จัดการ Flags', href: ROUTES.ADMIN.FLAGS, icon: <Shield size={20} />, roles: [ROLE.ADMIN, ROLE.MASTER_ADMIN] },
  { label: 'จัดการ API', href: ROUTES.ADMIN.API_MANAGEMENT, icon: <Key size={20} />, roles: [ROLE.ADMIN, ROLE.MASTER_ADMIN] },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const roleLabels: Record<string, string> = {
  [ROLE.USER]: 'User',
  [ROLE.ADMIN]: 'Admin',
  [ROLE.MASTER_ADMIN]: 'Master Admin',
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const canAccessAdminPanel = user?.role === ROLE.ADMIN || user?.role === ROLE.MASTER_ADMIN;

  const handleLogout = async () => {
    await logout();
    onClose?.();
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-dark/40 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-gray-primary-1 bg-light transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="แถบนำทางหลัก"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-primary-1 p-6">
          <h1 className="text-2xl font-bold text-primary">SEMD</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดเมนูนำทาง"
            className="rounded-lg p-2 text-gray-primary-0 hover:bg-gray-primary-2 hover:text-dark lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 pt-3 text-xs text-gray-primary-0">
          ตรวจสอบ URL ที่น่าสงสัย พร้อมคำอธิบายและคำแนะนำที่เข้าใจง่าย
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-primary-0">เมนูหลัก</p>
            {userNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200',
                  pathname === item.href
                    ? 'bg-primary font-medium text-dark shadow-sm'
                    : 'text-gray-primary-0 hover:bg-gray-primary-2 hover:text-dark'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {canAccessAdminPanel && (
            <div className="mt-6 space-y-1">
              <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-primary-0">ผู้ดูแลระบบ</p>
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200',
                    pathname === item.href
                      ? 'bg-secondary font-medium text-white shadow-sm'
                      : 'text-gray-primary-0 hover:bg-gray-primary-2 hover:text-dark'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-gray-primary-1 p-4">
          {user && (
            <div className="mb-3 rounded-lg bg-gray-primary-2 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-dark">{user.username}</p>
                <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary-dark">
                  {roleLabels[user.role] || user.role}
                </span>
              </div>
              <p className="text-xs text-gray-primary-0">{user.email}</p>
            </div>
          )}
          <div className="mb-3 rounded-xl border border-dashed border-gray-primary-1 bg-light px-3 py-3 text-xs text-gray-primary-0">
            หากออกจากระบบ คุณยังกลับมาเข้าสู่ระบบใหม่เพื่อดูประวัติการตรวจสอบและรายงานได้เสมอ
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-accent-red transition-all duration-200 hover:bg-accent-light-red"
          >
            <LogOut size={20} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
};
