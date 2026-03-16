'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UserConnections } from '@/lib/profileMock';

interface ConnectedAccountsProps {
  initialConnections: UserConnections;
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

interface ServiceConfig {
  key: keyof UserConnections;
  name: string;
  icon: string;
  iconClass: string;
}

const services: ServiceConfig[] = [
  { key: 'google', name: 'Google', icon: 'G', iconClass: 'bg-red-50 text-red-500' },
  { key: 'github', name: 'GitHub', icon: 'GH', iconClass: 'bg-gray-primary-light text-dark' },
];

export const ConnectedAccounts: React.FC<ConnectedAccountsProps> = ({
  initialConnections,
  className,
}) => {
  const [connections, setConnections] = useState<UserConnections>(initialConnections);

  const toggleConnection = (key: keyof UserConnections) => {
    setConnections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn('bg-white rounded-2xl border border-gray-primary p-4', className)}
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs font-bold text-gray-primary-dark uppercase tracking-wider mb-3"
      >
        บัญชีที่เชื่อมต่อ
      </motion.h3>
      
      <div className="space-y-2">
        {services.map((service, index) => {
          const isConnected = connections[service.key];
          
          return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <IconBox className={service.iconClass}>{service.icon}</IconBox>
                </motion.div>
                <span className="text-sm font-medium text-dark">{service.name}</span>
              </div>
              
              <motion.button
                onClick={() => toggleConnection(service.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors',
                  isConnected
                    ? 'bg-accent-light-green text-safe border-safe'
                    : 'bg-white text-gray-primary-dark border-gray-primary hover:bg-gray-primary-light'
                )}
              >
                <AnimatePresence mode="wait">
                  {isConnected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconBox className="w-4 h-4 text-[8px] bg-safe text-white rounded">OK</IconBox>
                    </motion.div>
                  )}
                </AnimatePresence>
                {isConnected ? 'เชื่อมแล้ว' : '+ เชื่อมต่อ'}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ConnectedAccounts;
