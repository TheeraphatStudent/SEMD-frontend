'use client';

import React from 'react';
import { Menu, User2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/routes';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const routeTitles: Record<string, string> = {
  [ROUTES.DASHBOARD.HOME]: 'แดชบอร์ด',
  [ROUTES.DASHBOARD.SCAN]: 'ตรวจสอบ URL',
  [ROUTES.DASHBOARD.REPORT]: 'รายงาน URL',
  [ROUTES.DASHBOARD.FLAGS]: 'URL Flags ของฉัน',
  [ROUTES.DASHBOARD.API_ACCESS]: 'API Access',
  [ROUTES.DASHBOARD.PROFILE]: 'ข้อมูลส่วนตัว',
  [ROUTES.ADMIN.USERS]: 'จัดการผู้ใช้',
  [ROUTES.ADMIN.FLAGS]: 'จัดการ URL Flags',
  [ROUTES.ADMIN.API_MANAGEMENT]: 'จัดการ API',
};

const routeDescriptions: Record<string, string> = {
  [ROUTES.DASHBOARD.HOME]: 'ดูภาพรวมการตรวจสอบล่าสุดและงานที่ควรทำต่อ',
  [ROUTES.DASHBOARD.SCAN]: 'กรอก URL แล้วรับผลพร้อมคำแนะนำที่เข้าใจง่าย',
  [ROUTES.DASHBOARD.REPORT]: 'ส่งรายงาน URL และติดตามสถานะการตรวจสอบของทีม',
  [ROUTES.DASHBOARD.FLAGS]: 'บันทึกเครื่องหมาย URL ส่วนตัวโดยไม่เปลี่ยนผลประเมินของระบบ',
  [ROUTES.DASHBOARD.API_ACCESS]: 'จัดการ API Keys และดูตัวอย่างการเชื่อมต่ออย่างปลอดภัย',
  [ROUTES.DASHBOARD.PROFILE]: 'แก้ไขข้อมูลส่วนตัวและตรวจสอบการตั้งค่าความปลอดภัย',
  [ROUTES.ADMIN.USERS]: 'ค้นหาและจัดการบัญชีผู้ใช้ตามสิทธิ์ของผู้ดูแล',
  [ROUTES.ADMIN.FLAGS]: 'ติดตาม URL Flags ทั้งระบบและจัดการรายการที่ต้องตรวจสอบ',
  [ROUTES.ADMIN.API_MANAGEMENT]: 'ดูการใช้งาน API Keys ทั้งระบบและจัดการสถานะการเข้าถึง',
};

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const resolvedTitle = title || routeTitles[pathname] || 'SEMD';
  const description = routeDescriptions[pathname];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-primary-1 bg-light/95 backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="เปิดเมนูนำทาง"
            className="lg:hidden rounded-lg p-2 text-gray-primary-0 hover:bg-gray-primary-2 hover:text-dark"
          >
            <Menu size={24} />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-dark">{resolvedTitle}</h2>
          <p className="text-xs text-gray-primary-0">{description || (user ? `เข้าสู่ระบบในชื่อ ${user.email}` : 'SEMD security workspace')}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.DASHBOARD.PROFILE}
          aria-label="เปิดหน้าโปรไฟล์"
          className="relative rounded-lg p-2 text-gray-primary-0 hover:text-dark hover:bg-gray-primary-2 transition-all"
        >
          <User2 size={20} />
        </Link>
      </div>
      </div>
    </header>
  );
};
