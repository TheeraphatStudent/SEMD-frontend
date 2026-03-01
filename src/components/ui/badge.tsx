import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { scaleIn, smoothTransition } from '@/lib/motion-variants';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
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
    };
    
    const Component = animated ? motion.span : 'span';
    const motionProps = animated ? {
      initial: scaleIn.initial,
      animate: pulse ? { scale: [1, 1.05, 1] } : scaleIn.animate,
      transition: pulse ? { duration: 2, repeat: Infinity } : smoothTransition,
    } : {};
    
    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
          variants[variant],
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Badge.displayName = 'Badge';
