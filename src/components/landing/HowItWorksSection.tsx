'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, Heading, Text, SectionHeader, Container } from '@/components/ui';

interface StepProps {
  icon: string;
  number: number;
  title: string;
  description: string;
  delay: number;
}

const Step: React.FC<StepProps> = ({ icon, number, title, description, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center px-6"
    >
      <div className="text-[28px] mb-[10px]">{icon}</div>
      <div className="w-14 h-14 rounded-full bg-primary text-dark text-xl font-extrabold flex items-center justify-center mx-auto mb-5 shadow-xl relative z-10">
        {number}
      </div>
      <Heading as="h3" variant="subtitle" className="mb-2">{title}</Heading>
      <Text variant="small" className="leading-[1.6]">{description}</Text>
    </motion.div>
  );
};

export const HowItWorksSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      icon: '🔗',
      number: 1,
      title: 'วาง URL',
      description: 'วางลิงก์ที่ต้องการตรวจสอบลงในช่อง ไม่ต้องสมัครสมาชิก ไม่ต้องติดตั้งโปรแกรม',
    },
    {
      icon: '🤖',
      number: 2,
      title: 'ML วิเคราะห์',
      description: 'ระบบดึง Feature จาก URL และวิเคราะห์ด้วย Machine Learning Model ที่ฝึกมาจาก Dataset ขนาดใหญ่',
    },
    {
      icon: '📊',
      number: 3,
      title: 'รับผลทันที',
      description: 'ได้รับผลลัพธ์พร้อม Confidence Score และคำแนะนำ ภายในไม่กี่วินาที',
    },
  ];

  return (
    <section id="how" className="py-20 bg-background">
      <Container size="xl">
        <SectionHeader
          badge="วิธีการทำงาน"
          title="ง่ายกว่าที่คิด ใน 3 ขั้นตอน"
          align="center"
          animated={isInView}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto">
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-[2px] bg-gradient-to-r from-primary to-primary-dark" />
          {steps.map((step, index) => (
            <Step key={index} {...step} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
