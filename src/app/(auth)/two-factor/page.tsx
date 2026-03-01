'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { Shield, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verify2FA, loading } = useAuth();
  const [code, setCode] = useState('');
  const email = searchParams.get('email') || '';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error('กรุณากรอกรหัส 6 หลัก');
      return;
    }
    
    try {
      await verify2FA(email, code);
      toast.success('ยืนยันตัวตนสำเร็จ');
      router.push(ROUTES.DASHBOARD.HOME);
    } catch (error) {
      toast.error('รหัสยืนยันไม่ถูกต้อง');
    }
  };
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-primary-light rounded-full">
              <Shield className="text-primary" size={40} />
            </div>
          </div>
          <CardTitle className="text-center">ยืนยันตัวตนด้วย 2FA</CardTitle>
          <p className="text-center text-gray-primary-0 text-sm mt-2">
            กรุณากรอกรหัส 6 หลักจากแอปยืนยันตัวตนของคุณ
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-sm text-gray-primary-0 mb-2">
                อีเมล: <span className="font-medium text-dark">{email}</span>
              </p>
            </div>
            
            <div className="flex justify-center">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                className="w-48 text-center text-3xl font-bold tracking-widest px-4 py-3 border-2 border-gray-primary-1 rounded-lg focus:outline-none focus:border-primary transition-colors"
                maxLength={6}
                autoFocus
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || code.length !== 6}
            >
              {loading ? 'กำลังตรวจสอบ...' : 'ยืนยันตัวตน'}
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-primary-0">
                ไม่ได้รับรหัส?{' '}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => toast.info('ส่งรหัสใหม่แล้ว')}
                >
                  ส่งรหัสใหม่
                </button>
              </p>
              
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="inline-flex items-center gap-2 text-sm text-gray-primary-0 hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
