'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { useScan } from '@/hooks/use-scan';
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Calendar, User, RefreshCw, CircleHelp } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/libs/utils/utils';
import type { PredictionStatus } from '@/types/scan.types';

export default function PredictionResultPage() {
  const params = useParams();
  const { getResult, result, loading, error, status } = useScan();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      void getResult(id);
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
            <p className="text-gray-primary-0">{error || 'ไม่พบผลการตรวจสอบที่คุณค้นหา'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig: Record<PredictionStatus, {
    title: string;
    subtitle: string;
    badge: 'safe' | 'warning' | 'danger' | 'info';
    icon: ReactNode;
    iconBg: string;
    bannerClass: string;
  }> = {
    idle: {
      title: 'ยังยืนยันสถานะไม่ได้',
      subtitle: 'ระบบยังไม่สามารถสรุปผลได้อย่างน่าเชื่อถือในขณะนี้',
      badge: 'info',
      icon: <CircleHelp className="text-secondary-dark" size={56} />,
      iconBg: '#D3DFFF',
      bannerClass: 'bg-gradient-master-admin',
    },
    validating: {
      title: 'กำลังตรวจสอบข้อมูล',
      subtitle: 'ระบบกำลังประเมิน URL นี้และรวบรวมผลลัพธ์จากบริการตรวจสอบ',
      badge: 'warning',
      icon: <RefreshCw className="text-warning animate-spin" size={56} />,
      iconBg: '#FFEDD5',
      bannerClass: 'bg-[linear-gradient(135deg,#FFEDD5_0%,#FFFEF4_23%,#FFFEF4_80%,#FFBE69_100%)]',
    },
    submitting: {
      title: 'กำลังตรวจสอบข้อมูล',
      subtitle: 'ระบบกำลังประเมิน URL นี้และรวบรวมผลลัพธ์จากบริการตรวจสอบ',
      badge: 'warning',
      icon: <RefreshCw className="text-warning animate-spin" size={56} />,
      iconBg: '#FFEDD5',
      bannerClass: 'bg-[linear-gradient(135deg,#FFEDD5_0%,#FFFEF4_23%,#FFFEF4_80%,#FFBE69_100%)]',
    },
    pending: {
      title: 'กำลังตรวจสอบข้อมูล',
      subtitle: 'ระบบกำลังประเมิน URL นี้และรวบรวมผลลัพธ์จากบริการตรวจสอบ',
      badge: 'warning',
      icon: <RefreshCw className="text-warning animate-spin" size={56} />,
      iconBg: '#FFEDD5',
      bannerClass: 'bg-[linear-gradient(135deg,#FFEDD5_0%,#FFFEF4_23%,#FFFEF4_80%,#FFBE69_100%)]',
    },
    safe: {
      title: 'ไม่พบสัญญาณอันตราย',
      subtitle: 'ไม่พบสัญญาณอันตรายจากการประเมินครั้งนี้ แต่ควรตรวจสอบบริบทของลิงก์ก่อนใช้งานเสมอ',
      badge: 'safe',
      icon: <CheckCircle className="text-safe" size={56} />,
      iconBg: '#D5FFC0',
      bannerClass: 'bg-gradient-safe-1',
    },
    suspicious: {
      title: 'ผลลัพธ์น่าสงสัย',
      subtitle: 'มีสัญญาณที่ควรระวังและยังไม่ควรเชื่อถือว่าปลอดภัย',
      badge: 'warning',
      icon: <CircleHelp className="text-warning" size={56} />,
      iconBg: '#FFEDD5',
      bannerClass: 'bg-[linear-gradient(135deg,#FFEDD5_0%,#FFFEF4_23%,#FFFEF4_80%,#FFBE69_100%)]',
    },
    malicious: {
      title: 'ตรวจพบความเสี่ยงสูง',
      subtitle: 'ผลลัพธ์จากบริการตรวจสอบระบุว่าลิงก์นี้มีความเสี่ยงสูง',
      badge: 'danger',
      icon: <AlertTriangle className="text-danger" size={56} />,
      iconBg: '#FFD7D7',
      bannerClass: 'bg-gradient-danger-1',
    },
    unknown: {
      title: 'ยังยืนยันสถานะไม่ได้',
      subtitle: 'ระบบยังไม่สามารถสรุปผลได้อย่างน่าเชื่อถือในขณะนี้',
      badge: 'info',
      icon: <CircleHelp className="text-secondary-dark" size={56} />,
      iconBg: '#D3DFFF',
      bannerClass: 'bg-gradient-master-admin',
    },
    failed: {
      title: 'การตรวจสอบไม่สำเร็จ',
      subtitle: 'ไม่สามารถสรุปผลจากบริการตรวจสอบได้ กรุณาลองใหม่อีกครั้ง',
      badge: 'danger',
      icon: <AlertTriangle className="text-danger" size={56} />,
      iconBg: '#FFD7D7',
      bannerClass: 'bg-gradient-danger-1',
    },
  };

  const config = statusConfig[status];
  const confidencePercent = result.confidence !== null ? `${(result.confidence * 100).toFixed(1)}%` : 'ไม่ระบุ';

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card variant="elevated" className={config.bannerClass}>
          <CardContent className="pt-8 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
              style={{ backgroundColor: config.iconBg }}>
              {config.icon}
            </div>

            <h1 className="text-4xl font-bold text-dark mb-3">
              {config.title}
            </h1>

            <p className="text-lg text-gray-primary-0 mb-6">
              ความเชื่อมั่น: <span className="font-bold text-dark">{confidencePercent}</span>
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
                    <Badge variant={config.badge} className="mt-1">
                      {config.title}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-primary-0">ตรวจสอบโดย</p>
                    <p className="text-dark">{result.predictedBy || 'SEMD'}</p>
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
                <p className="text-sm text-gray-primary-0">{config.subtitle}</p>
                <p className="text-sm text-gray-primary-0">{result.recommendation}</p>
                {result.responseTime !== null && (
                  <p className="text-sm text-gray-primary-0">
                    เวลาในการตอบกลับของบริการ: <span className="font-semibold text-dark">{result.responseTime} ms</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {Object.keys(result.details).length > 0 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle>รายละเอียดจากบริการตรวจสอบ</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(result.details).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-light px-3 py-3">
                    <dt className="text-xs uppercase tracking-wide text-gray-primary-0">{key}</dt>
                    <dd className="mt-1 text-sm text-dark break-all">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card variant="outlined" className="border-danger">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertTriangle className="text-danger mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-dark">เกิดข้อผิดพลาดระหว่างดึงผลการตรวจสอบ</p>
                <p className="text-sm text-gray-primary-0">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={ROUTES.DASHBOARD.SCAN} className="sm:flex-1">
            <Button variant="outline" className="w-full">
              ตรวจสอบ URL ใหม่
            </Button>
          </Link>
          <Button variant="primary" className="sm:flex-1" onClick={() => void getResult(id)} isLoading={loading}>
            <RefreshCw size={16} className="mr-2" />
            โหลดผลลัพธ์อีกครั้ง
          </Button>
        </div>
      </div>
    </div>
  );
}
