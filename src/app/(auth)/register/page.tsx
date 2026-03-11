'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { validators } from '@/lib/validators';
import { Input, Button } from '@/components/ui';
import { RecaptchaV3 } from '@/components/RecaptchaV3';
import {
  AuthBackground,
  SEMDMascot,
  SocialLoginRow,
  StatsStrip,
  URLTablePreview,
} from '@/components/auth';

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
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleRecaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token);
  }, []);

  const handleRecaptchaError = useCallback((error: string) => {
    console.error('reCAPTCHA error:', error);
  }, []);

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
      await register({
        ...formData,
        recaptchaToken: recaptchaToken || undefined,
      });
      toast.success('ลงทะเบียนสำเร็จ! กรุณาตั้งค่า 2FA');
      router.push(`/two-factor-setup?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      toast.error(error.message || 'ลงทะเบียนไม่สำเร็จ');
    }
  };

  const registerStats = [
    { value: '3.2K', label: 'Researchers' },
    { value: 'Free', label: 'Basic Plan' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <AuthBackground>
      <div className="w-full min-h-screen flex">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden animate-slide-left">
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
              เข้าร่วมชุมชนนักวิเคราะห์ URL ที่น่าสงสัย
              <br />
              และช่วยทำให้อินเทอร์เน็ตปลอดภัยยิ่งขึ้น
            </p>
            {/* <div className="flex flex-wrap gap-2 justify-center mt-3">
              <span className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-brown/10 text-brown">
                ✉️ Free Account
              </span>
              <span className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-amber/20 text-brown-mid">
                🚀 เริ่มได้ทันที
              </span>
              <span className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-brown/10 text-brown">
                🌐 ชุมชนนักวิจัย
              </span>
            </div> */}
          </div>

          {/* <StatsStrip stats={registerStats} /> */}
          <URLTablePreview 
            variant="full"
            maxHeight="320px"
            showBrowserBar={true}
            showToolbar={true}
            showPagination={true}
            showFilters={true}
            animated={true}
          />
        </div>

        <div className="w-[440px] min-w-[440px] bg-cream/95 backdrop-blur-xl border-l border-white/60 flex flex-col justify-center px-11 py-12 overflow-y-auto shadow-[-20px_0_60px_rgba(61,43,31,0.08)] animate-slide-right">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-deep mb-1.5">
            สวัสดีสมาชิกใหม่
          </p>
          <h2 className="font-display text-[34px] font-extrabold text-brown tracking-tight leading-tight mb-7">
            สมัครสมาชิก
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ชื่อผู้ใช้งาน"
              type="text"
              placeholder="ระบุชื่อผู้ใช้งาน"
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
              error={errors.username}
              required
            />

            <Input
              label="อีเมล"
              type="email"
              placeholder="semd@msu.ac.th"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <Input
              label="รหัสผ่าน"
              type="password"
              placeholder="ระบุรหัสผ่าน"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
            />

            <Input
              label="ยืนยันรหัสผ่าน"
              type="password"
              placeholder="ระบุรหัสผ่านอีกครั้ง"
              value={formData.confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              สมัครสมาชิก
            </Button>

            <RecaptchaV3
              action="register"
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
            มีบัญชีอยู่แล้ว?{' '}
            <Link href={ROUTES.AUTH.LOGIN} className="text-brown font-bold hover:underline">
              เข้าสู่ระบบเลย
            </Link>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
}
