'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, HelpCircle, ArrowRight, X } from 'lucide-react';
import { EvaluatorSelect } from './EvaluatorSelect';
import { InputTypeSelect } from './InputTypeSelect';
import { InputType, CheckInput } from '@/lib/types';
import { inputTypeOptions } from '@/lib/mockData';

interface CheckerBoxProps {
  onCheck: (input: CheckInput) => void;
}

export const CheckerBox: React.FC<CheckerBoxProps> = ({ onCheck }) => {
  const [evaluator, setEvaluator] = useState('semd-0.2');
  const [inputType, setInputType] = useState<InputType>('url');
  const [urlValue, setUrlValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOption = inputTypeOptions.find(opt => opt.value === inputType);
  const supportsFile = currentOption?.supportsFile ?? false;

  const handleSubmit = () => {
    const value = inputType === 'url' ? urlValue.trim() : textValue.trim();
    if (!value) {
      alert('กรุณาใส่ URL ก่อนครับ');
      return;
    }
    onCheck({
      url: value,
      evaluator,
      inputType,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setTextValue(content);
      };
      reader.readAsText(file);
    }
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
        return 'ระบุ URL เช่น https://example.com หรือ http://…';
      case 'csv':
        return 'วาง URL หลายรายการ หรืออัปโหลดไฟล์ .csv\n\nตัวอย่าง:\nid,url\n1,https://example.com\n2,https://test.com';
      case 'txt':
        return 'วาง URL แต่ละบรรทัด หรืออัปโหลดไฟล์ .txt\n\nตัวอย่าง:\nhttps://example.com\nhttps://test.com';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.24 }}
      className="w-full max-w-[680px]"
    >
      <div className="flex items-center gap-2 mb-3">
        <EvaluatorSelect value={evaluator} onChange={setEvaluator} />
        <InputTypeSelect value={inputType} onChange={setInputType} />
      </div>

      <div className="bg-white rounded-2xl border-[1.5px] border-gray-primary shadow-xl overflow-hidden">
        <div className="flex items-stretch p-3 gap-2">
          <div className="flex-1 relative">
            {inputType === 'url' ? (
              <input
                type="text"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={getPlaceholder()}
                className="w-full border-none outline-none font-mono text-[13px] text-dark bg-transparent px-[10px] py-2"
              />
            ) : (
              <div className="relative">
                <textarea
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value);
                    setFileName(null);
                  }}
                  placeholder={getPlaceholder()}
                  className="w-full border-none outline-none font-mono text-[12px] text-dark bg-transparent px-[10px] py-2 resize-y min-h-[100px]"
                />
                {fileName && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary-light border border-primary rounded-full px-2 py-1 text-[11px] font-medium">
                    <FileText size={12} className="text-primary-dark" />
                    <span className="max-w-[100px] truncate">{fileName}</span>
                    <button onClick={clearFile} className="hover:text-danger">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 self-center">
            {supportsFile && (
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
                  className="flex items-center gap-1 bg-gray-primary-light text-gray-primary-dark border border-gray-primary px-3 py-[6px] rounded-lg text-[12px] font-semibold cursor-pointer transition-all hover:bg-primary-light hover:border-primary hover:text-primary-dark whitespace-nowrap"
                >
                  <Upload size={13} />
                  อัปโหลด
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-dark text-primary border-none px-4 py-[6px] rounded-lg text-[13px] font-bold cursor-pointer transition-all hover:translate-y-[-1px] hover:opacity-90 whitespace-nowrap"
            >
              <ArrowRight size={14} />
              ตรวจสอบ
            </button>
          </div>
        </div>

        {supportsFile && (
          <div className="flex items-center justify-between px-4 py-[10px] bg-primary-light border-t border-gray-primary">
            <div className="flex items-center gap-2 text-[11px] text-gray-primary-dark">
              <HelpCircle size={13} className="text-primary-dark" />
              <span>รองรับการวาง URL หรืออัปโหลดไฟล์ {currentOption?.fileAccept}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className="text-[11px] font-semibold text-primary-dark hover:underline cursor-pointer"
            >
              {showExample ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่างไฟล์'}
            </button>
          </div>
        )}

        <AnimatePresence>
          {showExample && supportsFile && currentOption?.exampleFormat && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-primary-light border-t border-gray-primary">
                <div className="text-[11px] font-bold text-gray-primary-dark mb-2">
                  ตัวอย่างรูปแบบไฟล์ {inputType.toUpperCase()}:
                </div>
                <pre className="bg-white border border-gray-primary rounded-lg p-3 text-[11px] font-mono text-dark overflow-x-auto">
                  {currentOption.exampleFormat}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {inputType === 'url' && (
          <div className="flex items-center gap-3 px-4 py-[10px] bg-primary-light flex-wrap border-t border-gray-primary">
            <span className="text-[11px] text-gray-primary-dark font-semibold">รองรับ:</span>
            <span className="text-[10.5px] bg-white border border-gray-primary text-gray-primary-dark px-[10px] py-[2px] rounded-full">
              <b className="text-dark">URL</b> https:// · http://
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
