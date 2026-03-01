'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { validators } from '@/lib/validators';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!validators.email(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    
    if (!validators.required(formData.username)) {
      newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    }
    
    const passwordValidation = validators.password(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(formData);
      toast.success('ลงทะเบียนสำเร็จ! กรุณาตั้งค่า 2FA');
      router.push(`/two-factor-setup?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      toast.error(error.message || 'ลงทะเบียนไม่สำเร็จ');
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
          <CardTitle>ลงทะเบียน</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="อีเมล"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />
            
            <Input
              label="ชื่อผู้ใช้"
              type="text"
              placeholder="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              error={errors.username}
              required
            />
            
            <Input
              label="รหัสผ่าน"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              helperText="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข"
              required
            />
            
            <Input
              label="ยืนยันรหัสผ่าน"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              ลงทะเบียน
            </Button>
            
            <div className="text-center text-sm text-gray-primary-0">
              มีบัญชีอยู่แล้ว?{' '}
              <Link href={ROUTES.AUTH.LOGIN} className="text-primary hover:underline font-medium">
                เข้าสู่ระบบ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
