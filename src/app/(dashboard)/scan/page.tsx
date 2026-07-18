'use client';

import { useRouter } from 'next/navigation';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { URLTablePreview } from '@/components/auth/URLTablePreview';
import { UrlInputBox } from '@/components/shared/UrlInputBox';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/hooks/use-toast';
import { useScan } from '@/hooks/use-scan';
import { CheckInput } from '@/libs/utils/types';
import { getPredictionStatusLabel, getPredictionStatusVariant } from '@/libs/utils/ui-status';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const processingSteps = [
  'กำลังตรวจสอบรูปแบบ URL',
  'กำลังส่ง URL ไปยังบริการตรวจสอบ',
  'กำลังวิเคราะห์ผลลัพธ์',
  'กำลังเตรียมคำแนะนำ',
];

export default function ScanPage() {
  const router = useRouter();
  const { predict, loading, status, error } = useScan();

  const handleCheck = async (input: CheckInput) => {
    try {
      const prediction = await predict(input.url);
      toast.success('ตรวจสอบ URL สำเร็จ');
      router.push(ROUTES.PREDICT.RESULT(prediction.id));
    } catch (predictError: any) {
      toast.error(predictError.message || 'ไม่สามารถตรวจสอบ URL ได้ในขณะนี้');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">ตรวจสอบ URL</h1>
        <p className="mt-1 text-gray-primary-0">กรอก URL ที่ต้องการตรวจสอบ แล้ว SEMD จะสรุปผลพร้อมคำแนะนำที่ควรทำต่อให้คุณ</p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>เริ่มตรวจสอบ URL</CardTitle>
              <p className="mt-1 text-sm text-gray-primary-0">
                ใช้ลำดับง่าย ๆ: กรอก URL → ตรวจสอบ → อ่านผลและคำแนะนำก่อนเปิดลิงก์
              </p>
            </div>
            <Badge variant={getPredictionStatusVariant(status)} animated={false}>
              {getPredictionStatusLabel(status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <UrlInputBox variant="dashboard" onCheck={handleCheck} autoFocus />

          <div className="rounded-2xl border border-gray-primary-1 bg-gray-primary-2/60 px-4 py-4">
            {loading ? (
              <div className="space-y-3">
                {processingSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-dark">
                    <Loader2 size={16} className={index === 0 ? 'animate-spin text-primary-dark' : 'text-primary-dark'} />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex items-start gap-3 text-sm text-dark">
                <AlertCircle size={18} className="mt-0.5 text-danger" />
                <div>
                  <p className="font-semibold">ยังไม่สามารถตรวจสอบ URL นี้ได้</p>
                  <p className="mt-1 text-gray-primary-0">{error}</p>
                  <p className="mt-1 text-gray-primary-0">กรุณาตรวจสอบรูปแบบ URL หรือลองใหม่อีกครั้งในอีกสักครู่</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-sm text-dark">
                <ShieldCheck size={18} className="mt-0.5 text-safe" />
                <div>
                  <p className="font-semibold">ก่อนกดตรวจสอบ</p>
                  <p className="text-gray-primary-0">
                    หากระบบยังไม่สามารถยืนยันผลได้ SEMD จะไม่สรุปว่า URL นี้ปลอดภัย และจะแนะนำให้คุณหลีกเลี่ยงการเปิดลิงก์นั้นไปก่อน
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>ตัวอย่างรายการ URL ล่าสุด</CardTitle>
          <p className="text-sm text-gray-primary-0">
            ตัวอย่างนี้ช่วยให้เห็นรูปแบบผลลัพธ์และสถานะที่คุณจะได้รับหลังการตรวจสอบจริง
          </p>
        </CardHeader>
        <CardContent>
          <URLTablePreview
            variant="full"
            maxHeight="320px"
            showBrowserBar
            showToolbar={false}
            showPagination
            showFilters
            animated
          />
        </CardContent>
      </Card>
    </div>
  );
}
