import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const variantClasses = {
  default: 'bg-primary',
  success: 'bg-safe',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant = 'default', size = 'md', showLabel = false, animated = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const autoVariant = variant === 'default' 
      ? percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'danger'
      : variant;

    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
        <div className={cn('flex-1 bg-gray-primary-1 rounded-full overflow-hidden', sizeClasses[size])}>
          {animated ? (
            <motion.div
              className={cn('h-full rounded-full', variantClasses[autoVariant])}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ) : (
            <div
              className={cn('h-full rounded-full', variantClasses[autoVariant])}
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        {showLabel && (
          <span className="text-xs font-semibold text-dark whitespace-nowrap">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
