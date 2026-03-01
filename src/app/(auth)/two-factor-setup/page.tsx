'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { Shield, Copy, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enable2FA, loading } = useAuth();
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'qr' | 'verify'>('qr');
  const email = searchParams.get('email') || '';
  
  const mockSecret = 'JBSWY3DPEHPK3PXP';
  const mockQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  const handleCopySecret = () => {
    navigator.clipboard.writeText(mockSecret);
    toast.success('คัดลอกรหัสลับแล้ว');
  };
  
  const handleVerify = async (e: React.FormEvent) => {
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
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card variant="elevated" className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-secondary-light rounded-full">
              <Shield className="text-secondary" size={40} />
            </div>
          </div>
          <CardTitle className="text-center">ตั้งค่า Two-Factor Authentication</CardTitle>
          <p className="text-center text-gray-primary-0 text-sm mt-2">
            เพิ่มความปลอดภัยให้กับบัญชีของคุณด้วย 2FA
          </p>
        </CardHeader>
        
        <CardContent>
          {step === 'qr' ? (
            <div className="space-y-6">
              <div className="bg-gray-primary-2 rounded-lg p-6">
                <h3 className="font-bold text-dark mb-4">ขั้นตอนที่ 1: สแกน QR Code</h3>
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0">
                    <div className="w-48 h-48 bg-light border-2 border-gray-primary-1 rounded-lg flex items-center justify-center">
                      <img 
                        src={mockQRCode} 
                        alt="QR Code" 
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-gray-primary-0 mb-2">
                        1. ดาวน์โหลดแอปยืนยันตัวตน เช่น:
                      </p>
                      <ul className="text-sm text-gray-primary-0 list-disc list-inside space-y-1 ml-2">
                        <li>Google Authenticator</li>
                        <li>Microsoft Authenticator</li>
                        <li>Authy</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-primary-0 mb-2">
                        2. สแกน QR Code ด้วยแอป
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-primary-0 mb-2">
                        3. หรือกรอกรหัสลับด้วยตนเอง:
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-light rounded border border-gray-primary-1">
                        <code className="flex-1 text-sm text-dark font-mono">{mockSecret}</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleCopySecret}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => setStep('verify')}
                  className="min-w-[200px]"
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="bg-gray-primary-2 rounded-lg p-6">
                <h3 className="font-bold text-dark mb-4">ขั้นตอนที่ 2: ยืนยันรหัส</h3>
                
                <p className="text-sm text-gray-primary-0 mb-4">
                  กรอกรหัส 6 หลักจากแอปยืนยันตัวตนของคุณ
                </p>
                
                <div className="flex justify-center mb-6">
                  <input
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="000000"
                    className="w-48 text-center text-3xl font-bold tracking-widest px-4 py-3 border-2 border-gray-primary-1 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                
                <div className="bg-accent-green/10 border border-accent-green rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-accent-green flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-gray-primary-0">
                      <p className="font-medium text-dark mb-1">สำคัญ!</p>
                      <p>เก็บรหัสลับไว้ในที่ปลอดภัย หากคุณสูญเสียอุปกรณ์ คุณจะต้องใช้รหัสนี้เพื่อกู้คืนบัญชี</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('qr')}
                  className="flex-1"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? 'กำลังยืนยัน...' : 'ยืนยันและเปิดใช้งาน'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
