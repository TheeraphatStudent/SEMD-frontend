'use client';

import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface UseRecaptchaOptions {
  action: string;
}

interface UseRecaptchaReturn {
  executeRecaptcha: () => Promise<string | null>;
  isReady: boolean;
  error: string | null;
}

const RECAPTCHA_SCRIPT_ID = 'recaptcha-v3-script';

export function useRecaptcha({ action }: UseRecaptchaOptions): UseRecaptchaReturn {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      setError('reCAPTCHA site key is not configured');
      return;
    }

    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (existingScript) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsReady(true);
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
    };

    script.onerror = () => {
      setError('Failed to load reCAPTCHA script');
    };

    document.head.appendChild(script);

    return () => {
    };
  }, [siteKey]);

  const executeRecaptcha = useCallback(async (): Promise<string | null> => {
    if (!siteKey) {
      setError('reCAPTCHA site key is not configured');
      return null;
    }

    if (!isReady || !window.grecaptcha) {
      setError('reCAPTCHA is not ready');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute reCAPTCHA';
      setError(errorMessage);
      return null;
    }
  }, [siteKey, action, isReady]);

  return {
    executeRecaptcha,
    isReady,
    error,
  };
}

