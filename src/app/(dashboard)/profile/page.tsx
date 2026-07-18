'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Badge } from '@/components/ui';
import { api } from '@/libs/utils/api';
import { normalizeError } from '@/libs/utils/api-error';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { UserModel } from '@/services/generated/models';

export default function ProfilePageRoute() {
  const { checkAuth } = useAuth();
  const [profile, setProfile] = useState<UserModel | null>(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    full_name: '',
    birthday: '',
    profile_img_uri: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getMeAuthMeGet();
      const user = response.data;
      setProfile(user);
      setForm({
        username: user.username ?? '',
        email: user.email ?? '',
        full_name: user.full_name ?? '',
        birthday: user.birthday ?? '',
        profile_img_uri: user.profile_img_uri ?? '',
      });
    } catch (loadError) {
      setError(normalizeError(loadError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await api.updateMeAuthMePut({
        username: form.username || null,
        email: form.email || null,
        full_name: form.full_name || null,
        birthday: form.birthday || null,
        profile_img_uri: form.profile_img_uri || null,
      });

      setProfile(response.data);
      toast.success('บันทึกข้อมูลโปรไฟล์แล้ว');
      await checkAuth();
    } catch (saveError) {
      const normalized = normalizeError(saveError);
      setError(normalized.message);
      toast.error(normalized.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">ข้อมูลส่วนตัว</h1>
          <p className="mt-1 text-gray-primary-0">แก้ไขข้อมูลโปรไฟล์จากบัญชีที่เข้าสู่ระบบอยู่ในขณะนี้</p>
        </div>
        {profile?.role && (
          <Badge variant={profile.role === 'SUPER_ADMIN' ? 'master-admin' : profile.role === 'ADMIN' ? 'admin' : 'info'}>
            {profile.role === 'SUPER_ADMIN' ? 'Master Admin' : profile.role === 'ADMIN' ? 'Admin' : 'User'}
          </Badge>
        )}
      </div>

      {error && (
        <Card variant="outlined" className="border-danger">
          <CardContent className="pt-6">
            <p className="font-semibold text-dark">ไม่สามารถโหลดหรือบันทึกข้อมูลโปรไฟล์ได้</p>
            <p className="mt-1 text-sm text-gray-primary-0">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>โปรไฟล์ผู้ใช้</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-12 animate-pulse rounded-xl bg-gray-primary-2" />
              ))}
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-gray-primary-1 bg-gray-primary-2/50 px-4 py-4">
                <p className="font-semibold text-dark">ข้อมูลส่วนตัว</p>
                <p className="mt-1 text-sm text-gray-primary-0">แก้ไขชื่อ อีเมล วันเกิด และรูปโปรไฟล์ที่ใช้แสดงในบัญชีของคุณ</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="ชื่อผู้ใช้"
                  value={form.username}
                  onChange={(event) => handleChange('username', event.target.value)}
                  required
                />
                <Input
                  label="อีเมล"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  required
                />
                <Input
                  label="ชื่อเต็ม"
                  value={form.full_name}
                  onChange={(event) => handleChange('full_name', event.target.value)}
                  required
                />
                <Input
                  label="วันเกิด"
                  type="date"
                  value={form.birthday}
                  onChange={(event) => handleChange('birthday', event.target.value)}
                />
              </div>
              <Input
                label="ลิงก์รูปโปรไฟล์"
                value={form.profile_img_uri}
                onChange={(event) => handleChange('profile_img_uri', event.target.value)}
                helperText="ใช้ URL รูปภาพที่พร้อมเข้าถึงจากเบราว์เซอร์ หากระบบรองรับ"
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4 text-sm text-gray-primary-0">
                  <p className="font-semibold text-dark">ความปลอดภัย</p>
                  <p className="mt-1">การเปลี่ยนรหัสผ่านยังใช้กระบวนการ `/auth/me/reset-password` ของระบบเดิม และยังไม่ได้เพิ่มหน้าจอเฉพาะในรอบนี้</p>
                </div>
                <div className="rounded-2xl border border-gray-primary-1 bg-light px-4 py-4 text-sm text-gray-primary-0">
                  <p className="font-semibold text-dark">บัญชีที่เชื่อมต่อ</p>
                  <p className="mt-1">การเชื่อมต่อ Google หรือ GitHub จะขึ้นอยู่กับการรองรับจาก backend และ NextAuth configuration ที่ใช้งานอยู่</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" isLoading={saving}>
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
