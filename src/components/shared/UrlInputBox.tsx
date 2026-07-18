'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, FileText, HelpCircle, Info, ShieldCheck, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EvaluatorSelect } from '@/components/landing/EvaluatorSelect';
import { InputTypeSelect } from '@/components/landing/InputTypeSelect';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { alert } from '@/libs/utils/alert';
import { CheckInput, InputType } from '@/libs/utils/types';
import { inputTypeOptions } from '@/libs/utils/mockData';
import { isValidUrl } from '@/libs/utils/utils';

interface UrlInputBoxProps {
  onCheck?: (input: CheckInput) => void;
  variant?: 'landing' | 'dashboard';
  className?: string;
  autoFocus?: boolean;
}

const STORAGE_KEYS = {
  PENDING_URL: 'semd_pending_url',
  PENDING_FILE: 'semd_pending_file',
  PENDING_INPUT_TYPE: 'semd_pending_input_type',
  PENDING_EVALUATOR: 'semd_pending_evaluator',
};

export const UrlInputBox: React.FC<UrlInputBoxProps> = ({
  onCheck,
  variant = 'landing',
  className = '',
  autoFocus = false,
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [evaluator, setEvaluator] = useState('semd-0.2');
  const [inputType, setInputType] = useState<InputType>('url');
  const [urlValue, setUrlValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const currentOption = inputTypeOptions.find((opt) => opt.value === inputType);
  const supportsFile = currentOption?.supportsFile ?? false;
  const isLandingPage = variant === 'landing';

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const pendingUrl = localStorage.getItem(STORAGE_KEYS.PENDING_URL);
    const pendingFile = localStorage.getItem(STORAGE_KEYS.PENDING_FILE);
    const pendingInputType = localStorage.getItem(STORAGE_KEYS.PENDING_INPUT_TYPE) as InputType;
    const pendingEvaluator = localStorage.getItem(STORAGE_KEYS.PENDING_EVALUATOR);

    if (pendingUrl) {
      setUrlValue(pendingUrl);
      localStorage.removeItem(STORAGE_KEYS.PENDING_URL);
    }
    if (pendingFile) {
      setTextValue(pendingFile);
      localStorage.removeItem(STORAGE_KEYS.PENDING_FILE);
    }
    if (pendingInputType) {
      setInputType(pendingInputType);
      localStorage.removeItem(STORAGE_KEYS.PENDING_INPUT_TYPE);
    }
    if (pendingEvaluator) {
      setEvaluator(pendingEvaluator);
      localStorage.removeItem(STORAGE_KEYS.PENDING_EVALUATOR);
    }

    if (variant === 'dashboard' && (pendingUrl || pendingFile)) {
      setTimeout(() => {
        handleSubmit();
      }, 500);
    }
  }, [variant]);

  const savePendingData = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const value = inputType === 'url' ? urlValue.trim() : textValue.trim();
    if (!value) {
      return;
    }

    if (inputType === 'url') {
      localStorage.setItem(STORAGE_KEYS.PENDING_URL, value);
    } else {
      localStorage.setItem(STORAGE_KEYS.PENDING_FILE, value);
    }

    localStorage.setItem(STORAGE_KEYS.PENDING_INPUT_TYPE, inputType);
    localStorage.setItem(STORAGE_KEYS.PENDING_EVALUATOR, evaluator);
  };

  const handleSubmit = () => {
    const value = inputType === 'url' ? urlValue.trim() : textValue.trim();

    if (!value) {
      setInlineError('กรุณากรอก URL หรือข้อมูลที่ต้องการตรวจสอบก่อนเริ่มวิเคราะห์');
      return;
    }

    if (inputType === 'url' && !isValidUrl(value)) {
      setInlineError('เราไม่สามารถตรวจสอบ URL นี้ได้ เพราะรูปแบบ URL ไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่อีกครั้ง');
      return;
    }

    setInlineError(null);

    const checkInput: CheckInput = {
      url: value,
      evaluator,
      inputType,
    };

    if (isLandingPage) {
      savePendingData();
      router.push(isAuthenticated ? ROUTES.DASHBOARD.SCAN : ROUTES.AUTH.LOGIN);
      return;
    }

    if (onCheck) {
      onCheck(checkInput);
      return;
    }

    alert.warning('ไม่พบปลายทางการตรวจสอบ', 'ระบบยังไม่พร้อมรับคำขอจากช่องกรอกนี้');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setInlineError(null);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const content = loadEvent.target?.result as string;
      setTextValue(content);
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileName(null);
    setTextValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'url':
        return 'ระบุ URL เช่น https://example.com/login';
      case 'csv':
        return 'วาง URL หลายรายการ หรืออัปโหลดไฟล์ .csv\n\nตัวอย่าง:\nid,url\n1,https://example.com\n2,https://test.com';
      case 'txt':
        return 'วาง URL แต่ละบรรทัด หรืออัปโหลดไฟล์ .txt\n\nตัวอย่าง:\nhttps://example.com\nhttps://test.com';
      default:
        return '';
    }
  };

  const motionProps = isLandingPage
    ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.65, delay: 0.24 },
    }
    : {};

  return (
    <motion.div {...motionProps} className={`w-full ${className}`}>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <EvaluatorSelect value={evaluator} onChange={setEvaluator} />
          <InputTypeSelect value={inputType} onChange={setInputType} />
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-primary-0 sm:max-w-[420px]">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-primary-dark" />
          <span>
            {isLandingPage
              ? 'คุณเริ่มตรวจสอบได้ทันที และหากเข้าสู่ระบบ ระบบจะช่วยบันทึกประวัติและรายงานของคุณ'
              : 'ระบบจะแสดงผลตามข้อมูลจริงที่ตอบกลับจากบริการตรวจสอบ และจะไม่สรุปว่า URL ปลอดภัยเมื่อยังยืนยันไม่ได้'}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border-[1.5px] border-gray-primary bg-white shadow-xl">
        <div className="border-b border-gray-primary-1 bg-primary-light/40 px-4 py-3">
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="mt-0.5 text-safe" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-dark">
                {inputType === 'url' ? 'วาง URL ที่ต้องการตรวจสอบ' : 'เพิ่มรายการ URL ที่ต้องการตรวจสอบ'}
              </p>
              <p className="text-xs leading-relaxed text-gray-primary-0">
                {inputType === 'url'
                  ? 'SEMD จะช่วยตรวจสอบความเสี่ยงของลิงก์และสรุปคำแนะนำที่ควรทำต่อให้คุณ'
                  : 'เหมาะสำหรับการตรวจสอบหลายรายการในครั้งเดียว โดยยังคงอธิบายผลลัพธ์และสถานะให้เข้าใจง่าย'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-3">
          <div className="flex-1">
            {inputType === 'url' ? (
              <input
                type="text"
                value={urlValue}
                onChange={(event) => {
                  setUrlValue(event.target.value);
                  if (inlineError) setInlineError(null);
                }}
                onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
                placeholder={getPlaceholder()}
                autoFocus={autoFocus}
                aria-label="URL ที่ต้องการตรวจสอบ"
                inputMode="url"
                className="w-full rounded-xl border border-gray-primary-1 bg-light px-4 py-3 font-mono text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <div className="relative">
                <textarea
                  value={textValue}
                  onChange={(event) => {
                    setTextValue(event.target.value);
                    setFileName(null);
                    if (inlineError) setInlineError(null);
                  }}
                  placeholder={getPlaceholder()}
                  aria-label="ข้อมูล URL แบบหลายรายการ"
                  className="min-h-[120px] w-full resize-y rounded-xl border border-gray-primary-1 bg-light px-4 py-3 font-mono text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                {fileName ? (
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-primary bg-primary-light px-2 py-1 text-[11px] font-medium">
                    <FileText size={12} className="text-primary-dark" />
                    <span className="max-w-[100px] truncate">{fileName}</span>
                    <button type="button" onClick={clearFile} aria-label="ล้างไฟล์ที่อัปโหลด" className="hover:text-danger">
                      <X size={12} />
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-gray-primary-0">
              {isLandingPage
                ? 'ยังไม่ต้องเข้าสู่ระบบเพื่อเริ่มตรวจสอบ แต่การเข้าสู่ระบบจะช่วยบันทึกประวัติและรายงานของคุณ'
                : 'เมื่อกดตรวจสอบ ระบบจะส่ง URL ไปยังบริการวิเคราะห์และสรุปผลพร้อมคำแนะนำให้คุณ'}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {supportsFile ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={currentOption?.fileAccept}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-gray-primary bg-gray-primary-light px-4 py-2 text-sm font-semibold text-gray-primary-dark transition-all hover:border-primary hover:bg-primary-light hover:text-primary-dark"
                  >
                    <Upload size={16} />
                    อัปโหลดไฟล์
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={handleSubmit}
                className="flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-dark px-5 py-2 text-sm font-bold text-primary transition-all hover:translate-y-[-1px] hover:opacity-90"
              >
                <ArrowRight size={16} />
                ตรวจสอบ URL
              </button>
            </div>
          </div>
        </div>

        {inlineError ? (
          <div className="border-t border-danger/20 bg-accent-light-red/60 px-4 py-3">
            <div className="flex items-start gap-2 text-sm text-dark">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-danger" />
              <p>{inlineError}</p>
            </div>
          </div>
        ) : null}

        {supportsFile ? (
          <div className="flex items-center justify-between border-t border-gray-primary bg-primary-light px-4 py-[10px]">
            <div className="flex items-center gap-2 text-[11px] text-gray-primary-dark">
              <HelpCircle size={13} className="text-primary-dark" />
              <span>รองรับการวาง URL หรืออัปโหลดไฟล์ {currentOption?.fileAccept}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className="cursor-pointer text-[11px] font-semibold text-primary-dark hover:underline"
            >
              {showExample ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่างไฟล์'}
            </button>
          </div>
        ) : null}

        <AnimatePresence>
          {showExample && supportsFile && currentOption?.exampleFormat ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-primary bg-gray-primary-light px-4 py-3">
                <div className="mb-2 text-[11px] font-bold text-gray-primary-dark">
                  ตัวอย่างรูปแบบไฟล์ {inputType.toUpperCase()}:
                </div>
                <pre className="overflow-x-auto rounded-lg border border-gray-primary bg-white p-3 text-[11px] font-mono text-dark">
                  {currentOption.exampleFormat}
                </pre>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {inputType === 'url' ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-primary bg-primary-light px-4 py-[10px]">
            <span className="text-[11px] font-semibold text-gray-primary-dark">รองรับ:</span>
            <span className="rounded-full border border-gray-primary bg-white px-[10px] py-[2px] text-[10.5px] text-gray-primary-dark">
              <b className="text-dark">URL</b> https:// · http://
            </span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};
