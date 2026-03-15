'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Heading, Text, SectionHeader, Container } from '@/components/ui';

interface StepProps {
  icon: string;
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

const Step: React.FC<StepProps> = ({ number, title, description, index, isInView }) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stepVariants}
      className="text-center px-6 relative"
    >
      <motion.div
        custom={index}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={circleVariants}
        className="w-14 h-14 rounded-full bg-primary text-dark text-xl font-extrabold flex items-center justify-center mx-auto mb-5 shadow-xl relative z-10"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.4 + 0.15, duration: 0.2 }}
        >
          {number}
        </motion.span>
      </motion.div>
      
      <motion.div
        custom={index}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={contentVariants}
      >
        <Heading as="h3" variant="subtitle" className="text-center mb-2">{title}</Heading>
        <Text variant="small" className="leading-[1.6] text-center">{description}</Text>
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
      className="hidden md:block absolute top-7 h-[2px] bg-gradient-to-r from-primary to-primary-dark origin-left"
      style={{
        left: index === 0 ? 'calc(16.66% + 28px)' : 'calc(50% + 28px)',
        width: 'calc(33.33% - 56px)'
      }}
    />
  );
};

export const HowItWorksSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

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
    <section id="how" className="py-20 bg-background" ref={ref}>
      <Container size="xl">
        <SectionHeader
          badge="วิธีการทำงาน"
          title="ง่ายกว่าที่คิด ใน 3 ขั้นตอน"
          align="center"
          animated={isInView}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 max-w-4xl mx-auto">
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
