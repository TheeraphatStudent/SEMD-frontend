import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/libs/utils/utils';
import { scaleIn } from '@/libs/utils/motion-variants';
import { BadgeVariant } from '@/types/badge.types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  animated?: boolean;
  pulse?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'benign', children, animated = true, pulse = false, ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      benign: 'bg-gray-primary-1 text-dark',
      malicious: 'bg-danger/20 text-danger',
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
