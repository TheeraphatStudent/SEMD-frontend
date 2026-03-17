'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/libs/utils/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface AccountInfoCardProps {
  username: string;
  email: string;
  className?: string;
}

const IconBox: React.FC<{ children: string; className?: string }> = ({ children, className }) => (
  <span className={cn(
    'inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-light text-[10px] font-black text-primary-dark select-none',
    className
  )}>
    {children}
  </span>
);

export const AccountInfoCard: React.FC<AccountInfoCardProps> = ({
  username,
  email,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card variant="elevated" animated={false} className={cn('p-5', className)}>
      <CardHeader className="mb-4">
        <CardTitle className="text-base">ข้อมูลบัญชี</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-primary-dark uppercase tracking-wider mb-1.5">
              ชื่อผู้ใช้งาน
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                disabled
                className="w-full px-3 py-2.5 pl-10 rounded-xl border border-gray-primary bg-gray-primary-light font-mono text-sm text-dark opacity-75 cursor-not-allowed"
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <IconBox className="w-5 h-5 text-[8px]">USR</IconBox>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-primary-dark uppercase tracking-wider mb-1.5">
              อีเมลล์
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2.5 pl-10 rounded-xl border border-gray-primary bg-gray-primary-light font-mono text-sm text-dark opacity-75 cursor-not-allowed"
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <IconBox className="w-5 h-5 text-[8px]">MAIL</IconBox>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-primary-light text-[10px] font-semibold text-gray-primary-dark">
            <IconBox className="w-4 h-4 text-[7px]">KEY</IconBox>
            ชื่อผู้ใช้ไม่สามารถแก้ไขได้
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light-green text-[10px] font-semibold text-safe">
            <IconBox className="w-4 h-4 text-[7px] bg-safe text-white">OK</IconBox>
            อีเมลล์ยืนยันแล้ว
          </span>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default AccountInfoCard;
