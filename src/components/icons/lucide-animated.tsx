'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/libs/utils/utils';

interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AnimatedIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ActivityVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.6,
      ease: 'linear',
      opacity: { duration: 0.1 },
    },
  },
};

const BadgeAlertVariants: Variants = {
  normal: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.1, 1.1, 1.1, 1],
    rotate: [0, -3, 3, -2, 2, 0],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.4, 0.6, 1],
      ease: 'easeInOut',
    },
  },
};

const ShieldCheckVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
};

function useAnimatedIconHandlers(
  controls: ReturnType<typeof useAnimation>,
  onMouseEnter?: HTMLAttributes<HTMLDivElement>['onMouseEnter'],
  onMouseLeave?: HTMLAttributes<HTMLDivElement>['onMouseLeave'],
) {
  const isControlledRef = useRef(false);

  const bindHandle = useCallback(() => {
    isControlledRef.current = true;
    return {
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    };
  }, [controls]);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(event);
        return;
      }
      controls.start('animate');
    },
    [controls, onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(event);
        return;
      }
      controls.start('normal');
    },
    [controls, onMouseLeave],
  );

  return { bindHandle, handleMouseEnter, handleMouseLeave };
}

export const ActivityIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const { bindHandle, handleMouseEnter, handleMouseLeave } = useAnimatedIconHandlers(
      controls,
      onMouseEnter,
      onMouseLeave,
    );

    useImperativeHandle(ref, bindHandle);

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
            initial="normal"
            variants={ActivityVariants}
          />
        </svg>
      </div>
    );
  },
);

ActivityIcon.displayName = 'ActivityIcon';

export const ArrowRightIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const { bindHandle, handleMouseEnter, handleMouseLeave } = useAnimatedIconHandlers(
      controls,
      onMouseEnter,
      onMouseLeave,
    );

    useImperativeHandle(ref, bindHandle);

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            d="M5 12h14"
            variants={{
              normal: { d: 'M5 12h14' },
              animate: {
                d: ['M5 12h14', 'M5 12h9', 'M5 12h14'],
                transition: { duration: 0.4 },
              },
            }}
          />
          <motion.path
            animate={controls}
            d="m12 5 7 7-7 7"
            variants={{
              normal: { d: 'm12 5 7 7-7 7', translateX: 0 },
              animate: {
                d: 'm12 5 7 7-7 7',
                translateX: [0, -3, 0],
                transition: { duration: 0.4 },
              },
            }}
          />
        </svg>
      </div>
    );
  },
);

ArrowRightIcon.displayName = 'ArrowRightIcon';

export const BadgeAlertIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const { bindHandle, handleMouseEnter, handleMouseLeave } = useAnimatedIconHandlers(
      controls,
      onMouseEnter,
      onMouseLeave,
    );

    useImperativeHandle(ref, bindHandle);

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          variants={BadgeAlertVariants}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </motion.svg>
      </div>
    );
  },
);

BadgeAlertIcon.displayName = 'BadgeAlertIcon';

export const BotIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const { bindHandle, handleMouseEnter, handleMouseLeave } = useAnimatedIconHandlers(
      controls,
      onMouseEnter,
      onMouseLeave,
    );

    useImperativeHandle(ref, bindHandle);

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 8V4H8" />
          <rect height="12" rx="2" width="16" x="4" y="8" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <motion.line
            animate={controls}
            initial="normal"
            variants={{
              normal: { y1: 13, y2: 15 },
              animate: {
                y1: [13, 14, 13],
                y2: [15, 14, 15],
                transition: {
                  duration: 0.5,
                  ease: 'easeInOut',
                  delay: 0.2,
                },
              },
            }}
            x1={15}
            x2={15}
          />
          <motion.line
            animate={controls}
            initial="normal"
            variants={{
              normal: { y1: 13, y2: 15 },
              animate: {
                y1: [13, 14, 13],
                y2: [15, 14, 15],
                transition: {
                  duration: 0.5,
                  ease: 'easeInOut',
                  delay: 0.2,
                },
              },
            }}
            x1={9}
            x2={9}
          />
        </svg>
      </div>
    );
  },
);

BotIcon.displayName = 'BotIcon';

export const BrainIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const { bindHandle, handleMouseEnter, handleMouseLeave } = useAnimatedIconHandlers(
      controls,
      onMouseEnter,
      onMouseLeave,
    );

    useImperativeHandle(ref, bindHandle);

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          variants={{
            normal: { scale: 1, strokeWidth: 2 },
            animate: {
              scale: [1, 1.08, 1],
              strokeWidth: [2, 2.25, 2],
              transition: {
                duration: 1.4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
            },
          }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            d="M12 18V5"
            variants={{
              normal: { pathLength: 1, pathOffset: 0 },
              animate: {
                pathLength: [1, 0.4, 1],
                pathOffset: [0, 0.25, 0],
                transition: {
                  duration: 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                },
              },
            }}
          />
          <motion.path
            animate={controls}
            d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"
            variants={{
              normal: { pathLength: 1, pathOffset: 0 },
              animate: {
                pathLength: [1, 0.5, 1],
                pathOffset: [0, 0.25, 0],
                transition: {
                  duration: 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                },
              },
            }}
          />
          <motion.path
            animate={controls}
            d="M12 5A3 3 0 1 1 17.598 6.5"
            variants={{
              normal: { pathLength: 1, pathOffset: 0 },
              animate: {
                pathLength: [1, 0.8, 1],
                pathOffset: [0, 0.07, 0],
                transition: {
                  duration: 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                },
              },
            }}
          />
          <motion.path
            animate={controls}
            d="M12 5A3 3 0 1 0 6.402 6.5"
            variants={{
              normal: { pathLength: 1, pathOffset: 0 },
              animate: {
                pathLength: [1, 0.8, 1],
                pathOffset: [0, 0.07, 0],
                transition: {
                  duration: 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                },
              },
            }}
          />
          <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
          <motion.path
            animate={controls}
            d="M18 18a4 4 0 0 0 2-7.464"
            variants={{
              normal: { pathLength: 1, pathOffset: 0 },
              animate: {
                pathLength: [1, 0.8, 1],
                pathOffset: [0, 0.14, 0],
                transition: {
                  duration: 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                },
              },
            }}
          />
          <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
          <motion.path
            animate={controls}
            d="M6 18a4 4 0 0 1-2-7.464"
            variants={{
              normal: { pathLength: 1, pathOffset: 0 },
              animate: {
                pathLength: [1, 0.8, 1],
                pathOffset: [0, 0.14, 0],
                transition: {
                  duration: 1.4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                },
              },
            }}
          />
          <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
        </motion.svg>
      </div>
    );
  },
);

BrainIcon.displayName = 'BrainIcon';

export const ChartLineIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const { bindHandle, handleMouseEnter, handleMouseLeave } = useAnimatedIconHandlers(
      controls,
      onMouseEnter,
      onMouseLeave,
    );

    useImperativeHandle(ref, bindHandle);

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <motion.path
            animate={controls}
            d="m7 13 3-3 4 4 5-5"
            variants={{
              normal: { pathLength: 1, opacity: 1 },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: {
                  delay: 0.15,
                  duration: 0.3,
                  opacity: { delay: 0.1 },
                },
              },
            }}
          />
        </svg>
      </div>
    );
  },
);

ChartLineIcon.displayName = 'ChartLineIcon';

export const ShieldCheckIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const { bindHandle, handleMouseEnter, handleMouseLeave } = useAnimatedIconHandlers(
      controls,
      onMouseEnter,
      onMouseLeave,
    );

    useImperativeHandle(ref, bindHandle);

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <motion.path
            animate={controls}
            d="m9 12 2 2 4-4"
            initial="normal"
            variants={ShieldCheckVariants}
          />
        </svg>
      </div>
    );
  },
);

ShieldCheckIcon.displayName = 'ShieldCheckIcon';
