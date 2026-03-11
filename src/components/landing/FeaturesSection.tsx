'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, Badge, Heading, Text, SectionHeader, Container } from '@/components/ui';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accent?: string;
  large?: boolean;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, accent, large, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -3 }}
      className={large ? 'md:col-span-2' : ''}
    >
      <Card className="p-6">
        <div className="text-[32px] mb-[14px]">{icon}</div>
        <Heading as="h3" variant="subtitle" className="mb-[6px]">{title}</Heading>
        <Text variant="small" className="leading-[1.6]">{description}</Text>
        {accent && (
          <Badge variant="default" className="inline-block mt-3 rounded-full px-[10px] py-[3px] bg-primary-light text-primary-dark">
            {accent}
          </Badge>
        )}
      </Card>
    </motion.div>
  );
};

export const FeaturesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: '🧠',
      title: 'ML-Powered Analysis',
      description: 'ไม่ใช่แค่ Blacklist — ระบบเรียนรู้ pattern ของ URL อันตรายจาก Dataset ขนาดใหญ่ และอัปเดตอยู่เสมอ สามารถจับ URL ใหม่ที่ไม่เคยเห็นมาก่อนได้',
      accent: 'Core Technology',
      large: true,
    },
    {
      icon: '⚡',
      title: 'ผลลัพธ์ Real-time',
      description: 'วิเคราะห์และแสดงผลภายในไม่กี่วินาที พร้อม Confidence Score',
    },
    {
      icon: '📈',
      title: 'Dashboard & Report',
      description: 'ติดตาม จัดการ และ Export รายงาน URL ที่ตรวจแล้วทั้งหมดได้',
    },
    {
      icon: '👥',
      title: 'Team Management',
      description: 'มอบหมายงาน ติดตามสถานะ และทำงานร่วมกันเป็นทีมได้',
    },
    {
      icon: '🎯',
      title: 'Confidence Score',
      description: 'บอกระดับคค่าความถูกต้องของ Model ในการตัดสิน ไม่ใช่แค่ Safe/Danger',
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <Container size="xl">
        <SectionHeader
          badge="ความสามารถ"
          title="ทำไมต้อง SEMD"
          align="center"
          animated={isInView}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
