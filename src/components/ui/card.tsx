import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/motion-variants';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
  animated?: boolean;
  delay?: number;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, animated = true, delay = 0, ...props }, ref) => {
    const variants = {
      default: 'bg-light border border-gray-primary-1',
      elevated: 'bg-light shadow-xl',
      outlined: 'bg-transparent border-2 border-primary',
    };

    const baseClassName = cn(
      'rounded-lg p-6 transition-shadow duration-200',
      variants[variant],
      className
    );

    if (!animated) {
      return (
        <div ref={ref} className={baseClassName} {...props}>
          {children}
        </div>
      );
    }
    
    return (
      <motion.div
        ref={ref}
        className={baseClassName}
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        exit={fadeInUp.exit}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut', delay }}
        whileHover={{ 
          y: -4, 
          scale: 1.01,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          transition: { 
            type: 'spring', 
            stiffness: 400, 
            damping: 20,
          }
        }}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-bold text-dark', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-4 pt-4 border-t border-gray-primary-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
