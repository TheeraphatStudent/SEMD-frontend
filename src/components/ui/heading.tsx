import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'display' | 'title' | 'subtitle' | 'section';
  align?: 'left' | 'center' | 'right';
  animated?: boolean;
  delay?: number;
}

const variantClasses = {
  display: 'text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight',
  title: 'text-3xl md:text-4xl font-extrabold leading-tight',
  subtitle: 'text-2xl md:text-3xl font-bold leading-snug',
  section: 'text-xl md:text-2xl font-bold leading-snug',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = 'h2', variant = 'title', align = 'left', animated = false, delay = 0, children, ...props }, ref) => {
    const baseClassName = cn(
      'text-dark',
      variantClasses[variant],
      alignClasses[align],
      className
    );

    if (!animated) {
      return (
        <Component ref={ref} className={baseClassName} {...props}>
          {children}
        </Component>
      );
    }

    const MotionComponent = motion[Component] as any;

    return (
      <MotionComponent
        ref={ref}
        className={baseClassName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

Heading.displayName = 'Heading';
