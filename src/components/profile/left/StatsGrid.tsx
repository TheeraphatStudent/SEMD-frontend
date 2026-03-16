'use client';

import React from 'react';
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
    <div className={cn('bg-white rounded-2xl border border-gray-primary overflow-hidden', className)}>
      <div className="grid grid-cols-2">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={cn('p-4 text-center', getBorderClass(index))}
          >
            <p className={cn('text-2xl font-extrabold', cell.nClass)}>{cell.n}</p>
            <p className="text-[11px] text-gray-primary-dark mt-0.5">{cell.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
