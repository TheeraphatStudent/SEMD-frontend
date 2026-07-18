'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ActivityIcon, ChartLineIcon, ShieldCheckIcon } from '@/components/icons/lucide-animated';
import { Text, SectionHeader, Container } from '@/components/ui';

interface StatItemProps {
  value: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, sub, icon: Icon, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={isInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay }}
      className="rounded-[28px] border border-white/70 bg-white/92 px-6 py-6 text-left shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-dark text-white">
        <Icon size={22} />
      </div>
      <div className="text-4xl font-extrabold leading-none tracking-tight text-dark md:text-5xl">{value}</div>
      <div className="mt-3 text-sm font-bold uppercase tracking-[0.08em] text-primary-dark">{label}</div>
      <Text variant="small" className="mt-2 leading-6 text-gray-primary-0">
        {sub}
      </Text>
    </motion.div>
  );
};

export const StatsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '97.8%', label: 'Model accuracy', sub: 'ประเมินจากโมเดลหลักของ SEMD สำหรับการจำแนก URL ที่น่าสงสัย', icon: ActivityIcon },
    { value: '10K+', label: 'URLs analyzed', sub: 'มีข้อมูลการตรวจสอบสะสมและยังคงเพิ่มขึ้นจากการใช้งานจริงอย่างต่อเนื่อง', icon: ChartLineIcon },
    { value: '<2s', label: 'Average response', sub: 'ช่วยให้การตัดสินใจก่อนคลิกเกิดขึ้นได้ทันในงานประจำวันและการเฝ้าระวัง', icon: ShieldCheckIcon },
  ];

  return (
    <section ref={ref} className="bg-[linear-gradient(135deg,#1e3a5f_0%,#274a75_46%,#f3f6fb_46%,#f8fafc_100%)] py-24">
      <Container size="xl">
        <SectionHeader
          badge="Proof points"
          title="ตัวเลขที่ช่วยสร้างความมั่นใจก่อนนำไปใช้จริง"
          description="เราเปลี่ยนหน้า statistics ให้ทำหน้าที่เป็น trust section มากกว่าแค่โชว์ตัวเลข"
          align="center"
          animated={isInView}
          className="mb-14 [&_h2]:text-white [&_p]:text-slate-200 [&_span]:border-white/20 [&_span]:bg-white/10 [&_span]:text-white"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
