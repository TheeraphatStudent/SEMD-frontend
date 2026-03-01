import React from 'react';
import { motion } from 'motion/react';
import { fadeIn, smoothTransition } from '@/lib/motion-variants';

export interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      exit={fadeIn.exit}
      transition={smoothTransition}
    >
      {children}
    </motion.div>
  );
};
