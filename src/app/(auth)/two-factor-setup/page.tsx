'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { Button, OTPInput, QRCode } from '@/components/ui';
import { AuthBackground } from '@/components/auth';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enable2FA, loading } = useAuth();
  const [code, setCode] = useState('');
  
  const secret = searchParams.get('secret') || '';
  const qrUri = searchParams.get('qr') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error('กรุณากรอกรหัส 6 หลัก');
      return;
    }

    if (!secret) {
      toast.error('ไม่พบ Secret Key กรุณาลองใหม่อีกครั้ง');
      return;
    }

    try {
      await enable2FA(secret, code);
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
            <div className="w-[152px] h-[152px] bg-white border-2 border-gray-200 rounded-2xl p-2 shadow-md overflow-hidden flex items-center justify-center">
              {qrUri ? (
                <QRCode value={qrUri} size={136} />
              ) : (
                <span className="text-xs text-gray-400">ไม่พบ QR Code</span>
              )}
            </div>
          </div>

          {secret && (
            <div className="mb-4">
              <p className="text-center text-[13px] text-brown-mid/70 font-medium mb-2">
                หรือ ป้อนคีย์การตั้งค่าผ่านแอปพลิเคชัน
              </p>
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-center">
                <code className="text-sm font-mono text-brown break-all select-all">{secret}</code>
              </div>
            </div>
          )}

          <p className="text-center text-[13px] text-brown-mid/70 font-medium mb-3">
            กรอกรหัส 6 หลักจากแอปพลิเคชัน
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
