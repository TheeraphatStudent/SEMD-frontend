'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from '@/components/ui';
import { useScan } from '@/hooks/use-scan';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { Search, AlertCircle } from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();
  const { predict, loading, result } = useScan();
  const [url, setUrl] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('กรุณากรอก URL');
      return;
    }
    
    try {
      const prediction = await predict(url);
      toast.success('ตรวจสอบสำเร็จ');
      router.push(ROUTES.PREDICT.RESULT(prediction.id));
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการตรวจสอบ');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">ตรวจสอบ URL</h1>
        <p className="text-gray-primary-0 mt-1">ตรวจสอบความปลอดภัยของ URL ด้วย AI</p>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>กรอก URL ที่ต้องการตรวจสอบ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="URL"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              helperText="กรอก URL ที่ต้องการตรวจสอบความปลอดภัย"
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              <Search size={20} className="mr-2" />
              ตรวจสอบ
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card variant="outlined">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-secondary flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-bold text-dark mb-2">คำแนะนำ</h3>
              <ul className="text-sm text-gray-primary-0 space-y-1 list-disc list-inside">
                <li>ตรวจสอบ URL ก่อนคลิกเข้าชมเสมอ</li>
                <li>ระวัง URL ที่มีการสะกดผิดหรือดูน่าสงสัย</li>
                <li>ตรวจสอบ URL ที่ได้รับจากอีเมลหรือข้อความที่ไม่คุ้นเคย</li>
                <li>ระบบจะวิเคราะห์และให้คะแนนความปลอดภัย</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>ตัวอย่าง URL ที่ตรวจสอบล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { url: 'https://google.com', safe: true, accuracy: 0.95 },
              { url: 'https://suspicious-site.com', safe: false, accuracy: 0.87 },
              { url: 'https://facebook.com', safe: true, accuracy: 0.92 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-primary-2 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">{item.url}</p>
                  <p className="text-xs text-gray-primary-0">ความแม่นยำ: {(item.accuracy * 100).toFixed(1)}%</p>
                </div>
                <Badge variant={item.safe ? 'safe' : 'danger'}>
                  {item.safe ? 'ปลอดภัย' : 'อันตราย'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
