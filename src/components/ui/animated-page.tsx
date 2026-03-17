import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/libs/utils/motion-variants';

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
      transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};
