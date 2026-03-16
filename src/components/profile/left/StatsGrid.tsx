'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UserStats } from '@/lib/profileMock';

interface StatsGridProps {
  stats: UserStats;
  className?: string;
}

interface StatCell {
  n: string;
  label: string;
  nClass: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, className }) => {
  const cells: StatCell[] = [
    { n: stats.total.toString(), label: 'URL ตรวจแล้ว', nClass: 'text-dark' },
    { n: stats.dangers.toString(), label: 'พบอันตราย', nClass: 'text-danger' },
    { n: `${stats.accuracy}%`, label: 'ความแม่นยำ', nClass: 'text-safe' },
    { n: stats.days.toString(), label: 'วันที่ใช้งาน', nClass: 'text-dark' },
  ];

  const getBorderClass = (index: number): string => {
    switch (index) {
      case 0: return 'border-r border-b border-gray-primary';
      case 1: return 'border-b border-gray-primary';
      case 2: return 'border-r border-gray-primary';
      default: return '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn('bg-white rounded-2xl border border-gray-primary overflow-hidden', className)}
    >
      <div className="grid grid-cols-2">
        {cells.map((cell, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 206, 105, 0.1)' }}
            className={cn('p-4 text-center transition-colors', getBorderClass(index))}
          >
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
              className={cn('text-2xl font-extrabold', cell.nClass)}
            >
              {cell.n}
            </motion.p>
            <p className="text-[11px] text-gray-primary-dark mt-0.5">{cell.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatsGrid;
