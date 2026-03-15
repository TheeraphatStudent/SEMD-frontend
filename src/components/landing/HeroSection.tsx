'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { Badge, Button, Text, Heading, Pulse } from '@/components/ui';
import { UrlInputBox } from '@/components/shared/UrlInputBox';
import { CheckInput } from '@/lib/types';
import { BadgeVariant } from '@/types/badge.types';

const LiveDot: React.FC = () => (
  <Pulse size="sm" variant="success" />
);

const Chip: React.FC<{ variant: BadgeVariant; children: React.ReactNode }> = ({ variant, children }) => {
  return (
    <Badge variant={variant} className="inline-flex items-center gap-[5px] rounded-full px-3 py-[5px] border shadow-sm">
      {children}
    </Badge>
  );
};

interface HeroSectionProps {
  onCheck?: (input: CheckInput) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCheck }) => {
  const handleCheck = (input: CheckInput) => {
    if (onCheck) {
      onCheck(input);
    } else {
      window.location.href = `${ROUTES.DASHBOARD.SCAN}?url=${encodeURIComponent(input.url)}`;
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center overflow-hidden bg-[radial-gradient(ellipse_90%_60%_at_50%_-5%,#FFF0CC_0%,#FFFCEB_65%)]">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(71,49,0,0.05) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 bg-[rgba(255,246,228,0.9)] border border-primary rounded-full px-4 py-[5px] text-[12px] font-bold text-primary-dark mb-7 tracking-wide"
      >
        <LiveDot />
        ขับเคลื่อนด้วย Machine Learning
      </motion.div>

      <Heading
        as="h1"
        variant="display"
        className="leading-[1.1] text-dark mb-4"
        animated
        delay={0.08}
      >
        ให้ <span className="text-primary-dark">SEMD</span> ตรวจก่อน
      </Heading>

      <Text
        variant="lead"
        className="max-w-[520px] mx-auto mb-10 leading-[1.75]"
        animated
        delay={0.16}
      >
        ระบบวิเคราะห์ URL ต้องสงสัยด้วย Machine Learning ตรวจจับเว็บไซต์อันตราย ได้แม่นยำ รวดเร็ว ใช้งานง่าย
      </Text>

      <div className='flex w-full max-w-[640px]'>
        <UrlInputBox variant="landing" />
      </div>

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.32 }}
        className="flex gap-2 justify-center flex-wrap mt-7"
      >
        <Chip variant="safe">Benign</Chip>
        <Chip variant="malicious">Malicious</Chip>
      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex gap-3 justify-center flex-wrap mt-8"
      >
        <Link href={ROUTES.AUTH.REGISTER}>
          <Button variant="primary" size="lg">
            เริ่มใช้งานฟรี →
          </Button>
        </Link>
        <a href="#how">
          <Button variant="outline" size="lg">
            ดูวิธีการทำงาน
          </Button>
        </a>
      </motion.div>
    </section>
  );
};
