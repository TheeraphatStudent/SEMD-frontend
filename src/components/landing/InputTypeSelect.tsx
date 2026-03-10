'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { inputTypeOptions } from '@/lib/mockData';
import { InputType, InputTypeOption } from '@/lib/types';

const iconMap: Record<string, React.ReactNode> = {
  'link': <Link size={14} />,
  'file-spreadsheet': <FileSpreadsheet size={14} />,
  'file-text': <FileText size={14} />,
};

interface InputTypeSelectProps {
  value: InputType;
  onChange: (value: InputType) => void;
}

export const InputTypeSelect: React.FC<InputTypeSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = inputTypeOptions.find(opt => opt.value === value) || inputTypeOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: InputTypeOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-[6px] bg-white border border-gray-primary rounded-full px-3 py-[6px] text-[12px] font-semibold text-dark cursor-pointer whitespace-nowrap transition-all hover:border-primary hover:bg-primary-light ${isOpen ? 'border-primary bg-primary-light' : ''}`}
      >
        <span className="text-primary-dark">{iconMap[selectedOption.icon]}</span>
        <span>{selectedOption.label}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-[calc(100%+6px)] left-0 min-w-[260px] bg-white border border-gray-primary rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {inputTypeOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`flex items-start gap-3 px-4 py-3 text-[13px] font-medium cursor-pointer transition-colors border-b border-gray-primary-light last:border-b-0 hover:bg-primary-light text-left ${
                  value === option.value ? 'bg-primary-light font-bold text-primary-dark' : ''
                }`}
              >
                <span className="text-primary-dark mt-[2px]">{iconMap[option.icon]}</span>
                <div className="text-left">
                  <div className="font-bold">{option.label}</div>
                  <div className="text-[11px] text-gray-primary-dark font-normal">{option.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
