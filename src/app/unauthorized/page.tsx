import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <Card variant="elevated" className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light-red text-danger">
            <ShieldAlert size={30} />
          </div>
          <CardTitle>ไม่สามารถเข้าถึงหน้านี้ได้</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-primary-0">
            บัญชีของคุณไม่มีสิทธิ์เข้าถึงหน้านี้ หรือเซสชันปัจจุบันยังไม่พร้อมใช้งาน
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={ROUTES.DASHBOARD.HOME}>
              <Button variant="primary" className="w-full sm:w-auto">
                ไปยังแดชบอร์ด
              </Button>
            </Link>
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button variant="outline" className="w-full sm:w-auto">
                เข้าสู่ระบบใหม่
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
