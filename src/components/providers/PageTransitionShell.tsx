'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';

interface PageTransitionShellProps {
  children: React.ReactNode;
}

export const PageTransitionShell: React.FC<PageTransitionShellProps> = ({ children }) => {
  const pathname = usePathname();
  const motionEnabled = useMotionEnabled();
  const overlayControls = useAnimationControls();
  const isFirstRender = useRef(true);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionEnabled) {
      return;
    }

    const run = async () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        await overlayControls.set({ scaleY: 0, transformOrigin: 'top' });
        return;
      }

      await overlayControls.set({
        scaleY: 0,
        transformOrigin: 'bottom',
        opacity: 1,
      });
      await overlayControls.start({
        scaleY: 1,
        transition: { duration: 0.34, ease: [0.83, 0, 0.17, 1] },
      });
      await overlayControls.set({ transformOrigin: 'top' });
      await overlayControls.start({
        scaleY: 0,
        transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.06 },
      });
    };

    void run();
  }, [motionEnabled, overlayControls, pathname]);

  useEffect(() => {
    pageRef.current?.focus();
  }, [pathname]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[120] bg-[linear-gradient(180deg,rgba(30,58,95,0.98)_0%,rgba(37,99,235,0.92)_55%,rgba(161,98,7,0.88)_100%)]"
        initial={false}
        animate={overlayControls}
        style={{ scaleY: 0 }}
      />

      <motion.div
        ref={pageRef}
        key={pathname}
        tabIndex={-1}
        initial={
          !motionEnabled
            ? false
            : { opacity: 0, y: 24, filter: 'blur(8px)' }
        }
        animate={
          !motionEnabled
            ? undefined
            : { opacity: 1, y: 0, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh outline-none"
      >
        {children}
      </motion.div>
    </>
  );
};
