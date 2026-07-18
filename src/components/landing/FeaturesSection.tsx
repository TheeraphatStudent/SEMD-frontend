'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { Gauge, Users } from 'lucide-react';
import { BrainIcon, ChartLineIcon, ShieldCheckIcon } from '@/components/icons/lucide-animated';
import { Card, Badge, Heading, Text, SectionHeader, Container } from '@/components/ui';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  accent?: string;
  large?: boolean;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  accent,
  large,
  delay,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const motionEnabled = useMotionEnabled();

  return (
    <motion.div
      ref={ref}
      initial={!motionEnabled ? false : { opacity: 0, y: 24 }}
      animate={isInView && motionEnabled ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay }}
      className={large ? 'md:col-span-2' : ''}
    >
      <Card className="h-full rounded-[28px] border-primary/10 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-dark text-white">
          <Icon size={22} />
        </div>
        <Heading as="h3" variant="section" className="mb-2 text-left text-[22px]">
          {title}
        </Heading>
        <Text variant="small" className="leading-7">
          {description}
        </Text>
        {accent && (
          <Badge variant="info" className="mt-5 inline-flex rounded-full border border-primary/10 bg-primary-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-dark">
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
      icon: BrainIcon,
      title: 'ML-powered URL analysis',
      description: 'ระบบไม่ได้อาศัย blacklist เพียงอย่างเดียว แต่เรียนรู้ pattern ของ URL อันตรายจากข้อมูลจำนวนมาก เพื่อช่วยจับลิงก์ใหม่ที่ยังไม่ถูกติดธงมาก่อน',
      accent: 'Core engine',
      large: true,
    },
    {
      icon: Gauge,
      title: 'ผลลัพธ์ที่อ่านแล้วตัดสินใจต่อได้',
      description: 'แสดง verdict พร้อม confidence score และคำอธิบายที่ช่วยให้เข้าใจว่าเพราะอะไรลิงก์นี้จึงน่าสงสัย',
    },
    {
      icon: ChartLineIcon,
      title: 'ประวัติ รายงาน และการติดตามผล',
      description: 'รวมผลการตรวจสอบไว้ใน dashboard เดียว เพื่อย้อนดู จัดกลุ่ม และส่งต่อข้อมูลให้ทีมได้สะดวกขึ้น',
    },
    {
      icon: Users,
      title: 'พร้อมต่อยอดสู่การทำงานเป็นทีม',
      description: 'รองรับ workflow ที่ต้องมีคนตรวจสอบหลายบทบาท ตั้งแต่ผู้ใช้งานทั่วไปไปจนถึงฝ่าย IT และ security',
    },
    {
      icon: ShieldCheckIcon,
      title: 'ออกแบบมาเพื่อสร้าง trust',
      description: 'ทั้งภาษาที่ใช้ การจัดลำดับข้อมูล และสถานะผลลัพธ์ ถูกออกแบบให้ลดความคลุมเครือในช่วงที่ผู้ใช้ต้องตัดสินใจเร็ว',
    },
  ];

  return (
    <section id="features" ref={ref} className="bg-background py-24">
      <Container size="xl">
        <SectionHeader
          badge="Capabilities"
          title="SEMD ไม่ได้แค่บอกว่าปลอดภัยหรือไม่"
          description="หน้า feature ใหม่เน้นประโยชน์เชิงตัดสินใจและการทำงานจริง มากกว่ารายการความสามารถแบบกระจัดกระจาย"
          align="center"
          animated={isInView}
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={0.1 * (index + 1)} />
          ))}
        </div>
      </Container>
    </section>
  );
};
