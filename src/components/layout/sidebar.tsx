'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { ROLE } from '@/constants/config';
import {
  Home,
  Search,
  Flag,
  FileText,
  Key,
  Code,
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
  { label: 'หน้าแรก', href: ROUTES.DASHBOARD.HOME, icon: <Home size={20} /> },
  { label: 'ตรวจสอบ URL', href: ROUTES.DASHBOARD.SCAN, icon: <Search size={20} /> },
  { label: 'รายงาน URL', href: ROUTES.DASHBOARD.REPORT, icon: <FileText size={20} /> },
  { label: 'จัดการ Flag', href: ROUTES.DASHBOARD.FLAGS, icon: <Flag size={20} /> },
  { label: 'API Access', href: ROUTES.DASHBOARD.API_ACCESS, icon: <Key size={20} /> },
  { label: 'API Code', href: ROUTES.DASHBOARD.API_CODE, icon: <Code size={20} /> },
  { label: 'โปรไฟล์', href: ROUTES.DASHBOARD.PROFILE, icon: <User size={20} /> },
];

const adminNavItems: NavItem[] = [
  { label: 'จัดการผู้ใช้', href: ROUTES.ADMIN.USERS, icon: <Users size={20} />, roles: [ROLE.ADMIN, ROLE.MASTER_ADMIN] },
  { label: 'จัดการ Flags', href: ROUTES.ADMIN.FLAGS, icon: <Shield size={20} />, roles: [ROLE.ADMIN, ROLE.MASTER_ADMIN] },
  { label: 'จัดการ API', href: ROUTES.ADMIN.API_MANAGEMENT, icon: <Key size={20} />, roles: [ROLE.ADMIN, ROLE.MASTER_ADMIN] },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const canAccessAdminPanel = user?.role === ROLE.ADMIN || user?.role === ROLE.MASTER_ADMIN;
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <aside className="w-64 h-screen bg-light border-r border-gray-primary-1 flex flex-col">
      <div className="p-6 border-b border-gray-primary-1">
        <h1 className="text-2xl font-bold text-primary">SEMD</h1>
        <p className="text-xs text-gray-primary-0 mt-1">Security Email & Malicious URL Detection</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-gray-primary-0 uppercase">เมนูหลัก</p>
          {userNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                pathname === item.href
                  ? 'bg-primary text-dark font-medium shadow-sm'
                  : 'text-gray-primary-0 hover:bg-gray-primary-2 hover:text-dark'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        {canAccessAdminPanel && (
          <div className="mt-6 space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-gray-primary-0 uppercase">ผู้ดูแลระบบ</p>
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                  pathname === item.href
                    ? 'bg-secondary text-white font-medium shadow-sm'
                    : 'text-gray-primary-0 hover:bg-gray-primary-2 hover:text-dark'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-primary-1">
        {user && (
          <div className="mb-3 p-3 bg-gray-primary-2 rounded-lg">
            <p className="text-sm font-medium text-dark">{user.username}</p>
            <p className="text-xs text-gray-primary-0">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-accent-red hover:bg-accent-light-red rounded-lg transition-all duration-200"
        >
          <LogOut size={20} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
};
