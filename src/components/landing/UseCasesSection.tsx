'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, Badge, Heading, Text, SectionHeader, Container } from '@/components/ui';

interface UseCaseCardProps {
  icon: string;
  title: string;
  description: string;
  tag: string;
  delay: number;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ icon, title, description, tag, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -3 }}
    >
      <Card className="p-7 cursor-pointer">
        <div className="text-[32px] mb-[14px]">{icon}</div>
        <Heading as="h3" variant="subtitle" className="mb-[6px]">{title}</Heading>
        <Text variant="small" className="leading-[1.65]">{description}</Text>
        <Badge variant="info" className="inline-block mt-[14px] rounded-full px-3 py-[3px] bg-secondary-light text-secondary-dark border border-secondary">
          {tag}
        </Badge>
      </Card>
    </motion.div>
  );
};

export const UseCasesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const useCases = [
    {
      icon: '🔐',
      title: 'SOC Team / IT Security',
      description: 'ตรวจสอบ URL ต้องสงสัยจำนวนมากได้รวดเร็ว จัดการเป็นทีม และ Export รายงานเพื่อส่งต่อ',
      tag: 'Dashboard + Team',
    },
    {
      icon: '🏢',
      title: 'องค์กรและ IT Admin',
      description: 'ป้องกันพนักงานจากการคลิกลิงก์อันตราย ตรวจสอบก่อน deploy หรือแชร์ลิงก์ภายใน',
      tag: 'Bulk Check + Report',
    },
    {
      icon: '🎓',
      title: 'นักวิจัย / นักศึกษา Cybersecurity',
      description: 'ศึกษา pattern ของ URL อันตราย ดู Confidence Score และ Feature ที่ Model ใช้ตัดสิน',
      tag: 'Score + Feature Insight',
    },
    {
      icon: '👤',
      title: 'บุคคลทั่วไป',
      description: 'ตรวจลิงก์ก่อนกด ไม่ว่าจะมาจาก SMS, Line, อีเมล หรือโซเชียลมีเดีย ปลอดภัยในทุกคลิก',
      tag: 'Quick URL Check',
    },
  ];

  return (
    <section id="usecases" className="py-20 bg-primary-light">
      <Container size="xl">
        <SectionHeader
          badge="เหมาะสำหรับใคร"
          title="SEMD ช่วยได้ทุกกลุ่ม"
          align="center"
          animated={isInView}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} {...useCase} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
