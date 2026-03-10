import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div' | 'label';
  variant?: 'body' | 'lead' | 'small' | 'muted' | 'caption';
  align?: 'left' | 'center' | 'right';
  animated?: boolean;
  delay?: number;
}

const variantClasses = {
  body: 'text-base text-gray-primary-0 leading-relaxed',
  lead: 'text-lg text-gray-primary-0 leading-relaxed',
  small: 'text-sm text-gray-primary-0 leading-normal',
  muted: 'text-sm text-gray-primary-0/70 leading-normal',
  caption: 'text-xs text-gray-primary-0 leading-tight',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Component = 'p', variant = 'body', align = 'left', animated = false, delay = 0, children, ...props }, ref) => {
    const baseClassName = cn(
      variantClasses[variant],
      alignClasses[align],
      className
    );

    if (!animated) {
      const Element = Component as any;
      return (
        <Element className={baseClassName} {...props}>
          {children}
        </Element>
      );
    }

    const MotionComponent = motion[Component] as any;

    return (
      <MotionComponent
        className={baseClassName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </MotionComponent>
    );
  }
);

Text.displayName = 'Text';
