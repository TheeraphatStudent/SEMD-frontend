'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface LoadingViewProps {
  url: string;
  model: string;
  onComplete: () => void;
}

type StepStatus = 'pending' | 'active' | 'done';

const STEP_LABELS = [
  'กำลังตรวจสอบรูปแบบ URL',
  'กำลังส่ง URL ไปยังบริการตรวจสอบ',
  'กำลังวิเคราะห์ผลลัพธ์',
  'กำลังเตรียมคำแนะนำ',
];

export const LoadingView: React.FC<LoadingViewProps> = ({ url, model, onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timers = STEP_LABELS.map((_, index) => (
      window.setTimeout(() => {
        setActiveIndex(index);
      }, index * 700)
    ));

    const completionTimer = window.setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completionTimer);
    };
  }, [onComplete]);

  const steps = useMemo(() => (
    STEP_LABELS.map((label, index) => ({
      label,
      status: index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending',
    }))
  ), [activeIndex]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#FFF6E4,#FFFCEB)] p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl rounded-[24px] border border-gray-primary-1 bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary-dark">SEMD กำลังตรวจสอบ URL</p>
            <h2 className="mt-1 text-2xl font-extrabold text-dark">ขอเวลาอีกเล็กน้อย</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-primary-0">
              เรากำลังประมวลผลจากบริการตรวจสอบและจะสรุปผลพร้อมคำแนะนำให้คุณทันทีเมื่อข้อมูลพร้อม
            </p>
          </div>
          <div className="rounded-2xl bg-primary-light px-4 py-3 text-sm text-primary-dark">
            <div className="font-semibold">แหล่งวิเคราะห์</div>
            <div className="mt-1 break-words">{model}</div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-primary-1 bg-gray-primary-2/50 px-4 py-4 font-mono text-sm text-dark break-all">
          {url}
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.label}
              className="flex items-start gap-3 rounded-2xl border border-gray-primary-1 bg-light px-4 py-4"
            >
              <div className="mt-0.5">
                {step.status === 'done' ? (
                  <CheckCircle2 size={18} className="text-safe" />
                ) : (
                  <Loader2 size={18} className={step.status === 'active' ? 'animate-spin text-primary-dark' : 'text-gray-primary-0'} />
                )}
              </div>
              <div>
                <p className="font-medium text-dark">{step.label}</p>
                <p className="mt-1 text-sm text-gray-primary-0">
                  {step.status === 'done'
                    ? 'ขั้นตอนนี้เสร็จแล้ว'
                    : step.status === 'active'
                      ? 'กำลังดำเนินการอยู่'
                      : 'รอขั้นตอนก่อนหน้าเสร็จสิ้น'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
