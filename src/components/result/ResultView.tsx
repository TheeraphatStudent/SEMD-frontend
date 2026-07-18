'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Copy, ExternalLink, ShieldAlert } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Verdict } from '@/lib/types';

interface ResultViewProps {
  url: string;
  verdict: Verdict;
  confidence: number;
  model: string;
  onBack: () => void;
}

const verdictConfig: Record<Verdict, {
  tone: string;
  badge: string;
  title: string;
  summary: string;
  nextSteps: string[];
  detail: string;
  icon: React.ReactNode;
}> = {
  Benign: {
    tone: 'bg-gradient-to-br from-accent-light-green via-white to-accent-light-green',
    badge: 'border-safe/20 bg-safe/10 text-safe',
    title: 'ไม่พบสัญญาณอันตรายจากการตรวจสอบครั้งนี้',
    summary: 'ผลการตรวจสอบนี้ช่วยลดความเสี่ยงเบื้องต้น แต่ยังไม่สามารถรับประกันความปลอดภัยได้ทั้งหมด',
    nextSteps: [
      'ตรวจสอบชื่อโดเมนให้ตรงกับเว็บไซต์ที่คุณตั้งใจเปิด',
      'หลีกเลี่ยงการกรอกข้อมูลสำคัญ หากเว็บไซต์ไม่คุ้นเคย',
      'หากพฤติกรรมของหน้าเว็บดูผิดปกติ ควรหยุดใช้งานทันที',
    ],
    detail: 'SEMD ไม่พบสัญญาณอันตรายชัดเจนจากข้อมูลที่ใช้ตรวจสอบครั้งนี้',
    icon: <CheckCircle2 size={56} className="text-safe" />,
  },
  Malicious: {
    tone: 'bg-gradient-to-br from-accent-light-red via-white to-accent-light-red',
    badge: 'border-danger/20 bg-danger/10 text-danger',
    title: 'URL นี้อาจไม่ปลอดภัย',
    summary: 'ผลการตรวจสอบระบุว่าลิงก์นี้มีความเสี่ยงสูง และไม่ควรเปิดต่อจนกว่าจะยืนยันความน่าเชื่อถือได้',
    nextSteps: [
      'อย่าเปิดเว็บไซต์นี้ต่อ',
      'อย่ากรอกอีเมล รหัสผ่าน หรือข้อมูลการชำระเงิน',
      'ปิดหน้าเว็บและรายงานลิงก์นี้หากจำเป็น',
    ],
    detail: 'รูปแบบของ URL หรือผลตอบกลับจากบริการตรวจสอบมีลักษณะที่ใกล้เคียงเว็บไซต์อันตรายหรือหลอกลวง',
    icon: <ShieldAlert size={56} className="text-danger" />,
  },
};

export const ResultView: React.FC<ResultViewProps> = ({
  url,
  verdict,
  confidence,
  model,
  onBack,
}) => {
  const config = verdictConfig[verdict];
  const now = new Date();
  const timeLabel = now.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Keep this action best-effort on the landing flow.
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#FFF6E4,#FFFCEB)] px-4 pb-12 pt-24">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card variant="elevated" className={config.tone}>
            <CardContent className="space-y-6 pt-8 text-center">
              <div className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/70 shadow-sm">
                {config.icon}
              </div>
              <div className="space-y-3">
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${config.badge}`}>
                  ความเชื่อมั่น {confidence}%
                </span>
                <h1 className="text-3xl font-extrabold text-dark sm:text-4xl">{config.title}</h1>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-primary-0">{config.summary}</p>
              </div>
              <div className="rounded-2xl border border-gray-primary-1 bg-white/80 px-4 py-4 text-left">
                <p className="text-sm font-semibold text-dark">URL ที่ตรวจสอบ</p>
                <p className="mt-2 break-all font-mono text-sm text-gray-primary-0">{url}</p>
                <p className="mt-2 text-xs text-gray-primary-0">ตรวจสอบเมื่อ {timeLabel}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>ควรทำอะไรต่อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.nextSteps.map((step) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl border border-gray-primary-1 bg-light px-4 py-3">
                  <AlertTriangle size={16} className="mt-1 text-primary-dark" />
                  <p className="text-sm leading-relaxed text-dark">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>รายละเอียดการประเมิน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-primary-0">
              <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4">
                <p className="font-semibold text-dark">คำอธิบายสั้น ๆ</p>
                <p className="mt-2 leading-relaxed">{config.detail}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4">
                  <p className="text-xs uppercase tracking-wide">แหล่งตรวจสอบ</p>
                  <p className="mt-2 font-medium text-dark">{model}</p>
                </div>
                <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4">
                  <p className="text-xs uppercase tracking-wide">ข้อควรทราบ</p>
                  <p className="mt-2 font-medium text-dark">
                    {verdict === 'Benign' ? 'ยังควรตรวจสอบโดเมนด้วยตัวเองก่อนกรอกข้อมูลสำคัญ' : 'หลีกเลี่ยงการเปิดต่อจนกว่าจะยืนยันแหล่งที่มาได้'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button type="button" variant="outline" className="sm:flex-1" onClick={onBack}>
            กลับไปตรวจสอบ URL อื่น
          </Button>
          <Button type="button" variant="secondary" className="sm:flex-1" onClick={() => void handleCopy()}>
            <Copy size={16} />
            คัดลอก URL นี้
          </Button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="sm:flex-1">
            <Button type="button" variant={verdict === 'Benign' ? 'primary' : 'danger'} className="w-full">
              <ExternalLink size={16} />
              {verdict === 'Benign' ? 'เปิดลิงก์ในแท็บใหม่' : 'เปิดต่อด้วยความระมัดระวัง'}
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  );
};
