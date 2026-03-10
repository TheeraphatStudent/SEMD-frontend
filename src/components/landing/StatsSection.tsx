'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Text, SectionHeader, Container } from '@/components/ui';

interface StatItemProps {
  value: string;
  label: string;
  sub: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, sub, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center py-6 px-4 relative"
    >
      <div className="text-4xl md:text-5xl font-extrabold text-dark leading-none">{value}</div>
      <div className="text-sm font-bold text-dark mt-[6px] mb-[2px]">{label}</div>
      <Text variant="caption" className="text-gray-primary-0">{sub}</Text>
    </motion.div>
  );
};

export const StatsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '97.8%', label: 'Accuracy', sub: 'ของ ML Model' },
    { value: '10K+', label: 'URL ตรวจแล้ว', sub: 'และเพิ่มขึ้นทุกวัน' },
    { value: '<2s', label: 'Response Time', sub: 'เฉลี่ยต่อการตรวจ' },
    { value: '3', label: 'ระดับการแจ้งเตือน', sub: 'Safe / Warning / Danger' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary-light to-background">
      <Container size="xl">
        <SectionHeader
          badge="ตัวเลขที่พิสูจน์ได้"
          title="ความแม่นยำที่ไว้วางใจได้"
          align="center"
          animated={isInView}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              {index > 0 && (
                <div className="hidden md:block absolute left-0 top-[20%] bottom-[20%] w-px bg-dark/15" />
              )}
              <StatItem {...stat} delay={0.1 * (index + 1)} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
