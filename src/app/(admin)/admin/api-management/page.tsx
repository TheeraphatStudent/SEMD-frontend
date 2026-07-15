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
import { asRecord, readArray, readBoolean, readNumber, readString } from '@/libs/utils/object-access';
import { toast } from '@/hooks/use-toast';
import { alert } from '@/libs/utils/alert';
import { Activity, KeyRound, RefreshCw, Search } from 'lucide-react';
import { formatDate } from '@/libs/utils/utils';

interface AdminKeyRow {
  id: string;
  owner: string;
  keyName: string;
  status: string;
  isActive: boolean | null;
  usageLimit: number | null;
  createdAt: string;
  expiredAt: string;
}

function normalizeAdminKeyRow(value: unknown): AdminKeyRow {
  const record = asRecord(value);
  const status = readString(record, 'status');
  const isActive = readBoolean(record, 'is_active');

  return {
    id: readString(record, 'id', 'key_id') || String(Math.random()),
    owner: readString(record, 'owner', 'username', 'user_name', 'user_id') || 'ไม่ระบุ',
    keyName: readString(record, 'key_name', 'name') || 'Unnamed key',
    status: status || (isActive === true ? 'active' : isActive === false ? 'inactive' : 'unknown'),
    isActive,
    usageLimit: readNumber(record, 'usage_limit', 'request_limit'),
    createdAt: readString(record, 'created_at'),
    expiredAt: readString(record, 'expired_at'),
  };
}

export default function AdminApiManagementPage() {
  const [keys, setKeys] = useState<AdminKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadKeys = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.adminGetAllKeysSettingAccessKeyAdminGet({ page: 1, page_size: 50, sort_order: 'desc' });
      setKeys(readArray(response.data.data).map(normalizeAdminKeyRow));
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadKeys();
  }, []);

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return keys;
    }

    return keys.filter((key) => (
      key.owner.toLowerCase().includes(query) ||
      key.keyName.toLowerCase().includes(query) ||
      key.status.toLowerCase().includes(query)
    ));
  }, [keys, search]);

  const summary = useMemo(() => ({
    total: keys.length,
    active: keys.filter((key) => key.isActive === true || key.status.toLowerCase() === 'active').length,
    limited: keys.filter((key) => key.usageLimit !== null).length,
  }), [keys]);

  const toggleKeyStatus = async (key: AdminKeyRow) => {
    const confirmed = await alert.confirm(
      key.isActive === false ? 'เปิดใช้งาน key นี้หรือไม่' : 'ปิดใช้งาน key นี้หรือไม่',
      'การเปลี่ยนสถานะจะเรียก endpoint admin update ของระบบโดยตรง'
    );

    if (!confirmed.isConfirmed) {
      return;
    }

    try {
      await api.adminUpdateKeySettingAccessKeyAdminKeyIdPut(Number(key.id), {
        key_name: key.keyName,
        usage_limit: key.usageLimit,
        is_active: !(key.isActive === true),
        expired_at: key.expiredAt || null,
      });
      toast.success('อัปเดตสถานะ API Key แล้ว');
      await loadKeys();
    } catch (updateError) {
      const normalized = normalizeError(updateError);
      setError(normalized.message);
      toast.error(normalized.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">จัดการ API</h1>
          <p className="mt-1 text-gray-primary-0">แสดงรายการ access keys ทั้งระบบจาก backend และช่วยจัดการสถานะการใช้งานอย่างปลอดภัย</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadKeys()} isLoading={loading}>
          <RefreshCw size={16} className="mr-2" />
          โหลดรายการอีกครั้ง
        </Button>
      </div>

      {error && (
        <Card variant="outlined" className="border-danger">
          <CardContent className="pt-6">
            <p className="font-semibold text-dark">ไม่สามารถโหลดข้อมูล API keys ของผู้ใช้ทั้งหมดได้</p>
            <p className="mt-1 text-sm text-gray-primary-0">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
        <Card variant="elevated">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-primary-0">คีย์ที่มี limit</p>
            <p className="mt-2 text-2xl font-bold text-secondary">{loading ? '...' : summary.limited.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound size={18} />
            รายการ API Keys ทั้งระบบ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-gray-primary-1 bg-gray-primary-2/60 px-4 py-4 text-sm text-gray-primary-0">
            ใช้ตารางนี้เพื่อตรวจสอบว่า key ใดกำลังใช้งานอยู่ ใครเป็นเจ้าของ และ key ไหนควรถูกปิดใช้งานหรือทบทวนเพิ่มเติม
          </div>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-primary-0" size={16} />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาจากผู้ใช้ ชื่อ key หรือสถานะ"
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-2xl bg-gray-primary-2" />
              ))}
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
              <p className="font-semibold text-dark">ไม่พบ API Keys ที่ตรงเงื่อนไข</p>
              <p className="mt-1 text-sm text-gray-primary-0">ระบบยังไม่ส่งข้อมูล หรือคำค้นหาไม่ตรงกับรายการที่มี</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>ชื่อ key</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>Usage limit</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead>หมดอายุ</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium text-dark">{key.owner}</TableCell>
                    <TableCell>{key.keyName}</TableCell>
                    <TableCell>
                      <Badge variant={key.status.toLowerCase() === 'active' ? 'safe' : 'warning'}>
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{key.usageLimit !== null ? key.usageLimit.toLocaleString() : 'ไม่จำกัด'}</TableCell>
                    <TableCell>{key.createdAt ? formatDate(key.createdAt) : 'ไม่ระบุ'}</TableCell>
                    <TableCell>{key.expiredAt ? formatDate(key.expiredAt) : 'ไม่ระบุ'}</TableCell>
                    <TableCell>
                      <Button type="button" variant="outline" size="sm" onClick={() => void toggleKeyStatus(key)}>
                        <Activity size={14} className="mr-1" />
                        {key.isActive === false ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
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
