'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/libs/utils/utils';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [localValues, setLocalValues] = useState<string[]>(
    value.split('').concat(Array(length).fill('')).slice(0, length)
  );

  useEffect(() => {
    const newValues = value.split('').concat(Array(length).fill('')).slice(0, length);
    setLocalValues(newValues);
  }, [value, length]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    
    if (inputValue.length === 0) {
      const newValues = [...localValues];
      newValues[index] = '';
      setLocalValues(newValues);
      onChange(newValues.join(''));
      return;
    }

    if (inputValue.length === 1) {
      const newValues = [...localValues];
      newValues[index] = inputValue;
      setLocalValues(newValues);
      onChange(newValues.join(''));
      
      if (index < length - 1) {
        focusInput(index + 1);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!localValues[index] && index > 0) {
        focusInput(index - 1);
        const newValues = [...localValues];
        newValues[index - 1] = '';
        setLocalValues(newValues);
        onChange(newValues.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newValues = pastedData.split('').concat(Array(length).fill('')).slice(0, length);
    setLocalValues(newValues);
    onChange(newValues.join(''));
    
    const nextEmptyIndex = newValues.findIndex(v => !v);
    if (nextEmptyIndex >= 0) {
      focusInput(nextEmptyIndex);
    } else {
      focusInput(length - 1);
    }
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={localValues[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={`
            w-[52px] h-14 text-center text-2xl font-bold
            border-2 rounded-xl outline-none transition-all duration-200
            font-display text-brown
            ${localValues[index] 
              ? 'border-amber-deep bg-amber-pale' 
              : 'border-gray-300 bg-white'
            }
            focus:border-amber focus:shadow-[0_0_0_3px_rgba(245,185,66,0.2)] focus:bg-amber-pale focus:scale-105
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;
