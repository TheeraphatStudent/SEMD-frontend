import React from 'react';
import { cn } from '@/libs/utils/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-4 py-8',
  md: 'px-6 md:px-12 py-12 md:py-16',
  lg: 'px-6 md:px-12 py-16 md:py-20',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Component = 'div', size = 'lg', padding = 'md', center = true, children, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          sizeClasses[size],
          paddingClasses[padding],
          center && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
