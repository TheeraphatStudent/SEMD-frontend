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
import { ApiDocumentation } from '@/components/dashboard/ApiDocumentation';
import { api } from '@/libs/utils/api';
import { normalizeError } from '@/libs/utils/api-error';
import { asRecord, readArray, readBoolean, readNumber, readString } from '@/libs/utils/object-access';
import { toast } from '@/hooks/use-toast';
import { alert } from '@/libs/utils/alert';
import { Copy, KeyRound, RefreshCw } from 'lucide-react';
import { formatDate } from '@/libs/utils/utils';

interface AccessKeyRow {
  id: string;
  keyName: string;
  maskedKey: string;
  rawKey: string | null;
  createdAt: string;
  expiredAt: string;
  isActive: boolean | null;
  usageLimit: number | null;
}

function normalizeAccessKeyRow(value: unknown): AccessKeyRow {
  const record = asRecord(value);
  const rawKey = readString(record, 'raw_key', 'access_key', 'key', 'token') || null;

  return {
    id: readString(record, 'id', 'key_id') || String(Math.random()),
    keyName: readString(record, 'key_name', 'name') || 'Unnamed key',
    maskedKey: readString(record, 'masked_key', 'display_key') || (rawKey ? `${rawKey.slice(0, 8)}...` : 'Backend did not expose key'),
    rawKey,
    createdAt: readString(record, 'created_at', 'createdAt'),
    expiredAt: readString(record, 'expired_at', 'expiredAt'),
    isActive: readBoolean(record, 'is_active') ?? (readString(record, 'status') === 'active' ? true : null),
    usageLimit: readNumber(record, 'usage_limit', 'request_limit'),
  };
}

export default function ApiAccessPage() {
  const [keys, setKeys] = useState<AccessKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [form, setForm] = useState({
    key_name: '',
    expired_at: '',
  });

  const loadKeys = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getMyKeysSettingAccessKeyMeGet({ page: 1, page_size: 20, sort_order: 'desc' });
      setKeys(readArray(response.data.data).map(normalizeAccessKeyRow));
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadKeys();
  }, []);

  const summary = useMemo(() => ({
    total: keys.length,
    active: keys.filter((item) => item.isActive === true).length,
  }), [keys]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.createKeySettingAccessKeyPost({
        key_name: form.key_name || null,
        expired_at: form.expired_at || null,
      });

      const created = normalizeAccessKeyRow(response.data.data);
      setNewlyCreatedKey(created.rawKey || created.maskedKey);
      toast.success('สร้าง API Key แล้ว');
      setForm({ key_name: '', expired_at: '' });
      await loadKeys();
    } catch (submitError) {
      const normalized = normalizeError(submitError);
      setError(normalized.message);
      toast.error(normalized.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (keyId: string) => {
    const confirmed = await alert.confirm('รีเซ็ต API Key นี้หรือไม่', 'คีย์เดิมอาจหยุดใช้งานและระบบจะสร้างคีย์ใหม่ให้');
    if (!confirmed.isConfirmed) {
      return;
    }

    try {
      const response = await api.resetKeySettingAccessKeyKeyIdResetPost(Number(keyId));
      const updated = normalizeAccessKeyRow(response.data.data);
      setNewlyCreatedKey(updated.rawKey || updated.maskedKey);
      toast.success('รีเซ็ต API Key แล้ว');
      await loadKeys();
    } catch (resetError) {
      const normalized = normalizeError(resetError);
      setError(normalized.message);
      toast.error(normalized.message);
    }
  };

  const copyKey = async (value: string | null) => {
    if (!value) {
      toast.error('ไม่มีค่า key สำหรับคัดลอก');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success('คัดลอก key แล้ว');
    } catch {
      toast.error('ไม่สามารถคัดลอก key ได้');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">API Access</h1>
          <p className="mt-1 text-gray-primary-0">จัดการ API Keys จากระบบจริง พร้อมตัวอย่างการเชื่อมต่อที่ช่วยให้เริ่มใช้งานได้อย่างปลอดภัย</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadKeys()} isLoading={loading}>
          <RefreshCw size={16} className="mr-2" />
          โหลดรายการอีกครั้ง
        </Button>
      </div>

      {error && (
        <Card variant="outlined" className="border-danger">
          <CardContent className="pt-6">
            <p className="font-semibold text-dark">มีปัญหาในการจัดการ API Keys</p>
            <p className="mt-1 text-sm text-gray-primary-0">{error}</p>
          </CardContent>
        </Card>
      )}

      {newlyCreatedKey && (
        <Card variant="outlined" className="border-primary">
          <CardContent className="space-y-3 pt-6">
            <p className="font-semibold text-dark">API Key ล่าสุดจาก backend</p>
            <p className="text-sm text-gray-primary-0">คีย์นี้อาจแสดงเพียงครั้งเดียวตามนโยบายของ backend โปรดคัดลอกและจัดเก็บในที่ปลอดภัยก่อนปิดหน้านี้</p>
            <div className="rounded-2xl bg-gray-primary-2 px-4 py-3 font-mono text-sm text-dark break-all">{newlyCreatedKey}</div>
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => void copyKey(newlyCreatedKey)}>
                <Copy size={16} className="mr-2" />
                คัดลอก key ล่าสุด
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>สร้าง API Key ใหม่</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-2xl border border-gray-primary-1 bg-gray-primary-2/60 px-4 py-4 text-sm text-gray-primary-0">
                ใช้ API Key สำหรับเชื่อมต่อระบบภายนอกกับ SEMD โดยควรตั้งชื่อให้บอกวัตถุประสงค์ชัดเจน และกำหนดวันหมดอายุเมื่อเป็นไปได้
              </div>
              <form className="space-y-4" onSubmit={handleCreate}>
                <Input
                  label="ชื่อ key"
                  value={form.key_name}
                  onChange={(event) => setForm((current) => ({ ...current, key_name: event.target.value }))}
                  placeholder="เช่น Production integration"
                  helperText="ตั้งชื่อให้จำได้ง่ายว่าคีย์นี้ถูกใช้กับระบบใด"
                />
                <Input
                  label="วันหมดอายุ"
                  type="date"
                  value={form.expired_at}
                  onChange={(event) => setForm((current) => ({ ...current, expired_at: event.target.value }))}
                  helperText="หากเว้นว่าง ระบบจะใช้ค่าเริ่มต้นจาก backend"
                />
                <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                  สร้าง API Key
                </Button>
              </form>
            </CardContent>
          </Card>
          <ApiDocumentation />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">คีย์ทั้งหมด</p>
                <p className="mt-2 text-2xl font-bold text-dark">{loading ? '...' : summary.total.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-primary-0">คีย์ที่ใช้งานอยู่</p>
                <p className="mt-2 text-2xl font-bold text-safe">{loading ? '...' : summary.active.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound size={18} />
                API Keys ของคุณ
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-14 animate-pulse rounded-2xl bg-gray-primary-2" />
                  ))}
                </div>
              ) : keys.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
                  <p className="font-semibold text-dark">ยังไม่มี API Keys</p>
                  <p className="mt-1 text-sm text-gray-primary-0">สร้าง key ใหม่เพื่อใช้งาน integration กับ SEMD API</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อ</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>หมดอายุ</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium text-dark">{key.keyName}</TableCell>
                        <TableCell>
                          <code className="rounded bg-primary-light px-2 py-1 text-xs text-primary-dark">{key.maskedKey}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={key.isActive === true ? 'safe' : 'warning'}>
                            {key.isActive === true ? 'active' : key.isActive === false ? 'inactive' : 'unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>{key.expiredAt ? formatDate(key.expiredAt) : 'ไม่ระบุ'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => void copyKey(key.rawKey || key.maskedKey)}>
                              คัดลอก
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => void handleReset(key.id)}>
                              รีเซ็ต
                            </Button>
                          </div>
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
