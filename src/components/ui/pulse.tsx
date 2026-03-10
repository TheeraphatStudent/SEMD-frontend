import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PulseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  speed?: 'slow' | 'normal' | 'fast';
}

const sizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

const variantClasses = {
  default: 'bg-primary',
  success: 'bg-safe',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

const speedDurations = {
  slow: 2,
  normal: 1.4,
  fast: 1,
};

export const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ className, size = 'sm', variant = 'success', speed = 'normal', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-full',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: speedDurations[speed],
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }
);

Pulse.displayName = 'Pulse';
