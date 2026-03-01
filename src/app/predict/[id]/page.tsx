'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { useScan } from '@/hooks/use-scan';
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Calendar, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PredictionResultPage() {
  const params = useParams();
  const { getResult, result, loading } = useScan();
  const id = params.id as string;
  
  useEffect(() => {
    if (id) {
      getResult(id);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-primary-0">กำลังโหลดผลการตรวจสอบ...</p>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card variant="elevated" className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="text-warning mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-dark mb-2">ไม่พบข้อมูล</h2>
            <p className="text-gray-primary-0">ไม่พบผลการตรวจสอบที่คุณค้นหา</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const isSafe = !result.isMalicious;
  const accuracyPercent = (result.accuracy * 100).toFixed(1);
  
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card 
          variant="elevated" 
          className={`${isSafe ? 'bg-gradient-safe-1' : 'bg-gradient-danger-1'}`}
        >
          <CardContent className="pt-8 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" 
                 style={{ backgroundColor: isSafe ? '#D5FFC0' : '#FFD7D7' }}>
              {isSafe ? (
                <CheckCircle className="text-accent-green" size={56} />
              ) : (
                <AlertTriangle className="text-accent-red" size={56} />
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-dark mb-3">
              {isSafe ? 'URL ปลอดภัย' : 'URL อันตราย'}
            </h1>
            
            <p className="text-lg text-gray-primary-0 mb-6">
              ความแม่นยำ: <span className="font-bold text-dark">{accuracyPercent}%</span>
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-light rounded-lg">
              <ExternalLink size={20} className="text-gray-primary-0" />
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-dark font-medium hover:text-primary transition-colors break-all"
              >
                {result.url}
              </a>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>รายละเอียดการตรวจสอบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-primary-0">สถานะ</p>
                    <Badge variant={isSafe ? 'success' : 'danger'} className="mt-1">
                      {isSafe ? 'ปลอดภัย' : 'อันตราย'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <User className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-primary-0">ตรวจสอบโดย</p>
                    <p className="text-dark">{result.predictedBy || 'System'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-primary-0">วันที่ตรวจสอบ</p>
                    <p className="text-dark">{formatDate(result.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>คำแนะนำ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isSafe ? (
                  <>
                    <p className="text-sm text-gray-primary-0">
                      ✓ URL นี้ถูกตรวจสอบแล้วและปลอดภัย
                    </p>
                    <p className="text-sm text-gray-primary-0">
                      ✓ คุณสามารถเข้าชม URL นี้ได้
                    </p>
                    <p className="text-sm text-gray-primary-0">
                      ⚠ แต่ควรระมัดระวังเสมอเมื่อกรอกข้อมูลส่วนตัว
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-accent-red font-medium">
                      ⚠ URL นี้อาจเป็นอันตราย
                    </p>
                    <p className="text-sm text-gray-primary-0">
                      ✗ ไม่แนะนำให้เข้าชม URL นี้
                    </p>
                    <p className="text-sm text-gray-primary-0">
                      ✗ อาจมีการพยายามขโมยข้อมูลหรือติดมัลแวร์
                    </p>
                    <p className="text-sm text-gray-primary-0">
                      ✓ หากจำเป็นต้องเข้าชม ควรใช้ความระมัดระวังสูงสุด
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {result.suggested && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>คำแนะนำเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-primary-0">{result.suggested}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
