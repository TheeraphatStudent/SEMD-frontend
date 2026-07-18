'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * useReducedMotion() reads matchMedia synchronously on the client but always
 * reports false during SSR, so branching render output on it directly causes
 * hydration mismatches. Gate on mount so the first client render always
 * matches the server, then enable motion afterwards if allowed.
 */
export function useMotionEnabled(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && !prefersReducedMotion;
}
