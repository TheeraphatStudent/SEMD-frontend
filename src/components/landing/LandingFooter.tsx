'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { Button, Text, Heading, Container } from '@/components/ui';

// ─── Reusable ambient orb ─────────────────────────────────────────────────────

const Orb: React.FC<{
  size: number; x: string; y: string;
  color: string; duration: number; delay?: number;
}> = ({ size, x, y, color, duration, delay = 0 }) => (
  <motion.div
    aria-hidden
    className="absolute rounded-full pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, background: color, filter: 'blur(80px)' }}
    animate={{ 
      scale: [1, 1.3, 0.9, 1.1, 1], 
      opacity: [0.2, 0.5, 0.3, 0.45, 0.2], 
      x: [0, 25, -15, 20, 0], 
      y: [0, -20, 15, -10, 0],
      rotate: [0, 5, -3, 2, 0]
    }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity, 
      ease: [0.25, 0.46, 0.45, 0.94],
      times: [0, 0.25, 0.5, 0.75, 1]
    }}
  />
);

// ─── Animated dot-grid ────────────────────────────────────────────────────────

const DotGrid: React.FC = () => (
  <motion.div
    aria-hidden
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}
    style={{
      backgroundImage: 'radial-gradient(circle, rgba(255,200,80,0.10) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}
  />
);

// ─── Shimmer ring ─────────────────────────────────────────────────────────────

const ShimmerRing: React.FC = () => (
  <motion.span
    aria-hidden
    className="absolute inset-0 rounded-full"
    style={{ border: '1px solid rgba(255,255,255,0.35)' }}
    animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
  />
);

// ─── Divider line ─────────────────────────────────────────────────────────────

const Divider: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
  <motion.div
    className="w-full h-px"
    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
  />
);

// ─── Footer nav link ──────────────────────────────────────────────────────────

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link
    href={href}
    className="text-white/50 hover:text-white text-sm transition-colors duration-200"
  >
    {children}
  </Link>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'เมนู',
    links: [
      { label: 'หน้าหลัก', href: '/' },
      { label: 'วิธีการทำงาน', href: '/#how' },
      { label: 'ฟีเจอร์', href: '/#features' },
    ],
  },
  {
    label: 'บัญชี',
    links: [
      { label: 'เข้าสู่ระบบ', href: ROUTES.AUTH.LOGIN },
      { label: 'สมัครสมาชิก', href: ROUTES.AUTH.REGISTER },
    ],
  },
  {
    label: 'ข้อมูล',
    links: [
      { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
      { label: 'เงื่อนไขการใช้งาน', href: '/terms' },
    ],
  },
];


export const LandingFooter: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer
      id='footer'
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a1206 0%, #2d1f08 40%, #1c2a1e 100%)' }}
    >
      <DotGrid />
      <Orb size={500} x="-8%"  y="-30%" color="rgba(180,120,20,0.40)" duration={9} />
      <Orb size={380} x="65%"  y="10%"  color="rgba(20,90,50,0.35)"   duration={11} delay={1.5} />
      <Orb size={240} x="40%"  y="50%"  color="rgba(200,140,30,0.20)" duration={7}  delay={0.8} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.30)' }} />

      <div className="relative z-10 pt-24 pb-16">
        <Container size="lg" className="flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                       bg-white/10 border border-white/25 text-white text-xs
                       font-semibold tracking-widest uppercase mb-7 relative"
          >
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-green-400"
                animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            ใช้งานได้ฟรีทันที
            <ShimmerRing />
          </motion.div>

          <motion.div
            className="mb-4 overflow-hidden"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
            }}
          >
            <Heading as="h2" variant="title" className="!text-white !text-center leading-tight w-full">
              {'อย่ารอให้โดนก่อน'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <Text variant="lead" className="max-w-[440px] mx-auto mb-10 !text-white/80">
              เริ่มตรวจสอบ URL ของคุณได้ฟรีวันนี้
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.5 }}
            className="relative inline-block"
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-xl bg-primary/40 blur-xl"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.1, 0.95] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button
                variant="primary"
                size="lg"
                className="relative shadow-2xl hover:scale-[1.04] active:scale-[0.98] transition-transform duration-150"
              >
                เริ่มใช้งานเลย →
              </Button>
            </Link>
          </motion.div>

        </Container>
      </div>

      {/* ── FOOTER LINKS GRID ─────────────────────────────────────────────────── */}
      <div className="relative z-10 px-4">
        <Container size="lg">
          <Divider delay={0.6} />

          <motion.div
            className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } },
            }}
          >
            {/* Brand column */}
            <motion.div
              className="md:col-span-1 flex flex-col gap-3"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary font-extrabold text-lg tracking-tight">SEMD</span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded
                             bg-primary/20 text-primary border border-primary/30 tracking-wide uppercase"
                >
                  Beta
                </span>
              </div>
              <p className="text-white/45 text-xs leading-relaxed max-w-[200px]">
                Suspicious URL Evaluation for Malicious Detection — ปกป้องคุณจาก Phishing ด้วย AI
              </p>
            </motion.div>

            {NAV_GROUPS.map((group) => (
              <motion.div
                key={group.label}
                className="flex flex-col gap-3"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <span className="text-white/30 text-[11px] font-semibold tracking-widest uppercase">
                  {group.label}
                </span>
                {group.links.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </motion.div>
            ))}
          </motion.div>

          <Divider delay={0.8} />

          {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
          <motion.div
            className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <p className="text-white/30 text-xs">
              © 2026{' '}
              <span className="text-primary/80 font-semibold">SEMD</span>
              {' — '}Powered by Machine Learning
            </p>
          </motion.div>

        </Container>
      </div>
    </footer>
  );
};