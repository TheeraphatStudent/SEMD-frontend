'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { api } from '@/libs/utils/api';
import { normalizeError } from '@/libs/utils/api-error';
import { asRecord, readArray, readBoolean, readString } from '@/libs/utils/object-access';
import { toast } from '@/hooks/use-toast';
import { FlagType, ReportStatusType, type FlagType as FlagTypeValue } from '@/services/generated/models';
import { FileText, RefreshCw, Search } from 'lucide-react';
import { getBooleanLabel, getReportStatusLabel, getReportStatusVariant } from '@/libs/utils/ui-status';
import { formatDate } from '@/libs/utils/utils';

interface ReportRow {
  id: string;
  url: string;
  status: string;
  isMalicious: boolean | null;
  reportedAt: string;
  reportedBy: string;
}

function normalizeReportRow(value: unknown): ReportRow {
  const record = asRecord(value);

  return {
    id: readString(record, 'id', 'report_id') || String(Math.random()),
    url: readString(record, 'url'),
    status: readString(record, 'status') || 'PENDING',
    isMalicious: readBoolean(record, 'is_malicious', 'isMalicious'),
    reportedAt: readString(record, 'reported_at', 'created_at', 'reportedAt'),
    reportedBy: readString(record, 'reported_by', 'reportedBy', 'user_id') || 'ไม่ระบุ',
  };
}

export default function ReportPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    url: '',
    categories: FlagType.MALICIOUS as FlagTypeValue,
    remark: '',
  });
  const [search, setSearch] = useState('');

  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getMyReportsReportMeGet({ skip: 0, limit: 20 });
      setReports(readArray(response.data.data).map(normalizeReportRow));
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const summary = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((item) => item.status === ReportStatusType.PENDING).length,
    malicious: reports.filter((item) => item.isMalicious === true).length,
  }), [reports]);
  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reports;

    return reports.filter((report) => (
      report.url.toLowerCase().includes(query) ||
      report.status.toLowerCase().includes(query) ||
      report.reportedBy.toLowerCase().includes(query)
    ));
  }, [reports, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.createReportReportPost({
        url: form.url,
        categories: form.categories,
        status: ReportStatusType.PENDING,
        remark: form.remark || null,
      });

      toast.success('ส่งรายงาน URL แล้ว');
      setForm({ url: '', categories: FlagType.MALICIOUS, remark: '' });
      await loadReports();
    } catch (submitError) {
      const normalized = normalizeError(submitError);
      setError(normalized.message);
      toast.error(normalized.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">รายงาน URL</h1>
          <p className="mt-1 text-gray-primary-0">ส่ง URL ที่ควรให้ทีมตรวจสอบเพิ่มเติม และติดตามสถานะการทบทวนจากข้อมูลจริงของ API</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadReports()} isLoading={loading}>
          <RefreshCw size={16} className="mr-2" />
          โหลดรายการอีกครั้ง
        </Button>
      </div>

      {error && (
        <Card variant="outlined" className="border-danger">
          <CardContent className="pt-6">
            <p className="font-semibold text-dark">มีปัญหาในการทำงานกับรายการรายงาน</p>
            <p className="mt-1 text-sm text-gray-primary-0">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>สร้างรายงานใหม่</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-2xl border border-gray-primary-1 bg-gray-primary-2/60 px-4 py-4 text-sm text-gray-primary-0">
              เมื่อคุณส่งรายงาน ผู้ดูแลระบบจะตรวจสอบข้อมูลเพิ่มเติมก่อนสรุปผล รายงานของคุณจะไม่เปลี่ยนผลประเมินของระบบทันทีจนกว่าจะผ่านการทบทวน
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="URL"
                type="url"
                value={form.url}
                onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                placeholder="https://example.com"
                required
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-dark">ประเภทที่คาดว่าเป็น</label>
                <select
                  value={form.categories}
                  onChange={(event) => setForm((current) => ({ ...current, categories: event.target.value as FlagTypeValue }))}
                  className="min-h-[44px] w-full rounded-xl border border-gray-primary-1 bg-light px-4 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={FlagType.MALICIOUS}>คาดว่าเป็น URL อันตราย</option>
                  <option value={FlagType.BENIGN}>คาดว่าเป็น URL ปลอดภัย</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark">รายละเอียดเพิ่มเติม</label>
                <textarea
                  value={form.remark}
                  onChange={(event) => setForm((current) => ({ ...current, remark: event.target.value }))}
                  className="min-h-[120px] w-full rounded-xl border border-gray-primary-1 bg-light px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="อธิบายเหตุผลที่ต้องการรายงาน URL นี้"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                รายงาน URL
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">รายงานทั้งหมด</p>
                <p className="mt-2 text-2xl font-bold text-dark">{loading ? '...' : summary.total.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">รอตรวจสอบ</p>
                <p className="mt-2 text-2xl font-bold text-warning">{loading ? '...' : summary.pending.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">ระบุว่าอันตราย</p>
                <p className="mt-2 text-2xl font-bold text-danger">{loading ? '...' : summary.malicious.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={18} />
                รายการรายงานของคุณ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-primary-0" size={16} />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ค้นหา URL สถานะ หรือผู้รายงาน"
                  className="pl-10"
                />
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-14 animate-pulse rounded-2xl bg-gray-primary-2" />
                  ))}
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
                  <p className="font-semibold text-dark">{reports.length === 0 ? 'ยังไม่มีรายการรายงาน' : 'ไม่พบรายการที่ตรงกับคำค้นหา'}</p>
                  <p className="mt-1 text-sm text-gray-primary-0">
                    {reports.length === 0 ? 'เมื่อส่งรายงานสำเร็จ รายการล่าสุดจะแสดงที่นี่' : 'ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองแล้วลองอีกครั้ง'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>การประเมิน</TableHead>
                      <TableHead>วันที่รายงาน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="max-w-[320px] font-medium text-dark">
                          <span className="line-clamp-2 break-all">{report.url}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getReportStatusVariant(report.status)}>
                            {getReportStatusLabel(report.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={report.isMalicious ? 'danger' : report.isMalicious === false ? 'safe' : 'info'}>
                            {getBooleanLabel(report.isMalicious, {
                              trueLabel: 'ยืนยันว่าอันตราย',
                              falseLabel: 'ยืนยันว่าปลอดภัย',
                              unknownLabel: 'ยังไม่สรุปผล',
                            })}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.reportedAt ? formatDate(report.reportedAt) : 'ไม่ระบุ'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
