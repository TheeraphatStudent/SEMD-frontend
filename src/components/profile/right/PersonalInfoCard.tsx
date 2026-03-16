'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { toast } from '@/hooks/use-toast';

interface PersonalInfoCardProps {
  className?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  birthday: '',
  gender: '',
};

const IconBox: React.FC<{ children: string; className?: string }> = ({ children, className }) => (
  <span className={cn(
    'inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-light text-[10px] font-black text-primary-dark select-none',
    className
  )}>
    {children}
  </span>
);

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ className }) => {
  const [form, setForm] = useState<FormData>(initialForm);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm(initialForm);
  };

  const handleSave = () => {
    toast.success('บันทึกเรียบร้อยแล้ว');
  };

  const inputClass = cn(
    'w-full px-3 py-2.5 rounded-xl border border-gray-primary bg-gray-primary-light text-sm text-dark',
    'focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
    'transition-all duration-200'
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card variant="elevated" animated={false} className={cn('p-5', className)}>
      <CardHeader className="mb-4">
        <CardTitle className="text-base">ข้อมูลส่วนตัว</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-primary-dark uppercase tracking-wider mb-1.5">
              ชื่อ
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="ระบุชื่อ"
              className={inputClass}
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-primary-dark uppercase tracking-wider mb-1.5">
              นามสกุล
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="ระบุนามสกุล"
              className={inputClass}
            />
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-primary-dark uppercase tracking-wider mb-1.5">
              วันเกิด
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.birthday}
                onChange={(e) => handleChange('birthday', e.target.value)}
                className={cn(inputClass, 'pl-10')}
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <IconBox className="w-5 h-5 text-[8px]">CAL</IconBox>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-primary-dark uppercase tracking-wider mb-1.5">
              เพศ
            </label>
            <div className="relative">
              <select
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className={cn(inputClass, 'appearance-none pr-10 cursor-pointer')}
              >
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="unspecified">ไม่ระบุ</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-gray-primary-dark text-xs">▼</span>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end gap-2 mt-5"
        >
          <motion.button
            onClick={handleCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gray-primary-light text-gray-primary-dark text-sm font-semibold hover:bg-gray-primary transition-colors"
          >
            ยกเลิก
          </motion.button>
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark text-primary text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <IconBox className="w-5 h-5 text-[8px] bg-primary text-dark">OK</IconBox>
            บันทึก
          </motion.button>
        </motion.div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default PersonalInfoCard;
