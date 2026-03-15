'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingViewProps {
  url: string;
  model: string;
  onComplete: () => void;
}

type StepStatus = 'pending' | 'active' | 'done';

interface Step {
  id: number;
  label: string;
  status: StepStatus;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ url, model, onComplete }) => {
  useEffect(() => {
    setTimeout(() => {
        onComplete();
      }, 2800)

  }, [onComplete]);

  const getDotClass = (status: StepStatus) => {
    switch (status) {
      case 'done':
        return 'bg-safe';
      case 'active':
        return 'bg-primary animate-pulse';
      default:
        return 'bg-gray-primary-light';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#FFF6E4,#FFFCEB)] gap-7 p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[20px] p-12 shadow-xl border border-gray-primary text-center max-w-[460px] w-full"
      >
        <div className="font-mono text-[13px] text-secondary-dark bg-gray-primary-light px-4 py-2 rounded-lg mb-7 break-all text-left leading-relaxed">
          {url}
        </div>

        <div className="w-20 h-20 rounded-full border-4 border-gray-primary-light border-t-primary border-r-primary-dark animate-spin mx-auto mb-6" />

        <h2 className="text-xl font-extrabold mb-2 text-dark">กำลังวิเคราะห์ URL</h2>
        <p className="text-[13.5px] text-gray-primary-dark leading-relaxed mb-6">
          ระบบกำลังดึง Feature และประเมินด้วย Machine Learning<br />
          กรุณารอสักครู่…
        </p>
      </motion.div>
    </div>
  );
};
