import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scaleIn } from '@/lib/motion-variants';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'safe' | 'admin' | 'master-admin';
  children: React.ReactNode;
  animated?: boolean;
  pulse?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, animated = true, pulse = false, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-primary-1 text-dark',
      success: 'bg-success/20 text-success',
      warning: 'bg-warning/20 text-warning',
      danger: 'bg-danger/20 text-danger',
      info: 'bg-info/20 text-info',
      safe: 'bg-safe/20 text-safe',
      admin: 'bg-primary/20 text-primary-dark',
      'master-admin': 'bg-secondary/20 text-secondary-dark',
    };

    const baseClassName = cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      variants[variant],
      className
    );

    if (!animated) {
      return (
        <span ref={ref} className={baseClassName} {...props}>
          {children}
        </span>
      );
    }
    
    return (
      <motion.span
        ref={ref}
        className={baseClassName}
        initial={scaleIn.initial}
        animate={pulse ? { scale: [1, 1.05, 1] } : scaleIn.animate}
        transition={pulse ? { duration: 2, repeat: Infinity } : { type: 'tween', duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.span>
    );
  }
);

Badge.displayName = 'Badge';
