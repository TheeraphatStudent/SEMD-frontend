import Link from 'next/link';
import { Button } from '@/components/ui';
import { Shield, Search, FileText } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary mb-4">SEMD</h1>
          <p className="text-2xl text-gray-primary-0 mb-2">Security Email & Malicious URL Detection</p>
          <p className="text-lg text-gray-primary-0">ระบบตรวจจับ URL และอีเมลที่เป็นอันตราย</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-light p-8 rounded-lg shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-full mb-4">
              <Shield className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">ตรวจสอบความปลอดภัย</h3>
            <p className="text-gray-primary-0">ตรวจสอบ URL และอีเมลที่น่าสงสัยด้วย AI</p>
          </div>

          <div className="bg-light p-8 rounded-lg shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-light rounded-full mb-4">
              <Search className="text-secondary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">วิเคราะห์แบบเรียลไทม์</h3>
            <p className="text-gray-primary-0">ผลการวิเคราะห์ทันทีด้วยความแม่นยำสูง</p>
          </div>

          <div className="bg-light p-8 rounded-lg shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light-green rounded-full mb-4">
              <FileText className="text-accent-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">รายงานและจัดการ</h3>
            <p className="text-gray-primary-0">รายงาน URL ที่เป็นอันตรายและจัดการข้อมูล</p>
          </div>
        </div>

        <div className="text-center">
          <div className="space-x-4">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button variant="primary" size="lg">
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button variant="outline" size="lg">
                ลงทะเบียน
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
