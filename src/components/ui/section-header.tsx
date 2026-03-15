'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Badge as BadgeComponent } from './badge';
import { Heading } from './heading';
import { Text } from './text';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  animated?: boolean;
}

export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, badge, title, description, align = 'center', animated = true, ...props }, ref) => {
    const internalRef = useRef(null);
    const isInView = useInView(internalRef, { once: true, margin: '-100px' });

    const alignClasses = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    };

    return (
      <div
        ref={ref || internalRef}
        className={cn('flex flex-col gap-3 mb-12', alignClasses[align], className)}
        {...props}
      >
        {badge && (
          <motion.div
            initial={animated ? { opacity: 0, y: 24 } : false}
            animate={animated && isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="info" className="inline-flex items-center gap-[6px] text-xs font-bold uppercase tracking-[0.1em] text-primary-dark bg-primary-light rounded-full px-3 py-[3px] border border-primary">
              {badge}
            </Badge>
          </motion.div>
        )}

        <Heading
          as="h2"
          variant="title"
          align={align}
          animated={animated && isInView}
          delay={0.1}
        >
          {title}
        </Heading>

        {description && (
          <Text
            variant="body"
            align={align}
            animated={animated && isInView}
            delay={0.2}
            className="max-w-[520px]"
          >
            {description}
          </Text>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
