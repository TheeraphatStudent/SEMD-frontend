'use client';

import React, { useState } from 'react';
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
    <div className={cn('bg-white rounded-2xl border border-gray-primary p-4', className)}>
      <h3 className="text-xs font-bold text-gray-primary-dark uppercase tracking-wider mb-3">
        บัญชีที่เชื่อมต่อ
      </h3>
      
      <div className="space-y-2">
        {services.map((service) => {
          const isConnected = connections[service.key];
          
          return (
            <div
              key={service.key}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <IconBox className={service.iconClass}>{service.icon}</IconBox>
                <span className="text-sm font-medium text-dark">{service.name}</span>
              </div>
              
              <button
                onClick={() => toggleConnection(service.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors',
                  isConnected
                    ? 'bg-accent-light-green text-safe border-safe'
                    : 'bg-white text-gray-primary-dark border-gray-primary hover:bg-gray-primary-light'
                )}
              >
                {isConnected && <IconBox className="w-4 h-4 text-[8px] bg-safe text-white rounded">OK</IconBox>}
                {isConnected ? 'เชื่อมแล้ว' : '+ เชื่อมต่อ'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectedAccounts;
