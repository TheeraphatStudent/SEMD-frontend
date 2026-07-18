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
import { asRecord, readArray, readNumber, readString } from '@/libs/utils/object-access';
import { toast } from '@/hooks/use-toast';
import { alert } from '@/libs/utils/alert';
import { Flag, RefreshCw, Search, Trash2 } from 'lucide-react';
import { formatDate } from '@/libs/utils/utils';

interface AdminFlagRow {
  id: string;
  url: string;
  type: string;
  status: string;
  flaggedBy: string;
  confidence: number | null;
  flaggedAt: string;
}

function normalizeAdminFlagRow(value: unknown): AdminFlagRow {
  const record = asRecord(value);

  return {
    id: readString(record, 'id', 'flag_id') || String(Math.random()),
    url: readString(record, 'url'),
    type: readString(record, 'flag_type', 'type') || 'UNKNOWN',
    status: readString(record, 'status') || 'PENDING',
    flaggedBy: readString(record, 'flagged_by', 'created_by') || 'ไม่ระบุ',
    confidence: readNumber(record, 'confidence'),
    flaggedAt: readString(record, 'flagged_at', 'created_at'),
  };
}

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<AdminFlagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadFlags = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getAllFlagsSettingUrlFlagGet({ skip: 0, limit: 50 });
      setFlags(readArray(response.data.data).map(normalizeAdminFlagRow));
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFlags();
  }, []);

  const filteredFlags = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return flags;
    }

    return flags.filter((flag) => (
      flag.url.toLowerCase().includes(query) ||
      flag.type.toLowerCase().includes(query) ||
      flag.status.toLowerCase().includes(query) ||
      flag.flaggedBy.toLowerCase().includes(query)
    ));
  }, [flags, search]);

  const handleDelete = async (flagId: string) => {
    const confirmed = await alert.confirm('ลบ URL Flag นี้หรือไม่', 'คำสั่งนี้จะเรียก endpoint ลบของระบบโดยตรง');
    if (!confirmed.isConfirmed) {
      return;
    }

    try {
      await api.deleteFlagSettingUrlFlagFlagIdDelete(Number(flagId));
      toast.success('ลบ URL Flag แล้ว');
      await loadFlags();
    } catch (deleteError) {
      const normalized = normalizeError(deleteError);
      setError(normalized.message);
      toast.error(normalized.message);
    }
  };

  const summary = useMemo(() => ({
    total: flags.length,
    pending: flags.filter((flag) => flag.status.toLowerCase().includes('pending')).length,
    malicious: flags.filter((flag) => flag.type.toLowerCase().includes('malicious')).length,
  }), [flags]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">จัดการ URL Flags</h1>
          <p className="mt-1 text-gray-primary-0">ตรวจสอบรายการ flags ทั้งระบบจาก backend และช่วยแยกแยะรายการที่ควรตรวจสอบต่อได้รวดเร็วขึ้น</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadFlags()} isLoading={loading}>
          <RefreshCw size={16} className="mr-2" />
          โหลดรายการอีกครั้ง
        </Button>
      </div>

      {error && (
        <Card variant="outlined" className="border-danger">
          <CardContent className="pt-6">
            <p className="font-semibold text-dark">ไม่สามารถโหลดรายการ URL Flags ได้</p>
            <p className="mt-1 text-sm text-gray-primary-0">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-primary-0">ทั้งหมด</p>
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
            <p className="text-sm text-gray-primary-0">Malicious</p>
            <p className="mt-2 text-2xl font-bold text-danger">{loading ? '...' : summary.malicious.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag size={18} />
            รายการ URL Flags ทั้งระบบ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-gray-primary-1 bg-gray-primary-2/60 px-4 py-4 text-sm text-gray-primary-0">
            ตารางนี้รวม URL Flags ที่ผู้ใช้หรือระบบส่งเข้ามา ผู้ดูแลควรใช้สถานะ ความเชื่อมั่น และผู้สร้างรายการเพื่อจัดลำดับการทบทวน
          </div>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-primary-0" size={16} />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหา URL ประเภท สถานะ หรือผู้สร้าง"
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-2xl bg-gray-primary-2" />
              ))}
            </div>
          ) : filteredFlags.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
              <p className="font-semibold text-dark">ไม่พบ URL Flag ที่ตรงเงื่อนไข</p>
              <p className="mt-1 text-sm text-gray-primary-0">ลองปรับคำค้นหาหรือรอข้อมูลจาก backend</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ผู้สร้าง</TableHead>
                  <TableHead>ความเชื่อมั่น</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell className="max-w-[320px] font-medium text-dark">
                      <span className="line-clamp-2 break-all">{flag.url}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={flag.type.toLowerCase().includes('malicious') ? 'danger' : 'info'}>
                        {flag.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={flag.status.toLowerCase().includes('confirmed') ? 'safe' : flag.status.toLowerCase().includes('rejected') ? 'danger' : 'warning'}>
                        {flag.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{flag.flaggedBy}</TableCell>
                    <TableCell>{flag.confidence !== null ? `${(flag.confidence * 100).toFixed(1)}%` : 'ไม่ระบุ'}</TableCell>
                    <TableCell>{flag.flaggedAt ? formatDate(flag.flaggedAt) : 'ไม่ระบุ'}</TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="sm" onClick={() => void handleDelete(flag.id)}>
                        <Trash2 size={14} className="mr-1" />
                        ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
