import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/libs/utils/utils';
import { tapScale, springTransition } from '@/libs/utils/motion-variants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  animated?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, animated = true, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-accent text-dark hover:shadow-lg hover:shadow-primary/30',
      secondary: 'bg-gray-primary-1 text-dark hover:bg-gray-primary-2',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-dark',
      ghost: 'text-primary hover:bg-primary/10',
      danger: 'bg-danger text-light hover:bg-danger/90',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    
    const Component: any = animated ? motion.button : 'button';
    const motionProps = animated ? {
      whileHover: { scale: 1.02, y: -2 },
      whileTap: tapScale,
      transition: springTransition,
    } : {};
    
    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...motionProps}
        {...props}
      >
        {isLoading ? (
          <motion.span 
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
