'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/libs/utils/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ActivityRow, ProfileVerdict } from '@/libs/utils/profileMock';

interface RecentActivityCardProps {
  activities: ActivityRow[];
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

const verdictStyles: Record<ProfileVerdict, { dot: string; badge: string }> = {
  Safe: {
    dot: 'bg-safe',
    badge: 'bg-accent-light-green text-safe',
  },
  Danger: {
    dot: 'bg-danger',
    badge: 'bg-accent-light-red text-danger',
  },
  Warning: {
    dot: 'bg-warning',
    badge: 'bg-accent-light-orange text-primary-dark',
  },
};

const verdictLabels: Record<ProfileVerdict, string> = {
  Safe: 'ปลอดภัย',
  Danger: 'อันตราย',
  Warning: 'น่าสงสัย',
};

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card variant="elevated" animated={false} className={cn('p-5', className)}>
      <CardHeader className="mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
          >
            <IconBox>ACT</IconBox>
          </motion.div>
          <CardTitle className="text-base">กิจกรรมล่าสุด</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-0">
          {activities.map((activity, index) => {
            const styles = verdictStyles[activity.verdict];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(255, 206, 105, 0.05)', x: 4 }}
                className={cn(
                  'flex items-center gap-3 py-2.5 transition-colors',
                  index < activities.length - 1 && 'border-b border-gray-primary'
                )}
              >
                <motion.div 
                  className={cn('w-2 h-2 rounded-full shrink-0', styles.dot)}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
                
                <span className="font-mono text-[11px] text-secondary-dark truncate flex-1">
                  {activity.url}
                </span>
                
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                    styles.badge
                  )}
                >
                  {verdictLabels[activity.verdict]}
                </motion.span>
                
                <span className="text-[10.5px] text-gray-primary-dark whitespace-nowrap shrink-0">
                  {activity.time}
                </span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default RecentActivityCard;
