'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { ArrowRightIcon, ShieldCheckIcon } from '@/components/icons/lucide-animated';
import { Button } from '@/components/ui';

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '#how', label: 'วิธีทำงาน' },
  { href: '#features', label: 'ฟีเจอร์' },
  { href: '#demo', label: 'ดูตัวอย่าง' },
  { href: '#usecases', label: 'ใครใช้ได้' },
];

const NavItem: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-primary-0 text-sm font-medium hover:text-dark transition-colors"
    >
      {children}
    </a>
  </li>
);

export const LandingNavbar: React.FC = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 flex h-[68px] items-center justify-between border-b border-gray-primary-1 bg-background/88 px-6 backdrop-blur-md md:px-12"
    >
      <Link href="/" className="flex items-center gap-3 text-[22px] font-extrabold text-dark">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-dark text-white shadow-sm">
          <ShieldCheckIcon size={18} />
        </span>
        <span className="text-primary-dark">SEMD</span>
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        {NAV_LINKS.map((link) => (
          <NavItem key={link.href} href={link.href}>
            {link.label}
          </NavItem>
        ))}
      </ul>

      <Link href={ROUTES.AUTH.LOGIN}>
        <Button variant="primary" size="sm">
          ลองใช้ฟรี
          <ArrowRightIcon size={16} />
        </Button>
      </Link>
    </motion.nav>
  );
};
