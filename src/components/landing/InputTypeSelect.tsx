'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { inputTypeOptions } from '@/libs/utils/mockData';
import { InputType, InputTypeOption } from '@/libs/utils/types';

const iconMap: Record<string, React.ReactNode> = {
  link: <Link size={16} />,
  'file-spreadsheet': <FileSpreadsheet size={16} />,
  'file-text': <FileText size={16} />,
};

interface InputTypeSelectProps {
  value: InputType;
  onChange: (value: InputType) => void;
}

export const InputTypeSelect: React.FC<InputTypeSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const selectedOption = inputTypeOptions.find((opt) => opt.value === value) || inputTypeOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSelect = (option: InputTypeOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative z-20">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="เลือกรูปแบบข้อมูลที่ต้องการตรวจสอบ"
        className={`flex min-h-11 items-center gap-2 rounded-2xl border px-3.5 py-2 text-left text-[13px] font-semibold text-dark shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isOpen
            ? 'border-primary bg-primary-light'
            : 'border-gray-primary bg-white hover:border-primary/60 hover:bg-primary-light/40'
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
          {iconMap[selectedOption.icon]}
        </span>
        <span className="flex flex-col">
          <span>{selectedOption.label}</span>
          <span className="text-[11px] font-normal text-gray-primary-0">รูปแบบข้อมูลนำเข้า</span>
        </span>
        <ChevronDown
          size={14}
          className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[300px] overflow-hidden rounded-2xl border border-gray-primary bg-white shadow-2xl"
          >
            <div role="listbox" aria-label="รายการรูปแบบข้อมูลที่รองรับ" className="p-2">
              {inputTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => handleSelect(option)}
                  className={`flex min-h-12 w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    value === option.value
                      ? 'bg-primary-light text-primary-dark'
                      : 'text-dark hover:bg-primary-light/50'
                  }`}
                >
                  <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                    {iconMap[option.icon]}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">{option.label}</span>
                    <span className="mt-0.5 block text-[12px] font-normal leading-5 text-gray-primary-0">
                      {option.desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
