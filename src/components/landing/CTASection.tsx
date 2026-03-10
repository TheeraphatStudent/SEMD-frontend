'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { Button, Text, Heading, Container } from '@/components/ui';

export const CTASection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-primary-1 via-primary-light to-primary">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(156,118,38,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Container size="lg" className="relative z-10 text-center">
        <Heading
          as="h2"
          variant="title"
          className="mb-[14px]"
          animated={isInView}
        >
          อย่ารอให้โดนก่อน
        </Heading>

        <Text
          variant="lead"
          className="max-w-[480px] mx-auto mb-10"
          animated={isInView}
          delay={0.1}
        >
          เริ่มตรวจสอบ URL ของคุณได้ฟรีวันนี้ ไม่ต้องสมัครสมาชิก ไม่ต้องติดตั้ง
        </Text>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href={ROUTES.AUTH.REGISTER}>
            <Button variant="primary" size="lg">
              เริ่มใช้งานเลย →
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-[13px] text-gray-primary-0 flex gap-5 justify-center flex-wrap"
        >
          <span>🔒 ไม่เก็บข้อมูล URL ของคุณ</span>
          <span>🔒 ใช้งานได้ฟรี</span>
          <span>🔒 ไม่ต้องติดตั้ง</span>
        </motion.div>
      </Container>
    </section>
  );
};
