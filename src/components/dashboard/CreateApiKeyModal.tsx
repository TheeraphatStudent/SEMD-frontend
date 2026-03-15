'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { X, Key } from 'lucide-react';
import { alert } from '@/lib/alert';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (apiKey: any) => void;
}

export const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [keyName, setKeyName] = useState('');
  const [expiryDays, setExpiryDays] = useState('90');
  const [quota, setQuota] = useState('10000');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyName.trim()) {
      alert.warning('กรุณาใส่ชื่อ Key', 'กรุณาใส่ชื่อสำหรับ API Key');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newApiKey = {
        id: Date.now().toString(),
        name: keyName,
        key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        usage: 0,
        maxUsage: parseInt(quota),
        created: new Date().toLocaleDateString('th-TH'),
        expired: new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH'),
        isActive: true,
      };

      alert.success('สร้าง API Key สำเร็จ', 'API Key ใหม่ถูกสร้างเรียบร้อยแล้ว');
      
      if (onSuccess) {
        onSuccess(newApiKey);
      }
      
      handleClose();
    } catch (error) {
      alert.error('เกิดข้อผิดพลาด', 'ไม่สามารถสร้าง API Key ได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setKeyName('');
    setExpiryDays('90');
    setQuota('10000');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-primary">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light rounded-lg">
                <Key className="text-primary-dark" size={20} />
              </div>
              <h2 className="text-lg font-bold text-dark">สร้าง API Key ใหม่</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-primary-2 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-primary-0" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Key Name */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                ชื่อ Key (สำหรับจำ)
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="เช่น Production Key, Testing"
                className="w-full px-3 py-2 border border-gray-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                หมดอายุ
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="30">30 วัน</option>
                <option value="60">60 วัน</option>
                <option value="90">90 วัน</option>
                <option value="180">180 วัน</option>
                <option value="365">1 ปี</option>
              </select>
            </div>

            {/* Quota */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Quota (requests/เดือน)
              </label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-3 py-2 border border-gray-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="1000">1,000</option>
                <option value="5000">5,000</option>
                <option value="10000">10,000</option>
                <option value="25000">25,000</option>
                <option value="50000">50,000</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                isLoading={isLoading}
              >
                <Key size={16} />
                สร้าง Key
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
