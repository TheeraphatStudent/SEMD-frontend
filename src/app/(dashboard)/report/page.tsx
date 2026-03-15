'use client';

import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { URLTablePreview } from '@/components/auth/URLTablePreview';
import { Plus } from 'lucide-react';

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">รายงาน URL</h1>
          <p className="text-gray-primary-0 mt-1">รายงาน URL ที่น่าสงสัยหรืออันตราย</p>
        </div>
        <Button variant="primary">
          <Plus size={20} className="mr-2" />
          รายงาน URL ใหม่
        </Button>
      </div>
      
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>รายการรายงานของคุณ</CardTitle>
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
