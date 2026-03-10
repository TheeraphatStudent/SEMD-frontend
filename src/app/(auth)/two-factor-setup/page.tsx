'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { Button, OTPInput } from '@/components/ui';
import { AuthBackground } from '@/components/auth';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enable2FA, loading } = useAuth();
  const [code, setCode] = useState('');
  const email = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error('กรุณากรอกรหัส 6 หลัก');
      return;
    }

    try {
      await enable2FA(code);
      toast.success('เปิดใช้งาน 2FA สำเร็จ');
      router.push(ROUTES.DASHBOARD.HOME);
    } catch (error) {
      toast.error('รหัสยืนยันไม่ถูกต้อง');
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.AUTH.REGISTER);
  };

  return (
    <AuthBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-5">
        <h1 className="font-display text-[62px] font-black text-brown tracking-tight leading-none mb-7 drop-shadow-[0_4px_0_rgba(61,43,31,0.12)] animate-fade-down">
          SEMD
        </h1>

        <div className="bg-cream/95 backdrop-blur-xl border border-white/70 rounded-[28px] px-11 py-9 w-full max-w-[460px] shadow-xl animate-fade-up">
          <p className="text-sm text-brown-mid text-center mb-6 leading-relaxed">
            ดำเนินการด้วย <strong className="font-display font-bold text-brown">Authenticator App</strong> เพื่อความปลอดภัย
          </p>

          <div className="flex flex-col items-center mb-5">
            <p className="text-[13px] text-brown-mid/70 font-medium mb-3.5">
              สแกน QR Code ผ่านแอปพลิเคชัน
            </p>
            <div className="w-[152px] h-[152px] bg-white border-2 border-gray-200 rounded-2xl p-3 shadow-md overflow-hidden">
              <svg viewBox="0 0 21 21" fill="none" className="w-full h-full">
                <rect width="21" height="21" fill="white" />
                <rect x="0" y="0" width="7" height="7" fill="#3D2B1F" />
                <rect x="1" y="1" width="5" height="5" fill="white" />
                <rect x="2" y="2" width="3" height="3" fill="#3D2B1F" />
                <rect x="14" y="0" width="7" height="7" fill="#3D2B1F" />
                <rect x="15" y="1" width="5" height="5" fill="white" />
                <rect x="16" y="2" width="3" height="3" fill="#3D2B1F" />
                <rect x="0" y="14" width="7" height="7" fill="#3D2B1F" />
                <rect x="1" y="15" width="5" height="5" fill="white" />
                <rect x="2" y="16" width="3" height="3" fill="#3D2B1F" />
                <rect x="8" y="0" width="1" height="1" fill="#3D2B1F" />
                <rect x="10" y="0" width="1" height="1" fill="#3D2B1F" />
                <rect x="12" y="0" width="1" height="1" fill="#3D2B1F" />
                <rect x="8" y="2" width="2" height="1" fill="#3D2B1F" />
                <rect x="11" y="2" width="1" height="1" fill="#3D2B1F" />
                <rect x="7" y="4" width="1" height="1" fill="#3D2B1F" />
                <rect x="9" y="4" width="2" height="1" fill="#3D2B1F" />
                <rect x="12" y="4" width="1" height="1" fill="#3D2B1F" />
                <rect x="8" y="6" width="1" height="1" fill="#3D2B1F" />
                <rect x="10" y="6" width="3" height="1" fill="#3D2B1F" />
                <rect x="0" y="8" width="1" height="1" fill="#3D2B1F" />
                <rect x="2" y="8" width="3" height="1" fill="#3D2B1F" />
                <rect x="7" y="8" width="2" height="1" fill="#3D2B1F" />
                <rect x="11" y="8" width="1" height="1" fill="#3D2B1F" />
                <rect x="13" y="8" width="2" height="1" fill="#3D2B1F" />
                <rect x="16" y="8" width="1" height="1" fill="#3D2B1F" />
                <rect x="18" y="8" width="1" height="1" fill="#3D2B1F" />
                <rect x="20" y="8" width="1" height="1" fill="#3D2B1F" />
                <rect x="1" y="10" width="2" height="1" fill="#3D2B1F" />
                <rect x="5" y="10" width="1" height="1" fill="#3D2B1F" />
                <rect x="8" y="10" width="1" height="1" fill="#3D2B1F" />
                <rect x="10" y="10" width="2" height="1" fill="#3D2B1F" />
                <rect x="14" y="10" width="1" height="1" fill="#3D2B1F" />
                <rect x="17" y="10" width="2" height="1" fill="#3D2B1F" />
                <rect x="0" y="12" width="3" height="1" fill="#3D2B1F" />
                <rect x="4" y="12" width="2" height="1" fill="#3D2B1F" />
                <rect x="8" y="12" width="2" height="1" fill="#3D2B1F" />
                <rect x="12" y="12" width="3" height="1" fill="#3D2B1F" />
                <rect x="17" y="12" width="1" height="1" fill="#3D2B1F" />
                <rect x="19" y="12" width="2" height="1" fill="#3D2B1F" />
                <rect x="8" y="14" width="1" height="1" fill="#3D2B1F" />
                <rect x="10" y="14" width="2" height="1" fill="#3D2B1F" />
                <rect x="13" y="14" width="1" height="1" fill="#3D2B1F" />
                <rect x="15" y="14" width="1" height="1" fill="#3D2B1F" />
                <rect x="17" y="14" width="1" height="1" fill="#3D2B1F" />
                <rect x="8" y="16" width="2" height="1" fill="#3D2B1F" />
                <rect x="12" y="16" width="1" height="1" fill="#3D2B1F" />
                <rect x="14" y="16" width="2" height="1" fill="#3D2B1F" />
                <rect x="18" y="16" width="1" height="1" fill="#3D2B1F" />
                <rect x="7" y="18" width="2" height="1" fill="#3D2B1F" />
                <rect x="11" y="18" width="3" height="1" fill="#3D2B1F" />
                <rect x="16" y="18" width="2" height="1" fill="#3D2B1F" />
                <rect x="8" y="20" width="1" height="1" fill="#3D2B1F" />
                <rect x="10" y="20" width="1" height="1" fill="#3D2B1F" />
                <rect x="12" y="20" width="2" height="1" fill="#3D2B1F" />
                <rect x="16" y="20" width="1" height="1" fill="#3D2B1F" />
                <rect x="19" y="20" width="2" height="1" fill="#3D2B1F" />
                <rect x="9" y="9" width="3" height="3" rx="0.5" fill="#F5B942" />
              </svg>
            </div>
          </div>

          <p className="text-center text-[13px] text-brown-mid/70 font-medium mb-3">
            หรือ ป้อนคีย์การตั้งค่าผ่านแอปพลิเคชัน
          </p>

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
                ยืนยันการตั้งค่า
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthBackground>
  );
}
