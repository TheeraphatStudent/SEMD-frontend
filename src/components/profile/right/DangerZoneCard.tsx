'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/libs/utils/utils';
import { toast } from '@/hooks/use-toast';

interface DangerZoneCardProps {
  className?: string;
}

const IconBox: React.FC<{ children: string; className?: string }> = ({ children, className }) => (
  <span className={cn(
    'inline-flex items-center justify-center w-7 h-7 rounded-lg text-[10px] font-black select-none',
    className
  )}>
    {children}
  </span>
);

interface DangerAction {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export const DangerZoneCard: React.FC<DangerZoneCardProps> = ({ className }) => {
  const handleSignOutAll = () => {
    toast.success('ออกจากระบบทุกอุปกรณ์แล้ว');
  };

  const handleDeleteAccount = () => {
    // Future: open confirm modal
  };

  const actions: DangerAction[] = [
    {
      icon: 'OUT',
      title: 'ออกจากระบบทุกอุปกรณ์',
      description: 'ยกเลิก session ทั้งหมดที่เชื่อมต่ออยู่',
      buttonText: 'ออกจากระบบทั้งหมด',
      onClick: handleSignOutAll,
    },
    {
      icon: 'DEL',
      title: 'ลบบัญชี',
      description: 'ลบข้อมูลทั้งหมดอย่างถาวร ไม่สามารถกู้คืนได้',
      buttonText: 'ลบบัญชีถาวร',
      onClick: handleDeleteAccount,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={cn('border-2 border-accent-light-red rounded-2xl p-5', className)}
    >
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 mb-4"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.6, repeat: 3 }}
        >
          <IconBox className="bg-accent-light-red text-danger">!</IconBox>
        </motion.div>
        <span className="text-danger font-extrabold text-xs tracking-wide uppercase">
          Danger Zone
        </span>
      </motion.div>
      
      <div className="space-y-0">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            className={cn(
              'flex items-center justify-between py-3',
              index < actions.length - 1 && 'border-b border-gray-primary'
            )}
          >
            <div className="flex items-start gap-3">
              <IconBox className="bg-accent-light-red text-danger mt-0.5">{action.icon}</IconBox>
              <div>
                <p className="text-sm font-semibold text-dark">{action.title}</p>
                <p className="text-[11px] text-gray-primary-dark mt-0.5">{action.description}</p>
              </div>
            </div>
            
            <motion.button
              onClick={action.onClick}
              whileHover={{ scale: 1.05, backgroundColor: '#FF696C', color: '#FFFFFF' }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-lg bg-accent-light-red text-danger text-[11px] font-semibold transition-colors shrink-0"
            >
              {action.buttonText}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DangerZoneCard;
