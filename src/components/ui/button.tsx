import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { tapScale, springTransition } from '@/libs/utils/motion-variants';
import { cn } from '@/libs/utils/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  animated?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, animated = true, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-accent-orange text-dark shadow-sm hover:shadow-lg hover:shadow-primary/20',
      secondary: 'bg-gray-primary-1 text-dark hover:bg-gray-primary-2',
      outline: 'border-2 border-primary text-primary-dark hover:bg-primary/15',
      ghost: 'text-primary-dark hover:bg-primary/10',
      danger: 'bg-danger text-light hover:bg-danger/90 hover:shadow-lg hover:shadow-danger/15',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const shouldAnimate = animated && !prefersReducedMotion;
    const Component: any = shouldAnimate ? motion.button : 'button';
    const motionProps = shouldAnimate ? {
      whileHover: { scale: 1.01, y: -1 },
      whileTap: tapScale,
      transition: springTransition,
    } : {};

    return (
      <Component
        ref={ref}
        className={cn(
          'min-h-[44px] rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...motionProps}
        {...props}
      >
        {isLoading ? (
          <motion.span
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={prefersReducedMotion ? undefined : { duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
