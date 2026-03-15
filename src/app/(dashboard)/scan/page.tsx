'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { UrlInputBox } from '@/components/shared/UrlInputBox';
import { URLTablePreview } from '@/components/auth/URLTablePreview';
import { useScan } from '@/hooks/use-scan';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { AlertCircle } from 'lucide-react';
import { CheckInput } from '@/lib/types';

export default function ScanPage() {
  const router = useRouter();
  const { predict, loading, result } = useScan();
  
  const handleCheck = async (input: CheckInput) => {
    try {
      const prediction = await predict(input.url);
      toast.success('ตรวจสอบสำเร็จ');
      router.push(ROUTES.PREDICT.RESULT(prediction.id));
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการตรวจสอบ');
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">ตรวจสอบ URL</h1>
        <p className="text-gray-primary-0 mt-1">ตรวจสอบความปลอดภัยของ URL ด้วย AI</p>
      </div>

      <CardTitle>กรอก URL ที่ต้องการตรวจสอบ</CardTitle>

      <UrlInputBox 
            variant="dashboard" 
            onCheck={handleCheck}
            autoFocus={true}
          />

        <CardHeader>
          <CardTitle>URL ที่ตรวจสอบล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <URLTablePreview
            variant="full"
            maxHeight="320px"
            showBrowserBar={true}
            showToolbar={false}
            showPagination={true}
            showFilters={true}
            animated={true}
          />
        </CardContent>
    </div>
  );
}
