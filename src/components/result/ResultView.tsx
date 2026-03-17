'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Verdict } from '@/libs/utils/types';

interface ResultViewProps {
  url: string;
  verdict: Verdict;
  confidence: number;
  model: string;
  onBack: () => void;
}

const verdictConfig: Record<Verdict, {
  bannerClass: string;
  iconRingClass: string;
  icon: string;
  title: string;
  recommendations: string[];
  extra: string;
}> = {
  Benign: {
    bannerClass: 'bg-gradient-to-br from-accent-light-green via-white to-accent-light-green',
    iconRingClass: 'bg-accent-light-green',
    icon: '✅',
    title: 'URL ปลอดภัย',
    recommendations: [
      '✅ URL นี้ถูกตรวจสอบแล้วและปลอดภัย',
      '✅ คุณสามารถเข้าชม URL นี้ได้',
      '⚠️ แต่ควรระมัดระวังเสมอเมื่อกรอกข้อมูลส่วนตัว',
    ],
    extra: 'URL นี้ผ่านการตรวจสอบจาก ML Model แล้วไม่พบลักษณะที่เป็นอันตราย อย่างไรก็ตามควรระมัดระวังการกรอกข้อมูลส่วนตัวทุกครั้ง',
  },
  Malicious: {
    bannerClass: 'bg-gradient-to-br from-accent-light-red via-white to-accent-light-red',
    iconRingClass: 'bg-accent-light-red',
    icon: '🚨',
    title: 'URL อันตราย',
    recommendations: [
      '🚫 ห้ามเข้าเว็บไซต์นี้โดยเด็ดขาด',
      '🔒 อย่ากรอกข้อมูลส่วนตัวหรือรหัสผ่าน',
      '⚠️ แจ้งเตือนผู้ส่งลิงก์ให้ทราบ',
      '🛡️ แสกน Malware บนเครื่องของคุณ',
    ],
    extra: 'URL นี้มีลักษณะที่ตรงกับ Pattern ของเว็บไซต์ Phishing หรือ Malware ที่ระบบตรวจพบ ควรหลีกเลี่ยงและไม่แชร์ลิงก์นี้ต่อ',
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
  const dateStr = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const displayUrl = url.length > 60 ? url.substring(0, 57) + '…' : url;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#FFF6E4,#FFFCEB)] p-6 pt-20 gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[680px] bg-white rounded-[20px] shadow-xl border border-gray-primary overflow-hidden"
      >
        <div className={`${config.bannerClass} px-8 py-9 flex flex-col items-center text-center relative overflow-hidden`}>
          <div className={`w-[72px] h-[72px] rounded-full ${config.iconRingClass} flex items-center justify-center text-[34px] mb-4 shadow-[0_0_0_6px_rgba(255,255,255,0.7)]`}>
            {config.icon}
          </div>
          <h2 className="text-[26px] font-extrabold mb-1 text-dark">{config.title}</h2>
          <p className="text-[15px] text-gray-primary-dark">
            ความแม่นยำ: <b className="text-dark">{confidence}%</b>
          </p>
          <div className="flex items-center gap-[6px] mt-[14px] font-mono text-[12.5px] text-secondary-dark bg-white/70 px-[14px] py-[5px] rounded-lg max-w-full break-all">
            🔗 {displayUrl}
          </div>
          <p className="text-[11px] text-gray-primary-dark mt-[6px]">
            ตรวจสอบเมื่อ {dateStr} เวลา {timeStr}
          </p>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-primary-light rounded-xl p-[18px]">
            <h4 className="text-[11px] font-extrabold text-gray-primary-dark uppercase tracking-wider mb-[14px]">
              รายละเอียดการตรวจสอบ
            </h4>
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-start gap-[10px]">
                <span className="text-[14px] flex-shrink-0 mt-[1px]">🔘</span>
                <div>
                  <div className="text-[11px] text-gray-primary-dark">สถานะ</div>
                  <div className="text-[13.5px] font-bold">{config.title}</div>
                </div>
              </div>
              <div className="flex items-start gap-[10px]">
                <span className="text-[14px] flex-shrink-0 mt-[1px]">👤</span>
                <div>
                  <div className="text-[11px] text-gray-primary-dark">ตรวจสอบโดย</div>
                  <div className="text-[13.5px] font-bold">{model}</div>
                </div>
              </div>
              <div className="flex items-start gap-[10px]">
                <span className="text-[14px] flex-shrink-0 mt-[1px]">📅</span>
                <div>
                  <div className="text-[11px] text-gray-primary-dark">วันที่ตรวจสอบ</div>
                  <div className="text-[13.5px] font-bold">{now.toLocaleDateString('th-TH')} {timeStr}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-primary-light rounded-xl p-[18px]">
            <h4 className="text-[11px] font-extrabold text-gray-primary-dark uppercase tracking-wider mb-[14px]">
              คำแนะนำ
            </h4>
            <div className="flex flex-col gap-[7px]">
              {config.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[13px] text-gray-primary-dark leading-relaxed">
                  <span className="flex-shrink-0 mt-[1px]">{rec.substring(0, 2)}</span>
                  <span>{rec.substring(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-[680px] bg-white rounded-[14px] p-5 shadow-sm border-2 border-primary"
      >
        <h4 className="text-[11px] font-extrabold text-primary-dark uppercase tracking-wider mb-[10px]">
          คำแนะนำเพิ่มเติม
        </h4>
        <p className="text-[13.5px] text-gray-primary-dark leading-relaxed">
          {config.extra}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-3 w-full max-w-[680px]"
      >
        <button
          onClick={onBack}
          className="flex-1 bg-white text-dark border-[1.5px] border-gray-primary px-3 py-3 rounded-[10px] text-[14px] font-semibold cursor-pointer transition-colors hover:bg-gray-primary-light"
        >
          ◀ หน้าหลัก
        </button>
        <button
          className="flex-1 bg-secondary-dark text-white border-none px-3 py-3 rounded-[10px] text-[14px] font-bold cursor-pointer transition-opacity hover:opacity-90"
        >
          ✈️ แชร์ผลลัพธ์
        </button>
      </motion.div>
    </div>
  );
};
