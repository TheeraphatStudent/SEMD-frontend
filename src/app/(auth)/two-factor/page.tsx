'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { Button, OTPInput } from '@/components/ui';
import { AuthBackground, SEMDMascot } from '@/components/auth';

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

  const handleCancel = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <AuthBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-5">
        <h1 className="font-display text-[62px] font-black text-brown tracking-tight leading-none mb-7 drop-shadow-[0_4px_0_rgba(61,43,31,0.12)] animate-fade-down">
          SEMD
        </h1>

        <div className="bg-cream/95 backdrop-blur-xl border border-white/70 rounded-[28px] px-11 py-9 w-full max-w-[460px] shadow-xl animate-fade-up">
          <p className="text-sm text-brown-mid text-center mb-6 leading-relaxed">
            ป้อนคีย์การตั้งค่าจาก <strong className="font-display font-bold text-brown">Authenticator application</strong>
          </p>

          <div className="flex flex-col items-center gap-1.5 mb-6">
            <SEMDMascot size="sm" showBadge={false} />
            <span className="text-xs text-brown-mid/70 font-medium">
              หรือ ป้อนคีย์การตั้งค่าผ่านแอปพลิเคชัน
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <OTPInput
                length={6}
                value={code}
                onChange={setCode}
                autoFocus
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="danger"
                onClick={handleCancel}
              >
                ยกเลิก
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={code.length !== 6}
                isLoading={loading}
              >
                ยืนยัน OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthBackground>
  );
}
