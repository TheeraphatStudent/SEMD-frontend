import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square';
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  fallback?: string;
  animated?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', variant = 'circle', children, src, alt, fallback, animated = false, ...props }, ref) => {
    const baseClassName = cn(
      'inline-flex items-center justify-center font-bold text-dark bg-primary overflow-hidden flex-shrink-0',
      variant === 'circle' ? 'rounded-full' : 'rounded-lg',
      sizeClasses[size],
      className
    );

    const content = src ? (
      <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
    ) : (
      <span>{children || fallback || '?'}</span>
    );

    if (!animated) {
      return (
        <div ref={ref} className={baseClassName} {...props}>
          {content}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={baseClassName}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {content}
      </motion.div>
    );
  }
);

Avatar.displayName = 'Avatar';
