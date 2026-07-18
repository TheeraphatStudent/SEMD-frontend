'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { api } from '@/libs/utils/api';
import { normalizeError } from '@/libs/utils/api-error';
import type { PredictionStatItem, PredictionTrendItem, ReportStatItem } from '@/services/generated/models';
import { AlertTriangle, ArrowRight, CheckCircle, Clock3, FileText, Flag, RefreshCw, Shield, TrendingUp } from 'lucide-react';
import { formatDate } from '@/libs/utils/utils';

interface DashboardState {
  predictionStat: PredictionStatItem | null;
  reportStat: ReportStatItem | null;
  trend: PredictionTrendItem[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardState>({
    predictionStat: null,
    reportStat: null,
    trend: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeDays, setRangeDays] = useState(7);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [predictionStatResponse, reportStatResponse, trendResponse] = await Promise.all([
        api.getPredictionStatStatPredictionGet(),
        api.getUrlReportStatDashboardUrlReportStatGet(),
        api.getPredictionTrendStatPredictionTrendGet(),
      ]);

      setData({
        predictionStat: predictionStatResponse.data.data,
        reportStat: reportStatResponse.data.data,
        trend: trendResponse.data.data ?? [],
      });
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const predictionStat = data.predictionStat;
  const reportStat = data.reportStat;
  const filteredTrend = useMemo(() => {
    const sorted = [...data.trend].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted.slice(0, rangeDays);
  }, [data.trend, rangeDays]);
  const hasDashboardData = Boolean(predictionStat || reportStat || filteredTrend.length > 0);

  const kpis = [
    {
      label: 'URL ที่ตรวจสอบ',
      value: predictionStat?.total_predictions ?? null,
      helper: 'จำนวนรายการที่ API ส่งกลับมายังแดชบอร์ดนี้',
      icon: <Shield className="text-primary" size={24} />,
      iconClassName: 'bg-primary-light',
    },
    {
      label: 'URL อันตราย',
      value: predictionStat?.malicious_count ?? null,
      helper: 'รายการที่ระบบแนะนำให้หลีกเลี่ยง',
      icon: <AlertTriangle className="text-danger" size={24} />,
      iconClassName: 'bg-accent-light-red',
      valueClassName: 'text-danger',
    },
    {
      label: 'URL ปลอดภัย',
      value: predictionStat?.safe_count ?? null,
      helper: 'รายการที่ยังไม่พบสัญญาณอันตรายจากการตรวจสอบครั้งนี้',
      icon: <CheckCircle className="text-safe" size={24} />,
      iconClassName: 'bg-accent-light-green',
      valueClassName: 'text-safe',
    },
    {
      label: 'รอตรวจสอบ',
      value: predictionStat?.pending_count ?? null,
      helper: 'รายการที่ยังประมวลผลไม่เสร็จหรือยังยืนยันผลไม่ได้',
      icon: <Clock3 className="text-warning" size={24} />,
      iconClassName: 'bg-accent-light-orange',
      valueClassName: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">แดชบอร์ด</h1>
          <p className="mt-1 text-gray-primary-0">ภาพรวมการตรวจสอบ URL รายงาน และสถานะที่ควรติดตามจากข้อมูลจริงของ API</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={ROUTES.DASHBOARD.SCAN}>
            <Button type="button" variant="primary" className="w-full sm:w-auto">
              ตรวจสอบ URL ใหม่
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Button type="button" variant="outline" onClick={() => void loadDashboard()} isLoading={loading}>
            <RefreshCw size={16} />
            โหลดข้อมูลอีกครั้ง
          </Button>
        </div>
      </div>

      {error ? (
        <Card variant="outlined" className="border-danger">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="mt-0.5 text-danger" size={20} />
            <div>
              <p className="font-semibold text-dark">ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ในขณะนี้</p>
              <p className="text-sm text-gray-primary-0">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((item) => (
          <Card key={item.label} variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-primary-0">{item.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${item.valueClassName || 'text-dark'}`}>
                    {loading ? '...' : item.value?.toLocaleString() ?? 'ไม่พบข้อมูล'}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-primary-0">{item.helper}</p>
                </div>
                <div className={`rounded-lg p-3 ${item.iconClassName}`}>{item.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} />
              ภาพรวมที่ควรรู้
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-gray-primary-2/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-primary-0">สัดส่วนผลที่ระบบประเมินอย่างมั่นใจ</p>
                <Badge variant="info" animated={false}>
                  {loading ? 'กำลังโหลด' : predictionStat ? `${predictionStat.accuracy_rate.toFixed(1)}%` : 'ไม่พบข้อมูล'}
                </Badge>
              </div>
              <div className="mt-3 h-3 w-full rounded-full bg-light">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                  style={{ width: `${Math.min(predictionStat?.accuracy_rate ?? 0, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-primary-0">ตัวเลขนี้ช่วยบอกแนวโน้มคุณภาพของผลจากบริการที่ระบบใช้งานอยู่ ไม่ใช่การรับประกันว่าทุก URL จะปลอดภัย</p>
            </div>

            <div className="rounded-2xl bg-gray-primary-2/70 p-4">
              <p className="text-sm text-gray-primary-0">เวลาเฉลี่ยในการตอบกลับ</p>
              <p className="mt-2 text-2xl font-bold text-dark">
                {loading ? '...' : predictionStat ? `${predictionStat.avg_response_time.toLocaleString()} ms` : 'ไม่พบข้อมูล'}
              </p>
              <p className="mt-1 text-xs text-gray-primary-0">ยิ่งตัวเลขนี้ต่ำ การตอบกลับจากระบบยิ่งรวดเร็ว</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4">
                <p className="text-sm text-gray-primary-0">รายงานของคุณ</p>
                <p className="mt-2 text-xl font-bold text-dark">
                  {loading ? '...' : reportStat?.reported_by_amount?.toLocaleString() ?? 'ไม่พบข้อมูล'}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4">
                <p className="text-sm text-gray-primary-0">รายงานที่รอตรวจสอบ</p>
                <p className="mt-2 text-xl font-bold text-warning">
                  {loading ? '...' : reportStat?.pending_urls?.toLocaleString() ?? 'ไม่พบข้อมูล'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>แนวโน้มล่าสุด</CardTitle>
              <select
                value={rangeDays}
                onChange={(event) => setRangeDays(Number(event.target.value))}
                className="min-h-[44px] rounded-xl border border-gray-primary-1 bg-light px-4 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="เลือกจำนวนรายการแนวโน้ม"
              >
                <option value={7}>7 รายการล่าสุด</option>
                <option value={14}>14 รายการล่าสุด</option>
                <option value={30}>30 รายการล่าสุด</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-14 animate-pulse rounded-2xl bg-gray-primary-2" />
                ))}
              </div>
            ) : filteredTrend.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
                <p className="font-semibold text-dark">ยังไม่มีข้อมูลแนวโน้ม</p>
                <p className="mt-1 text-sm text-gray-primary-0">ระบบยังไม่ส่งข้อมูลสถิติตามช่วงเวลาให้หน้านี้</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-primary-2/70 px-4 py-4 text-sm text-gray-primary-0">
                  สรุป: ช่วงข้อมูลนี้มี {filteredTrend.reduce((sum, item) => sum + item.total_predictions, 0).toLocaleString()} รายการ และพบ URL เสี่ยง {filteredTrend.reduce((sum, item) => sum + item.malicious_count, 0).toLocaleString()} รายการ
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>วันที่</TableHead>
                      <TableHead>ตรวจสอบทั้งหมด</TableHead>
                      <TableHead>อันตราย</TableHead>
                      <TableHead>ปลอดภัย</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrend.map((item) => (
                      <TableRow key={item.date}>
                        <TableCell className="font-medium text-dark">{formatDate(item.date)}</TableCell>
                        <TableCell>{item.total_predictions.toLocaleString()}</TableCell>
                        <TableCell className="text-danger">{item.malicious_count.toLocaleString()}</TableCell>
                        <TableCell className="text-safe">{item.safe_count.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>สิ่งที่ควรทำต่อ</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link href={ROUTES.DASHBOARD.SCAN}>
              <div className="surface-subtle flex min-h-[132px] cursor-pointer flex-col justify-between px-4 py-4 transition-colors hover:bg-primary-light/50">
                <Shield size={20} className="text-primary-dark" />
                <div>
                  <p className="font-semibold text-dark">ตรวจสอบ URL ใหม่</p>
                  <p className="mt-1 text-sm text-gray-primary-0">เริ่มวิเคราะห์ลิงก์ที่คุณได้รับทันที</p>
                </div>
              </div>
            </Link>
            <Link href={ROUTES.DASHBOARD.REPORT}>
              <div className="surface-subtle flex min-h-[132px] cursor-pointer flex-col justify-between px-4 py-4 transition-colors hover:bg-primary-light/50">
                <FileText size={20} className="text-primary-dark" />
                <div>
                  <p className="font-semibold text-dark">ติดตามรายงาน URL</p>
                  <p className="mt-1 text-sm text-gray-primary-0">ดูว่ายังมีรายการใดรอการตรวจสอบอยู่</p>
                </div>
              </div>
            </Link>
            <Link href={ROUTES.DASHBOARD.FLAGS}>
              <div className="surface-subtle flex min-h-[132px] cursor-pointer flex-col justify-between px-4 py-4 transition-colors hover:bg-primary-light/50">
                <Flag size={20} className="text-primary-dark" />
                <div>
                  <p className="font-semibold text-dark">จัดการ URL Flags</p>
                  <p className="mt-1 text-sm text-gray-primary-0">ดูเครื่องหมาย URL ส่วนตัวและอัปเดตรายการที่สำคัญ</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>สถานะข้อมูล</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasDashboardData ? (
              <>
                <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4">
                  <p className="text-sm text-gray-primary-0">อัปเดตล่าสุดจากแนวโน้ม</p>
                  <p className="mt-2 font-semibold text-dark">
                    {filteredTrend[0]?.date ? formatDate(filteredTrend[0].date) : 'ไม่มีข้อมูลเวลาอัปเดต'}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4 text-sm text-gray-primary-0">
                  หากตัวเลขบางส่วนไม่แสดง อาจเป็นเพราะ backend ยังไม่ส่งข้อมูลส่วนนั้นมาที่แดชบอร์ดนี้
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
                <p className="font-semibold text-dark">ยังไม่มีข้อมูลสำหรับแดชบอร์ด</p>
                <p className="mt-1 text-sm text-gray-primary-0">เริ่มจากการตรวจสอบ URL หรือส่งรายงาน แล้วข้อมูลของคุณจะแสดงที่นี่</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
