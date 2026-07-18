'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Building2, GraduationCap, Shield, UserRound } from 'lucide-react';
import { Card, Badge, Heading, Text, SectionHeader, Container } from '@/components/ui';

interface UseCaseCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  tag: string;
  delay: number;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ icon: Icon, title, description, tag, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={isInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay }}
      className="h-full"
    >
      <Card className="flex h-full flex-col rounded-[28px] border-secondary/10 bg-white p-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary-dark">
          <Icon size={22} />
        </div>
        <Heading as="h3" variant="section" className="mb-2 text-left text-[22px]">
          {title}
        </Heading>
        <Text variant="small" className="flex-1 leading-7">
          {description}
        </Text>
        <Badge variant="info" className="mt-5 inline-flex self-start rounded-full border border-secondary/10 bg-secondary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary-dark">
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
      icon: Shield,
      title: 'SOC team และฝ่าย IT security',
      description: 'ใช้ตรวจสอบลิงก์ต้องสงสัยจำนวนมากอย่างรวดเร็ว พร้อมเก็บผลลัพธ์เพื่อนำไปอ้างอิงหรือส่งต่อใน incident workflow',
      tag: 'Team workflow',
    },
    {
      icon: Building2,
      title: 'องค์กรและ IT admin',
      description: 'ช่วยคัดกรองลิงก์ก่อนส่งต่อให้พนักงาน ลูกค้า หรือผู้ใช้ภายในองค์กร ลดความเสี่ยงจาก human error ในงานประจำวัน',
      tag: 'Operational safety',
    },
    {
      icon: GraduationCap,
      title: 'นักวิจัยและผู้เรียนด้าน cybersecurity',
      description: 'ดู confidence score และ pattern เชิงวิเคราะห์เพื่อทำความเข้าใจว่าระบบใช้สัญญาณใดในการประเมินความเสี่ยงของ URL',
      tag: 'Learning insight',
    },
    {
      icon: UserRound,
      title: 'บุคคลทั่วไปที่ต้องเช็กลิงก์ด่วน',
      description: 'เหมาะกับลิงก์จาก SMS, อีเมล, LINE หรือโซเชียลมีเดียที่ยังไม่แน่ใจว่าจะปลอดภัยพอให้เปิดหรือไม่',
      tag: 'Fast check',
    },
  ];

  return (
    <section id="usecases" ref={ref} className="bg-[linear-gradient(180deg,#fff9ef_0%,#f8fafc_100%)] py-24">
      <Container size="xl">
        <SectionHeader
          badge="Use cases"
          title="เหมาะกับทั้งงานรายบุคคลและ workflow ของทีม"
          description="เราเปลี่ยน section นี้ให้สื่อ role-based value ชัดขึ้น เพื่อให้ผู้ใช้รู้ทันทีว่าตัวเองอยู่ในกลุ่มไหน"
          align="center"
          animated={isInView}
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={useCase.title} {...useCase} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
