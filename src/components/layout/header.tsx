'use client';

import React from 'react';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="h-16 bg-light border-b border-gray-primary-1 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-primary-0 hover:text-dark"
          >
            <Menu size={24} />
          </button>
        )}
        {title && <h2 className="text-xl font-bold text-dark">{title}</h2>}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-primary-0 hover:text-dark hover:bg-gray-primary-2 rounded-lg transition-all">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
