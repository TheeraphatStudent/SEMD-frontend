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
import { asRecord, readArray, readString } from '@/libs/utils/object-access';
import { toast } from '@/hooks/use-toast';
import { alert } from '@/libs/utils/alert';
import { ACLType, FlagType, type ACLType as ACLTypeValue, type FlagType as FlagTypeValue } from '@/services/generated/models';
import { Flag, RefreshCw, Search, Trash2 } from 'lucide-react';
import { getAclLabel, getFlagTypeLabel, getReportStatusLabel, getReportStatusVariant } from '@/libs/utils/ui-status';
import { formatDate } from '@/libs/utils/utils';

interface FlagRow {
  id: string;
  url: string;
  type: string;
  status: string;
  accessLevel: string;
  flaggedAt: string;
}

function normalizeFlagRow(value: unknown): FlagRow {
  const record = asRecord(value);

  return {
    id: readString(record, 'id', 'flag_id') || String(Math.random()),
    url: readString(record, 'url'),
    type: readString(record, 'flag_type', 'type') || 'UNKNOWN',
    status: readString(record, 'status') || 'PENDING',
    accessLevel: readString(record, 'access_level', 'accessLevel') || ACLType.PRIVATE,
    flaggedAt: readString(record, 'flagged_at', 'created_at', 'flaggedAt'),
  };
}

export default function FlagsPage() {
  const [flags, setFlags] = useState<FlagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    url: '',
    type: FlagType.MALICIOUS as FlagTypeValue,
    access_level: ACLType.PRIVATE as ACLTypeValue,
  });
  const [search, setSearch] = useState('');

  const loadFlags = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getMyFlagsSettingUrlFlagMeGet({ skip: 0, limit: 20 });
      setFlags(readArray(response.data.data).map(normalizeFlagRow));
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFlags();
  }, []);

  const summary = useMemo(() => ({
    total: flags.length,
    malicious: flags.filter((item) => item.type === FlagType.MALICIOUS).length,
    private: flags.filter((item) => item.accessLevel === ACLType.PRIVATE).length,
  }), [flags]);
  const filteredFlags = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return flags;
    }

    return flags.filter((flag) => (
      flag.url.toLowerCase().includes(query) ||
      flag.type.toLowerCase().includes(query) ||
      flag.status.toLowerCase().includes(query)
    ));
  }, [flags, search]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.createFlagSettingUrlFlagPost({
        url: form.url,
        type: form.type,
        access_level: form.access_level,
      });

      toast.success('เพิ่ม URL Flag แล้ว');
      setForm({
        url: '',
        type: FlagType.MALICIOUS,
        access_level: ACLType.PRIVATE,
      });
      await loadFlags();
    } catch (submitError) {
      const normalized = normalizeError(submitError);
      setError(normalized.message);
      toast.error(normalized.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (flagId: string) => {
    const confirmed = await alert.confirm('ลบ URL Flag นี้หรือไม่', 'การลบจะมีผลกับรายการตั้งค่าของคุณ');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">URL Flags ของฉัน</h1>
          <p className="mt-1 text-gray-primary-0">บันทึก URL ที่คุณต้องการทำเครื่องหมายเป็นพิเศษ โดยไม่เปลี่ยนผลประเมินกลางของระบบโดยอัตโนมัติ</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadFlags()} isLoading={loading}>
          <RefreshCw size={16} className="mr-2" />
          โหลดรายการอีกครั้ง
        </Button>
      </div>

      {error && (
        <Card variant="outlined" className="border-danger">
          <CardContent className="pt-6">
            <p className="font-semibold text-dark">มีปัญหาในการจัดการ URL Flags</p>
            <p className="mt-1 text-sm text-gray-primary-0">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>เพิ่ม Flag ใหม่</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-2xl border border-gray-primary-1 bg-gray-primary-2/60 px-4 py-4 text-sm text-gray-primary-0">
              URL Flag ช่วยให้คุณจัดการลิงก์ที่ต้องการระวังหรือยืนยันไว้ใช้เอง ส่วนผลประเมินกลางของ SEMD จะยังขึ้นอยู่กับบริการตรวจสอบและกฎของระบบ
            </div>
            <form className="space-y-4" onSubmit={handleCreate}>
              <Input
                label="URL"
                type="url"
                value={form.url}
                onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                placeholder="https://example.com"
                required
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-dark">ประเภท</label>
                <select
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as FlagTypeValue }))}
                  className="min-h-[44px] w-full rounded-xl border border-gray-primary-1 bg-light px-4 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={FlagType.MALICIOUS}>ทำเครื่องหมายว่าเสี่ยงอันตราย</option>
                  <option value={FlagType.BENIGN}>ทำเครื่องหมายว่าปลอดภัย</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark">ระดับการใช้งาน</label>
                <select
                  value={form.access_level}
                  onChange={(event) => setForm((current) => ({ ...current, access_level: event.target.value as ACLTypeValue }))}
                  className="min-h-[44px] w-full rounded-xl border border-gray-primary-1 bg-light px-4 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={ACLType.PRIVATE}>ใช้เฉพาะบัญชีของฉัน</option>
                  <option value={ACLType.GLOBAL}>ใช้ร่วมทั้งระบบ</option>
                </select>
              </div>
              <div className="rounded-2xl bg-gray-primary-2/60 px-4 py-4 text-sm text-gray-primary-0">
                โปรดใช้ด้วยความระมัดระวัง เพราะ backend อาจใช้ค่าประเภทและระดับการเข้าถึงนี้ในการแสดงผลหรือกฎของผู้ใช้
              </div>
              <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                บันทึก URL Flag
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">ทั้งหมด</p>
                <p className="mt-2 text-2xl font-bold text-dark">{loading ? '...' : summary.total.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">Malicious</p>
                <p className="mt-2 text-2xl font-bold text-danger">{loading ? '...' : summary.malicious.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">Private</p>
                <p className="mt-2 text-2xl font-bold text-secondary">{loading ? '...' : summary.private.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag size={18} />
                รายการ URL Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-14 animate-pulse rounded-2xl bg-gray-primary-2" />
                  ))}
                </div>
              ) : flags.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
                  <p className="font-semibold text-dark">ยังไม่มี URL Flags</p>
                  <p className="mt-1 text-sm text-gray-primary-0">เมื่อเพิ่มรายการใหม่ ระบบจะแสดงผลในส่วนนี้</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>ระดับ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flags.map((flag) => (
                      <TableRow key={flag.id}>
                        <TableCell className="max-w-[300px] font-medium text-dark">
                          <span className="line-clamp-2 break-all">{flag.url}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={flag.type === FlagType.MALICIOUS ? 'danger' : 'safe'}>{flag.type}</Badge>
                        </TableCell>
                        <TableCell>{flag.accessLevel}</TableCell>
                        <TableCell>
                          <Badge variant={flag.status === 'confirmed' ? 'safe' : flag.status === 'rejected' ? 'danger' : 'warning'}>
                            {flag.status}
                          </Badge>
                        </TableCell>
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
      </div>
    </div>
  );
}
