'use client';

import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { FileText, Plus } from 'lucide-react';

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
          <div className="space-y-3">
            {[
              { url: 'https://suspicious-phishing.com', status: 'pending', reason: 'Phishing attempt' },
              { url: 'https://malware-site.net', status: 'reviewed', reason: 'Malware distribution' },
              { url: 'https://fake-bank.com', status: 'approved', reason: 'Fake banking site' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-gray-primary-2 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark">{item.url}</p>
                    <p className="text-xs text-gray-primary-0 mt-1">เหตุผล: {item.reason}</p>
                  </div>
                  <Badge variant={
                    item.status === 'approved' ? 'safe' :
                    item.status === 'reviewed' ? 'warning' :
                    'info'
                  }>
                    {item.status === 'approved' ? 'อนุมัติแล้ว' : 
                     item.status === 'reviewed' ? 'กำลังตรวจสอบ' : 
                     'รอดำเนินการ'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
