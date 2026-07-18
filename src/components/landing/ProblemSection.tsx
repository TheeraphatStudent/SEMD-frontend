'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EyeOff } from 'lucide-react';
import { BadgeAlertIcon, ShieldCheckIcon } from '@/components/icons/lucide-animated';
import { Card, Badge, Heading, Text, SectionHeader, Container } from '@/components/ui';

interface ProblemCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  riskLevel: string;
  insight: string;
  delay: number;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  icon: Icon,
  title,
  description,
  riskLevel,
  insight,
  delay,
}) => {
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
      <Card className="flex h-full flex-col rounded-[28px] border-danger/10 bg-white p-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <Icon size={22} />
          </div>
          <Badge variant="danger" className="rounded-full border border-danger/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]">
            {riskLevel}
          </Badge>
        </div>

        <Heading as="h3" variant="section" className="mb-2 text-left text-[22px]">
          {title}
        </Heading>
        <Text variant="small" className="flex-1 leading-7">
          {description}
        </Text>

        <div className="mt-5 rounded-2xl bg-danger/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-danger">ผลกระทบ</p>
          <p className="mt-1 text-sm leading-6 text-gray-primary-0">{insight}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export const ProblemSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const problems = [
    {
      icon: BadgeAlertIcon,
      title: 'Phishing ที่ดูเหมือนของจริง',
      description: 'หน้าเว็บปลอมเลียนแบบธนาคาร โซเชียล หรือองค์กรที่คุ้นเคย ต่างกันเพียงตัวอักษรหรือโดเมนย่อยเล็กน้อย',
      riskLevel: 'High risk',
      insight: 'ผู้ใช้มักกดต่อเพราะเชื่อว่ากำลังอยู่บนโดเมนจริง และส่งข้อมูลสำคัญโดยไม่ตั้งใจ',
    },
    {
      icon: ShieldCheckIcon,
      title: 'ลิงก์อันตรายที่พาไปหา malware',
      description: 'บาง URL ไม่ได้หลอกให้กรอกข้อมูล แต่พาไปยังหน้าที่กระตุ้นการดาวน์โหลดไฟล์หรือสคริปต์ที่เป็นอันตราย',
      riskLevel: 'Critical',
      insight: 'ความเสียหายไม่หยุดที่คนคลิกคนเดียว แต่อาจลามไปยังเครื่อง อีเมล และบัญชีอื่นในระบบ',
    },
    {
      icon: EyeOff,
      title: 'มองด้วยตาเปล่าก็ยังแยกยาก',
      description: 'URL ย่อ ลิงก์เปลี่ยนเส้นทาง และข้อความลวงในแชตหรืออีเมล ทำให้การดูจากหน้าตาอย่างเดียวไม่เพียงพอ',
      riskLevel: 'Common',
      insight: 'เมื่อไม่มีเครื่องมือช่วยตัดสินใจ คนมักลังเลช้าเกินไปหรือรีบคลิกเพราะคิดว่าไม่มีอะไรผิดปกติ',
    },
  ];

  return (
    <section id="problem" ref={ref} className="bg-[linear-gradient(180deg,#f8fafc_0%,#fef8ef_100%)] py-24">
      <Container size="xl">
        <SectionHeader
          badge="Pain points"
          title="ภัยคุกคามเริ่มจากลิงก์ที่ดูธรรมดา"
          description="SEMD ถูกออกแบบมาเพื่อแก้ปัญหาที่เกิดขึ้นก่อนคลิก ไม่ใช่หลังจากเกิดเหตุแล้ว"
          align="center"
          animated={isInView}
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {problems.map((problem, index) => (
            <ProblemCard key={problem.title} {...problem} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
