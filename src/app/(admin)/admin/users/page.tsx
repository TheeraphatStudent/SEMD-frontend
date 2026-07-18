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
import { toast } from '@/hooks/use-toast';
import { alert } from '@/libs/utils/alert';
import { UserModel } from '@/services/generated/models';
import { ROLE } from '@/constants/config';
import { RefreshCw, Search, Trash2, Users } from 'lucide-react';
import { normalizeBackendRole } from '@/libs/utils/auth-storage';
import { formatDate } from '@/libs/utils/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin' | 'master_admin'>('all');

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getAllUsersAuthUsersGet({ page: 1, page_size: 50, sort_order: 'desc' });
      setUsers(response.data.data ?? []);
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const role = normalizeBackendRole(user.role);
      const matchesRole = roleFilter === 'all' || role === roleFilter;
      const matchesSearch =
        !query ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.full_name.toLowerCase().includes(query);

      return matchesRole && matchesSearch;
    });
  }, [roleFilter, search, users]);

  const summary = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => {
      const role = normalizeBackendRole(user.role);
      return role === ROLE.ADMIN || role === ROLE.MASTER_ADMIN;
    }).length,
    members: users.filter((user) => normalizeBackendRole(user.role) === ROLE.USER).length,
  }), [users]);

  const handleDelete = async (user: UserModel) => {
    const userId = user.user_id;
    if (!userId) {
      toast.error('ไม่พบ user id สำหรับรายการนี้');
      return;
    }

    const confirmed = await alert.confirm('ลบบัญชีผู้ใช้นี้หรือไม่', `บัญชี ${user.username} จะถูกลบตามสิทธิ์ที่ backend อนุญาต`);
    if (!confirmed.isConfirmed) {
      return;
    }

    try {
      await api.deleteUserAuthUsersUserIdDelete(userId);
      toast.success('ลบบัญชีผู้ใช้แล้ว');
      await loadUsers();
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
          <h1 className="text-3xl font-bold text-dark">จัดการผู้ใช้</h1>
          <p className="mt-1 text-gray-primary-0">แสดงรายการผู้ใช้จริงจากระบบ พร้อมการกรองตามบทบาทและการจัดการตามสิทธิ์ของ backend</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadUsers()} isLoading={loading}>
          <RefreshCw size={16} className="mr-2" />
          โหลดรายการอีกครั้ง
        </Button>
      </div>

      {error && (
        <Card variant="outlined" className="border-danger">
          <CardContent className="pt-6">
            <p className="font-semibold text-dark">ไม่สามารถโหลดรายการผู้ใช้ได้</p>
            <p className="mt-1 text-sm text-gray-primary-0">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-primary-0">ผู้ใช้ทั้งหมด</p>
            <p className="mt-2 text-2xl font-bold text-dark">{loading ? '...' : summary.total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-primary-0">ผู้ดูแลระบบ</p>
            <p className="mt-2 text-2xl font-bold text-secondary">{loading ? '...' : summary.admins.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-primary-0">ผู้ใช้ทั่วไป</p>
            <p className="mt-2 text-2xl font-bold text-primary-dark">{loading ? '...' : summary.members.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={18} />
            รายการผู้ใช้
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-gray-primary-1 bg-gray-primary-2/60 px-4 py-4 text-sm text-gray-primary-0">
            ใช้หน้าจอนี้เพื่อตรวจสอบบทบาทผู้ใช้ สถานะการเปิด 2FA และจัดการบัญชีที่ backend อนุญาตให้ลบได้
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-primary-0" size={16} />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหาจากชื่อผู้ใช้ อีเมล หรือชื่อเต็ม"
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)}
              className="min-h-[44px] rounded-xl border border-gray-primary-1 bg-light px-4 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">ทุกบทบาท</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="master_admin">Master Admin</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-2xl bg-gray-primary-2" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-primary-1 bg-gray-primary-2/50 px-4 py-8 text-center">
              <p className="font-semibold text-dark">ไม่พบผู้ใช้ที่ตรงเงื่อนไข</p>
              <p className="mt-1 text-sm text-gray-primary-0">ลองเปลี่ยนคำค้นหาหรือบทบาทที่ต้องการกรอง</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อผู้ใช้</TableHead>
                  <TableHead>ชื่อเต็ม</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const role = normalizeBackendRole(user.role);

                  return (
                    <TableRow key={user.user_id ?? user.username}>
                      <TableCell className="font-medium text-dark">{user.username}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={role === ROLE.MASTER_ADMIN ? 'master-admin' : role === ROLE.ADMIN ? 'admin' : 'info'}>
                          {role === ROLE.MASTER_ADMIN ? 'Master Admin' : role === ROLE.ADMIN ? 'Admin' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_2fa_enabled ? 'safe' : 'warning'}>
                          {user.is_2fa_enabled ? 'เปิดใช้งานแล้ว' : 'ยังไม่เปิดใช้งาน'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.created_at ? formatDate(user.created_at) : 'ไม่ระบุ'}</TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="sm" onClick={() => void handleDelete(user)}>
                          <Trash2 size={14} className="mr-1" />
                          ลบ
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
