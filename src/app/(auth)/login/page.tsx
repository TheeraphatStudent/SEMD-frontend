'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await login(formData);
      
      if (result.requiresTwoFactor) {
        toast.info('กรุณายืนยันตัวตนด้วย 2FA');
        router.push(`/two-factor?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      
      toast.success('เข้าสู่ระบบสำเร็จ');
      router.push(ROUTES.DASHBOARD.HOME);
    } catch (error: any) {
      toast.error(error.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md" variant="elevated">
        <CardHeader>
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-primary mb-2">SEMD</h1>
            <p className="text-sm text-gray-primary-0">Security Email & Malicious URL Detection</p>
          </div>
          <CardTitle>เข้าสู่ระบบ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="อีเมล"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <Input
              label="รหัสผ่าน"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              เข้าสู่ระบบ
            </Button>
            
            <div className="text-center text-sm text-gray-primary-0">
              ยังไม่มีบัญชี?{' '}
              <Link href={ROUTES.AUTH.REGISTER} className="text-primary hover:underline font-medium">
                ลงทะเบียน
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
