'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import { Icon, Shield } from '@/components/ui';

export const LandingNavbar: React.FC = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-gray-primary-1 px-6 md:px-12 h-[60px] flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-2 text-[22px] font-extrabold text-dark">
        {/* <Icon icon={Shield} variant="primary" size={28} /> */}
        <span className="text-primary-dark">SEMD</span>
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        <li>
          <a href="#how" className="text-gray-primary-0 text-sm font-medium hover:text-dark transition-colors">
            วิธีทำงาน
          </a>
        </li>
        <li>
          <a href="#features" className="text-gray-primary-0 text-sm font-medium hover:text-dark transition-colors">
            ฟีเจอร์
          </a>
        </li>
        <li>
          <a href="#usecases" className="text-gray-primary-0 text-sm font-medium hover:text-dark transition-colors">
            ใครใช้ได้
          </a>
        </li>
      </ul>

      <Link href={ROUTES.AUTH.LOGIN}>
        <Button variant="primary" size="sm">
          ลองใช้ฟรี →
        </Button>
      </Link>
    </motion.nav>
  );
};
