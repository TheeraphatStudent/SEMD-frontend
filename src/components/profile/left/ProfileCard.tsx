'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  username: string;
  email: string;
  role: string;
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

export const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  email,
  role,
  className,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('bg-white rounded-2xl border border-gray-primary overflow-hidden shadow-xl', className)}
    >
      <div className="relative bg-gradient-to-br from-primary-light via-primary/30 to-primary p-5 pb-6">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #9C7626 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
        
        <div className="relative flex flex-col items-center">
          <div 
            className="w-20 h-20 rounded-full p-[3px] animate-spin"
            style={{
              background: 'conic-gradient(from 0deg, #FFCE69 0deg, #9C7626 180deg, #FFCE69 360deg)',
              animationDuration: '6000ms',
            }}
          >
            <div className="w-full h-full rounded-full bg-gray-primary-light flex items-center justify-center relative">
              <span className="text-4xl font-black text-primary-dark select-none">
                {username[0]?.toUpperCase() || 'U'}
              </span>
              <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-safe rounded-full border-2 border-white" />
            </div>
          </div>
          
          <p className="mt-3 font-extrabold text-base text-dark">{username}</p>
          <p className="font-mono text-[11px] text-gray-primary-dark">{email}</p>
          
          <span className="mt-2 inline-flex gap-1 items-center bg-primary-light text-primary-dark border border-primary rounded-full text-[10.5px] font-bold px-3 py-0.5">
            <IconBox className="w-5 h-5 text-[8px]">ROLE</IconBox>
            {role}
          </span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-3.5 flex flex-col gap-2"
      >
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-dark text-primary rounded-xl py-2.5 px-4 font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <IconBox className="bg-primary text-dark">EDIT</IconBox>
          แก้ไขรูปโปรไฟล์
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-white text-danger border-[1.5px] border-accent-light-red rounded-xl py-2.5 px-4 font-semibold text-sm hover:bg-accent-light-red transition-colors"
        >
          <IconBox className="bg-accent-light-red text-danger">KEY</IconBox>
          เปลี่ยนรหัสผ่าน
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;
