'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useToast, ToastType } from '@/hooks/use-toast';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const variants: Record<ToastType, string> = {
  success: 'bg-accent-light-green border-accent-green text-accent-green',
  error: 'bg-accent-light-red border-accent-red text-accent-red',
  warning: 'bg-accent-light-orange border-warning text-warning',
  info: 'bg-accent-light-sky border-accent-sky text-accent-sky',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border shadow-xl',
            'min-w-[300px] max-w-md',
            'animate-in slide-in-from-right',
            variants[toast.type]
          )}
        >
          <div className="flex-shrink-0">
            {icons[toast.type]}
          </div>
          
          <p className="flex-1 text-sm font-medium text-dark">
            {toast.message}
          </p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-primary-0 hover:text-dark transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
