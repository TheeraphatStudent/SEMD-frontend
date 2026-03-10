'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, Badge, Heading, Text, SectionHeader, Container } from '@/components/ui';

interface ProblemCardProps {
  icon: string;
  title: string;
  description: string;
  riskLevel: string;
  delay: number;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ icon, title, description, riskLevel, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="p-7">
        <div className="text-4xl mb-[14px]">{icon}</div>
        <Heading as="h3" variant="subtitle" className="mb-2">{title}</Heading>
        <Text variant="small" className="leading-[1.65]">{description}</Text>
        <Badge variant="danger" className="inline-block mt-3 rounded-full px-[10px] py-[2px] border">
          {riskLevel}
        </Badge>
      </Card>
    </motion.div>
  );
};

export const ProblemSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const problems = [
    {
      icon: '🎣',
      title: 'Phishing ที่ดูเหมือนของจริง',
      description: 'หน้าเว็บปลอมที่เลียนแบบธนาคาร โซเชียล หรือองค์กรน่าเชื่อถือ ต่างกันเพียงตัวอักษรเดียว',
      riskLevel: '🚨 High Risk',
    },
    {
      icon: '💀',
      title: 'Malware แฝงในลิงก์',
      description: 'เพียงเข้าเว็บไซต์ อาจดาวน์โหลด malware เข้าเครื่องโดยไม่รู้ตัว ข้อมูลทั้งหมดตกอยู่ในความเสี่ยง',
      riskLevel: '🚨 High Risk',
    },
    {
      icon: '😵',
      title: 'แยกไม่ออกด้วยตาเปล่า',
      description: 'URL ปลอมมักถูกย่อหรือซ่อน ยากมากที่จะสังเกตโดยไม่ใช้เครื่องมือช่วยตรวจสอบ',
      riskLevel: '⚠️ Common',
    },
  ];

  return (
    <section id="problem" className="py-20 bg-primary-light">
      <Container size="xl">
        <SectionHeader
          badge="ปัญหาที่คุณเจออยู่"
          title="แค่คลิกเดียว อาจเปลี่ยนทุกอย่าง"
          description="ภัยคุกคามทางไซเบอร์เพิ่มขึ้นทุกปี และมักมาในรูปแบบลิงก์ธรรมดาที่มองไม่ออก"
          align="center"
          animated={isInView}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <ProblemCard key={index} {...problem} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
