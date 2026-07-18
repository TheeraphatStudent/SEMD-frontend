'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { BotIcon, ChartLineIcon, ShieldCheckIcon } from '@/components/icons/lucide-animated';
import { Heading, Text, SectionHeader, Container } from '@/components/ui';

interface StepProps {
  icon: React.ElementType;
  number: number;
  title: string;
  description: string;
  index: number;
  isInView: boolean;
}

const stepVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: index * 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

const circleVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0
  },
  visible: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: index * 0.4,
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  })
};

const contentVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 15
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.4 + 0.2,
      ease: 'easeOut'
    }
  })
};

const lineVariants: Variants = {
  hidden: { 
    scaleX: 0,
    opacity: 0
  },
  visible: (index: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      delay: index * 0.4 + 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

const Step: React.FC<StepProps> = ({ icon: Icon, number, title, description, index, isInView }) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stepVariants}
      className="relative px-4 text-center"
    >
      <motion.div
        custom={index}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={circleVariants}
        className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-dark shadow-[0_18px_40px_rgba(15,23,42,0.10)] ring-1 ring-primary/10"
      >
        <Icon size={26} />
      </motion.div>

      <motion.div
        custom={index}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={contentVariants}
        className="rounded-[28px] border border-primary/10 bg-white px-6 py-7 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
      >
        <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white">
          {number}
        </div>
        <Heading as="h3" variant="section" className="mb-2 text-center text-[22px]">{title}</Heading>
        <Text variant="small" className="text-center leading-7">{description}</Text>
      </motion.div>
    </motion.div>
  );
};

const ConnectingLine: React.FC<{ index: number; isInView: boolean }> = ({ index, isInView }) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={lineVariants}
      className="absolute top-8 hidden h-[2px] origin-left bg-gradient-to-r from-primary/70 to-primary-dark md:block"
      style={{
        left: index === 0 ? 'calc(16.66% + 34px)' : 'calc(50% + 34px)',
        width: 'calc(33.33% - 68px)'
      }}
    />
  );
};

export const HowItWorksSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    {
      icon: ShieldCheckIcon,
      number: 1,
      title: 'วาง URL',
      description: 'วางลิงก์ที่ต้องการตรวจสอบลงในช่อง ไม่ต้องสมัครสมาชิก ไม่ต้องติดตั้งโปรแกรม',
    },
    {
      icon: BotIcon,
      number: 2,
      title: 'ML วิเคราะห์',
      description: 'ระบบดึง Feature จาก URL และวิเคราะห์ด้วย Machine Learning Model ที่ฝึกมาจาก Dataset ขนาดใหญ่',
    },
    {
      icon: ChartLineIcon,
      number: 3,
      title: 'รับผลทันที',
      description: 'ได้รับผลลัพธ์พร้อม Confidence Score และคำแนะนำ ภายในไม่กี่วินาที',
    },
  ];

  return (
    <section id="how" className="bg-background py-24" ref={ref}>
      <Container size="xl">
        <SectionHeader
          badge="Workflow"
          title="ตรวจสอบลิงก์ได้ใน 3 ขั้นตอนที่ชัดเจน"
          description="จัดลำดับให้ผู้ใช้เห็น flow ก่อนใช้งานจริง ลดความรู้สึกว่าเครื่องมือซับซ้อนเกินจำเป็น"
          align="center"
          animated={isInView}
          className="mb-14"
        />

        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-0">
          {[0, 1].map((lineIndex) => (
            <ConnectingLine key={lineIndex} index={lineIndex} isInView={isInView} />
          ))}
          
          {steps.map((step, index) => (
            <Step 
              key={index} 
              {...step} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
