'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Badge, Avatar, Progress, Table, TableHeader, TableBody, TableRow as UITableRow, TableHead, TableCell, Text, Pulse, SectionHeader, Container } from '@/components/ui';
import { mockRows, reporterColors } from '@/lib/mockData';
import { URLRow, Verdict } from '@/lib/types';

type FilterType = 'all' | Verdict;

const LiveDot: React.FC = () => (
  <Pulse size="sm" variant="success" />
);

const verdictLabels: Record<Verdict, string> = {
  Safe: '✅ Safe',
  Danger: '🚨 Danger',
  Warning: '⚠️ Warning',
};

const typeLabels: Record<string, string> = {
  Phishing: 'Phishing',
  Malware: 'Malware',
  Scam: 'Scam',
  Suspicious: 'Suspicious',
  Legitimate: 'Legitimate',
};

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const styles: Record<string, string> = {
    Phishing: 'bg-accent-light-red text-gray-accent-red border-[#F0BBBB]',
    Malware: 'bg-accent-light-red text-gray-accent-red border-[#F0BBBB]',
    Scam: 'bg-accent-light-orange text-primary-dark border-[#F0D5A0]',
    Suspicious: 'bg-accent-light-orange text-primary-dark border-[#F0D5A0]',
    Legitimate: 'bg-accent-light-green text-gray-accent-green border-[#B0D9A0]',
  };

  return (
    <Badge variant="default" className={`inline-flex items-center gap-1 rounded-full px-[10px] py-[3px] text-[11px] font-bold border whitespace-nowrap ${styles[type] || ''}`}>
      {typeLabels[type] || type}
    </Badge>
  );
};

const VerdictBadge: React.FC<{ verdict: Verdict }> = ({ verdict }) => {
  const styles: Record<Verdict, string> = {
    Safe: 'bg-accent-light-green text-safe border-safe',
    Danger: 'bg-accent-light-red text-danger border-danger',
    Warning: 'bg-accent-light-orange text-primary-dark border-warning',
  };

  return (
    <Badge variant="default" className={`inline-flex items-center gap-1 rounded-full px-[10px] py-[3px] text-[11px] font-bold border whitespace-nowrap ${styles[verdict]}`}>
      {verdictLabels[verdict]}
    </Badge>
  );
};

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 150);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClass = value >= 80 ? 'bg-safe' : value >= 60 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="flex items-center gap-[7px]">
      <div className="w-[55px] h-[5px] bg-gray-primary rounded-[3px] overflow-hidden">
        <div 
          className={`h-full rounded-[3px] transition-all duration-[900ms] ease-out ${colorClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-[11.5px] font-bold">{value}%</span>
    </div>
  );
};

const DemoTableRow: React.FC<{ row: URLRow; index: number }> = ({ row, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const borderClass: Record<Verdict, string> = {
    Safe: 'border-l-[3px] border-l-safe',
    Danger: 'border-l-[3px] border-l-danger',
    Warning: 'border-l-[3px] border-l-warning',
  };

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: index * 0.055 }}
        className={`border-b border-gray-primary-light cursor-pointer transition-colors hover:bg-[#FFFBF0] ${borderClass[row.verdict]} ${isExpanded ? 'bg-primary-light' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-[14px] py-[9px] text-center text-[11px] text-gray-primary-dark">{row.id}</td>
        <td className="px-[14px] py-[9px]">
          <div className="relative group">
            <span className="block font-mono text-[11px] text-secondary-dark max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
              {row.url}
            </span>
            <div className="absolute bottom-full left-0 mb-[5px] bg-dark text-primary text-[10.5px] px-[10px] py-1 rounded-md whitespace-nowrap max-w-[300px] overflow-hidden text-ellipsis font-mono opacity-0 group-hover:opacity-100 translate-y-[3px] group-hover:translate-y-0 transition-all duration-150 z-30 pointer-events-none">
              {row.url}
            </div>
          </div>
        </td>
        <td className="px-[14px] py-[9px] text-[11.5px] text-gray-primary-dark whitespace-nowrap hidden md:table-cell">{row.date}</td>
        <td className="px-[14px] py-[9px]"><TypeBadge type={row.type} /></td>
        <td className="px-[14px] py-[9px]"><VerdictBadge verdict={row.verdict} /></td>
        <td className="px-[14px] py-[9px]"><ConfidenceBar value={row.conf} /></td>
        <td className="px-[14px] py-[9px] hidden md:table-cell">
          <div className="inline-flex items-center gap-1">
            <span 
              className="w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[9.5px] font-extrabold text-dark mr-1"
              style={{ background: reporterColors[row.reporter] || '#EBE1D5' }}
            >
              {row.reporter[0].toUpperCase()}
            </span>
            <span className="text-[12px]">{row.reporter}</span>
          </div>
        </td>
      </motion.tr>
      <AnimatePresence>
        {isExpanded && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary-light border-t border-dashed border-gray-primary"
          >
            <td colSpan={7} className="p-0">
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-[14px_18px] grid grid-cols-3 gap-[10px]"
              >
                <div>
                  <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Full URL</label>
                  <span className="font-mono text-[11px] break-all">{row.url}</span>
                </div>
                <div>
                  <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Submitted</label>
                  <span className="text-[12.5px] font-semibold">{row.date}</span>
                </div>
                <div>
                  <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Reporter</label>
                  <span className="text-[12.5px] font-semibold">{row.reporter}</span>
                </div>
                <div>
                  <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">ML Verdict</label>
                  <VerdictBadge verdict={row.verdict} />
                </div>
                <div>
                  <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Confidence</label>
                  <span className="text-[18px] font-extrabold">{row.conf}%</span>
                </div>
                <div>
                  <label className="text-[9.5px] font-extrabold text-gray-primary-dark uppercase tracking-wider block mb-[3px]">Threat Type</label>
                  <TypeBadge type={row.type} />
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};

export const DemoTableSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [filter, setFilter] = useState<FilterType>('all');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const filteredRows = filter === 'all' 
    ? mockRows 
    : mockRows.filter(row => row.verdict === filter);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 4;
    setIsScrolledToBottom(isAtBottom);
  };

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: '✅ Safe', value: 'Safe' },
    { label: '🚨 Danger', value: 'Danger' },
    { label: '⚠️ Warning', value: 'Warning' },
  ];

  return (
    <section ref={ref} id="demo" className="py-20 bg-background">
      <Container size="xl">
        <SectionHeader
          badge={
            <span className="inline-flex items-center gap-2">
              <LiveDot />
              Live Preview
            </span>
          }
          title="ดูตัวอย่างรายงาน URL จริง"
          description="วางเมาส์เพื่อดูรายละเอียด · คลิกแถวเพื่อขยายข้อมูล · กรองตามผลลัพธ์"
          align="center"
          animated={isInView}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto bg-white rounded-[18px] border border-gray-primary shadow-xl overflow-hidden mt-9"
        >
          <div className="bg-gray-primary-light px-4 py-[9px] flex items-center gap-2 border-b border-gray-primary">
            <div className="w-[10px] h-[10px] rounded-full bg-danger" />
            <div className="w-[10px] h-[10px] rounded-full bg-warning" />
            <div className="w-[10px] h-[10px] rounded-full bg-safe" />
            <div className="flex-1 bg-white border border-gray-primary rounded-md px-3 py-[3px] text-[11.5px] text-gray-primary-dark font-mono ml-2">
              semd.app/dashboard/reports
            </div>
          </div>

          <div className="flex items-center justify-between px-[18px] py-3 border-b border-gray-primary bg-light flex-wrap gap-2">
            <div className="flex items-center gap-[10px]">
              <span className="text-[14.5px] font-bold">รายงานล่าสุด</span>
              <span className="bg-primary-light text-primary-dark text-[11px] font-bold px-[9px] py-[2px] rounded-full">
                {filteredRows.length} รายการ
              </span>
              <LiveDot />
            </div>
            <div className="flex gap-[6px] flex-wrap">
              {filterButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-3 py-[5px] rounded-[7px] text-[12px] font-semibold border transition-all cursor-pointer ${
                    filter === btn.value
                      ? 'bg-primary text-dark border-primary'
                      : 'bg-gray-primary-light text-gray-primary-dark border-gray-primary hover:bg-primary hover:text-dark hover:border-primary'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
              <button className="px-3 py-[5px] rounded-[7px] text-[12px] font-semibold bg-dark text-primary border-dark">
                + เพิ่ม URL
              </button>
            </div>
          </div>

          <div className="relative">
            <div 
              className="max-h-[320px] overflow-y-auto"
              onScroll={handleScroll}
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFCE69 #FFF6E4' }}
            >
              <table className="w-full border-collapse text-[12.5px]">
                <thead>
                  <tr>
                    <th className="bg-primary text-dark px-[14px] py-[9px] font-bold sticky top-0 z-[2] whitespace-nowrap w-10 text-center">#</th>
                    <th className="bg-primary text-dark px-[14px] py-[9px] text-left font-bold sticky top-0 z-[2] whitespace-nowrap">URL</th>
                    <th className="bg-primary text-dark px-[14px] py-[9px] text-left font-bold sticky top-0 z-[2] whitespace-nowrap hidden md:table-cell">วันที่</th>
                    <th className="bg-primary text-dark px-[14px] py-[9px] text-left font-bold sticky top-0 z-[2] whitespace-nowrap">ประเภท</th>
                    <th className="bg-primary text-dark px-[14px] py-[9px] text-left font-bold sticky top-0 z-[2] whitespace-nowrap">ผลลัพธ์</th>
                    <th className="bg-primary text-dark px-[14px] py-[9px] text-left font-bold sticky top-0 z-[2] whitespace-nowrap">ความมั่นใจ</th>
                    <th className="bg-primary text-dark px-[14px] py-[9px] text-left font-bold sticky top-0 z-[2] whitespace-nowrap hidden md:table-cell">ผู้รายงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, index) => (
                    <DemoTableRow key={row.id} row={row} index={index} />
                  ))}
                </tbody>
              </table>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-11 bg-gradient-to-t from-[rgba(255,246,228,0.9)] to-transparent pointer-events-none"
              animate={{ opacity: isScrolledToBottom ? 0 : [1, 0.25, 1] }}
              transition={{ duration: 2, repeat: isScrolledToBottom ? 0 : Infinity }}
            />
          </div>

          <div className="flex items-center justify-between px-[18px] py-[9px] border-t border-gray-primary bg-light text-[12px] text-gray-primary-dark">
            <span>แสดง 1–{filteredRows.length} จาก {filteredRows.length} รายการ</span>
            <div className="flex gap-1">
              <button className="w-[27px] h-[27px] rounded-md border border-gray-primary bg-white text-[12px] flex items-center justify-center cursor-pointer hover:bg-gray-primary-light">‹</button>
              <button className="w-[27px] h-[27px] rounded-md border border-primary bg-primary text-dark text-[12px] font-bold flex items-center justify-center cursor-pointer">1</button>
              <button className="w-[27px] h-[27px] rounded-md border border-gray-primary bg-white text-[12px] flex items-center justify-center cursor-pointer hover:bg-gray-primary-light">2</button>
              <button className="w-[27px] h-[27px] rounded-md border border-gray-primary bg-white text-[12px] flex items-center justify-center cursor-pointer hover:bg-gray-primary-light">›</button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
