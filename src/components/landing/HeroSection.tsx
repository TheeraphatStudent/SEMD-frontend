'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { Clock3, ScanSearch } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import {
  ActivityIcon,
  ArrowRightIcon,
  BotIcon,
  ShieldCheckIcon,
} from '@/components/icons/lucide-animated';
import { Button, Text, Heading, Pulse } from '@/components/ui';
import { UrlInputBox } from '@/components/shared/UrlInputBox';
import { CheckInput } from '@/libs/utils/types';

const LiveDot: React.FC = () => <Pulse size="sm" variant="success" />;

interface HeroSectionProps {
  onCheck?: (input: CheckInput) => void;
}

const heroSignals = [
  {
    icon: ShieldCheckIcon,
    title: 'ช่วยคัดกรองลิงก์ก่อนเปิด',
    description: 'สรุปความเสี่ยงเป็นภาษาที่อ่านง่าย ไม่ต้องตีความผลวิเคราะห์เอง',
  },
  {
    icon: Clock3,
    title: 'ได้ผลลัพธ์ภายในไม่กี่วินาที',
    description: 'เหมาะกับการเช็กด่วนก่อนแชร์ กดเข้าเว็บ หรือส่งต่อให้ทีม',
  },
  {
    icon: BotIcon,
    title: 'ผสาน ML กับฐานข้อมูลตรวจสอบ',
    description: 'ลดการพึ่งพาความรู้สึกหรือการเดาจากหน้าตา URL เพียงอย่างเดียว',
  },
];

const quickStats = [
  { label: 'Model accuracy', value: '97.8%' },
  { label: 'URLs analyzed', value: '10K+' },
  { label: 'Average response', value: '<2s' },
];

const flowSteps = [
  'วาง URL หรือนำเข้ารายการที่ต้องการตรวจสอบ',
  'SEMD วิเคราะห์ด้วยโมเดลและแหล่งข้อมูลที่รองรับ',
  'รับคำอธิบายความเสี่ยง พร้อมแนวทางที่ควรทำต่อ',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onCheck }) => {
  const motionEnabled = useMotionEnabled();

  const handleCheck = (input: CheckInput) => {
    if (onCheck) {
      onCheck(input);
    } else {
      window.location.href = `${ROUTES.DASHBOARD.SCAN}?url=${encodeURIComponent(input.url)}`;
    }
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#fff4d2_0%,#fffaf0_38%,#f8fafc_72%)] px-6 pb-20 pt-28 text-center sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(rgba(30,58,95,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,95,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle at center, black 55%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(161,98,7,0.18)_0%,rgba(161,98,7,0)_70%)] blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <motion.div
            initial={!motionEnabled ? false : { opacity: 0, y: 16 }}
            animate={!motionEnabled ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/20 bg-white/85 px-4 py-2 text-[12px] font-bold tracking-[0.14em] text-primary-dark shadow-[0_12px_30px_rgba(30,58,95,0.08)] backdrop-blur"
          >
            <LiveDot />
            THREAT DETECTION WORKFLOW
          </motion.div>

          <Heading
            as="h1"
            variant="display"
            className="max-w-5xl text-balance font-black leading-[1.02] text-dark"
            animated
            delay={0.08}
          >
            ตรวจสอบ URL ที่น่าสงสัย
            <br />
          </Heading>

          <Text
            variant="lead"
            className="mx-auto mb-8 mt-5 max-w-3xl text-balance text-md leading-8 text-gray-primary-0"
            animated
            delay={0.16}
          >
            SEMD ช่วยประเมินความเสี่ยงของลิงก์ อธิบายผลลัพธ์แบบเข้าใจง่าย และแนะนำสิ่งที่ควรทำต่อ
            เพื่อให้ตัดสินใจได้เร็วขึ้นทั้งสำหรับบุคคลทั่วไปและทีมความปลอดภัย
          </Text>

          <motion.div
            initial={!motionEnabled ? false : { opacity: 0, y: 18 }}
            animate={!motionEnabled ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mb-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {quickStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/80 bg-white/88 px-5 py-4 text-left shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <div className="text-2xl font-extrabold tracking-tight text-primary-dark">{item.value}</div>
                <p className="mt-1 text-sm font-medium text-gray-primary-0">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-10">
          <div className="rounded-[28px] border border-white/80 bg-white/88 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-6">
            <UrlInputBox variant="landing" onCheck={handleCheck} />
          </div>

          <motion.aside
            initial={!motionEnabled ? false : { opacity: 0, x: 18 }}
            animate={!motionEnabled ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="rounded-[28px] border border-primary/10 bg-slate-950/[0.03] p-6 text-left shadow-[0_24px_60px_rgba(30,58,95,0.10)]"
          >
            <div className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-dark">
              <ScanSearch size={14} />
              How SEMD helps
            </div>

            <div className="space-y-4">
              {heroSignals.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-dark text-white shadow-sm">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-dark">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-primary-0">{description}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-primary/10 bg-[linear-gradient(135deg,rgba(37,99,235,0.10),rgba(161,98,7,0.10))] p-4">
              <p className="text-sm font-semibold text-dark">เหมาะกับการใช้งานแบบรวดเร็วและแบบทีม</p>
              <p className="mt-1 text-sm leading-6 text-gray-primary-0">
                เริ่มจากเช็กลิงก์หนึ่งรายการ แล้วค่อยขยายไปสู่การบันทึกประวัติ รายงาน และ workflow ของทีมได้ทันที
              </p>
            </div>
          </motion.aside>
        </div>

        <div className="mx-auto grid w-full max-w-5xl gap-3 text-left md:grid-cols-3">
          {flowSteps.map((item, index) => (
            <motion.div
              key={item}
              initial={!motionEnabled ? false : { opacity: 0, y: 16 }}
              animate={!motionEnabled ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 * (index + 1) }}
              className="rounded-2xl border border-primary/10 bg-white/75 px-5 py-4 shadow-sm"
            >
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-gray-primary-0">{item}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={!motionEnabled ? false : { opacity: 0, y: 18 }}
          animate={!motionEnabled ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link href={ROUTES.AUTH.REGISTER}>
            <Button variant="primary" size="lg" className="min-w-[210px]">
              เริ่มใช้งานฟรี
              <ArrowRightIcon size={18} />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="min-w-[210px] bg-white/80">
              ดูความสามารถของระบบ
            </Button>
          </a>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-primary-0">
          <div className="inline-flex items-center gap-2">
            <ActivityIcon size={16} className="text-primary-dark" />
            วิเคราะห์ได้ทั้ง URL เดี่ยวและรายการจำนวนมาก
          </div>
          <div className="inline-flex items-center gap-2">
            <ShieldCheckIcon size={16} className="text-primary-dark" />
            มีคำอธิบายผลลัพธ์และข้อเสนอแนะหลังการตรวจสอบ
          </div>
        </div>
      </div>
    </section>
  );
};
