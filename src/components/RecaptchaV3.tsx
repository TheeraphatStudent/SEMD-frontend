'use client';

import React, { useEffect, useState } from 'react';
import { useRecaptcha } from '@/hooks/use-recaptcha';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface RecaptchaV3Props {
  action: 'login' | 'register';
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
}

export const RecaptchaV3: React.FC<RecaptchaV3Props> = ({
  action,
  onVerify,
  onError,
}) => {
  const { executeRecaptcha, isReady, error } = useRecaptcha({ action });
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (error && onError) {
      onError(error);
      setIsLoading(false);
    }
  }, [error, onError]);

  useEffect(() => {
    const getToken = async () => {
      if (isReady) {
        setIsLoading(true);
        const token = await executeRecaptcha();
        if (token) {
          onVerify(token);
          setIsVerified(true);
        }
        setIsLoading(false);
      }
    };

    getToken();
  }, [isReady, executeRecaptcha, onVerify]);

  return (
    <div className="mt-3 text-start">
      <div className="flex items-center justify-center gap-2 mb-2">
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin text-amber-500" />
            <span className="text-[11px] text-gray-500 font-medium">
              กำลังตรวจสอบความปลอดภัย...
            </span>
          </>
        ) : isVerified ? (
          <>
            <ShieldCheck size={14} className="text-green-500" />
            <span className="text-[11px] text-green-600 font-medium">
              ยืนยันความปลอดภัยแล้ว
            </span>
          </>
        ) : error ? (
          <span className="text-[11px] text-red-500 font-medium">
            ไม่สามารถตรวจสอบได้
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-center gap-2">
        <img
          src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
          alt="reCAPTCHA"
          className="w-4 h-4"
        />
        <p className="text-[10px] text-gray-400 leading-relaxed">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      </div>
    </div>
  );
};

export default RecaptchaV3;
