'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ActivityRow, ProfileVerdict } from '@/lib/profileMock';

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
    <Card variant="elevated" animated={false} className={cn('p-5', className)}>
      <CardHeader className="mb-4">
        <div className="flex items-center gap-2">
          <IconBox>ACT</IconBox>
          <CardTitle className="text-base">กิจกรรมล่าสุด</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-0">
          {activities.map((activity, index) => {
            const styles = verdictStyles[activity.verdict];
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 py-2.5',
                  index < activities.length - 1 && 'border-b border-gray-primary'
                )}
              >
                <div className={cn('w-2 h-2 rounded-full shrink-0', styles.dot)} />
                
                <span className="font-mono text-[11px] text-secondary-dark truncate flex-1">
                  {activity.url}
                </span>
                
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                  styles.badge
                )}>
                  {verdictLabels[activity.verdict]}
                </span>
                
                <span className="text-[10.5px] text-gray-primary-dark whitespace-nowrap shrink-0">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
