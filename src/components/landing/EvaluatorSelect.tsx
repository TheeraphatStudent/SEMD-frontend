'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Fish, Warehouse, ShieldCheck, Search, ChevronDown } from 'lucide-react';
import { evaluatorOptions } from '@/lib/mockData';
import { EvaluatorOption } from '@/lib/types';

const iconMap: Record<string, React.ReactNode> = {
  'bot': <Bot size={14} />,
  'fish': <Fish size={14} />,
  'warehouse': <Warehouse size={14} />,
  'shield-check': <ShieldCheck size={14} />,
  'search': <Search size={14} />,
};

interface EvaluatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const EvaluatorSelect: React.FC<EvaluatorSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = evaluatorOptions.find(opt => opt.value === value) || evaluatorOptions[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: EvaluatorOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-[6px] bg-primary-light border border-primary rounded-full px-3 py-[6px] text-[12px] font-semibold text-dark cursor-pointer whitespace-nowrap transition-all hover:bg-primary ${isOpen ? 'bg-primary border-primary-dark' : ''}`}
      >
        <span className="text-primary-dark">{selectedOption.icon ? iconMap[selectedOption.icon] : null}</span>
        <span>
          {selectedOption.label}
          {selectedOption.tag && ` (${selectedOption.tag})`}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-[calc(100%+6px)] left-0 min-w-[220px] bg-white border border-gray-primary rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {evaluatorOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 px-4 py-[10px] text-[13px] font-medium cursor-pointer transition-colors border-b border-gray-primary-light last:border-b-0 hover:bg-primary-light text-left ${
                  value === option.value ? 'bg-primary-light font-bold text-primary-dark' : ''
                }`}
              >
                <span className="text-primary-dark">{option.icon ? iconMap[option.icon] : null}</span>
                <span>{option.label}</span>
                {option.tag && (
                  <span className="text-[10px] text-gray-primary-dark bg-gray-primary-light px-[7px] py-[2px] rounded-full ml-auto">
                    {option.tag}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
