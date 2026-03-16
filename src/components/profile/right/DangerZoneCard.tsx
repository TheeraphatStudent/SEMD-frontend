'use client';

import React from 'react';
import { cn } from '@/lib/utils';
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
    <div className={cn('border-2 border-accent-light-red rounded-2xl p-5', className)}>
      <div className="flex items-center gap-2 mb-4">
        <IconBox className="bg-accent-light-red text-danger">!</IconBox>
        <span className="text-danger font-extrabold text-xs tracking-wide uppercase">
          Danger Zone
        </span>
      </div>
      
      <div className="space-y-0">
        {actions.map((action, index) => (
          <div
            key={index}
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
            
            <button
              onClick={action.onClick}
              className="px-3 py-1.5 rounded-lg bg-accent-light-red text-danger text-[11px] font-semibold hover:bg-danger hover:text-white transition-colors shrink-0"
            >
              {action.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DangerZoneCard;
