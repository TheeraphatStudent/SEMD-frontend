'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { URLTablePreview } from '@/components/auth/URLTablePreview';

export default function FlagsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">จัดการ Flag</h1>
        <p className="text-gray-primary-0 mt-1">รายการ URL ที่ถูก Flag ในระบบ</p>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>รายการ URL Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <URLTablePreview
            variant="full"
            maxHeight="400px"
            showBrowserBar={true}
            showToolbar={true}
            showPagination={true}
            showFilters={true}
            animated={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
