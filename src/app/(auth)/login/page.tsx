'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { Input, Button, PasswordInput } from '@/components/ui';
import { RecaptchaV3 } from '@/components/RecaptchaV3';
import {
  AuthBackground,
  SEMDMascot,
  SocialLoginRow,
  StatsStrip,
  URLTablePreview,
} from '@/components/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleRecaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token);
  }, []);

  const handleRecaptchaError = useCallback((error: string) => {
    console.error('reCAPTCHA error:', error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login({ 
        username: formData.username, 
        password: formData.password,
      });

      if (result.requiresTwoFactor) {
        toast.info('กรุณายืนยันตัวตนด้วย 2FA');
        router.push(`/two-factor?token=${encodeURIComponent(result.preAuthToken || '')}`);
        return;
      }

      toast.success('เข้าสู่ระบบสำเร็จ');
      router.push(ROUTES.DASHBOARD.HOME);
  };

  const loginStats = [
    { value: '12K+', label: 'URLs Scanned' },
    { value: '98%', label: 'Accuracy' },
    { value: '2.4K', label: 'Threats Blocked' },
  ];

  return (
    <AuthBackground>
      <div className="w-full min-h-screen flex">
        <div className="flex-1 flex flex-col items-center justify-center px-10 py-16 relative overflow-hidden animate-slide-left">
          <div 
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(61,43,31,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="text-center mb-10 relative z-10">
            <SEMDMascot size="md" showBadge />
            <h1 className="font-display text-[68px] font-black text-brown tracking-tight leading-none mt-4 drop-shadow-[0_4px_0_rgba(61,43,31,0.15)]">
              SEMD
            </h1>
            <p className="text-sm text-brown-mid font-medium max-w-[360px] leading-relaxed mt-2">
              Suspicious-URL Evaluation for Malicious Detection
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              <span className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-brown/10 text-brown">
                URL Scanner
              </span>
              {/* <span className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-amber/20 text-brown-mid">
                ⚡ Real-time
              </span> */}
              <span className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-brown/10 text-brown">
                AI-powered
              </span>
            </div>
          </div>

          {/* <StatsStrip stats={loginStats} /> */}
          <URLTablePreview 
            variant="full"
            maxHeight="320px"
            showBrowserBar={true}
            showToolbar={false}
            showPagination={true}
            showFilters={true}
            animated={true}
          />
        </div>

        <div className="w-[440px] min-w-[440px] bg-cream/95 backdrop-blur-xl border-l border-white/60 flex flex-col justify-center px-11 py-12 overflow-y-auto shadow-[-20px_0_60px_rgba(61,43,31,0.08)] animate-slide-right">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-deep mb-1.5">
            ยินดีต้อนรับ
          </p>
          <h2 className="font-display text-[34px] font-extrabold text-brown tracking-tight leading-tight mb-7">
            เข้าสู่ระบบ
          </h2>

          {/* <div className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-green-700 mb-5 w-fit"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <ShieldCheck size={14} />
            การเชื่อมต่อปลอดภัย SSL
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ชื่อผู้ใช้งาน"
              type="text"
              placeholder="ระบุชื่อผู้ใช้งาน"
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <PasswordInput
              label="รหัสผ่าน"
              placeholder="ระบุรหัสผ่าน"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Link
              href="#"
              className="block text-right text-[13px] text-amber-deep font-semibold hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              เข้าสู่ระบบ
            </Button>

            <RecaptchaV3
              action="login"
              onVerify={handleRecaptchaVerify}
              onError={handleRecaptchaError}
            />
          </form>

          <div className="flex items-center gap-3 my-4 text-brown-mid/60 text-xs font-medium">
            <span className="flex-1 h-px bg-brown/10" />
            หรือ
            <span className="flex-1 h-px bg-brown/10" />
          </div>

          <SocialLoginRow />

          <p className="text-center text-[13.5px] text-brown-mid/70 mt-4">
            ยังไม่มีบัญชี?{' '}
            <Link href={ROUTES.AUTH.REGISTER} className="text-brown font-bold hover:underline">
              สมัครตอนนี้เลย
            </Link>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
}
