'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/libs/utils/utils';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'w-full px-4 py-2 pr-12 rounded-lg border transition-all duration-200',
              'bg-light text-dark placeholder:text-gray-primary-0',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              error
                ? 'border-accent-red focus:ring-accent-red'
                : 'border-gray-primary-1 hover:border-gray-primary-0',
              'disabled:bg-gray-primary-2 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-primary-0 hover:text-dark transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {showPassword ? (
                <motion.div
                  key="eye-off"
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <EyeOff size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="eye"
                  initial={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <Eye size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        {error && (
          <p className="mt-1 text-sm text-accent-red">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-primary-0">{helperText}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
