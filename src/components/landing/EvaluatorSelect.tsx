'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bot, Fish, Warehouse, ShieldCheck, Search, ChevronDown } from 'lucide-react';
import { evaluatorOptions } from '@/libs/utils/mockData';
import { EvaluatorOption } from '@/libs/utils/types';

const iconMap: Record<string, React.ReactNode> = {
  bot: <Bot size={16} />,
  fish: <Fish size={16} />,
  warehouse: <Warehouse size={16} />,
  'shield-check': <ShieldCheck size={16} />,
  search: <Search size={16} />,
};

interface EvaluatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const EvaluatorSelect: React.FC<EvaluatorSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const selectedOption = evaluatorOptions.find((opt) => opt.value === value) || evaluatorOptions[1];

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

  const handleSelect = (option: EvaluatorOption) => {
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
        aria-label="เลือกเอนจินหรือแหล่งประเมิน URL"
        className={`flex min-h-11 items-center gap-2 rounded-2xl border px-3.5 py-2 text-left text-[13px] font-semibold text-dark shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isOpen
            ? 'border-primary bg-primary-light'
            : 'border-primary/20 bg-white hover:border-primary/60 hover:bg-primary-light/40'
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-dark text-white">
          {selectedOption.icon ? iconMap[selectedOption.icon] : <ShieldCheck size={16} />}
        </span>
        <span className="flex flex-col">
          <span>{selectedOption.label}</span>
          <span className="text-[11px] font-normal text-gray-primary-0">
            {selectedOption.tag || 'Threat source'}
          </span>
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
            <div role="listbox" aria-label="รายการเครื่องมือตรวจสอบ URL" className="p-2">
              {evaluatorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => handleSelect(option)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    value === option.value
                      ? 'bg-primary-light text-primary-dark'
                      : 'text-dark hover:bg-primary-light/50'
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                    {option.icon ? iconMap[option.icon] : <ShieldCheck size={16} />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">{option.label}</span>
                    <span className="mt-0.5 block text-[12px] font-normal leading-5 text-gray-primary-0">
                      {option.tag || 'External threat intelligence source'}
                    </span>
                  </span>
                  {option.tag ? (
                    <span className="rounded-full bg-gray-primary-light px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-primary-dark">
                      {option.tag}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
